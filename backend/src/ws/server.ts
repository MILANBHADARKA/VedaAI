import type { IncomingMessage } from 'node:http'
import { WebSocketServer, type WebSocket } from 'ws'
import { createRedis } from '../config/redis'
import { Job } from '../models/job'
import { PROGRESS_CHANNEL, type JobProgressEvent } from './publish'

const TERMINAL_STATUSES = new Set(['completed', 'failed'])

export function startWebSocket(port: number): WebSocketServer {
  const wss = new WebSocketServer({ port })
  const subscribers = new Map<string, Set<WebSocket>>()

  const sub = createRedis()
  if (!sub) {
    console.warn('[ws] no redis — live progress disabled')
  } else {
    sub.subscribe(PROGRESS_CHANNEL).catch((err) => {
      console.error('[ws] subscribe failed', err)
    })
    sub.on('message', (channel, payload) => {
      if (channel !== PROGRESS_CHANNEL) return
      let event: JobProgressEvent
      try {
        event = JSON.parse(payload)
      } catch {
        return
      }
      const set = subscribers.get(event.jobId)
      if (!set) return
      const frame = JSON.stringify(event)
      for (const ws of set) {
        if (ws.readyState === ws.OPEN) ws.send(frame)
      }
      if (TERMINAL_STATUSES.has(event.status)) {
        for (const ws of set) ws.close(1000, 'job finished')
        subscribers.delete(event.jobId)
      }
    })
  }

  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
    const jobId = url.searchParams.get('jobId')
    if (!jobId) {
      ws.close(1008, 'jobId required')
      return
    }

    let set = subscribers.get(jobId)
    if (!set) {
      set = new Set()
      subscribers.set(jobId, set)
    }
    set.add(ws)

    ws.on('close', () => {
      set?.delete(ws)
      if (set && set.size === 0) subscribers.delete(jobId)
    })

    try {
      const job = await Job.findById(jobId)
      if (job) {
        const snapshot: JobProgressEvent = {
          jobId,
          status: job.status,
          progress: job.progress,
          error: job.error ?? undefined,
        }
        ws.send(JSON.stringify(snapshot))
        if (TERMINAL_STATUSES.has(job.status)) {
          ws.close(1000, 'job already finished')
        }
      }
    } catch (err) {
      console.error('[ws] snapshot failed', err)
    }
  })

  console.log(`[ws] listening on :${port}`)
  return wss
}

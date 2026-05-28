'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Job, JobProgressEvent } from '@/lib/types'

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL?.replace(/\/$/, '') ?? 'ws://localhost:4001'

export function useJobProgress(jobId: string | null): JobProgressEvent | null {
  const [event, setEvent] = useState<JobProgressEvent | null>(null)

  useEffect(() => {
    if (!jobId) {
      setEvent(null)
      return
    }

    let active = true
    let viaWebSocket = false

    const ws = new WebSocket(`${WS_URL}/?jobId=${jobId}`)
    ws.onmessage = (e) => {
      viaWebSocket = true
      if (!active) return
      try {
        setEvent(JSON.parse(e.data) as JobProgressEvent)
      } catch {
        /* ignore malformed frame */
      }
    }

    const poll = setInterval(async () => {
      if (viaWebSocket || !active) return
      try {
        const job = await api<Job>(`/jobs/${jobId}`)
        if (!active) return
        setEvent({
          jobId,
          status: job.status,
          progress: job.progress,
          error: job.error ?? undefined,
        })
      } catch {
        /* keep trying */
      }
    }, 3000)

    return () => {
      active = false
      clearInterval(poll)
      ws.close()
    }
  }, [jobId])

  return event
}

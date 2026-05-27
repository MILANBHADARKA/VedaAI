import type { Redis } from 'ioredis'
import { createRedis } from '../config/redis'
import type { JobStatus } from '../lib/types'

export const PROGRESS_CHANNEL = 'vedaai:job:progress'

export type JobProgressEvent = {
  jobId: string
  status: JobStatus
  progress: number
  error?: string
  resultId?: string
}

let publisher: Redis | null = null

function getPublisher(): Redis | null {
  if (publisher) return publisher
  publisher = createRedis()
  return publisher
}

export async function publishProgress(event: JobProgressEvent): Promise<void> {
  const client = getPublisher()
  if (!client) return
  await client.publish(PROGRESS_CHANNEL, JSON.stringify(event))
}

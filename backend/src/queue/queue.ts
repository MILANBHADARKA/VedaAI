import { Queue } from 'bullmq'
import { createRedis } from '../config/redis'

export const GENERATION_QUEUE = 'assignment-generation'

export type GenerationJobData = {
  assignmentId: string
  jobId: string
}

export type GenerationJobResult = {
  resultId: string
}

let queue: Queue<GenerationJobData, GenerationJobResult> | null = null

export function getGenerationQueue(): Queue<
  GenerationJobData,
  GenerationJobResult
> | null {
  if (queue) return queue
  const connection = createRedis()
  if (!connection) return null
  queue = new Queue<GenerationJobData, GenerationJobResult>(GENERATION_QUEUE, {
    connection,
    defaultJobOptions: {
      attempts: 1,
      removeOnComplete: { age: 60 * 60, count: 200 },
      removeOnFail: { age: 24 * 60 * 60 },
    },
  })
  return queue
}

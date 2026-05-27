import { getGenerationQueue, type GenerationJobData } from './queue'

export async function enqueueGeneration(input: GenerationJobData): Promise<string> {
  const queue = getGenerationQueue()
  if (!queue) {
    console.warn('[queue] no redis — generation skipped', input)
    return input.jobId
  }
  const queueJob = await queue.add('generate', input, { jobId: input.jobId })
  console.log('[queue] enqueued', queueJob.id)
  return String(queueJob.id)
}

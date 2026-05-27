import { Worker } from 'bullmq'
import { connectDb, disconnectDb } from './config/db'
import { createRedis } from './config/redis'
import { Assignment } from './models/assignment'
import { Job } from './models/job'
import { processGeneration } from './queue/process'
import {
  GENERATION_QUEUE,
  type GenerationJobData,
  type GenerationJobResult,
} from './queue/queue'
import { publishProgress } from './ws/publish'

async function start() {
  await connectDb()
  const connection = createRedis()
  if (!connection) {
    console.warn('[worker] no redis connection — exiting')
    return
  }

  const worker = new Worker<GenerationJobData, GenerationJobResult>(
    GENERATION_QUEUE,
    processGeneration,
    { connection, concurrency: 2 },
  )

  worker.on('active', (job) => {
    console.log(`[worker] active ${job.id}`)
  })
  worker.on('completed', (job, result) => {
    console.log(`[worker] completed ${job.id} → result ${result.resultId}`)
  })
  worker.on('failed', async (job, err) => {
    console.error(`[worker] failed ${job?.id}`, err.message)
    if (!job) return
    const { jobId, assignmentId } = job.data
    await Promise.all([
      Job.findByIdAndUpdate(jobId, { status: 'failed', error: err.message }),
      Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' }),
    ])
    await publishProgress({
      jobId,
      status: 'failed',
      progress: 0,
      error: err.message,
    })
  })

  console.log(`[worker] ready on queue "${GENERATION_QUEUE}"`)

  const shutdown = async (signal: string) => {
    console.log(`[worker] ${signal} received, shutting down`)
    await worker.close()
    await connection.quit()
    await disconnectDb()
    process.exit(0)
  }
  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

start().catch((err) => {
  console.error('[worker] failed to start', err)
  process.exit(1)
})

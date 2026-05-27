import cors from 'cors'
import express from 'express'
import { env } from './config/env'
import { connectDb, disconnectDb } from './config/db'
import { errorHandler, notFoundHandler } from './lib/error'
import assignmentsRouter from './routes/assignments'
import jobsRouter from './routes/jobs'
import resultsRouter from './routes/results'

const app = express()

app.use(cors({ origin: env.corsOrigin }))
app.use(express.json({ limit: '2mb' }))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'vedaai-api' })
})

app.use('/assignments', assignmentsRouter)
app.use('/jobs', jobsRouter)
app.use('/results', resultsRouter)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  await connectDb()
  const server = app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port}`)
  })

  const shutdown = async (signal: string) => {
    console.log(`[api] ${signal} received, shutting down`)
    server.close()
    await disconnectDb()
    process.exit(0)
  }
  process.on('SIGINT', () => void shutdown('SIGINT'))
  process.on('SIGTERM', () => void shutdown('SIGTERM'))
}

start().catch((err) => {
  console.error('[api] failed to start', err)
  process.exit(1)
})

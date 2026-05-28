import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { env } from './config/env'
import { connectDb, disconnectDb } from './config/db'
import { errorHandler, notFoundHandler } from './lib/error'
import assignmentsRouter from './routes/assignments'
import authRouter from './routes/auth'
import jobsRouter from './routes/jobs'
import resultsRouter from './routes/results'
import shareRouter from './routes/share'
import { startWebSocket } from './ws/server'

const app = express()

app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'vedaai-api' })
})

app.use('/auth', authRouter)
app.use('/assignments', assignmentsRouter)
app.use('/jobs', jobsRouter)
app.use('/results', resultsRouter)
app.use('/share', shareRouter)

app.use(notFoundHandler)
app.use(errorHandler)

async function start() {
  await connectDb()
  const server = app.listen(env.port, () => {
    console.log(`[api] listening on http://localhost:${env.port}`)
  })
  const wss = startWebSocket(env.wsPort)

  const shutdown = async (signal: string) => {
    console.log(`[api] ${signal} received, shutting down`)
    server.close()
    wss.close()
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

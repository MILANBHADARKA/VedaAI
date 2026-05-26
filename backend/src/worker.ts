import { createRedis } from './config/redis'
import { connectDb, disconnectDb } from './config/db'

async function start() {
  await connectDb()
  const connection = createRedis()
  if (!connection) {
    console.warn('[worker] no redis connection — exiting')
    return
  }
  console.log('[worker] ready — queue + processors wired in chunk 3')

  const shutdown = async (signal: string) => {
    console.log(`[worker] ${signal} received, shutting down`)
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

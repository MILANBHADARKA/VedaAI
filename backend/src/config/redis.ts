import { Redis, type RedisOptions } from 'ioredis'
import { env } from './env'

const baseOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
}

export function createRedis(): Redis | null {
  if (!env.redisUrl) {
    console.warn('[redis] REDIS_URL not set — queue features disabled')
    return null
  }
  return new Redis(env.redisUrl, baseOptions)
}

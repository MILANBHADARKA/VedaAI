import mongoose from 'mongoose'
import { env } from './env'

let connected = false

export async function connectDb(): Promise<void> {
  if (!env.mongoUri) {
    console.warn('[db] MONGO_URI not set — running without persistence')
    return
  }
  if (connected) return
  await mongoose.connect(env.mongoUri)
  connected = true
  console.log('[db] connected')
}

export async function disconnectDb(): Promise<void> {
  if (!connected) return
  await mongoose.disconnect()
  connected = false
}

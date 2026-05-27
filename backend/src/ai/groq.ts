import Groq from 'groq-sdk'
import { env } from '../config/env'

let client: Groq | null = null

export function getGroq(): Groq | null {
  if (!env.groqApiKey) return null
  if (!client) {
    client = new Groq({ apiKey: env.groqApiKey, timeout: 60_000 })
  }
  return client
}

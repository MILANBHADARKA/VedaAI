import 'dotenv/config'

function read(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback
  if (value === undefined) {
    throw new Error(`Missing required env var: ${key}`)
  }
  return value
}

function optional(key: string): string | undefined {
  const value = process.env[key]
  return value && value.length > 0 ? value : undefined
}

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(read('PORT', '4000')),
  corsOrigin: read('CORS_ORIGIN', 'http://localhost:3000'),
  jwtSecret: read('JWT_SECRET', 'dev-secret-change-in-production'),
  mongoUri: optional('MONGO_URI'),
  redisUrl: optional('REDIS_URL'),
  groqApiKey: optional('GROQ_API_KEY'),
  groqModel: read('GROQ_MODEL', 'llama-3.3-70b-versatile'),
  groqFallbackModel: read('GROQ_FALLBACK_MODEL', 'llama-3.1-8b-instant'),
  cloudinary: {
    cloudName: optional('CLOUDINARY_CLOUD_NAME'),
    apiKey: optional('CLOUDINARY_API_KEY'),
    apiSecret: optional('CLOUDINARY_API_SECRET'),
  },
}

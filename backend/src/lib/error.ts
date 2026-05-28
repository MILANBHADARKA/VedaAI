import type { ErrorRequestHandler, RequestHandler } from 'express'
import { HttpError } from './http'

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Not found' })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error('[api] unhandled error', err)
  res.status(500).json({ error: 'Internal server error' })
}

import type { ErrorRequestHandler } from 'express'
import { HttpError } from './http'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error('[api] unhandled error', err)
  res.status(500).json({ error: 'Internal server error' })
}

export const notFoundHandler: ErrorRequestHandler = (_err, _req, res, _next) => {
  res.status(404).json({ error: 'Not found' })
}

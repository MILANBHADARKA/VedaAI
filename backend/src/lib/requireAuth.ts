import type { NextFunction, Request, Response } from 'express'
import type { HydratedDocument } from 'mongoose'
import { User, type UserDoc } from '../models/user'
import { verifyToken } from './auth'

export const AUTH_COOKIE = 'token'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: HydratedDocument<UserDoc>
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[AUTH_COOKIE] as string | undefined
    const userId = token ? verifyToken(token) : null
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }
    const user = await User.findById(userId)
    if (!user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

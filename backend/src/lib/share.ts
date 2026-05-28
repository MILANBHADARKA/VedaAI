import jwt from 'jsonwebtoken'
import { env } from '../config/env'

const SHARE_AUDIENCE = 'share'

export type ShareVariant = 'student'

export type SharePayload = {
  assignmentId: string
  variant: ShareVariant
}

export function signShareToken(assignmentId: string): string {
  return jwt.sign({ assignmentId, variant: 'student' }, env.jwtSecret, {
    audience: SHARE_AUDIENCE,
    expiresIn: '7d',
  })
}

export function verifyShareToken(token: string): SharePayload | null {
  try {
    const decoded = jwt.verify(token, env.jwtSecret, {
      audience: SHARE_AUDIENCE,
    })
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'assignmentId' in decoded
    ) {
      return {
        assignmentId: String((decoded as { assignmentId: unknown }).assignmentId),
        variant: 'student',
      }
    }
    return null
  } catch {
    return null
  }
}

import type { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { QUESTION_TYPES } from './types'

const fileSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  mimeType: z.string().min(1),
  originalName: z.string().min(1).max(200),
  sizeBytes: z.number().int().nonnegative(),
})

const questionTypeRowSchema = z.object({
  type: z.enum(QUESTION_TYPES),
  count: z.number().int().min(1).max(50),
  marks: z.number().int().min(1).max(100),
})

const startOfToday = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

export const createAssignmentSchema = z.object({
  title: z.string().trim().max(200).optional(),
  dueDate: z.coerce
    .date()
    .refine((d) => d >= startOfToday(), 'Due date must be today or later'),
  questionTypes: z.array(questionTypeRowSchema).min(1).max(20),
  additionalInstructions: z.string().max(2000).optional().default(''),
  file: fileSchema.nullish(),
})

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed',
        issues: parsed.error.flatten(),
      })
      return
    }
    req.body = parsed.data
    next()
  }
}

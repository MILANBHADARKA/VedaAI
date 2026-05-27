import { z } from 'zod'
import { DIFFICULTIES } from '../lib/types'

export const llmQuestionSchema = z.object({
  number: z.number().int().positive(),
  text: z.string().min(1),
  difficulty: z.enum(DIFFICULTIES),
  marks: z.number().int().positive(),
  options: z.array(z.string().min(1)).min(2).max(6).nullable(),
  answer: z.string().min(1),
})

export const llmSectionSchema = z.object({
  id: z.string().min(1).max(2),
  title: z.string().min(1),
  instruction: z.string().default(''),
  questions: z.array(llmQuestionSchema).min(1),
})

export const llmPaperSchema = z.object({
  header: z.object({
    schoolName: z.string(),
    subject: z.string(),
    className: z.string(),
    timeAllowedMinutes: z.number().int().nonnegative(),
    maxMarks: z.number().int().nonnegative(),
    generalInstructions: z.array(z.string()),
  }),
  sections: z.array(llmSectionSchema).min(1),
})

export type LlmPaper = z.infer<typeof llmPaperSchema>

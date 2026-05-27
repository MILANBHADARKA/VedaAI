export const QUESTION_TYPES = [
  'multiple_choice',
  'short_answer',
  'long_answer',
  'diagram_graph',
  'numerical',
  'true_false',
  'fill_blanks',
] as const
export type QuestionType = (typeof QUESTION_TYPES)[number]

export const DIFFICULTIES = ['easy', 'moderate', 'challenging'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const JOB_STATUS = [
  'queued',
  'processing',
  'completed',
  'failed',
] as const
export type JobStatus = (typeof JOB_STATUS)[number]

export const ASSIGNMENT_STATUS = [
  'generating',
  'ready',
  'failed',
] as const
export type AssignmentStatus = (typeof ASSIGNMENT_STATUS)[number]

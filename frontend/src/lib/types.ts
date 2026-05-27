export type QuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'long_answer'
  | 'diagram_graph'
  | 'numerical'
  | 'true_false'
  | 'fill_blanks'

export type Difficulty = 'easy' | 'moderate' | 'challenging'

export type AssignmentStatus = 'generating' | 'ready' | 'failed'
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed'

export type AssignmentFile = {
  url: string
  publicId: string
  mimeType: string
  originalName: string
  sizeBytes: number
}

export type QuestionTypeRow = {
  type: QuestionType
  count: number
  marks: number
}

export type Assignment = {
  id: string
  title: string
  dueDate: string
  questionTypes: QuestionTypeRow[]
  additionalInstructions: string
  file: AssignmentFile | null
  totalQuestions: number
  totalMarks: number
  status: AssignmentStatus
  createdAt: string
  updatedAt: string
}

export type Job = {
  id: string
  assignmentId: string
  status: JobStatus
  progress: number
  error: string | null
  queueJobId: string | null
  createdAt: string
  updatedAt: string
}

export type ResultQuestion = {
  number: number
  text: string
  difficulty: Difficulty
  marks: number
  options: string[] | null
  answer: string
}

export type ResultSection = {
  id: string
  title: string
  instruction: string
  questions: ResultQuestion[]
}

export type ResultHeader = {
  schoolName: string
  subject: string
  className: string
  timeAllowedMinutes: number
  maxMarks: number
  generalInstructions: string[]
}

export type GeneratedPaper = {
  id: string
  assignmentId: string
  jobId: string
  header: ResultHeader
  sections: ResultSection[]
  createdAt: string
  updatedAt: string
}

export type ListResponse<T> = {
  items: T[]
  total: number
  skip: number
  limit: number
}

export type JobProgressEvent = {
  jobId: string
  status: JobStatus
  progress: number
  error?: string
  resultId?: string
}

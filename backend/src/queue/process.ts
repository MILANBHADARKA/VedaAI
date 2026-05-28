import type { Job as QueueJob } from 'bullmq'
import { extractFileText } from '../ai/extract'
import { generatePaper } from '../ai/generate'
import type { LlmPaper } from '../ai/schema'
import { env } from '../config/env'
import type { Difficulty, QuestionType } from '../lib/types'
import { Assignment, type AssignmentDoc } from '../models/assignment'
import { Job } from '../models/job'
import { Result } from '../models/result'
import { User } from '../models/user'
import { publishProgress } from '../ws/publish'
import type { GenerationJobData, GenerationJobResult } from './queue'

const DIFF_CYCLE: Difficulty[] = ['easy', 'moderate', 'challenging']

type AssignmentLike = {
  questionTypes: { type: QuestionType; count: number; marks: number }[]
  totalQuestions: number
  totalMarks: number
  additionalInstructions: string
  file: { originalName: string; mimeType: string } | null
}

function buildStubPaper(assignment: AssignmentLike): LlmPaper {
  let n = 1
  const questions = assignment.questionTypes.flatMap((row, rowIdx) =>
    Array.from({ length: row.count }, (_, qIdx) => ({
      number: n++,
      text: `[Placeholder] Question on ${row.type.replace(/_/g, ' ')}.`,
      difficulty: DIFF_CYCLE[(rowIdx + qIdx) % DIFF_CYCLE.length],
      marks: row.marks,
      options: null,
      answer: 'Placeholder answer — set GROQ_API_KEY to enable real generation.',
    })),
  )

  return {
    header: {
      schoolName: 'Delhi Public School, Sector-4, Bokaro',
      subject: 'TBD',
      className: 'TBD',
      timeAllowedMinutes: 45,
      maxMarks: assignment.totalMarks,
      generalInstructions: [
        'All questions are compulsory unless stated otherwise.',
      ],
    },
    sections: [
      {
        id: 'A',
        title: 'Section A',
        instruction: 'Attempt all questions.',
        questions,
      },
    ],
  }
}

async function buildPaper(
  assignment: AssignmentDoc,
  referenceText: string | null,
  schoolName: string | null,
): Promise<LlmPaper> {
  const input: AssignmentLike = {
    questionTypes: assignment.questionTypes.map((row) => ({
      type: row.type as QuestionType,
      count: row.count,
      marks: row.marks,
    })),
    totalQuestions: assignment.totalQuestions,
    totalMarks: assignment.totalMarks,
    additionalInstructions: assignment.additionalInstructions,
    file: assignment.file
      ? {
          originalName: assignment.file.originalName,
          mimeType: assignment.file.mimeType,
        }
      : null,
  }

  if (!env.groqApiKey) {
    console.warn('[ai] GROQ_API_KEY not set — using stub paper')
    return buildStubPaper(input)
  }

  return generatePaper({
    questionTypes: input.questionTypes,
    totalQuestions: input.totalQuestions,
    totalMarks: input.totalMarks,
    additionalInstructions: input.additionalInstructions,
    fileHint: input.file
      ? `${input.file.originalName} (${input.file.mimeType})`
      : null,
    referenceText,
    schoolName,
  })
}

async function advance(jobId: string, progress: number) {
  await Job.findByIdAndUpdate(jobId, { progress })
  await publishProgress({ jobId, status: 'processing', progress })
}

export async function processGeneration(
  queueJob: QueueJob<GenerationJobData, GenerationJobResult>,
): Promise<GenerationJobResult> {
  const { assignmentId, jobId } = queueJob.data

  await Job.findByIdAndUpdate(jobId, {
    status: 'processing',
    progress: 5,
    queueJobId: String(queueJob.id),
  })
  await queueJob.updateProgress(5)
  await publishProgress({ jobId, status: 'processing', progress: 5 })

  const assignment = await Assignment.findById(assignmentId)
  if (!assignment) throw new Error(`Assignment ${assignmentId} not found`)

  const user = await User.findById(assignment.userId)
  const schoolName = user?.institution?.name?.trim() || null

  let referenceText: string | null = null
  if (assignment.file) {
    await advance(jobId, 20)
    referenceText = await extractFileText(assignment.file).catch((err) => {
      console.warn('[ocr] extraction failed', err)
      return null
    })
    await advance(jobId, 40)
  }

  const payload = await buildPaper(assignment, referenceText, schoolName)
  if (schoolName) payload.header.schoolName = schoolName
  await queueJob.updateProgress(70)
  await advance(jobId, 70)

  const existing = await Result.findOne({ assignmentId })
  const result = existing
    ? await Result.findOneAndUpdate(
        { assignmentId },
        { ...payload, jobId },
        { new: true },
      )
    : await Result.create({ assignmentId, jobId, ...payload })

  if (!result) throw new Error('Failed to persist Result')

  await Job.findByIdAndUpdate(jobId, { status: 'completed', progress: 100 })
  await Assignment.findByIdAndUpdate(assignmentId, { status: 'ready' })
  await queueJob.updateProgress(100)
  await publishProgress({
    jobId,
    status: 'completed',
    progress: 100,
    resultId: String(result._id),
  })

  return { resultId: String(result._id) }
}

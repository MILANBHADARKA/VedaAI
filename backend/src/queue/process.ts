import type { Job as QueueJob } from 'bullmq'
import { Assignment } from '../models/assignment'
import { Job } from '../models/job'
import { Result } from '../models/result'
import type { Difficulty } from '../lib/types'
import type { GenerationJobData, GenerationJobResult } from './queue'

const DIFF_CYCLE: Difficulty[] = ['easy', 'moderate', 'challenging']

async function buildStubResult(assignmentId: string) {
  const assignment = await Assignment.findById(assignmentId)
  if (!assignment) throw new Error(`Assignment ${assignmentId} not found`)

  let n = 1
  const questions = assignment.questionTypes.flatMap((row, rowIdx) =>
    Array.from({ length: row.count }, (_, qIdx) => ({
      number: n++,
      text: `[Placeholder] Question on ${row.type.replace(/_/g, ' ')}.`,
      difficulty: DIFF_CYCLE[(rowIdx + qIdx) % DIFF_CYCLE.length],
      marks: row.marks,
      answer: 'Placeholder answer — replaced once GROQ is wired in.',
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

  const payload = await buildStubResult(assignmentId)
  await queueJob.updateProgress(60)
  await Job.findByIdAndUpdate(jobId, { progress: 60 })

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

  return { resultId: String(result._id) }
}

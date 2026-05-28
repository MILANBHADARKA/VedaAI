import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { Assignment } from '../models/assignment'
import { Job } from '../models/job'
import { Result } from '../models/result'
import { asyncHandler, HttpError } from '../lib/http'
import {
  createAssignmentSchema,
  validateBody,
  type CreateAssignmentInput,
} from '../lib/validation'
import { enqueueGeneration } from '../queue/enqueue'

const router = Router()

const totals = (input: CreateAssignmentInput) => {
  const totalQuestions = input.questionTypes.reduce(
    (sum, row) => sum + row.count,
    0,
  )
  const totalMarks = input.questionTypes.reduce(
    (sum, row) => sum + row.count * row.marks,
    0,
  )
  return { totalQuestions, totalMarks }
}

const deriveTitle = (input: CreateAssignmentInput): string => {
  if (input.title && input.title.length > 0) return input.title
  const hint = input.additionalInstructions?.trim().split('\n')[0]
  if (hint && hint.length > 0) return hint.slice(0, 80)
  return 'Untitled Assignment'
}

router.post(
  '/',
  validateBody(createAssignmentSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as CreateAssignmentInput
    const { totalQuestions, totalMarks } = totals(input)

    const assignment = await Assignment.create({
      title: deriveTitle(input),
      dueDate: input.dueDate,
      questionTypes: input.questionTypes,
      additionalInstructions: input.additionalInstructions ?? '',
      file: input.file ?? null,
      totalQuestions,
      totalMarks,
      status: 'generating',
    })

    const job = await Job.create({
      assignmentId: assignment._id,
      status: 'queued',
    })

    await enqueueGeneration({
      assignmentId: String(assignment._id),
      jobId: String(job._id),
    })

    res.status(201).json({
      assignment: assignment.toJSON(),
      job: job.toJSON(),
    })
  }),
)

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit ?? 20), 100)
    const skip = Math.max(Number(req.query.skip ?? 0), 0)
    const [items, total] = await Promise.all([
      Assignment.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Assignment.countDocuments(),
    ])
    res.json({ items: items.map((a) => a.toJSON()), total, skip, limit })
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new HttpError(400, 'Invalid id')
    }
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) throw new HttpError(404, 'Assignment not found')
    res.json(assignment.toJSON())
  }),
)

router.get(
  '/:id/job',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new HttpError(400, 'Invalid id')
    }
    const job = await Job.findOne({ assignmentId: req.params.id }).sort({
      createdAt: -1,
    })
    if (!job) throw new HttpError(404, 'No job for assignment')
    res.json(job.toJSON())
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new HttpError(400, 'Invalid id')
    }
    const assignment = await Assignment.findByIdAndDelete(req.params.id)
    if (!assignment) throw new HttpError(404, 'Assignment not found')
    await Promise.all([
      Job.deleteMany({ assignmentId: assignment._id }),
      Result.deleteMany({ assignmentId: assignment._id }),
    ])
    res.status(204).end()
  }),
)

export default router

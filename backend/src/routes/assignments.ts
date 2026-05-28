import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { Assignment, type AssignmentDoc } from '../models/assignment'
import { Job } from '../models/job'
import { Result } from '../models/result'
import { asyncHandler, HttpError } from '../lib/http'
import { requireAuth } from '../lib/requireAuth'
import {
  createAssignmentSchema,
  validateBody,
  type CreateAssignmentInput,
} from '../lib/validation'
import { enqueueGeneration } from '../queue/enqueue'
import { renderPaperPdf } from '../pdf/render'

const router = Router()

router.use(requireAuth)

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

async function findOwned(id: string, userId: unknown) {
  if (!isValidObjectId(id)) throw new HttpError(400, 'Invalid id')
  const assignment = await Assignment.findById(id)
  if (!assignment || String(assignment.userId) !== String(userId)) {
    throw new HttpError(404, 'Assignment not found')
  }
  return assignment
}

router.post(
  '/',
  validateBody(createAssignmentSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as CreateAssignmentInput
    const { totalQuestions, totalMarks } = totals(input)

    const assignment = await Assignment.create({
      userId: req.user!._id,
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
    const filter = { userId: req.user!._id }
    const [items, total] = await Promise.all([
      Assignment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Assignment.countDocuments(filter),
    ])
    res.json({ items: items.map((a) => a.toJSON()), total, skip, limit })
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const assignment = await findOwned(req.params.id, req.user!._id)
    res.json(assignment.toJSON())
  }),
)

router.get(
  '/:id/job',
  asyncHandler(async (req, res) => {
    await findOwned(req.params.id, req.user!._id)
    const job = await Job.findOne({ assignmentId: req.params.id }).sort({
      createdAt: -1,
    })
    if (!job) throw new HttpError(404, 'No job for assignment')
    res.json(job.toJSON())
  }),
)

router.get(
  '/:id/pdf',
  asyncHandler(async (req, res) => {
    await findOwned(req.params.id, req.user!._id)
    const result = await Result.findOne({ assignmentId: req.params.id })
    if (!result) throw new HttpError(404, 'Result not ready')
    const pdf = await renderPaperPdf({
      header: result.header,
      sections: result.sections,
    })
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="question-paper.pdf"',
    )
    res.send(pdf)
  }),
)

router.post(
  '/:id/regenerate',
  asyncHandler(async (req, res) => {
    const assignment = await findOwned(req.params.id, req.user!._id)
    await Assignment.updateOne(
      { _id: assignment._id },
      { status: 'generating' },
    )
    const job = await Job.create({
      assignmentId: assignment._id,
      status: 'queued',
    })
    await enqueueGeneration({
      assignmentId: String(assignment._id),
      jobId: String(job._id),
    })
    res.status(201).json({ job: job.toJSON() })
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const assignment = await findOwned(req.params.id, req.user!._id)
    await Promise.all([
      Assignment.deleteOne({ _id: assignment._id }),
      Job.deleteMany({ assignmentId: assignment._id }),
      Result.deleteMany({ assignmentId: assignment._id }),
    ])
    res.status(204).end()
  }),
)

export default router

import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { Assignment } from '../models/assignment'
import { Job } from '../models/job'
import { asyncHandler, HttpError } from '../lib/http'
import { requireAuth } from '../lib/requireAuth'

const router = Router()

router.use(requireAuth)

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new HttpError(400, 'Invalid id')
    }
    const job = await Job.findById(req.params.id)
    if (!job) throw new HttpError(404, 'Job not found')
    const assignment = await Assignment.findById(job.assignmentId)
    if (!assignment || String(assignment.userId) !== String(req.user!._id)) {
      throw new HttpError(404, 'Job not found')
    }
    res.json(job.toJSON())
  }),
)

export default router

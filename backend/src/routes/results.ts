import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { Assignment } from '../models/assignment'
import { Result } from '../models/result'
import { asyncHandler, HttpError } from '../lib/http'
import { requireAuth } from '../lib/requireAuth'

const router = Router()

router.use(requireAuth)

router.get(
  '/:assignmentId',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.assignmentId)) {
      throw new HttpError(400, 'Invalid id')
    }
    const assignment = await Assignment.findById(req.params.assignmentId)
    if (!assignment || String(assignment.userId) !== String(req.user!._id)) {
      throw new HttpError(404, 'Result not found')
    }
    const result = await Result.findOne({
      assignmentId: req.params.assignmentId,
    })
    if (!result) throw new HttpError(404, 'Result not ready')
    res.json(result.toJSON())
  }),
)

export default router

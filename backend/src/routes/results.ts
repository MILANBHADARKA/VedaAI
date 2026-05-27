import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { Result } from '../models/result'
import { asyncHandler, HttpError } from '../lib/http'

const router = Router()

router.get(
  '/:assignmentId',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.assignmentId)) {
      throw new HttpError(400, 'Invalid id')
    }
    const result = await Result.findOne({
      assignmentId: req.params.assignmentId,
    })
    if (!result) throw new HttpError(404, 'Result not ready')
    res.json(result.toJSON())
  }),
)

export default router

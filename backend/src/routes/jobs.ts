import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { Job } from '../models/job'
import { asyncHandler, HttpError } from '../lib/http'

const router = Router()

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      throw new HttpError(400, 'Invalid id')
    }
    const job = await Job.findById(req.params.id)
    if (!job) throw new HttpError(404, 'Job not found')
    res.json(job.toJSON())
  }),
)

export default router

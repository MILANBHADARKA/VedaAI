import { Router } from 'express'
import { isValidObjectId } from 'mongoose'
import { asyncHandler, HttpError } from '../lib/http'
import { verifyShareToken } from '../lib/share'
import { Result } from '../models/result'

const router = Router()

router.get(
  '/:token',
  asyncHandler(async (req, res) => {
    const payload = verifyShareToken(req.params.token)
    if (!payload || !isValidObjectId(payload.assignmentId)) {
      throw new HttpError(404, 'This link is invalid or has expired')
    }
    const result = await Result.findOne({ assignmentId: payload.assignmentId })
    if (!result) throw new HttpError(404, 'Paper not found')

    const json = result.toJSON() as {
      header: unknown
      sections: {
        id: string
        title: string
        instruction: string
        questions: { answer?: string; [key: string]: unknown }[]
      }[]
    }

    const sections = json.sections.map((s) => ({
      id: s.id,
      title: s.title,
      instruction: s.instruction,
      questions: s.questions.map(({ answer: _answer, ...rest }) => rest),
    }))

    res.json({ header: json.header, sections, variant: payload.variant })
  }),
)

export default router

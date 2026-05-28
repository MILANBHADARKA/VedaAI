import { Router, type Response } from 'express'
import { hashPassword, signToken, verifyPassword } from '../lib/auth'
import { asyncHandler, HttpError } from '../lib/http'
import { AUTH_COOKIE, requireAuth } from '../lib/requireAuth'
import {
  loginSchema,
  onboardingSchema,
  profileSchema,
  signupSchema,
  validateBody,
  type LoginInput,
  type OnboardingInput,
  type ProfileInput,
  type SignupInput,
} from '../lib/validation'
import { User } from '../models/user'

const router = Router()

function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

router.post(
  '/signup',
  validateBody(signupSchema),
  asyncHandler(async (req, res) => {
    const { email, username, password } = req.body as SignupInput
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })
    if (existing) throw new HttpError(409, 'Email or username already in use')

    const user = await User.create({
      email: email.toLowerCase(),
      username,
      passwordHash: await hashPassword(password),
    })
    setAuthCookie(res, signToken(String(user._id)))
    res.status(201).json(user.toJSON())
  }),
)

router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.body as LoginInput
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    })
    if (!user) throw new HttpError(401, 'Invalid credentials')
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) throw new HttpError(401, 'Invalid credentials')

    setAuthCookie(res, signToken(String(user._id)))
    res.json(user.toJSON())
  }),
)

router.post('/logout', (_req, res) => {
  res.clearCookie(AUTH_COOKIE, { path: '/' })
  res.status(204).end()
})

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(req.user!.toJSON())
  }),
)

router.patch(
  '/onboarding',
  requireAuth,
  validateBody(onboardingSchema),
  asyncHandler(async (req, res) => {
    const { fullName, institution } = req.body as OnboardingInput
    const user = req.user!
    user.fullName = fullName
    user.institution = institution
    user.onboardingComplete = true
    await user.save()
    res.json(user.toJSON())
  }),
)

router.patch(
  '/profile',
  requireAuth,
  validateBody(profileSchema),
  asyncHandler(async (req, res) => {
    const body = req.body as ProfileInput
    const user = req.user!
    if (body.fullName !== undefined) user.fullName = body.fullName
    if (body.institution) {
      if (body.institution.kind) user.institution.kind = body.institution.kind
      if (body.institution.name !== undefined)
        user.institution.name = body.institution.name
      if (body.institution.address !== undefined)
        user.institution.address = body.institution.address
    }
    if (body.avatarUrl !== undefined) user.avatarUrl = body.avatarUrl
    await user.save()
    res.json(user.toJSON())
  }),
)

export default router

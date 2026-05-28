import { Schema, model } from 'mongoose'

export type Institution = {
  kind: 'school' | 'college'
  name: string
  address: string
}

export type UserDoc = {
  email: string
  username: string
  passwordHash: string
  fullName: string
  institution: Institution
  avatarUrl: string | null
  onboardingComplete: boolean
  createdAt: Date
  updatedAt: Date
}

const institutionSchema = new Schema(
  {
    kind: { type: String, enum: ['school', 'college'], default: 'school' },
    name: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { _id: false },
)

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, default: '' },
    institution: {
      type: institutionSchema,
      default: () => ({ kind: 'school', name: '', address: '' }),
    },
    avatarUrl: { type: String, default: null },
    onboardingComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>
        delete r._id
        delete r.passwordHash
      },
    },
  },
)

export const User = model<UserDoc>('User', userSchema)

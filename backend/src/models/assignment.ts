import { Schema, model, type Types } from 'mongoose'
import {
  ASSIGNMENT_STATUS,
  QUESTION_TYPES,
  type AssignmentStatus,
  type QuestionType,
} from '../lib/types'

const fileSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    mimeType: { type: String, required: true },
    originalName: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
  },
  { _id: false },
)

const questionTypeRow = new Schema(
  {
    type: { type: String, enum: QUESTION_TYPES, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const assignmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, default: 'Untitled Assignment', trim: true },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [questionTypeRow], required: true },
    additionalInstructions: { type: String, default: '' },
    file: { type: fileSchema, default: null },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    status: {
      type: String,
      enum: ASSIGNMENT_STATUS,
      default: 'generating',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>
        delete r._id
      },
    },
  },
)

assignmentSchema.index({ createdAt: -1 })

export type AssignmentFile = {
  url: string
  publicId: string
  mimeType: string
  originalName: string
  sizeBytes: number
}

export type AssignmentDoc = {
  userId: Types.ObjectId
  title: string
  dueDate: Date
  questionTypes: { type: QuestionType; count: number; marks: number }[]
  additionalInstructions: string
  file: AssignmentFile | null
  totalQuestions: number
  totalMarks: number
  status: AssignmentStatus
  createdAt: Date
  updatedAt: Date
}

export const Assignment = model<AssignmentDoc>('Assignment', assignmentSchema)

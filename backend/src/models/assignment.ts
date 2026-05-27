import { Schema, model, type InferSchemaType } from 'mongoose'
import {
  ASSIGNMENT_STATUS,
  QUESTION_TYPES,
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
      transform: (_doc, ret) => {
        ret.id = String(ret._id)
        delete ret._id
        return ret
      },
    },
  },
)

assignmentSchema.index({ createdAt: -1 })

export type AssignmentDoc = InferSchemaType<typeof assignmentSchema>
export const Assignment = model('Assignment', assignmentSchema)

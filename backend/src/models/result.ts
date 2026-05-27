import { Schema, model, type InferSchemaType } from 'mongoose'
import { DIFFICULTIES } from '../lib/types'

const questionSchema = new Schema(
  {
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: { type: String, enum: DIFFICULTIES, required: true },
    marks: { type: Number, required: true, min: 1 },
    options: { type: [String], default: undefined },
    answer: { type: String, required: true },
  },
  { _id: false },
)

const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    instruction: { type: String, default: '' },
    questions: { type: [questionSchema], required: true },
  },
  { _id: false },
)

const headerSchema = new Schema(
  {
    schoolName: { type: String, default: '' },
    subject: { type: String, default: '' },
    className: { type: String, default: '' },
    timeAllowedMinutes: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 0 },
    generalInstructions: { type: [String], default: [] },
  },
  { _id: false },
)

const resultSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      unique: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    header: { type: headerSchema, required: true },
    sections: { type: [sectionSchema], required: true },
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

export type ResultDoc = InferSchemaType<typeof resultSchema>
export const Result = model('Result', resultSchema)

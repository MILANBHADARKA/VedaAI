import { Schema, model, type InferSchemaType } from 'mongoose'
import { JOB_STATUS } from '../lib/types'

const jobSchema = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    status: { type: String, enum: JOB_STATUS, default: 'queued', index: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    error: { type: String, default: null },
    queueJobId: { type: String, default: null },
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

export type JobDoc = InferSchemaType<typeof jobSchema>
export const Job = model('Job', jobSchema)

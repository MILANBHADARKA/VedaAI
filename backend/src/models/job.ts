import { Schema, model, type Types } from 'mongoose'
import { JOB_STATUS, type JobStatus } from '../lib/types'

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
      virtuals: true,
      transform: (_doc, ret) => {
        const r = ret as Record<string, unknown>
        delete r._id
      },
    },
  },
)

export type JobDoc = {
  assignmentId: Types.ObjectId
  status: JobStatus
  progress: number
  error: string | null
  queueJobId: string | null
  createdAt: Date
  updatedAt: Date
}

export const Job = model<JobDoc>('Job', jobSchema)

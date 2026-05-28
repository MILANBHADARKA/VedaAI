'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { useJobProgress } from '@/hooks/useJobProgress'
import type { Assignment, GeneratedPaper, Job } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import FailedState from './FailedState'
import GeneratingState from './GeneratingState'
import PaperView from './PaperView'

export default function AssignmentOutput({ id }: { id: string }) {
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [paper, setPaper] = useState<GeneratedPaper | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)
  const reloadedRef = useRef(false)

  const load = useCallback(async () => {
    const a = await api<Assignment>(`/assignments/${id}`)
    setAssignment(a)
    if (a.status === 'ready') {
      setPaper(await api<GeneratedPaper>(`/results/${id}`))
    } else if (a.status === 'generating') {
      setJob(await api<Job>(`/assignments/${id}/job`).catch(() => null))
    }
  }, [id])

  useEffect(() => {
    load().catch((err) =>
      setError(err instanceof Error ? err.message : 'Failed to load'),
    )
  }, [load])

  const trackingJobId =
    assignment?.status === 'generating' ? job?.id ?? null : null
  const event = useJobProgress(trackingJobId)

  useEffect(() => {
    if (event?.status === 'completed' && !reloadedRef.current) {
      reloadedRef.current = true
      load().catch(() => undefined)
    }
  }, [event, load])

  const regenerate = useCallback(async () => {
    setRegenerating(true)
    try {
      const { job: nextJob } = await api<{ job: Job }>(
        `/assignments/${id}/regenerate`,
        { method: 'POST' },
      )
      reloadedRef.current = false
      setPaper(null)
      setJob(nextJob)
      setAssignment((a) => (a ? { ...a, status: 'generating' } : a))
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : 'Failed to regenerate',
      )
    } finally {
      setRegenerating(false)
    }
  }, [id])

  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="text-lg font-semibold text-neutral-900">
          Assignment not found
        </h2>
        <p className="text-sm text-neutral-600 mt-1">{error}</p>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-neutral-500">
        <Spinner />
      </div>
    )
  }

  if (assignment.status === 'failed' || event?.status === 'failed') {
    return (
      <FailedState
        error={event?.error}
        onRegenerate={regenerate}
        regenerating={regenerating}
      />
    )
  }

  if (assignment.status === 'generating' || !paper) {
    return <GeneratingState event={event} />
  }

  return (
    <PaperView
      paper={paper}
      assignmentId={id}
      onRegenerate={regenerate}
      regenerating={regenerating}
    />
  )
}

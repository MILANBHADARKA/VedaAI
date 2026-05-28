'use client'

import type { JobProgressEvent } from '@/lib/types'
import ProgressBar from '@/components/ui/ProgressBar'
import Spinner from '@/components/ui/Spinner'

type Props = {
  event: JobProgressEvent | null
  creating: boolean
  onRetry: () => void
  onClose: () => void
}

function statusText(event: JobProgressEvent | null, creating: boolean): string {
  if (creating && !event) return 'Creating your assignment…'
  switch (event?.status) {
    case 'queued':
      return 'Queued for generation…'
    case 'processing':
      return event.progress >= 70
        ? 'Finalizing your paper…'
        : 'Generating questions with AI…'
    case 'completed':
      return 'Done! Opening your paper…'
    default:
      return 'Working…'
  }
}

export default function GenerationOverlay({
  event,
  creating,
  onRetry,
  onClose,
}: Props) {
  const failed = event?.status === 'failed'
  const progress = event?.progress ?? (creating ? 2 : 0)

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl p-8 w-full max-w-md text-center shadow-popover">
        {failed ? (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-hard-bg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v5M12 16h.01"
                  stroke="#B42424"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="9" stroke="#B42424" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Generation failed
            </h3>
            <p className="text-sm text-neutral-600 mt-1 break-words">
              {event?.error ?? 'Something went wrong while generating the paper.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-5 rounded-full bg-surface border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onRetry}
                className="h-10 px-5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#111111] hover:from-[#333] hover:to-[#1a1a1a]"
              >
                Try Again
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-brand">
              <Spinner className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Generating your question paper
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              {statusText(event, creating)}
            </p>
            <div className="mt-6">
              <ProgressBar value={progress} />
              <div className="mt-2 text-xs text-neutral-500 tabular-nums">
                {Math.round(progress)}%
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

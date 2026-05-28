import type { JobProgressEvent } from '@/lib/types'
import ProgressBar from '@/components/ui/ProgressBar'
import Spinner from '@/components/ui/Spinner'

function statusText(event: JobProgressEvent | null): string {
  switch (event?.status) {
    case 'processing':
      return event.progress >= 70
        ? 'Finalizing your paper…'
        : 'Generating questions with AI…'
    case 'queued':
      return 'Queued for generation…'
    default:
      return 'Preparing…'
  }
}

export default function GeneratingState({
  event,
}: {
  event: JobProgressEvent | null
}) {
  const progress = event?.progress ?? 5
  return (
    <div className="max-w-md mx-auto py-24 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-brand">
        <Spinner className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-neutral-900">
        Generating your question paper
      </h2>
      <p className="text-sm text-neutral-600 mt-1">{statusText(event)}</p>
      <div className="mt-6">
        <ProgressBar value={progress} />
        <div className="mt-2 text-xs text-neutral-500 tabular-nums">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import Spinner from '@/components/ui/Spinner'

type Props = {
  error?: string | null
  onRegenerate: () => void
  regenerating: boolean
}

export default function FailedState({
  error,
  onRegenerate,
  regenerating,
}: Props) {
  return (
    <div className="max-w-md mx-auto py-24 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-challenging-bg flex items-center justify-center">
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
      <h2 className="text-lg font-semibold text-neutral-900">
        Generation failed
      </h2>
      <p className="text-sm text-neutral-600 mt-1 break-words">
        {error ?? 'Something went wrong while generating this paper.'}
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/assignments"
          className="inline-flex items-center h-10 px-5 rounded-full bg-surface border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
        >
          Back to Assignments
        </Link>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={regenerating}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#111111] hover:from-[#333] hover:to-[#1a1a1a] disabled:opacity-60"
        >
          {regenerating && <Spinner className="h-4 w-4" />}
          Regenerate
        </button>
      </div>
    </div>
  )
}

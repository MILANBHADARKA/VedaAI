'use client'

import type { ResultHeader } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import ExportMenu from './ExportMenu'

type Props = {
  assignmentId: string
  header: ResultHeader
  onRegenerate: () => void
  regenerating: boolean
}

function introLine(header: ResultHeader): string {
  const subject = header.subject && header.subject !== 'TBD' ? header.subject : ''
  const klass =
    header.className && header.className !== 'TBD' ? header.className : ''
  const target = [klass, subject].filter(Boolean).join(' ')
  return target
    ? `Here is your customized question paper for ${target}.`
    : 'Here is your customized question paper.'
}

export default function AiBanner({
  assignmentId,
  header,
  onRegenerate,
  regenerating,
}: Props) {
  return (
    <div className="bg-banner-dark text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 print:hidden">
      <p className="flex-1 text-sm leading-relaxed">{introLine(header)}</p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onRegenerate}
          disabled={regenerating}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
        >
          {regenerating ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          Regenerate
        </button>
        <ExportMenu assignmentId={assignmentId} />
      </div>
    </div>
  )
}

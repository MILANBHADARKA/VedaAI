'use client'

import type { ResultHeader } from '@/lib/types'

type Props = {
  header: ResultHeader
  onDownload: () => void
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

export default function AiBanner({ header, onDownload }: Props) {
  return (
    <div className="bg-banner-dark text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 print:hidden">
      <p className="flex-1 text-sm leading-relaxed">{introLine(header)}</p>
      <button
        type="button"
        onClick={onDownload}
        className="shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-surface text-neutral-900 text-sm font-semibold hover:bg-neutral-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download as PDF
      </button>
    </div>
  )
}

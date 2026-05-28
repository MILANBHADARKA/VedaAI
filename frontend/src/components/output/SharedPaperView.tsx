/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { ResultSection, SharedPaper } from '@/lib/types'
import Spinner from '@/components/ui/Spinner'
import PaperHeader from './PaperHeader'
import SectionBlock from './SectionBlock'
import StudentInfo from './StudentInfo'

export default function SharedPaperView({ token }: { token: string }) {
  const [paper, setPaper] = useState<SharedPaper | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api<SharedPaper>(`/share/${token}`)
      .then(setPaper)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'This link is not available'),
      )
  }, [token])

  if (error) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h1 className="text-lg font-semibold text-neutral-900">
          Link unavailable
        </h1>
        <p className="text-sm text-neutral-600 mt-1">{error}</p>
      </div>
    )
  }

  if (!paper) {
    return (
      <div className="flex items-center justify-center min-h-screen text-neutral-500">
        <Spinner />
      </div>
    )
  }

  const sections: ResultSection[] = paper.sections.map((s) => ({
    ...s,
    questions: s.questions.map((q) => ({ ...q, answer: '' })),
  }))

  return (
    <div className="min-h-screen bg-page">
      <header className="bg-surface border-b border-neutral-200 print:hidden">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icons/logo.png" alt="" width={24} height={24} />
            <span className="text-base font-semibold text-neutral-900">
              VedaAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500">
              Shared paper &middot; read-only
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-surface border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
            >
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <article className="bg-surface rounded-2xl shadow-card p-6 sm:p-10 print:shadow-none print:rounded-none print:p-0">
          <PaperHeader header={paper.header} />
          <StudentInfo className={paper.header.className} />

          {sections.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}

          <p className="mt-8 text-center text-sm font-semibold text-neutral-900">
            End of Question Paper
          </p>
        </article>
      </main>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import type { QuestionType } from '@/lib/types'
import { cn } from '@/lib/cn'

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  multiple_choice: 'Multiple Choice Questions',
  short_answer: 'Short Questions',
  long_answer: 'Long Answer Questions',
  diagram_graph: 'Diagram/Graph-Based Questions',
  numerical: 'Numerical Problems',
  true_false: 'True / False',
  fill_blanks: 'Fill in the Blanks',
}

const OPTIONS = Object.keys(QUESTION_TYPE_LABEL) as QuestionType[]

type Props = {
  value: QuestionType
  onChange: (next: QuestionType) => void
}

export default function QuestionTypeSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  return (
    <div ref={wrapperRef} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-11 px-4 pr-3 rounded-full bg-surface border border-neutral-300 text-sm text-neutral-900 flex items-center gap-2"
      >
        <span className="flex-1 text-left truncate">
          {QUESTION_TYPE_LABEL[value]}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul className="absolute left-0 top-full mt-2 w-full bg-surface rounded-xl shadow-popover p-1 z-20 max-h-72 overflow-y-auto">
          {OPTIONS.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-neutral-100',
                  opt === value
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-700',
                )}
              >
                {QUESTION_TYPE_LABEL[opt]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

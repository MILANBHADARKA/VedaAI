'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { useCreateAssignmentStore } from '@/store/createAssignment'
import AdditionalInfo from './AdditionalInfo'
import DueDateInput from './DueDateInput'
import FileDropzone from './FileDropzone'
import QuestionTypeRow from './QuestionTypeRow'
import StepperHeader from './StepperHeader'

type Errors = {
  dueDate?: string
  rows?: string
}

export default function CreateAssignmentForm() {
  const router = useRouter()
  const {
    dueDate,
    rows,
    additionalInstructions,
    fileUploading,
    setDueDate,
    addRow,
    removeRow,
    updateRow,
    setAdditionalInstructions,
  } = useCreateAssignmentStore()

  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const { totalQuestions, totalMarks } = useMemo(() => {
    let q = 0
    let m = 0
    for (const r of rows) {
      q += r.count
      m += r.count * r.marks
    }
    return { totalQuestions: q, totalMarks: m }
  }, [rows])

  function validate(): boolean {
    const e: Errors = {}
    if (!dueDate) {
      e.dueDate = 'Due date is required'
    } else {
      const d = new Date(dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (d < today) e.dueDate = 'Due date must be today or later'
    }
    if (rows.length === 0) e.rows = 'Add at least one question type'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleNext() {
    if (!validate()) return
    setSubmitting(true)
    console.log('would submit', {
      dueDate,
      rows,
      additionalInstructions,
      totalQuestions,
      totalMarks,
    })
    setSubmitting(false)
  }

  const canSubmit = !fileUploading && !submitting

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <StepperHeader />

      <section className="mt-6 bg-surface rounded-3xl p-6 lg:p-8 shadow-card">
        <header>
          <h2 className="text-lg font-semibold text-neutral-900">
            Assignment Details
          </h2>
          <p className="text-sm text-neutral-600 mt-0.5">
            Basic information about your assignment
          </p>
        </header>

        <div className="mt-6">
          <FileDropzone />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            Due Date
          </label>
          <DueDateInput
            value={dueDate}
            onChange={setDueDate}
            error={errors.dueDate}
          />
        </div>

        <div className="mt-6">
          <div className="flex items-end justify-between gap-4">
            <label className="block text-sm font-medium text-neutral-900">
              Question Type
            </label>
            <div className="hidden sm:flex items-center gap-6 pr-9 text-xs font-medium text-neutral-600">
              <span className="w-[120px] text-center">No. of Questions</span>
              <span className="w-[120px] text-center">Marks</span>
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {rows.map((row) => (
              <QuestionTypeRow
                key={row.id}
                row={row}
                onChange={(patch) => updateRow(row.id, patch)}
                onRemove={() => removeRow(row.id)}
                canRemove={rows.length > 1}
              />
            ))}
          </div>
          {errors.rows && (
            <p className="mt-2 text-xs text-danger">{errors.rows}</p>
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-brand"
            >
              <span className="h-6 w-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-base leading-none">
                +
              </span>
              Add Question Type
            </button>
            <div className="text-sm text-neutral-900 sm:text-right space-y-0.5">
              <div>
                <span className="text-neutral-600">Total Questions : </span>
                <span className="font-semibold">{totalQuestions}</span>
              </div>
              <div>
                <span className="text-neutral-600">Total Marks : </span>
                <span className="font-semibold">{totalMarks}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <AdditionalInfo
            value={additionalInstructions}
            onChange={setAdditionalInstructions}
          />
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-surface border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </Link>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#111111] hover:from-[#333] hover:to-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed shadow-button"
        >
          Next
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

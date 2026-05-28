'use client'

import type { FormRow } from '@/store/createAssignment'
import NumberStepper from './NumberStepper'
import QuestionTypeSelect from './QuestionTypeSelect'

type Props = {
  row: FormRow
  onChange: (patch: Partial<Omit<FormRow, 'id'>>) => void
  onRemove: () => void
  canRemove: boolean
}

export default function QuestionTypeRow({
  row,
  onChange,
  onRemove,
  canRemove,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <QuestionTypeSelect
          value={row.type}
          onChange={(type) => onChange({ type })}
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Remove row"
          className="h-9 w-9 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <NumberStepper
          value={row.count}
          onChange={(count) => onChange({ count })}
          min={1}
          max={50}
        />
        <NumberStepper
          value={row.marks}
          onChange={(marks) => onChange({ marks })}
          min={1}
          max={100}
        />
      </div>
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
'use client'

import { useRef } from 'react'
import { formatDate } from '@/lib/format'

type Props = {
  value: string
  onChange: (value: string) => void
  error?: string
}

const today = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export default function DueDateInput({ value, onChange, error }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const display = value ? formatDate(value) : 'DD-MM-YYYY'

  const openPicker = () => {
    const input = ref.current
    if (!input) return
    if ('showPicker' in input && typeof input.showPicker === 'function') {
      input.showPicker()
    } else {
      input.focus()
      input.click()
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={openPicker}
        className={`w-full h-12 px-4 rounded-xl border bg-surface flex items-center text-sm text-left ${
          error ? 'border-danger' : 'border-neutral-300'
        }`}
      >
        <span className={value ? 'text-neutral-900' : 'text-neutral-500'}>
          {display}
        </span>
        <img
          src="/icons/calendar.svg"
          alt=""
          width={18}
          height={18}
          className="ml-auto opacity-70"
        />
      </button>
      <input
        ref={ref}
        type="date"
        value={value}
        min={today()}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
        aria-label="Due date"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

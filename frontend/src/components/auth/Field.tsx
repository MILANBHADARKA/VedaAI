'use client'

import { cn } from '@/lib/cn'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  minLength?: number
  hint?: string
  error?: string
}

export default function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  required,
  minLength,
  hint,
  error,
}: Props) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-900 mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className={cn(
          'w-full h-12 px-4 rounded-xl border bg-surface text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400',
          error ? 'border-danger' : 'border-neutral-300',
        )}
      />
      {error ? (
        <p className="mt-1 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
      ) : null}
    </label>
  )
}

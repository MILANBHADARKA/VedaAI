'use client'

import { cn } from '@/lib/cn'

type Props = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  className?: string
}

export default function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 100,
  className,
}: Props) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div
      className={cn(
        'inline-flex items-center justify-between h-11 px-2 rounded-full bg-surface border border-neutral-300 w-[120px]',
        className,
      )}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease"
        className="h-7 w-7 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="text-sm font-semibold text-neutral-900 tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase"
        className="h-7 w-7 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  )
}

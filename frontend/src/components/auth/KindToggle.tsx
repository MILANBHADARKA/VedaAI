'use client'

import { cn } from '@/lib/cn'
import type { Institution } from '@/lib/types'

const KINDS: Institution['kind'][] = ['school', 'college']

type Props = {
  value: Institution['kind']
  onChange: (kind: Institution['kind']) => void
}

export default function KindToggle({ value, onChange }: Props) {
  return (
    <div>
      <span className="block text-sm font-medium text-neutral-900 mb-2">
        Institution type
      </span>
      <div className="grid grid-cols-2 gap-2">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={cn(
              'h-11 rounded-xl border text-sm font-medium capitalize transition-colors',
              value === k
                ? 'border-brand bg-nav-active text-neutral-900'
                : 'border-neutral-300 text-neutral-600 hover:bg-neutral-100',
            )}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useRef, useState } from 'react'
import type { AssignmentStatus } from '@/lib/types'
import { cn } from '@/lib/cn'

export type StatusFilter = 'all' | AssignmentStatus

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: 'All',
  generating: 'Generating',
  ready: 'Ready',
  failed: 'Failed',
}

type Props = {
  search: string
  onSearchChange: (value: string) => void
  status: StatusFilter
  onStatusChange: (value: StatusFilter) => void
}

export default function AssignmentsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
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
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-surface border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 5h18M6 12h12M10 19h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>
            Filter By{status !== 'all' && `: ${STATUS_LABEL[status]}`}
          </span>
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-2 w-44 bg-surface rounded-xl shadow-popover p-1 z-10">
            {(Object.keys(STATUS_LABEL) as StatusFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onStatusChange(key)
                  setOpen(false)
                }}
                className={cn(
                  'block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-neutral-100',
                  status === key
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-700',
                )}
              >
                {STATUS_LABEL[key]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      <label className="relative flex items-center w-full sm:w-80">
        <img
          src="/icons/search.svg"
          alt=""
          width={16}
          height={16}
          className="absolute left-4 opacity-60"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Assignment"
          className="w-full h-10 pl-10 pr-4 rounded-full bg-surface border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400"
        />
      </label>
    </div>
  )
}

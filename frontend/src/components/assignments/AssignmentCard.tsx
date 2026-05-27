'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Assignment } from '@/lib/types'
import { formatDate } from '@/lib/format'

type Props = {
  assignment: Assignment
  onDelete: (id: string) => void
}

export default function AssignmentCard({ assignment, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  const handleDelete = () => {
    setMenuOpen(false)
    if (window.confirm(`Delete "${assignment.title}"?`)) {
      onDelete(assignment.id)
    }
  }

  return (
    <article className="bg-surface rounded-lg shadow-card p-5 relative">
      <div className="flex items-start gap-3">
        <Link
          href={`/assignments/${assignment.id}`}
          className="flex-1 min-w-0 group"
        >
          <h3 className="text-lg font-semibold text-neutral-900 underline underline-offset-4 decoration-1 truncate group-hover:decoration-2">
            {assignment.title}
          </h3>
        </Link>
        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-surface rounded-xl shadow-popover p-1 z-10">
              <Link
                href={`/assignments/${assignment.id}`}
                className="block px-3 py-2 text-sm text-neutral-900 rounded-lg hover:bg-neutral-100"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="block w-full text-left px-3 py-2 text-sm text-danger rounded-lg hover:bg-neutral-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
        <span>
          <span className="font-semibold text-neutral-900">Assigned on</span>
          <span className="text-neutral-600"> : {formatDate(assignment.createdAt)}</span>
        </span>
        <span>
          <span className="font-semibold text-neutral-900">Due</span>
          <span className="text-neutral-600"> : {formatDate(assignment.dueDate)}</span>
        </span>
      </div>
    </article>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { api, apiBase } from '@/lib/api'
import { cn } from '@/lib/cn'
import Spinner from '@/components/ui/Spinner'

type Variant = 'teacher' | 'student'
type ShareState = 'idle' | 'loading' | 'copied' | 'error'

export default function ExportMenu({ assignmentId }: { assignmentId: string }) {
  const [open, setOpen] = useState(false)
  const [variant, setVariant] = useState<Variant>('teacher')
  const [share, setShare] = useState<ShareState>('idle')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const downloadUrl = (format: 'pdf' | 'docx') =>
    `${apiBase}/assignments/${assignmentId}/${format}?variant=${variant}`

  async function copyShareLink() {
    setShare('loading')
    try {
      const { token } = await api<{ token: string }>(
        `/assignments/${assignmentId}/share`,
        { method: 'POST' },
      )
      const url = `${window.location.origin}/share/${token}`
      await navigator.clipboard.writeText(url)
      setShare('copied')
    } catch {
      setShare('error')
    } finally {
      setTimeout(() => setShare('idle'), 2500)
    }
  }

  return (
    <div className="flex items-center gap-2" ref={ref}>
      <button
        type="button"
        onClick={copyShareLink}
        disabled={share === 'loading'}
        className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
      >
        {share === 'loading' ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {share === 'copied'
          ? 'Link copied'
          : share === 'error'
            ? 'Failed'
            : 'Share'}
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-surface text-neutral-900 text-sm font-semibold hover:bg-neutral-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Export
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
          <div
            role="menu"
            className="absolute right-0 mt-2 w-60 bg-surface rounded-2xl shadow-popover border border-neutral-200 p-3 z-20 text-neutral-900"
          >
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-xl">
              {(
                [
                  ['teacher', 'With answers'],
                  ['student', 'Questions only'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVariant(value)}
                  className={cn(
                    'h-8 rounded-lg text-xs font-semibold transition-colors',
                    variant === value
                      ? 'bg-surface text-neutral-900 shadow-card'
                      : 'text-neutral-600 hover:text-neutral-900',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-2 space-y-1">
              <a
                href={downloadUrl('pdf')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm hover:bg-neutral-100"
              >
                Download PDF
              </a>
              <a
                href={downloadUrl('docx')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm hover:bg-neutral-100"
              >
                Download DOCX
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

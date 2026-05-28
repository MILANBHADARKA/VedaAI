/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { SECTIONS, sectionForPath } from '@/lib/nav'

export default function Topbar() {
  const router = useRouter()
  const pathname = usePathname()
  const section = sectionForPath(pathname)
  const meta = section ? SECTIONS[section] : null

  return (
    <header className="h-16 bg-surface rounded-2xl flex items-center px-5 print:hidden">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Back"
        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-600"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {meta && (
        <div className="ml-2 flex items-center gap-2 text-sm text-neutral-600">
          <img src={meta.icon} alt="" width={16} height={16} className="opacity-70" />
          <span>{meta.topbarLabel}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-neutral-100"
        >
          <img src="/icons/notification.svg" alt="" width={18} height={18} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-notification" />
        </button>

        <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-neutral-300">
          <img
            src="/icons/avatar.svg"
            alt=""
            width={28}
            height={28}
            className="rounded-full bg-neutral-100"
          />
          <span className="text-sm font-medium text-neutral-900">John Doe</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </header>
  )
}

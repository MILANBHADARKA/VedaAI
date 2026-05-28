/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { SECTIONS, sectionForPath } from '@/lib/nav'
import { useAuthStore } from '@/store/auth'

export default function Topbar() {
  const router = useRouter()
  const pathname = usePathname()
  const section = sectionForPath(pathname)
  const meta = section ? SECTIONS[section] : null
  const { user, logout } = useAuthStore()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  const displayName = user?.fullName || user?.username || 'Account'
  const avatar = user?.avatarUrl || '/icons/avatar.svg'

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

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-neutral-300 hover:bg-neutral-100"
          >
            <img
              src={avatar}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover bg-neutral-100"
            />
            <span className="text-sm font-medium text-neutral-900 max-w-[140px] truncate">
              {displayName}
            </span>
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

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-48 bg-surface rounded-2xl shadow-popover border border-neutral-200 p-1.5 z-20"
            >
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm text-neutral-900 hover:bg-neutral-100"
              >
                Profile &amp; Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  void logout()
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm text-danger hover:bg-neutral-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

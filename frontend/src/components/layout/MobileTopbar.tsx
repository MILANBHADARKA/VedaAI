/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { SECTIONS, sectionForPath } from '@/lib/nav'
import { useAuthStore } from '@/store/auth'

type Props = {
  onMenuOpen: () => void
}

export default function MobileTopbar({ onMenuOpen }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const section = sectionForPath(pathname)
  const meta = section ? SECTIONS[section] : null
  const avatar = useAuthStore((s) => s.user?.avatarUrl) || '/icons/avatar.svg'

  return (
    <div className="lg:hidden sticky top-0 z-10 bg-page">
      <div className="h-14 bg-surface rounded-2xl mx-3 mt-3 flex items-center px-3">
        <div className="flex items-center gap-2">
          <img src="/icons/logo.png" alt="" width={24} height={24} />
          <span className="text-base font-semibold text-neutral-900">VedaAI</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative h-9 w-9 rounded-full flex items-center justify-center"
          >
            <img src="/icons/notification.svg" alt="" width={18} height={18} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-notification" />
          </button>
          <img
            src={avatar}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover bg-neutral-100"
          />
          <button
            type="button"
            aria-label="Menu"
            onClick={onMenuOpen}
            className="h-9 w-9 rounded-full flex items-center justify-center text-neutral-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 pt-3 pb-2">
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.back()}
          className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-700"
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
          <h1 className="text-base font-semibold text-neutral-900">
            {meta.topbarLabel}
          </h1>
        )}
      </div>
    </div>
  )
}

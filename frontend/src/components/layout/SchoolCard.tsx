/* eslint-disable @next/next/no-img-element */
'use client'

import { useAuthStore } from '@/store/auth'

export default function SchoolCard() {
  const user = useAuthStore((s) => s.user)
  const name = user?.institution?.name || 'Your institution'
  const address = user?.institution?.address || 'Add your institution'
  const avatar = user?.avatarUrl || '/icons/avatar.svg'

  return (
    <div className="mx-4 mb-4 p-3 bg-surface border border-neutral-300 rounded-2xl flex items-center gap-3">
      <img
        src={avatar}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover bg-neutral-100"
      />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-neutral-900 truncate">
          {name}
        </div>
        <div className="text-xs text-neutral-600 truncate">{address}</div>
      </div>
    </div>
  )
}

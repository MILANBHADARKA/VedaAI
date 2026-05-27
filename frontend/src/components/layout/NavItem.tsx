/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

type Props = {
  href: string
  icon: string
  children: React.ReactNode
  badge?: string | number
  exact?: boolean
}

export default function NavItem({
  href,
  icon,
  children,
  badge,
  exact,
}: Props) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-nav-active text-neutral-900'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
      )}
    >
      <img src={icon} alt="" width={18} height={18} className="shrink-0" />
      <span className="flex-1 truncate">{children}</span>
      {badge !== undefined && (
        <span className="text-[10px] font-semibold bg-notification text-white rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </Link>
  )
}

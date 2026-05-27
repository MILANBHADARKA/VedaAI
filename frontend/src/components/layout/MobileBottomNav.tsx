/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'

const ITEMS = [
  { href: '/home', label: 'Home', icon: '/icons/home-mobile.svg' },
  { href: '/assignments', label: 'Assignments', icon: '/icons/assignments-mobile.svg' },
  { href: '/library', label: 'Library', icon: '/icons/library-mobile.svg' },
  { href: '/ai-toolkit', label: 'AI Toolkit', icon: '/icons/ai-toolkit.svg' },
] as const

export default function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 bg-banner-dark text-white rounded-2xl shadow-popover">
      <ul className="flex items-center justify-around h-16">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 transition-opacity',
                  active ? 'opacity-100' : 'opacity-60 hover:opacity-90',
                )}
              >
                <img
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="invert"
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

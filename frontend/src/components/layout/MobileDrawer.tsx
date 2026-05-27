'use client'

import { useEffect } from 'react'
import Sidebar from './Sidebar'

type Props = {
  open: boolean
  onClose: () => void
}

export default function MobileDrawer({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute top-0 left-0 h-full w-[280px] transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar />
      </div>
    </div>
  )
}

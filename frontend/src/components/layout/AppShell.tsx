'use client'

import { useState } from 'react'
import MobileBottomNav from './MobileBottomNav'
import MobileDrawer from './MobileDrawer'
import MobileTopbar from './MobileTopbar'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-screen bg-page">
      <div className="hidden lg:flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 p-4 gap-4">
          <Topbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>

      <div className="lg:hidden min-h-screen flex flex-col">
        <MobileTopbar onMenuOpen={() => setDrawerOpen(true)} />
        <main className="flex-1 px-4 pb-24">{children}</main>
        <MobileBottomNav />
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </div>
  )
}

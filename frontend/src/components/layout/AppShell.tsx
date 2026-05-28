'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FullScreenLoader from '@/components/auth/FullScreenLoader'
import { useAuthStore } from '@/store/auth'
import MobileBottomNav from './MobileBottomNav'
import MobileDrawer from './MobileDrawer'
import MobileTopbar from './MobileTopbar'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const AUTH_ONLY_ROUTES = ['/login', '/signup']
const ONBOARDING_ROUTE = '/onboarding'
const PUBLIC_PREFIXES = ['/share/']

const isPublicRoute = (pathname: string) =>
  PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))

type View = 'loader' | 'bare' | 'app'

function decideView(
  status: ReturnType<typeof useAuthStore.getState>['status'],
  onboardingComplete: boolean,
  pathname: string,
): View {
  if (isPublicRoute(pathname)) return 'bare'
  if (status === 'loading') return 'loader'

  if (AUTH_ONLY_ROUTES.includes(pathname)) {
    return status === 'authenticated' ? 'loader' : 'bare'
  }

  if (pathname === ONBOARDING_ROUTE) {
    if (status !== 'authenticated' || onboardingComplete) return 'loader'
    return 'bare'
  }

  if (status !== 'authenticated' || !onboardingComplete) return 'loader'
  return 'app'
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { status, user, fetchMe } = useAuthStore()

  useEffect(() => {
    if (status === 'loading') void fetchMe()
  }, [status, fetchMe])

  useEffect(() => {
    if (status === 'loading' || isPublicRoute(pathname)) return
    const onAuthRoute = AUTH_ONLY_ROUTES.includes(pathname)
    const onOnboarding = pathname === ONBOARDING_ROUTE

    if (status === 'unauthenticated') {
      if (!onAuthRoute) router.replace('/login')
      return
    }
    if (!user?.onboardingComplete) {
      if (!onOnboarding) router.replace(ONBOARDING_ROUTE)
      return
    }
    if (onAuthRoute || onOnboarding) router.replace('/assignments')
  }, [status, user, pathname, router])

  const view = decideView(status, Boolean(user?.onboardingComplete), pathname)

  if (view === 'loader') return <FullScreenLoader />
  if (view === 'bare') return <div className="min-h-screen bg-page">{children}</div>

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

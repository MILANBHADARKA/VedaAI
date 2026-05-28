import { create } from 'zustand'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type State = {
  user: User | null
  status: AuthStatus
}

type Actions = {
  fetchMe: () => Promise<void>
  setUser: (user: User) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<State & Actions>((set) => ({
  user: null,
  status: 'loading',
  fetchMe: async () => {
    try {
      const user = await api<User>('/auth/me')
      set({ user, status: 'authenticated' })
    } catch {
      set({ user: null, status: 'unauthenticated' })
    }
  },
  setUser: (user) => set({ user, status: 'authenticated' }),
  logout: async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    set({ user: null, status: 'unauthenticated' })
  },
}))

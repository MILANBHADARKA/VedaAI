'use client'

import { useState } from 'react'
import AuthCard from '@/components/auth/AuthCard'
import Field from '@/components/auth/Field'
import KindToggle from '@/components/auth/KindToggle'
import SubmitButton from '@/components/auth/SubmitButton'
import { api } from '@/lib/api'
import type { Institution, User } from '@/lib/types'
import { useAuthStore } from '@/store/auth'

export default function OnboardingPage() {
  const { user, setUser, logout } = useAuthStore()
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [kind, setKind] = useState<Institution['kind']>(
    user?.institution?.kind ?? 'school',
  )
  const [name, setName] = useState(user?.institution?.name ?? '')
  const [address, setAddress] = useState(user?.institution?.address ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const updated = await api<User>('/auth/onboarding', {
        method: 'PATCH',
        json: { fullName, institution: { kind, name, address } },
      })
      setUser(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save profile')
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Tell us about you"
      subtitle="This personalises your dashboard and question papers."
      footer={
        <button
          type="button"
          onClick={() => void logout()}
          className="font-semibold text-neutral-600 hover:underline"
        >
          Sign out
        </button>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Full name"
          value={fullName}
          onChange={setFullName}
          placeholder="Jane Doe"
          autoComplete="name"
          required
        />

        <KindToggle value={kind} onChange={setKind} />

        <Field
          label="Institution name"
          value={name}
          onChange={setName}
          placeholder="Delhi Public School"
          required
        />
        <Field
          label="Address"
          value={address}
          onChange={setAddress}
          placeholder="Sector-4, Bokaro Steel City"
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <SubmitButton loading={loading}>Continue</SubmitButton>
      </form>
    </AuthCard>
  )
}

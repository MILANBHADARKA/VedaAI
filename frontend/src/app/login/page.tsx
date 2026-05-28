'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthCard from '@/components/auth/AuthCard'
import Field from '@/components/auth/Field'
import SubmitButton from '@/components/auth/SubmitButton'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'
import { useAuthStore } from '@/store/auth'

export default function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await api<User>('/auth/login', {
        method: 'POST',
        json: { identifier, password },
      })
      setUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue creating assessments."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-brand hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Email or username"
          value={identifier}
          onChange={setIdentifier}
          placeholder="you@school.edu"
          autoComplete="username"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
    </AuthCard>
  )
}

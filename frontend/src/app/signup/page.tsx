'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthCard from '@/components/auth/AuthCard'
import Field from '@/components/auth/Field'
import SubmitButton from '@/components/auth/SubmitButton'
import { api } from '@/lib/api'
import type { User } from '@/lib/types'
import { useAuthStore } from '@/store/auth'

export default function SignupPage() {
  const setUser = useAuthStore((s) => s.setUser)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await api<User>('/auth/signup', {
        method: 'POST',
        json: { email, username, password },
      })
      setUser(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start generating question papers in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@school.edu"
          autoComplete="email"
          required
        />
        <Field
          label="Username"
          value={username}
          onChange={setUsername}
          placeholder="janedoe"
          autoComplete="username"
          required
          minLength={3}
          hint="3–30 characters: letters, numbers and underscore."
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthCard>
  )
}

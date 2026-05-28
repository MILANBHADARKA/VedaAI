/* eslint-disable @next/next/no-img-element */
'use client'

import { useRef, useState } from 'react'
import Field from '@/components/auth/Field'
import KindToggle from '@/components/auth/KindToggle'
import Spinner from '@/components/ui/Spinner'
import { api } from '@/lib/api'
import { isConfigured, MAX_FILE_BYTES, uploadToCloudinary } from '@/lib/cloudinary'
import type { Institution, User } from '@/lib/types'
import { useAuthStore } from '@/store/auth'

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-sm font-medium text-neutral-900 mb-2">
        {label}
      </span>
      <div className="w-full h-12 px-4 rounded-xl border border-neutral-200 bg-neutral-100 text-sm text-neutral-600 flex items-center truncate">
        {value}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { user, setUser } = useAuthStore()
  const fileRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [kind, setKind] = useState<Institution['kind']>(
    user?.institution?.kind ?? 'school',
  )
  const [name, setName] = useState(user?.institution?.name ?? '')
  const [address, setAddress] = useState(user?.institution?.address ?? '')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.avatarUrl ?? null,
  )

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Avatar must be an image')
      return
    }
    if (f.size > MAX_FILE_BYTES) {
      setError('Image is too large (max 10MB)')
      return
    }
    setError(null)
    setUploading(true)
    try {
      const uploaded = await uploadToCloudinary(f)
      setAvatarUrl(uploaded.url)
      setSaved(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    setSaving(true)
    try {
      const updated = await api<User>('/auth/profile', {
        method: 'PATCH',
        json: { fullName, institution: { kind, name, address }, avatarUrl },
      })
      setUser(updated)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes')
    } finally {
      setSaving(false)
    }
  }

  const avatar = avatarUrl || '/icons/avatar.svg'

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <header className="pt-2">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Profile &amp; Settings
        </h1>
        <p className="text-sm text-neutral-600 mt-0.5">
          Manage your account and institution details.
        </p>
      </header>

      <form
        onSubmit={onSave}
        className="mt-6 bg-surface rounded-3xl p-6 lg:p-8 shadow-card space-y-6"
      >
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt=""
            className="h-16 w-16 rounded-full object-cover bg-neutral-100"
          />
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || !isConfigured()}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-surface border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading && <Spinner className="h-4 w-4" />}
              {avatarUrl ? 'Change photo' : 'Upload photo'}
            </button>
            {!isConfigured() && (
              <p className="mt-1 text-xs text-neutral-500">
                Cloudinary not configured.
              </p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickAvatar}
              className="sr-only"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ReadOnly label="Email" value={user?.email ?? ''} />
          <ReadOnly label="Username" value={user?.username ?? ''} />
        </div>

        <Field label="Full name" value={fullName} onChange={setFullName} required />
        <KindToggle value={kind} onChange={setKind} />
        <Field label="Institution name" value={name} onChange={setName} required />
        <Field label="Address" value={address} onChange={setAddress} required />

        {error && <p className="text-sm text-danger">{error}</p>}
        {saved && <p className="text-sm text-success">Saved.</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#111111] hover:from-[#333] hover:to-[#1a1a1a] disabled:opacity-60 disabled:cursor-not-allowed shadow-button"
          >
            {saving && <Spinner className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

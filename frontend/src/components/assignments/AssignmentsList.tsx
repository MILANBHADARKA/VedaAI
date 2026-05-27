'use client'

import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import type { Assignment, ListResponse } from '@/lib/types'
import AssignmentCard from './AssignmentCard'
import AssignmentsToolbar, { type StatusFilter } from './AssignmentsToolbar'
import EmptyState from './EmptyState'
import FloatingCreateBar from './FloatingCreateBar'
import Spinner from '@/components/ui/Spinner'

export default function AssignmentsList() {
  const [items, setItems] = useState<Assignment[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  useEffect(() => {
    let cancelled = false
    api<ListResponse<Assignment>>('/assignments')
      .then((res) => {
        if (!cancelled) setItems(res.items)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleDelete = async (id: string) => {
    const prev = items
    setItems((curr) => (curr ? curr.filter((a) => a.id !== id) : curr))
    try {
      await api<void>(`/assignments/${id}`, { method: 'DELETE' })
    } catch (err) {
      setItems(prev)
      window.alert(
        err instanceof Error ? err.message : 'Failed to delete assignment',
      )
    }
  }

  const filtered = useMemo(() => {
    if (!items) return []
    const needle = search.trim().toLowerCase()
    return items.filter((a) => {
      if (status !== 'all' && a.status !== status) return false
      if (needle && !a.title.toLowerCase().includes(needle)) return false
      return true
    })
  }, [items, search, status])

  if (error) {
    return (
      <div className="bg-surface rounded-2xl p-8 text-center">
        <p className="text-neutral-900 font-medium">Could not load assignments</p>
        <p className="text-sm text-neutral-600 mt-1">{error}</p>
      </div>
    )
  }

  if (items === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-neutral-500">
        <Spinner />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-2xl">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <h1 className="text-xl font-semibold text-neutral-900">
            Assignments
          </h1>
        </div>
        <p className="text-sm text-neutral-600 mt-1">
          Manage and create assignments for your classes.
        </p>
        <AssignmentsToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface rounded-2xl p-8 text-center text-sm text-neutral-600">
          No assignments match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-20">
          {filtered.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <FloatingCreateBar />
    </div>
  )
}

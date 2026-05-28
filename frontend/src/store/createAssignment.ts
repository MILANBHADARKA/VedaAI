import { create } from 'zustand'
import type { AssignmentFile, QuestionType } from '@/lib/types'

export type FormRow = {
  id: string
  type: QuestionType
  count: number
  marks: number
}

type State = {
  dueDate: string
  file: AssignmentFile | null
  fileUploading: boolean
  rows: FormRow[]
  additionalInstructions: string
}

type Actions = {
  setDueDate: (value: string) => void
  setFile: (file: AssignmentFile | null) => void
  setFileUploading: (value: boolean) => void
  addRow: () => void
  removeRow: (id: string) => void
  updateRow: (id: string, patch: Partial<Omit<FormRow, 'id'>>) => void
  setAdditionalInstructions: (value: string) => void
  reset: () => void
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

const initial: State = {
  dueDate: '',
  file: null,
  fileUploading: false,
  rows: [
    { id: 'row-1', type: 'multiple_choice', count: 4, marks: 1 },
    { id: 'row-2', type: 'short_answer', count: 3, marks: 2 },
  ],
  additionalInstructions: '',
}

export const useCreateAssignmentStore = create<State & Actions>((set) => ({
  ...initial,
  setDueDate: (dueDate) => set({ dueDate }),
  setFile: (file) => set({ file }),
  setFileUploading: (fileUploading) => set({ fileUploading }),
  addRow: () =>
    set((s) => ({
      rows: [
        ...s.rows,
        { id: newId(), type: 'multiple_choice', count: 1, marks: 1 },
      ],
    })),
  removeRow: (id) =>
    set((s) => ({ rows: s.rows.filter((r) => r.id !== id) })),
  updateRow: (id, patch) =>
    set((s) => ({
      rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),
  setAdditionalInstructions: (additionalInstructions) =>
    set({ additionalInstructions }),
  reset: () => set({ ...initial }),
}))

/* eslint-disable @next/next/no-img-element */
'use client'

import { useRef, useState } from 'react'
import {
  ALLOWED_MIME,
  MAX_FILE_BYTES,
  isConfigured,
  uploadToCloudinary,
} from '@/lib/cloudinary'
import { useCreateAssignmentStore } from '@/store/createAssignment'
import Spinner from '@/components/ui/Spinner'

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileDropzone() {
  const file = useCreateAssignmentStore((s) => s.file)
  const fileUploading = useCreateAssignmentStore((s) => s.fileUploading)
  const setFile = useCreateAssignmentStore((s) => s.setFile)
  const setFileUploading = useCreateAssignmentStore((s) => s.setFileUploading)

  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(f: File) {
    if (f.size > MAX_FILE_BYTES) {
      setError('File must be 10 MB or smaller')
      return
    }
    if (!ALLOWED_MIME.test(f.type)) {
      setError('Only JPEG, PNG, PDF, or text files')
      return
    }
    setError(null)
    setFileUploading(true)
    try {
      const uploaded = await uploadToCloudinary(f)
      setFile(uploaded)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setFileUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) void handleFile(f)
  }

  if (file) {
    return (
      <div className="rounded-2xl border border-neutral-300 bg-neutral-100 p-4 flex items-center gap-3">
        <img src="/icons/upload.svg" alt="" width={24} height={24} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-neutral-900 truncate">
            {file.originalName}
          </div>
          <div className="text-xs text-neutral-600">
            {humanSize(file.sizeBytes)} · uploaded
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFile(null)}
          className="text-sm text-danger hover:underline"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-2xl border-[1.5px] border-dashed p-8 text-center transition-colors ${
          dragging
            ? 'border-brand bg-brand/5'
            : 'border-[#CFC9BE] bg-neutral-100'
        }`}
      >
        <img
          src="/icons/upload.svg"
          alt=""
          width={40}
          height={40}
          className="mx-auto mb-3 opacity-80"
        />
        <p className="text-sm text-neutral-700">
          Choose a file or drag &amp; drop it here
        </p>
        <p className="text-xs text-neutral-500 mt-1">JPEG, PNG, upto 10MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf,text/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void handleFile(f)
            e.target.value = ''
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={fileUploading}
          className="mt-4 inline-flex items-center gap-2 h-9 px-4 rounded-full bg-surface border border-neutral-300 text-sm font-medium text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
        >
          {fileUploading ? <Spinner className="h-4 w-4" /> : null}
          {fileUploading ? 'Uploading…' : 'Browse Files'}
        </button>
      </div>
      {!isConfigured() && (
        <p className="mt-2 text-xs text-neutral-500">
          Cloudinary is not configured — uploads will fail until you set the
          NEXT_PUBLIC_CLOUDINARY_* env vars.
        </p>
      )}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <p className="mt-3 text-center text-xs text-neutral-500">
        Upload images of your preferred document/image
      </p>
    </div>
  )
}

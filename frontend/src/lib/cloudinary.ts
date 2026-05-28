import type { AssignmentFile } from './types'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export const MAX_FILE_BYTES = 10 * 1024 * 1024
export const ALLOWED_MIME = /^(image\/(jpe?g|png)|application\/pdf|text\/)/

export function isConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET)
}

export async function uploadToCloudinary(file: File): Promise<AssignmentFile> {
  if (!isConfigured()) {
    throw new Error(
      'Cloudinary not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.',
    )
  }
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET as string)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: form },
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed: ${text.slice(0, 200)}`)
  }
  const data = (await res.json()) as {
    secure_url: string
    public_id: string
  }
  return {
    url: data.secure_url,
    publicId: data.public_id,
    mimeType: file.type,
    originalName: file.name,
    sizeBytes: file.size,
  }
}

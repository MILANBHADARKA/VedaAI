import { createWorker } from 'tesseract.js'
import { extractText, getDocumentProxy } from 'unpdf'

const MAX_CHARS = 6000

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not fetch file (${res.status})`)
  return Buffer.from(await res.arrayBuffer())
}

async function ocrImage(buffer: Buffer): Promise<string> {
  const worker = await createWorker('eng')
  try {
    const { data } = await worker.recognize(buffer)
    return data.text
  } finally {
    await worker.terminate()
  }
}

async function readPdf(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: true })
  return text
}

export async function extractFileText(file: {
  url: string
  mimeType: string
}): Promise<string | null> {
  let raw: string | null = null

  if (file.mimeType.startsWith('image/')) {
    raw = await ocrImage(await fetchBuffer(file.url))
  } else if (file.mimeType === 'application/pdf') {
    raw = await readPdf(await fetchBuffer(file.url))
  } else if (file.mimeType.startsWith('text/')) {
    raw = (await fetchBuffer(file.url)).toString('utf-8')
  }

  if (!raw) return null
  const cleaned = raw.replace(/\s+/g, ' ').trim()
  return cleaned.length > 0 ? cleaned.slice(0, MAX_CHARS) : null
}

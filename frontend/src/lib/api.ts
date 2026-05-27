const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000'

type Options = RequestInit & { json?: unknown }

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { json, headers, ...rest } = options
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  if (res.status === 204) return undefined as T
  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      (payload && typeof payload === 'object' && 'error' in payload
        ? String(payload.error)
        : null) ?? `Request failed: ${res.status}`
    throw new Error(message)
  }
  return payload as T
}

export const apiBase = API_URL

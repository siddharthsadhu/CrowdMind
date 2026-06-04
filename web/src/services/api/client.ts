const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8001'

type RequestOptions = {
  method?: string
  body?: unknown
  params?: Record<string, string | undefined>
  headers?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, params, headers: extraHeaders } = options

  let url = `${BASE_URL}${path}`
  if (params) {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value) search.append(key, value)
    }
    const qs = search.toString()
    if (qs) url += `?${qs}`
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }

  const token = localStorage.getItem('clerk-token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Request failed: ${res.status}`, res.status)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | undefined>) =>
    request<T>(path, { params }),
  post: <T>(path: string, body?: unknown, params?: Record<string, string | undefined>) =>
    request<T>(path, { method: 'POST', body, params }),
  patch: <T>(path: string, body?: unknown, params?: Record<string, string | undefined>) =>
    request<T>(path, { method: 'PATCH', body, params }),
  delete: <T>(path: string, params?: Record<string, string | undefined>) =>
    request<T>(path, { method: 'DELETE', params }),
}

/**
 * API Client - Typed fetch wrapper for backend communication
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: any,
  ) {
    const message = body?.error || body?.detail || body?.message || `API error ${status}`
    super(message)
    this.name = 'ApiError'
  }
}

async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, body)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const apiClient = {
  get: <T,>(path: string) => api<T>(path, { method: 'GET' }),

  post: <T,>(path: string, data: unknown) =>
    api<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T,>(path: string, data: unknown) =>
    api<T>(path, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: <T,>(path: string, data: unknown) =>
    api<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T,>(path: string) =>
    api<T>(path, { method: 'DELETE' }),
}

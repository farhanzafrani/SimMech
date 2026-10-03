/**
 * useThermalPost - debounced POST hook shared by the thermal-slice
 * playgrounds. Params are compared by JSON value so an inline object
 * literal does not retrigger the request on every render.
 */

import { useEffect, useState } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export function useThermalPost<T>(path: string, params: object) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiClient.post<T>(path, JSON.parse(key))
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          setError(err.status === 400 ? String(err.message) : err.status === 500 ? 'Server error. Please try again.' : err.message || 'An error occurred.')
        } else {
          setError('An unexpected error occurred')
        }
        setData(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 150)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [path, key])

  return { data, loading, error }
}

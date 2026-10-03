/**
 * useMatMfgSimulation - Generic debounced POST hook shared by the
 * Materials & Manufacturing topics (metal cutting, material selection,
 * phase diagrams, sheet-metal bending, tolerance stack-up).
 *
 * Params are compared by value (JSON) so a fresh object literal on every
 * render does not retrigger the request.
 */

import { useEffect, useState, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export function useMatMfgSimulation<T>(endpoint: string, params: object) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const paramsKey = JSON.stringify(params)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    let cancelled = false

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiClient.post<T>(endpoint, JSON.parse(paramsKey))
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          // Surface the backend's validation message (400) so students see why
          setError(err.status === 400 ? err.message : err.status === 500 ? 'Server error. Please try again.' : err.message || 'An error occurred.')
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
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [endpoint, paramsKey])

  return { data, loading, error }
}

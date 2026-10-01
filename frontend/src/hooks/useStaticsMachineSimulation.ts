/**
 * useStaticsMachineSimulation - Generic debounced POST hook shared by the
 * gear/belt and statics playgrounds. Params are keyed by their JSON so an
 * inline object literal at the call site does not retrigger the request on
 * every render.
 */

import { useEffect, useState } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export function useStaticsMachineSimulation<T>(endpoint: string | null, params: unknown) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const key = JSON.stringify(params)

  useEffect(() => {
    if (!endpoint) return
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiClient.post<T>(endpoint, JSON.parse(key))
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          setError(err.status === 400 ? (typeof err.body?.detail === 'string' ? err.body.detail : 'Invalid input. Check your parameters.') : err.message || 'An error occurred.')
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
  }, [endpoint, key])

  return { data, loading, error }
}

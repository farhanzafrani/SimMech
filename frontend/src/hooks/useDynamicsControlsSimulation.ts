/**
 * useDynamicsControlsSimulation - Generic debounced POST hook shared by the
 * dynamics/controls topics (rigid-body kinetics, vibration, step response,
 * PID, root locus, Bode). Same debounce + error mapping as the per-topic hooks.
 */

import { useEffect, useState } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export function useDynamicsControlsSimulation<TData, TParams extends object>(
  endpoint: string,
  params: TParams,
) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stable key so a new-but-equal params object does not retrigger the fetch
  const key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiClient.post<TData>(endpoint, JSON.parse(key))
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          setError(mapApiErrorToMessage(err))
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

function mapApiErrorToMessage(error: ApiError): string {
  switch (error.status) {
    case 400:
      // Engine validation messages are student-readable (e.g. undamped resonance)
      return typeof error.message === 'string' && error.message ? error.message : 'Invalid input. Check your parameters.'
    case 404:
      return 'Resource not found.'
    case 500:
      return 'Server error. Please try again.'
    default:
      return error.message || 'An error occurred.'
  }
}

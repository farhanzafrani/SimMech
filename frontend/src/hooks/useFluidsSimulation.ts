/**
 * useFluidsSimulation - Generic debounced POST hook shared by the Fluid
 * Mechanics topic playgrounds. Params are compared by value (JSON) so a
 * fresh object literal each render does not retrigger the request.
 */

import { useEffect, useState } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export function useFluidsSimulation<T>(endpoint: string, params: object) {
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
        const result = await apiClient.post<T>(endpoint, JSON.parse(key))
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          setError(err.status === 400 ? err.message || 'Invalid input. Check your parameters.' : mapApiErrorToMessage(err))
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
    case 404:
      return 'Resource not found.'
    case 500:
      return 'Server error. Please try again.'
    default:
      return error.message || 'An error occurred.'
  }
}

/**
 * useFirstLawThermodynamicsSimulation - Hook for closed-system first-law
 * energy balance (dU = Q - W), with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface DeltaUCurvePoint {
  heat_added: number
  delta_u: number
}

export interface FirstLawThermodynamicsData {
  mass: number
  specific_heat_cv: number
  initial_temp: number
  heat_added: number
  work_done_by_system: number
  delta_u: number
  delta_t: number
  final_temp: number
  curve: DeltaUCurvePoint[]
}

interface FirstLawThermodynamicsParams {
  mass: number
  specific_heat_cv: number
  initial_temp: number
  heat_added: number
  work_done_by_system: number
}

export function useFirstLawThermodynamicsSimulation(params: FirstLawThermodynamicsParams) {
  const [data, setData] = useState<FirstLawThermodynamicsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<FirstLawThermodynamicsData>('/api/first-law-thermodynamics/compute', params)
      setData(result)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(mapApiErrorToMessage(err))
      } else {
        setError('An unexpected error occurred')
      }
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchData()
    }, 150)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [params, fetchData])

  return { data, loading, error }
}

function mapApiErrorToMessage(error: ApiError): string {
  switch (error.status) {
    case 400:
      return 'Invalid input. Check your parameters.'
    case 404:
      return 'Resource not found.'
    case 500:
      return 'Server error. Please try again.'
    default:
      return error.message || 'An error occurred.'
  }
}

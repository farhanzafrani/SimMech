/**
 * useBucklingSimulation - Hook for column buckling simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface ModeShapePoint {
  x: number
  y: number
}

export interface BucklingData {
  length: number
  end_condition: string
  width: number
  height: number
  applied_load: number
  moment_of_inertia: number
  area: number
  radius_of_gyration: number
  slenderness_ratio: number
  critical_load: number
  safety_factor: number
  mode_shape: ModeShapePoint[]
}

interface BucklingParams {
  length: number
  end_condition: string
  youngs_modulus: number
  width: number
  height: number
  applied_load: number
}

export function useBucklingSimulation(params: BucklingParams) {
  const [data, setData] = useState<BucklingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<BucklingData>('/api/buckling/compute', params)
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

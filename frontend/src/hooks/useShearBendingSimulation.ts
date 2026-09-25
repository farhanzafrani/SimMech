/**
 * useShearBendingSimulation - Hook for shear-force/bending-moment diagram simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface DiagramPoint {
  x: number
  shear: number
  moment: number
}

export interface ShearBendingData {
  length: number
  load_type: 'point' | 'udl'
  magnitude: number
  position_frac: number
  reaction_a: number
  reaction_b: number
  v_max: number
  v_max_location: number
  m_max: number
  m_max_location: number
  distribution: DiagramPoint[]
}

interface ShearBendingParams {
  length: number
  load_type: 'point' | 'udl'
  magnitude: number
  position_frac: number
}

export function useShearBendingSimulation(params: ShearBendingParams) {
  const [data, setData] = useState<ShearBendingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<ShearBendingData>('/api/shear-bending/compute', params)
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

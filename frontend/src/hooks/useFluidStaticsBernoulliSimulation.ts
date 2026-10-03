/**
 * useFluidStaticsBernoulliSimulation - Hook for the Venturi-effect
 * continuity/Bernoulli analysis, with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface PressureCurvePoint {
  area_ratio: number
  pressure2: number
}

export interface FluidStaticsBernoulliData {
  density: number
  area1: number
  area2: number
  velocity1: number
  pressure1: number
  velocity2: number
  pressure2: number
  dynamic_pressure_change: number
  curve: PressureCurvePoint[]
}

interface FluidStaticsBernoulliParams {
  density: number
  area1: number
  area2: number
  velocity1: number
  pressure1: number
}

export function useFluidStaticsBernoulliSimulation(params: FluidStaticsBernoulliParams) {
  const [data, setData] = useState<FluidStaticsBernoulliData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<FluidStaticsBernoulliData>('/api/fluid-statics-bernoulli/compute', params)
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

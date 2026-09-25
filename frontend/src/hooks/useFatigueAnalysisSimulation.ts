/**
 * useFatigueAnalysisSimulation - Hook for fatigue analysis (S-N curves &
 * modified Goodman diagram) simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface GoodmanPoint {
  mean_stress: number
  alternating_stress: number
}

export type FatigueLifeRegime = 'infinite' | 'finite' | 'finite_unquantified' | 'static_failure' | 'unknown'

export interface FatigueAnalysisData {
  mean_stress: number
  alternating_stress: number
  ultimate_strength: number
  endurance_limit: number
  safety_factor: number
  is_safe: boolean
  life_regime: FatigueLifeRegime
  cycles_to_failure: number | null
  equivalent_reversed_stress: number | null
  intersection_point: GoodmanPoint
  goodman_line: GoodmanPoint[]
  load_line: GoodmanPoint[]
}

interface FatigueAnalysisParams {
  mean_stress: number
  alternating_stress: number
  ultimate_strength: number
  endurance_limit: number
  fatigue_strength_coefficient?: number
  fatigue_strength_exponent?: number
}

export function useFatigueAnalysisSimulation(params: FatigueAnalysisParams) {
  const [data, setData] = useState<FatigueAnalysisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<FatigueAnalysisData>('/api/fatigue-analysis/compute', params)
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

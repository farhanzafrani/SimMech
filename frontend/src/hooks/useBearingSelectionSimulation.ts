/**
 * useBearingSelectionSimulation - Hook for rolling-element bearing L10
 * life simulation, with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export type BearingType = 'ball' | 'roller'
export type BearingSelectionMode = 'life' | 'required_rating'

export interface LoadCurvePoint {
  load_ratio: number
  L10: number
}

export interface BearingSelectionData {
  mode: BearingSelectionMode
  bearing_type: BearingType
  life_exponent: number
  dynamic_load_rating: number
  applied_load: number
  shaft_speed: number
  load_ratio: number
  L10: number
  L10_hours: number
  L10_years_typical_duty: number
  required_dynamic_load_rating: number | null
  load_curve: LoadCurvePoint[]
}

interface BearingSelectionParams {
  mode: BearingSelectionMode
  bearing_type: BearingType
  applied_load: number
  shaft_speed: number
  dynamic_load_rating?: number
  target_life_hours?: number
}

export function useBearingSelectionSimulation(params: BearingSelectionParams) {
  const [data, setData] = useState<BearingSelectionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<BearingSelectionData>('/api/bearing-selection/compute', params)
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

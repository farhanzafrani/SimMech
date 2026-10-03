/**
 * useFailureTheoriesSimulation - Hook for von Mises / Tresca failure-theory
 * comparison simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface EnvelopePoint {
  sigma_1: number
  sigma_2: number
}

export interface FailureTheoriesData {
  sigma_x: number
  sigma_y: number
  tau_xy: number
  yield_stress: number
  sigma_1: number
  sigma_2: number
  sigma_3: number
  von_mises_stress: number
  tresca_stress: number
  max_shear_stress: number
  safety_factor_von_mises: number
  safety_factor_tresca: number
  governing_theory: 'von_mises' | 'tresca' | 'equal'
  design_point: EnvelopePoint
  von_mises_ellipse: EnvelopePoint[]
  tresca_hexagon: EnvelopePoint[]
}

interface FailureTheoriesParams {
  sigma_x: number
  sigma_y: number
  tau_xy: number
  yield_stress: number
}

export function useFailureTheoriesSimulation(params: FailureTheoriesParams) {
  const [data, setData] = useState<FailureTheoriesData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<FailureTheoriesData>('/api/failure-theories/compute', params)
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

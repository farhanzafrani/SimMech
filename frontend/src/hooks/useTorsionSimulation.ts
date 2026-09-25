/**
 * useTorsionSimulation - Hook for torsion-in-circular-shafts simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface TorsionDistributionPoint {
  radius_mm: number
  shear_stress: number
}

export interface TorsionData {
  torque: number
  diameter: number
  length: number
  max_shear_stress: number
  shear_modulus: number
  polar_moment: number
  angle_of_twist_deg: number
  angle_of_twist_rad: number
  shear_yield_stress: number
  safety_factor: number
  distribution: TorsionDistributionPoint[]
  properties: {
    youngs_modulus: number
    poisson_ratio: number
    yield_stress: number
  }
}

interface TorsionParams {
  torque: number
  diameter: number
  length: number
  youngs_modulus: number
  poisson_ratio: number
  yield_stress: number
}

export function useTorsionSimulation(params: TorsionParams) {
  const [data, setData] = useState<TorsionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<TorsionData>('/api/torsion/compute', params)
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

/**
 * useShaftDesignSimulation - Hook for combined bending-and-torsion shaft
 * sizing simulation (ASME DE-Goodman equation), with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface ShaftDesignDistributionPoint {
  diameter_mm: number
  safety_factor: number
}

export interface ShaftDesignData {
  alternating_moment: number
  mean_torque: number
  endurance_limit: number
  ultimate_strength: number
  stress_concentration_factor: number
  notch_sensitivity: number
  target_safety_factor: number
  fatigue_stress_concentration_factor: number
  required_diameter: number
  alternating_stress: number
  rounded_diameter: number
  rounded_safety_factor: number
  distribution: ShaftDesignDistributionPoint[]
}

interface ShaftDesignParams {
  alternating_moment: number
  mean_torque: number
  endurance_limit: number
  ultimate_strength: number
  stress_concentration_factor: number
  notch_sensitivity: number
  target_safety_factor: number
}

export function useShaftDesignSimulation(params: ShaftDesignParams) {
  const [data, setData] = useState<ShaftDesignData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<ShaftDesignData>('/api/shaft-design/compute', params)
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

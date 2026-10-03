/**
 * useSpringDesignSimulation - Hook for helical compression spring
 * design simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface SpringDesignData {
  wire_diameter: number
  coil_diameter: number
  active_coils: number
  applied_force: number
  spring_index: number
  wahl_factor: number
  spring_rate: number
  deflection: number
  max_shear_stress: number
  is_practical_range: boolean
  safety_factor: number | null
  properties: {
    shear_modulus: number
    allowable_shear_stress: number | null
  }
}

interface SpringDesignParams {
  wire_diameter: number
  coil_diameter: number
  active_coils: number
  shear_modulus: number
  applied_force: number
  allowable_shear_stress?: number
}

export function useSpringDesignSimulation(params: SpringDesignParams) {
  const [data, setData] = useState<SpringDesignData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<SpringDesignData>('/api/spring-design/compute', params)
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

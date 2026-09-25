/**
 * useBeamDeflectionSimulation - Hook for beam-deflection simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface DeflectionCurvePoint {
  x: number
  y_mm: number
}

export interface BeamDeflectionData {
  length: number
  load_kn: number
  position_pct: number
  height_mm: number
  width_mm: number
  reaction_a_kn: number
  reaction_b_kn: number
  max_moment_knm: number
  moment_of_inertia: number
  max_bending_stress: number
  deflection_under_load_mm: number
  max_deflection_mm: number
  max_deflection_location_m: number
  deflection_limit_mm: number
  safety_factor: number
  strength_ok: boolean
  stiffness_ok: boolean
  deflection_curve: DeflectionCurvePoint[]
  properties: {
    youngs_modulus: number
    yield_stress: number
  }
}

interface BeamDeflectionParams {
  length: number
  load_kn: number
  position_pct: number
  height_mm: number
  youngs_modulus: number
  yield_stress: number
}

export function useBeamDeflectionSimulation(params: BeamDeflectionParams) {
  const [data, setData] = useState<BeamDeflectionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<BeamDeflectionData>('/api/beam-deflection/compute', params)
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

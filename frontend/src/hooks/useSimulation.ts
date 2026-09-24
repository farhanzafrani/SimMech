/**
 * useSimulation - Hook for stress-strain simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface StressStrainData {
  applied_stress: number
  axial_strain: number
  lateral_strain: number
  volumetric_strain: number
  region: string
  properties: {
    youngs_modulus: number
    poisson_ratio: number
    yield_stress: number
  }
}

export interface CurvePoint {
  strain: number
  stress: number
}

export interface Deformation3D {
  original: {
    length: number
    width: number
    height: number
  }
  deformed: {
    length: number
    width: number
    height: number
    volume: number
  }
  vertices: number[][]
  strains: {
    axial: number
    lateral: number
    volumetric: number
  }
}

export interface SimulationResult {
  compute?: StressStrainData
  curve?: { curve: CurvePoint[] }
  deformation3d?: Deformation3D
}

interface SimulationParams {
  applied_stress: number
  youngs_modulus: number
  poisson_ratio: number
  yield_stress: number
  ultimate_stress: number
}

export function useSimulation(params: SimulationParams) {
  const [data, setData] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [compute, curve, deformation3d] = await Promise.all([
        apiClient.post<StressStrainData>('/api/stress-strain/compute', {
          applied_stress: params.applied_stress,
          youngs_modulus: params.youngs_modulus,
          poisson_ratio: params.poisson_ratio,
          yield_stress: params.yield_stress,
        }),
        apiClient.post<{ curve: CurvePoint[] }>('/api/stress-strain/curve', {
          youngs_modulus: params.youngs_modulus,
          yield_stress: params.yield_stress,
          ultimate_stress: params.ultimate_stress,
          max_strain: 0.05,
          num_points: 100,
        }),
        apiClient.post<Deformation3D>('/api/stress-strain/3d-deformation', {
          applied_stress: params.applied_stress,
          youngs_modulus: params.youngs_modulus,
          poisson_ratio: params.poisson_ratio,
        }),
      ])

      setData({ compute, curve, deformation3d })
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
    // Debounce API calls by 150ms
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

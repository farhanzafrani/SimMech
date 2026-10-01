/**
 * useParticleKinematicsSimulation - Hook for particle tangential/normal
 * acceleration decomposition, with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface AccelCurvePoint {
  speed: number
  normal_accel: number
}

export interface ParticleKinematicsData {
  speed: number
  tangential_accel: number
  radius_of_curvature: number
  normal_accel: number
  total_accel: number
  angle_from_tangent_deg: number
  curve: AccelCurvePoint[]
}

interface ParticleKinematicsParams {
  speed: number
  tangential_accel: number
  radius_of_curvature: number
}

export function useParticleKinematicsSimulation(params: ParticleKinematicsParams) {
  const [data, setData] = useState<ParticleKinematicsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<ParticleKinematicsData>('/api/particle-kinematics/compute', params)
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

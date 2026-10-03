/**
 * useRigidBodyPlanarKinematicsSimulation - Hook for rolling-wheel
 * instantaneous-center velocity analysis, with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface VelocityCurvePoint {
  angle_deg: number
  velocity: number
}

export interface RigidBodyPlanarKinematicsData {
  radius: number
  angular_velocity: number
  point_angle_deg: number
  center_velocity: number
  point_velocity: number
  curve: VelocityCurvePoint[]
}

interface RigidBodyPlanarKinematicsParams {
  radius: number
  angular_velocity: number
  point_angle_deg: number
}

export function useRigidBodyPlanarKinematicsSimulation(params: RigidBodyPlanarKinematicsParams) {
  const [data, setData] = useState<RigidBodyPlanarKinematicsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<RigidBodyPlanarKinematicsData>('/api/rigid-body-planar-kinematics/compute', params)
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

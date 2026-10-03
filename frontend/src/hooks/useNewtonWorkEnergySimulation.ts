/**
 * useNewtonWorkEnergySimulation - Hook for the braking-distance
 * (F=ma vs work-energy) simulation, with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface SpeedDistancePoint {
  distance: number
  speed: number
}

export interface NewtonWorkEnergyData {
  mass: number
  initial_speed: number
  friction_coefficient: number
  friction_force: number
  deceleration: number
  stopping_distance: number
  stopping_time: number
  initial_kinetic_energy: number
  work_done_by_friction: number
  curve: SpeedDistancePoint[]
}

interface NewtonWorkEnergyParams {
  mass: number
  initial_speed: number
  friction_coefficient: number
}

export function useNewtonWorkEnergySimulation(params: NewtonWorkEnergyParams) {
  const [data, setData] = useState<NewtonWorkEnergyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<NewtonWorkEnergyData>('/api/newton-work-energy/compute', params)
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

/**
 * useBoltedJointsSimulation - Hook for bolted joint preload simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface BoltedJointLoadPoint {
  p: number
  bolt_load: number
  member_load: number
}

export interface BoltedJointData {
  bolt_stiffness: number
  member_stiffness: number
  proof_load: number
  external_load: number
  joint_constant: number
  preload: number
  bolt_load: number
  member_load: number
  is_separated: boolean
  safety_factor_yield: number
  separation_load: number
  safety_factor_separation: number
  points: BoltedJointLoadPoint[]
}

interface BoltedJointParams {
  bolt_stiffness: number
  member_stiffness: number
  proof_load: number
  external_load: number
}

export function useBoltedJointsSimulation(params: BoltedJointParams) {
  const [data, setData] = useState<BoltedJointData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<BoltedJointData>('/api/bolted-joints/compute', params)
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

/**
 * useMohrsCircleSimulation - Hook for combined-loading / Mohr's circle simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface CirclePoint {
  sigma: number
  tau: number
}

export interface MohrsCircleData {
  sigma_x: number
  sigma_y: number
  tau_xy: number
  sigma_avg: number
  radius: number
  sigma_1: number
  sigma_2: number
  theta_p_deg: number
  max_shear: number
  circle_points: CirclePoint[]
  point_x: CirclePoint
  point_y: CirclePoint
}

interface MohrsCircleParams {
  sigma_x: number
  sigma_y: number
  tau_xy: number
}

export function useMohrsCircleSimulation(params: MohrsCircleParams) {
  const [data, setData] = useState<MohrsCircleData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<MohrsCircleData>('/api/mohrs-circle/compute', params)
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

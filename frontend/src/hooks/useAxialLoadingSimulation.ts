/**
 * useAxialLoadingSimulation - Hook for axial-loading simulation with debouncing
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface AxialLoadingData {
  force: number
  length: number
  area: number
  constrained: boolean
  mechanical_stress: number
  thermal_stress: number
  total_stress: number
  mechanical_elongation: number
  thermal_elongation: number
  total_elongation: number
  safety_factor: number
  properties: {
    youngs_modulus: number
    alpha: number
    yield_stress: number
  }
}

interface AxialLoadingParams {
  force: number
  length: number
  area: number
  youngs_modulus: number
  alpha: number
  delta_t: number
  yield_stress: number
  constrained: boolean
}

export function useAxialLoadingSimulation(params: AxialLoadingParams) {
  const [data, setData] = useState<AxialLoadingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<AxialLoadingData>('/api/axial-loading/compute', params)
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

export interface TwoRodAxialLoadingData {
  force: number
  length: number
  area_1: number
  area_2: number
  force_1: number
  force_2: number
  stress_1: number
  stress_2: number
  elongation: number
  safety_factor_1: number
  safety_factor_2: number
  properties: {
    youngs_modulus_1: number
    youngs_modulus_2: number
    yield_stress_1: number
    yield_stress_2: number
  }
}

interface TwoRodAxialLoadingParams {
  force: number
  length: number
  area_1: number
  area_2: number
  youngs_modulus_1: number
  youngs_modulus_2: number
  yield_stress_1: number
  yield_stress_2: number
}

export function useTwoRodAxialLoadingSimulation(params: TwoRodAxialLoadingParams) {
  const [data, setData] = useState<TwoRodAxialLoadingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<TwoRodAxialLoadingData>('/api/axial-loading/two-rod', params)
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

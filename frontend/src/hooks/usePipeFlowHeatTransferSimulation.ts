/**
 * usePipeFlowHeatTransferSimulation - Hook for pipe friction (Reynolds /
 * Darcy-Weisbach) and convective heat transfer, with debouncing.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../lib/api-client'

export interface HeadLossCurvePoint {
  velocity: number
  head_loss: number
}

export interface PipeFlowHeatTransferData {
  density: number
  kinematic_viscosity: number
  velocity: number
  diameter: number
  length: number
  convection_coefficient: number
  surface_temp: number
  fluid_temp: number
  reynolds: number
  flow_regime: string
  friction_factor: number
  head_loss: number
  pressure_drop: number
  heat_flux: number
  curve: HeadLossCurvePoint[]
}

interface PipeFlowHeatTransferParams {
  density: number
  kinematic_viscosity: number
  velocity: number
  diameter: number
  length: number
  convection_coefficient: number
  surface_temp: number
  fluid_temp: number
}

export function usePipeFlowHeatTransferSimulation(params: PipeFlowHeatTransferParams) {
  const [data, setData] = useState<PipeFlowHeatTransferData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiClient.post<PipeFlowHeatTransferData>('/api/pipe-flow-heat-transfer/compute', params)
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

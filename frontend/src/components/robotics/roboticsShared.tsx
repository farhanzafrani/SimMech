/**
 * Shared hook + small UI pieces for the Robotics Kinematics playgrounds.
 * Mirrors the per-topic simulation hooks (debounced POST on param change)
 * but keyed by endpoint so the five topics share one implementation.
 */

import { useEffect, useState, type ReactNode } from 'react'
import { apiClient, ApiError } from '../../lib/api-client'
import { theme } from '../../styles/theme'

export function useRoboticsCompute<T>(path: string, params: object) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Stable key so a fresh params object with equal values does not refetch
  const key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await apiClient.post<T>(path, JSON.parse(key))
        if (!cancelled) setData(result)
      } catch (err) {
        if (cancelled) return
        if (err instanceof ApiError) {
          setError(err.status === 400 ? `Invalid input: ${err.message}` : err.status === 500 ? 'Server error. Please try again.' : err.message)
        } else {
          setError('An unexpected error occurred')
        }
        setData(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 150)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [path, key])

  return { data, loading, error }
}

export const cardTitleStyle = {
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: theme.spacing[3],
} as const

export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: theme.spacing[4] }}>
      {title && <h3 style={cardTitleStyle}>{title}</h3>}
      {children}
    </div>
  )
}

export function SliderField({
  label, value, unit, min, max, step, onChange, digits = 1,
}: {
  label: string
  value: number
  unit: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  digits?: number
}) {
  return (
    <div>
      <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{value.toFixed(digits)} {unit}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider"
      />
    </div>
  )
}

export function ResultRow({ label, value, color, last }: { label: string; value: string; color?: string; last?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: theme.spacing[2],
        paddingBottom: theme.spacing[2],
        borderBottom: last ? 'none' : `1px solid ${theme.colors.border}`,
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, color, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export function Banner({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div
      style={{
        padding: theme.spacing[2],
        backgroundColor: color,
        borderRadius: '6px',
        color: 'white',
        fontWeight: 600,
        textAlign: 'center',
        fontSize: '13px',
      }}
    >
      {children}
    </div>
  )
}

export function Status({ loading, error, hasData }: { loading: boolean; error: string | null; hasData: boolean }) {
  return (
    <>
      {loading && !hasData && (
        <div style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[2] }}>
          <span className="spinner"></span>
          Computing...
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </>
  )
}

export function EquationBox({ lines }: { lines: string[] }) {
  return (
    <div style={{ background: theme.colors.lightBlue[50], border: `1px solid ${theme.colors.lightBlue[200]}`, borderRadius: '6px', padding: theme.spacing[3] }}>
      {lines.map((l) => (
        <p key={l} style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>{l}</p>
      ))}
    </div>
  )
}

export const svgFrameStyle = {
  border: `1px solid ${theme.colors.border}`,
  borderRadius: '6px',
  backgroundColor: theme.colors.bg.secondary,
} as const

/** Reusable 2R arm drawing in a metre-scaled viewBox; y is flipped so +y is up. */
export function Arm2RSvg({
  l1, l2, elbow, tip, scale, ox, oy, color, ghost,
}: {
  l1: number; l2: number
  elbow: [number, number]; tip: [number, number]
  scale: number; ox: number; oy: number
  color: string
  ghost?: { elbow: [number, number]; tip: [number, number] }
}) {
  void l1; void l2
  const P = (p: [number, number]) => [ox + p[0] * scale, oy - p[1] * scale] as const
  const [bx, by] = P([0, 0])
  const [ex, ey] = P(elbow)
  const [tx, ty] = P(tip)
  return (
    <>
      {ghost && (() => {
        const [gex, gey] = P(ghost.elbow)
        const [gtx, gty] = P(ghost.tip)
        return <polyline points={`${bx},${by} ${gex},${gey} ${gtx},${gty}`} fill="none" stroke={theme.colors.gray[400]} strokeWidth="5" strokeDasharray="6 5" strokeLinecap="round" strokeLinejoin="round" />
      })()}
      <polyline points={`${bx},${by} ${ex},${ey} ${tx},${ty}`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={bx} cy={by} r="7" fill={theme.colors.text.primary} />
      <circle cx={ex} cy={ey} r="6" fill="white" stroke={theme.colors.text.primary} strokeWidth="2.5" />
      <circle cx={tx} cy={ty} r="6" fill={theme.colors.accent[600]} />
    </>
  )
}

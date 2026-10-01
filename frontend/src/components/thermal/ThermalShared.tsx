/**
 * Small presentational helpers shared by the thermal-slice playgrounds:
 * slider rows, result rows, section cards, and a minimal SVG line chart.
 */

import type { ReactNode } from 'react'
import { theme } from '../../styles/theme'

const headingStyle = {
  fontFamily: theme.typography.fontFamily.heading,
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: theme.spacing[3],
} as const

export function Card({ title, children, last }: { title?: string; children: ReactNode; last?: boolean }) {
  return (
    <div className="card" style={{ marginBottom: last ? 0 : theme.spacing[4] }}>
      {title && <h3 style={headingStyle}>{title}</h3>}
      {children}
    </div>
  )
}

export function SliderRow(props: {
  label: string
  value: number
  unit?: string
  min: number
  max: number
  step: number
  digits?: number
  onChange: (v: number) => void
}) {
  const { label, value, unit, min, max, step, digits = 1, onChange } = props
  return (
    <div>
      <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>
          {value.toFixed(digits)} {unit}
        </span>
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

export function Controls({ children }: { children: ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
      {children}
    </div>
  )
}

export function ChoiceButtons<T extends string>(props: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
      {props.options.map((o) => (
        <button
          key={o.value}
          onClick={() => props.onChange(o.value)}
          className={props.value === o.value ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ flex: 1, minWidth: '90px' }}
        >
          {o.label}
        </button>
      ))}
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

export function Banner({ text, color }: { text: string; color: string }) {
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
      {text}
    </div>
  )
}

export function ResultsCard({ loading, error, hasData, children }: { loading: boolean; error: string | null; hasData: boolean; children: ReactNode }) {
  return (
    <Card title="Results">
      {loading && !hasData && (
        <div style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[2] }}>
          <span className="spinner"></span>
          Computing...
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      {hasData && (
        <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>{children}</div>
      )}
    </Card>
  )
}

export function EquationsCard({ lines }: { lines: string[] }) {
  return (
    <Card title="Key Equations" last>
      <div style={{ padding: theme.spacing[3], backgroundColor: theme.colors.bg.secondary, borderRadius: '6px' }}>
        {lines.map((l) => (
          <p key={l} style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
            {l}
          </p>
        ))}
      </div>
    </Card>
  )
}

export interface Series {
  label: string
  color: string
  dashed?: boolean
  points: { x: number; y: number | null }[]
}

export interface Marker {
  x: number
  y: number
  color: string
  label?: string
}

/** Minimal responsive SVG line chart with axes, ticks, legend and point markers. */
export function LineChart(props: {
  series: Series[]
  xLabel: string
  yLabel: string
  markers?: Marker[]
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  height?: number
}) {
  const W = 480
  const H = props.height ?? 300
  const m = { l: 56, r: 14, t: 14, b: 62 }
  const pts = props.series.flatMap((s) => s.points.filter((p) => p.y !== null) as { x: number; y: number }[])
  const allX = [...pts.map((p) => p.x), ...(props.markers ?? []).map((p) => p.x)]
  const allY = [...pts.map((p) => p.y), ...(props.markers ?? []).map((p) => p.y)]
  const xMin = props.xMin ?? Math.min(...allX, 0)
  const xMax = props.xMax ?? (Math.max(...allX, xMin + 1e-9))
  let yMin = props.yMin ?? Math.min(...allY)
  let yMax = props.yMax ?? Math.max(...allY)
  if (!(yMax > yMin)) {
    yMax = yMin + 1
  }
  const pad = (yMax - yMin) * 0.06
  if (props.yMin === undefined) yMin -= pad
  if (props.yMax === undefined) yMax += pad
  const sx = (x: number) => m.l + ((x - xMin) / (xMax - xMin || 1)) * (W - m.l - m.r)
  const sy = (y: number) => H - m.b - ((y - yMin) / (yMax - yMin || 1)) * (H - m.t - m.b)
  const ticks = (a: number, b: number) => Array.from({ length: 5 }, (_, i) => a + ((b - a) * i) / 4)
  const fmt = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2))

  const paths = props.series.map((s) => {
    let d = ''
    let pen = false
    for (const p of s.points) {
      if (p.y === null) {
        pen = false
        continue
      }
      d += `${pen ? 'L' : 'M'} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)} `
      pen = true
    }
    return d
  })

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
      {ticks(yMin, yMax).map((t) => (
        <g key={`y${t}`}>
          <line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} stroke={theme.colors.border} strokeWidth="1" />
          <text x={m.l - 6} y={sy(t) + 4} fontSize="10" textAnchor="end" fill={theme.colors.text.light}>{fmt(t)}</text>
        </g>
      ))}
      {ticks(xMin, xMax).map((t) => (
        <text key={`x${t}`} x={sx(t)} y={H - m.b + 14} fontSize="10" textAnchor="middle" fill={theme.colors.text.light}>{fmt(t)}</text>
      ))}
      <line x1={m.l} x2={m.l} y1={m.t} y2={H - m.b} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x={(m.l + W - m.r) / 2} y={H - m.b + 30} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>{props.xLabel}</text>
      <text x={14} y={(m.t + H - m.b) / 2} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary} transform={`rotate(-90 14 ${(m.t + H - m.b) / 2})`}>{props.yLabel}</text>
      {paths.map((d, i) => (
        <path key={props.series[i].label} d={d} fill="none" stroke={props.series[i].color} strokeWidth="2.5" strokeDasharray={props.series[i].dashed ? '6 4' : undefined} />
      ))}
      {(props.markers ?? []).map((mk, i) => (
        <g key={i}>
          <circle cx={sx(mk.x)} cy={sy(mk.y)} r="5" fill={mk.color} stroke="white" strokeWidth="1.5" />
          {mk.label && <text x={sx(mk.x) + 8} y={sy(mk.y) - 8} fontSize="11" fontWeight={700} fill={mk.color}>{mk.label}</text>}
        </g>
      ))}
      {props.series.map((s, i) => (
        <g key={`lg${s.label}`} transform={`translate(${m.l + 8 + i * 140}, ${H - 12})`}>
          <line x1="0" x2="18" y1="-4" y2="-4" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dashed ? '6 4' : undefined} />
          <text x="24" y="0" fontSize="11" fill={theme.colors.text.secondary}>{s.label}</text>
        </g>
      ))}
    </svg>
  )
}

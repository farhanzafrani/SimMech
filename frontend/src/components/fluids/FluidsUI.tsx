/**
 * Small presentational helpers shared by the Fluid Mechanics playgrounds:
 * a labelled slider, a results row, a card with heading, and a lightweight
 * multi-series SVG line chart.
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
  display: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <div>
      <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
        <span>{props.label}</span>
        <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{props.display}</span>
      </label>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(parseFloat(e.target.value))}
        className="slider"
        disabled={props.disabled}
      />
    </div>
  )
}

export function ResultRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: theme.spacing[2], paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, color, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export function Banner({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div style={{ padding: theme.spacing[2], backgroundColor: color, borderRadius: '6px', color: 'white', fontWeight: 600, textAlign: 'center', fontSize: '13px' }}>
      {children}
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
        <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
          {children}
        </div>
      )}
    </Card>
  )
}

export function EquationsCard({ lines }: { lines: string[] }) {
  return (
    <Card title="Key Equations" last>
      <div style={{ backgroundColor: theme.colors.bg.secondary, borderRadius: '6px', padding: theme.spacing[3] }}>
        {lines.map((l) => (
          <p key={l} style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>{l}</p>
        ))}
      </div>
    </Card>
  )
}

export interface Series {
  label: string
  color: string
  ys: number[]
  dashed?: boolean
}

/** Multi-series line chart with a shared x array, optional marker point and optional log-x axis. */
export function LineChart(props: {
  xs: number[]
  series: Series[]
  xLabel: string
  yLabel: string
  marker?: { x: number; y: number; label?: string }
  logX?: boolean
  yMin?: number
  height?: number
}) {
  const W = 420
  const H = props.height ?? 260
  const pad = { l: 52, r: 14, t: 14, b: 40 }
  const tx = (x: number) => (props.logX ? Math.log10(Math.max(x, 1e-12)) : x)
  const xv = props.xs.map(tx)
  const xmin = Math.min(...xv)
  const xmax = Math.max(...xv)
  const allY = props.series.flatMap((s) => s.ys)
  const ymin = props.yMin ?? Math.min(0, ...allY)
  const ymaxRaw = Math.max(...allY, props.marker?.y ?? -Infinity)
  const ymax = ymaxRaw > ymin ? ymaxRaw * 1.08 : ymin + 1
  const px = (x: number) => pad.l + ((tx(x) - xmin) / (xmax - xmin || 1)) * (W - pad.l - pad.r)
  const py = (y: number) => H - pad.b - ((y - ymin) / (ymax - ymin || 1)) * (H - pad.t - pad.b)
  const fmt = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? v.toFixed(1) : v.toFixed(2))

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ymin + f * (ymax - ymin))
  const xTicks = props.logX
    ? Array.from({ length: Math.floor(xmax) - Math.ceil(xmin) + 1 }, (_, i) => Math.ceil(xmin) + i)
    : [0, 0.25, 0.5, 0.75, 1].map((f) => xmin + f * (xmax - xmin))

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${props.yLabel} versus ${props.xLabel}`} style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={pad.l} x2={W - pad.r} y1={py(t)} y2={py(t)} stroke={theme.colors.border} strokeWidth="1" />
            <text x={pad.l - 6} y={py(t) + 4} fontSize="10" textAnchor="end" fill={theme.colors.text.light}>{fmt(t)}</text>
          </g>
        ))}
        {xTicks.map((t) => {
          const xpos = pad.l + ((t - xmin) / (xmax - xmin || 1)) * (W - pad.l - pad.r)
          return (
            <text key={`x${t}`} x={xpos} y={H - pad.b + 14} fontSize="10" textAnchor="middle" fill={theme.colors.text.light}>
              {props.logX ? `1e${t}` : fmt(t)}
            </text>
          )
        })}
        <text x={(pad.l + W - pad.r) / 2} y={H - 6} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>{props.xLabel}</text>
        <text x={12} y={(pad.t + H - pad.b) / 2} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary} transform={`rotate(-90 12 ${(pad.t + H - pad.b) / 2})`}>{props.yLabel}</text>
        {props.series.map((s) => (
          <polyline
            key={s.label}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeDasharray={s.dashed ? '5 4' : undefined}
            points={props.xs.map((x, i) => `${px(x)},${py(s.ys[i])}`).join(' ')}
          />
        ))}
        {props.marker && (
          <g>
            <circle cx={px(props.marker.x)} cy={py(props.marker.y)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="1.5" />
            {props.marker.label && (
              <text x={px(props.marker.x) + 8} y={py(props.marker.y) - 8} fontSize="11" fontWeight={700} fill={theme.colors.error}>{props.marker.label}</text>
            )}
          </g>
        )}
      </svg>
      <div style={{ display: 'flex', gap: theme.spacing[3], flexWrap: 'wrap', marginTop: theme.spacing[2], fontSize: '12px', color: theme.colors.text.secondary }}>
        {props.series.map((s) => (
          <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 16, height: 0, borderTop: `3px ${s.dashed ? 'dashed' : 'solid'} ${s.color}` }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

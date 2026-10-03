/**
 * Small shared building blocks for the dynamics & controls playgrounds:
 * titled card, labelled slider, result row, status pill, and a lightweight
 * SVG line plot (linear or log x-axis) with reference lines and markers.
 */

import type { ReactNode } from 'react'
import { theme } from '../styles/theme'

export function Panel({ title, children, marginBottom = true }: { title?: string; children: ReactNode; marginBottom?: boolean }) {
  return (
    <div className="card" style={{ marginBottom: marginBottom ? theme.spacing[4] : 0 }}>
      {title && (
        <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

interface SliderRowProps {
  label: ReactNode
  valueText: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}

export function SliderRow({ label, valueText, min, max, step, value, onChange, disabled }: SliderRowProps) {
  return (
    <div>
      <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{valueText}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider"
        disabled={disabled}
      />
    </div>
  )
}

export function ResultRow({ label, value, color, last }: { label: ReactNode; value: ReactNode; color?: string; last?: boolean }) {
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

export function StatusPill({ color, children }: { color: string; children: ReactNode }) {
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

export function EquationList({ lines }: { lines: string[] }) {
  return (
    <div style={{ background: theme.colors.lightBlue[50], border: `1px solid ${theme.colors.lightBlue[200]}`, borderRadius: theme.radius.md, padding: theme.spacing[3] }}>
      {lines.map((l) => (
        <p key={l} style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
          {l}
        </p>
      ))}
    </div>
  )
}

export function LoadingAndError({ loading, error, hasData }: { loading: boolean; error: string | null; hasData: boolean }) {
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

// ---------------------------------------------------------------- line plot

export interface PlotSeries {
  x: number[]
  y: number[]
  color: string
  dash?: string
  width?: number
  label?: string
}

export interface PlotRef {
  value: number
  label?: string
  color?: string
}

export interface PlotPoint {
  x: number
  y: number
  color: string
  label?: string
}

interface LinePlotProps {
  series: PlotSeries[]
  xLabel: string
  yLabel: string
  xLog?: boolean
  /** Clamp the y-axis (e.g. to hide an undamped resonance spike) */
  yMin?: number
  yMax?: number
  xMin?: number
  xMax?: number
  hLines?: PlotRef[]
  vLines?: PlotRef[]
  points?: PlotPoint[]
  height?: number
  ariaLabel: string
}

const W = 560
const PAD = { l: 52, r: 14, t: 14, b: 40 }

function niceStep(span: number, target: number) {
  const raw = span / target
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const f = raw / mag
  const nice = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10
  return nice * mag
}

function fmt(v: number) {
  const a = Math.abs(v)
  if (a !== 0 && (a >= 1000 || a < 0.01)) return v.toExponential(0)
  return parseFloat(v.toPrecision(3)).toString()
}

export function LinePlot({ series, xLabel, yLabel, xLog, yMin, yMax, xMin, xMax, hLines = [], vLines = [], points = [], height = 240, ariaLabel }: LinePlotProps) {
  const H = height
  const allX = series.flatMap((s) => s.x)
  const allY = series.flatMap((s) => s.y).filter((v) => Number.isFinite(v))
  if (allX.length === 0 || allY.length === 0) return null

  let x0 = xMin ?? Math.min(...allX)
  let x1 = xMax ?? Math.max(...allX)
  let y0 = yMin ?? Math.min(...allY, ...hLines.map((h) => h.value))
  let y1 = yMax ?? Math.max(...allY, ...hLines.map((h) => h.value))
  if (y1 - y0 < 1e-12) {
    y0 -= 1
    y1 += 1
  }
  if (yMin === undefined && yMax === undefined) {
    const pad = (y1 - y0) * 0.06
    y0 -= pad
    y1 += pad
  }
  if (x1 - x0 < 1e-12) x1 = x0 + 1

  const lx = (v: number) => (xLog ? Math.log10(v) : v)
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b
  const px = (v: number) => PAD.l + ((lx(v) - lx(x0)) / (lx(x1) - lx(x0))) * plotW
  const py = (v: number) => PAD.t + (1 - (Math.min(Math.max(v, y0), y1) - y0) / (y1 - y0)) * plotH

  // Ticks
  const yStep = niceStep(y1 - y0, 5)
  const yTicks: number[] = []
  for (let v = Math.ceil(y0 / yStep) * yStep; v <= y1 + 1e-9; v += yStep) yTicks.push(v)
  const xTicks: number[] = []
  if (xLog) {
    for (let e = Math.ceil(Math.log10(x0) - 1e-9); e <= Math.floor(Math.log10(x1) + 1e-9); e++) xTicks.push(Math.pow(10, e))
  } else {
    const xStep = niceStep(x1 - x0, 6)
    for (let v = Math.ceil(x0 / xStep) * xStep; v <= x1 + 1e-9; v += xStep) xTicks.push(v)
  }

  const path = (s: PlotSeries) =>
    s.x
      .map((xv, i) => `${i === 0 ? 'M' : 'L'} ${px(xv).toFixed(1)} ${py(s.y[i]).toFixed(1)}`)
      .join(' ')

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={PAD.l} y1={py(v)} x2={W - PAD.r} y2={py(v)} stroke={theme.colors.border} strokeWidth="1" />
          <text x={PAD.l - 6} y={py(v) + 3} fontSize="10" textAnchor="end" fill={theme.colors.text.light}>{fmt(v)}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={px(v)} y1={PAD.t} x2={px(v)} y2={H - PAD.b} stroke={theme.colors.border} strokeWidth="1" />
          <text x={px(v)} y={H - PAD.b + 14} fontSize="10" textAnchor="middle" fill={theme.colors.text.light}>{fmt(v)}</text>
        </g>
      ))}
      <rect x={PAD.l} y={PAD.t} width={plotW} height={plotH} fill="none" stroke={theme.colors.gray[400]} strokeWidth="1" />

      {hLines.map((h) => (
        <g key={`h${h.value}${h.label}`}>
          <line x1={PAD.l} y1={py(h.value)} x2={W - PAD.r} y2={py(h.value)} stroke={h.color ?? theme.colors.gray[500]} strokeWidth="1.2" strokeDasharray="5 4" />
          {h.label && <text x={W - PAD.r - 4} y={py(h.value) - 4} fontSize="10" textAnchor="end" fill={h.color ?? theme.colors.text.light}>{h.label}</text>}
        </g>
      ))}
      {vLines.map((v) => (
        <g key={`v${v.value}${v.label}`}>
          <line x1={px(v.value)} y1={PAD.t} x2={px(v.value)} y2={H - PAD.b} stroke={v.color ?? theme.colors.gray[500]} strokeWidth="1.2" strokeDasharray="5 4" />
          {v.label && <text x={px(v.value) + 4} y={PAD.t + 11} fontSize="10" fill={v.color ?? theme.colors.text.light}>{v.label}</text>}
        </g>
      ))}

      {series.map((s, i) => (
        <path key={i} d={path(s)} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.2} strokeDasharray={s.dash} strokeLinejoin="round" />
      ))}

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={px(p.x)} cy={py(p.y)} r="5" fill={p.color} stroke="white" strokeWidth="1.5" />
          {p.label && <text x={px(p.x) + 8} y={py(p.y) - 6} fontSize="10" fontWeight={700} fill={p.color}>{p.label}</text>}
        </g>
      ))}

      {/* Legend */}
      {series.filter((s) => s.label).map((s, i) => (
        <g key={`l${i}`} transform={`translate(${PAD.l + 8 + i * 120}, ${PAD.t + 10})`}>
          <line x1="0" y1="0" x2="16" y2="0" stroke={s.color} strokeWidth="2.5" strokeDasharray={s.dash} />
          <text x="20" y="3" fontSize="10" fill={theme.colors.text.secondary}>{s.label}</text>
        </g>
      ))}

      <text x={PAD.l + plotW / 2} y={H - 6} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>{xLabel}</text>
      <text transform={`translate(12, ${PAD.t + plotH / 2}) rotate(-90)`} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>{yLabel}</text>
    </svg>
  )
}

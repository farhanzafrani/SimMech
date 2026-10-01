/**
 * Small shared UI building blocks for the Materials & Manufacturing
 * playgrounds - same look as the other topic playgrounds (card, slider,
 * results rows) without repeating the inline styles in every file.
 */

import type { ReactNode } from 'react'
import { theme } from '../../styles/theme'

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
      {children}
    </h3>
  )
}

interface SliderRowProps {
  label: string
  value: number
  display: string
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  disabled?: boolean
}

export function SliderRow({ label, value, display, min, max, step, onChange, disabled }: SliderRowProps) {
  return (
    <div>
      <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{display}</span>
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

export function Loading() {
  return (
    <div style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[2] }}>
      <span className="spinner"></span>
      Computing...
    </div>
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

/** Wrapper for the standard two-column layout used by every playground. */
export function TwoColumn({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </div>
  )
}

export const svgFrame = {
  border: `1px solid ${theme.colors.border}`,
  borderRadius: '6px',
  backgroundColor: theme.colors.bg.secondary,
} as const

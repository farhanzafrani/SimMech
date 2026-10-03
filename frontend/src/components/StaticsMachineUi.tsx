/**
 * Small presentational helpers shared by the gear/belt and statics
 * playgrounds, mirroring the card / slider / result-row markup used by the
 * other topic playgrounds.
 */

import type { CSSProperties, ReactNode } from 'react'
import { theme } from '../styles/theme'

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
      {children}
    </h3>
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
  const style: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing[2],
    borderBottom: last ? undefined : `1px solid ${theme.colors.border}`,
  }
  return (
    <div style={style}>
      <span>{label}</span>
      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, color }}>{value}</span>
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

export function ResultsShell({ loading, error, hasData, children }: { loading: boolean; error: string | null; hasData: boolean; children: ReactNode }) {
  return (
    <div className="card" style={{ marginBottom: theme.spacing[4] }}>
      <CardTitle>Results</CardTitle>
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
    </div>
  )
}

export function EquationsCard({ lines }: { lines: string[] }) {
  return (
    <div className="card">
      <CardTitle>Key Equations</CardTitle>
      <div style={{ background: theme.colors.lightBlue[50], border: `1px solid ${theme.colors.lightBlue[200]}`, borderRadius: '6px', padding: theme.spacing[3] }}>
        {lines.map((l) => (
          <p key={l} style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>{l}</p>
        ))}
      </div>
    </div>
  )
}

export function ModeTabs<T extends string>({ modes, value, onChange }: { modes: { id: T; label: string }[]; value: T; onChange: (m: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[4], flexWrap: 'wrap' }}>
      {modes.map((m) => (
        <button key={m.id} onClick={() => onChange(m.id)} className={value === m.id ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>
          {m.label}
        </button>
      ))}
    </div>
  )
}

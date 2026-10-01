/**
 * Viscous Flow - Interactive Topic
 *
 * Students switch between Couette flow (between a moving and a fixed plate)
 * and Poiseuille flow (pressure-driven pipe flow), change the fluid, and see
 * the velocity profile, wall shear, and Reynolds-number regime update live.
 */

import { useState } from 'react'
import { useFluidsSimulation } from '../hooks/useFluidsSimulation'
import { theme } from '../styles/theme'
import { Banner, Card, EquationsCard, ResultRow, ResultsCard, SliderRow } from './fluids/FluidsUI'

const FLUIDS = {
  water: { label: 'Water 20°C', rho: 998, mu: 1.002e-3 },
  glycerin: { label: 'Glycerin 20°C', rho: 1260, mu: 1.41 },
  air: { label: 'Air 20°C', rho: 1.204, mu: 1.81e-5 },
}

interface ViscousData {
  mode: string
  profile: { y: number[]; u: number[] }
  tau_lower: number
  tau_upper: number
  flow_rate: number
  mean_velocity: number
  max_velocity: number
  reynolds: number
  regime: string
  laminar_valid: boolean
  friction_factor: number | null
  wall_shear: number | null
}

const sci = (v: number) => (Math.abs(v) >= 0.01 && Math.abs(v) < 10000 ? v.toPrecision(4) : v.toExponential(3))

export default function ViscousFlowAnalysis() {
  const [mode, setMode] = useState<'couette' | 'pipe'>('pipe')
  const [fluid, setFluid] = useState<keyof typeof FLUIDS>('water')

  const [gapMm, setGapMm] = useState(2)
  const [plateU, setPlateU] = useState(0.5)
  const [dpdx, setDpdx] = useState(0)

  const [diameterMm, setDiameterMm] = useState(10)
  const [length, setLength] = useState(2)
  const [dp, setDp] = useState(100)

  const f = FLUIDS[fluid]
  const params =
    mode === 'couette'
      ? { mode, viscosity: f.mu, density: f.rho, gap: gapMm / 1000, plate_velocity: plateU, pressure_gradient: dpdx }
      : { mode, viscosity: f.mu, density: f.rho, diameter: diameterMm / 1000, length, pressure_drop: dp }
  const { data, loading, error } = useFluidsSimulation<ViscousData>('/api/viscous-flow/compute', params)

  const regimeColor = !data ? theme.colors.gray[500] : data.regime === 'laminar' ? theme.colors.success : data.regime === 'transitional' ? theme.colors.warning : theme.colors.error

  // --- Profile drawing ---
  const W = 340
  const H = 280
  const top = 40
  const bottom = 240
  const left = 60
  const right = 310
  let profilePath = ''
  let zeroX = left
  if (data) {
    const us = data.profile.u
    const umin = Math.min(0, ...us)
    const umax = Math.max(0, ...us, 1e-12)
    const span = umax - umin || 1
    zeroX = left + ((0 - umin) / span) * (right - left)
    const ymax = data.profile.y[data.profile.y.length - 1] || 1
    const pts = data.profile.y.map((y, i) => {
      const px = left + ((us[i] - umin) / span) * (right - left)
      const py = bottom - (y / ymax) * (bottom - top)
      return `${px},${py}`
    })
    profilePath = `M ${zeroX},${bottom} L ${pts.join(' L ')} L ${zeroX},${top} Z`
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Flow Configuration">
            <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              <button onClick={() => setMode('couette')} className={mode === 'couette' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>Couette</button>
              <button onClick={() => setMode('pipe')} className={mode === 'pipe' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>Pipe (Poiseuille)</button>
            </div>
            <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[3], flexWrap: 'wrap' }}>
              {(Object.keys(FLUIDS) as Array<keyof typeof FLUIDS>).map((k) => (
                <button key={k} onClick={() => setFluid(k)} className={fluid === k ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>
                  {FLUIDS[k].label}
                </button>
              ))}
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono, marginBottom: theme.spacing[3] }}>
              ρ = {f.rho} kg/m³, μ = {f.mu.toExponential(2)} Pa·s
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              {mode === 'couette' ? (
                <>
                  <SliderRow label="Gap h" value={gapMm} display={`${gapMm.toFixed(1)} mm`} min={0.5} max={10} step={0.5} onChange={setGapMm} disabled={loading} />
                  <SliderRow label="Plate Speed U" value={plateU} display={`${plateU.toFixed(2)} m/s`} min={0} max={5} step={0.05} onChange={setPlateU} disabled={loading} />
                  <SliderRow label="Pressure Gradient dp/dx" value={dpdx} display={`${dpdx.toFixed(0)} Pa/m`} min={-2000} max={2000} step={50} onChange={setDpdx} disabled={loading} />
                </>
              ) : (
                <>
                  <SliderRow label="Pipe Diameter D" value={diameterMm} display={`${diameterMm.toFixed(0)} mm`} min={2} max={50} step={1} onChange={setDiameterMm} disabled={loading} />
                  <SliderRow label="Pipe Length L" value={length} display={`${length.toFixed(1)} m`} min={0.5} max={10} step={0.5} onChange={setLength} disabled={loading} />
                  <SliderRow label="Pressure Drop Δp" value={dp} display={`${dp.toFixed(0)} Pa`} min={0} max={2000} step={5} onChange={setDp} disabled={loading} />
                </>
              )}
            </div>
          </Card>

          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Reynolds number" value={data.reynolds.toFixed(0)} color={regimeColor} />
                <ResultRow label="Mean velocity" value={`${sci(data.mean_velocity)} m/s`} />
                <ResultRow label="Max velocity" value={`${sci(data.max_velocity)} m/s`} />
                {data.mode === 'pipe' ? (
                  <>
                    <ResultRow label="Flow rate Q" value={`${(data.flow_rate * 1000).toExponential(3)} L/s`} />
                    <ResultRow label="Wall shear τ_w" value={`${sci(data.tau_lower)} Pa`} />
                    <ResultRow label="Friction factor 64/Re" value={data.friction_factor === null ? '—' : data.friction_factor.toFixed(4)} />
                  </>
                ) : (
                  <>
                    <ResultRow label="Flow per unit width" value={`${(data.flow_rate * 1e6).toFixed(2)} mm²/s`} />
                    <ResultRow label="Shear at lower plate" value={`${sci(data.tau_lower)} Pa`} />
                    <ResultRow label="Shear at upper plate" value={`${sci(data.tau_upper)} Pa`} />
                  </>
                )}
                <Banner color={regimeColor}>
                  {data.regime.toUpperCase()}
                  {data.laminar_valid ? ' — laminar solution valid' : ' — laminar formulas no longer apply'}
                </Banner>
              </>
            )}
          </ResultsCard>

          <EquationsCard
            lines={[
              'Couette: u = U y/h − (dp/dx) y(h−y)/(2μ)',
              'τ = μ du/dy',
              'Pipe: Q = π D⁴ Δp / (128 μ L)',
              'u = 2V (1 − (r/R)²),  τ_w = Δp D / (4L)',
              'Re = ρ V D / μ',
            ]}
          />
        </div>

        <div>
          <Card title="Velocity Profile" last>
            <svg width="100%" height="300" viewBox={`0 0 ${W} ${H + 20}`} style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {/* Walls */}
              <line x1={left - 10} y1={bottom} x2={right + 10} y2={bottom} stroke={theme.colors.text.primary} strokeWidth="5" />
              <line x1={left - 10} y1={top} x2={right + 10} y2={top} stroke={theme.colors.text.primary} strokeWidth="5" />
              <text x={right + 6} y={bottom + 18} fontSize="11" textAnchor="end" fill={theme.colors.text.secondary}>
                {mode === 'couette' ? 'fixed plate' : 'pipe wall'}
              </text>
              <text x={right + 6} y={top - 10} fontSize="11" textAnchor="end" fill={theme.colors.text.secondary}>
                {mode === 'couette' ? `moving plate U = ${plateU.toFixed(2)} m/s` : 'pipe wall'}
              </text>
              {mode === 'couette' && plateU > 0 && (
                <path d={`M ${left} ${top - 22} L ${left + 40} ${top - 22} l -7 -5 m 7 5 l -7 5`} stroke={theme.colors.error} strokeWidth="2" fill="none" />
              )}
              {/* Profile */}
              {data && <path d={profilePath} fill={theme.colors.lightBlue[200]} fillOpacity="0.7" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />}
              {/* Velocity axis (u = 0) */}
              <line x1={zeroX} y1={top} x2={zeroX} y2={bottom} stroke={theme.colors.gray[500]} strokeWidth="1" strokeDasharray="4 4" />
              <text x={W / 2} y={H + 8} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>velocity u →</text>
            </svg>
          </Card>
        </div>
      </div>
    </div>
  )
}

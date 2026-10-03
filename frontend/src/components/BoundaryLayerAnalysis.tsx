/**
 * Boundary Layers - Interactive Topic
 *
 * Students change the free-stream speed, plate length and fluid and watch the
 * boundary layer grow along a flat plate, the Blasius profile, and the skin
 * friction drag update, including the switch to a turbulent layer past Re = 5e5.
 */

import { useState } from 'react'
import { useFluidsSimulation } from '../hooks/useFluidsSimulation'
import { theme } from '../styles/theme'
import { Banner, Card, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './fluids/FluidsUI'

const FLUIDS = {
  air: { label: 'Air 20°C', rho: 1.2, nu: 1.5e-5 },
  water: { label: 'Water 20°C', rho: 998, nu: 1.0e-6 },
}

interface BLData {
  reynolds_length: number
  transition_location: number | null
  regime: string
  delta: number
  displacement_thickness: number
  momentum_thickness: number
  skin_friction_local: number
  wall_shear: number
  drag_coefficient: number
  drag_force: number
  blasius_eta99: number
  thickness_curve: { x: number[]; delta: number[] }
  velocity_profile: { eta: number[]; u_over_U: number[] }
}

export default function BoundaryLayerAnalysis() {
  const [fluid, setFluid] = useState<keyof typeof FLUIDS>('air')
  const [velocity, setVelocity] = useState(5)
  const [length, setLength] = useState(1)
  const [width, setWidth] = useState(1)

  const f = FLUIDS[fluid]
  const { data, loading, error } = useFluidsSimulation<BLData>('/api/boundary-layer/compute', {
    free_stream_velocity: velocity,
    plate_length: length,
    kinematic_viscosity: f.nu,
    density: f.rho,
    plate_width: width,
  })

  const turbulent = !!data && data.transition_location !== null
  const regimeColor = turbulent ? theme.colors.warning : theme.colors.success

  // --- Plate visualization (thickness is vertically exaggerated to be visible) ---
  const left = 30
  const right = 310
  const plateY = 190
  let layerPath = ''
  let exaggeration = 1
  if (data) {
    const dmax = Math.max(...data.thickness_curve.delta, 1e-12)
    exaggeration = Math.min(120 / ((dmax / length) * (right - left)), 1e6)
    const pts = data.thickness_curve.x.map((x, i) => {
      const px = left + (x / length) * (right - left)
      const py = plateY - (data.thickness_curve.delta[i] / length) * (right - left) * exaggeration
      return `${px},${py}`
    })
    layerPath = `M ${left},${plateY} L ${pts.join(' L ')} L ${right},${plateY} Z`
  }
  const transX = turbulent && data?.transition_location ? left + (data.transition_location / length) * (right - left) : null

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card>
            <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              {(Object.keys(FLUIDS) as Array<keyof typeof FLUIDS>).map((k) => (
                <button key={k} onClick={() => setFluid(k)} className={fluid === k ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>
                  {FLUIDS[k].label}
                </button>
              ))}
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono, marginBottom: theme.spacing[3] }}>
              ρ = {f.rho} kg/m³, ν = {f.nu.toExponential(1)} m²/s
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Free-stream Speed U" value={velocity} display={`${velocity.toFixed(1)} m/s`} min={0.5} max={40} step={0.5} onChange={setVelocity} disabled={loading} />
              <SliderRow label="Plate Length L" value={length} display={`${length.toFixed(2)} m`} min={0.1} max={5} step={0.05} onChange={setLength} disabled={loading} />
              <SliderRow label="Plate Width b" value={width} display={`${width.toFixed(1)} m`} min={0.1} max={5} step={0.1} onChange={setWidth} disabled={loading} />
            </div>
          </Card>

          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Re_L = UL/ν" value={data.reynolds_length.toExponential(2)} color={regimeColor} />
                <ResultRow label="BL thickness δ (at trailing edge)" value={`${(data.delta * 1000).toFixed(2)} mm`} />
                <ResultRow label="Displacement thickness δ*" value={`${(data.displacement_thickness * 1000).toFixed(2)} mm`} />
                <ResultRow label="Momentum thickness θ" value={`${(data.momentum_thickness * 1000).toFixed(3)} mm`} />
                <ResultRow label="Local skin friction c_f" value={data.skin_friction_local.toExponential(3)} />
                <ResultRow label="Wall shear τ_w" value={`${data.wall_shear.toFixed(3)} Pa`} />
                <ResultRow label="Drag coefficient C_D" value={data.drag_coefficient.toExponential(3)} />
                <ResultRow label="Friction drag (one side)" value={`${data.drag_force.toFixed(3)} N`} />
                <Banner color={regimeColor}>
                  {turbulent
                    ? `Transition at x = ${data.transition_location!.toFixed(2)} m — turbulent downstream`
                    : 'Laminar boundary layer (Blasius)'}
                </Banner>
              </>
            )}
          </ResultsCard>

          <EquationsCard
            lines={[
              'δ ≈ 4.91 x / √Re_x  (laminar)',
              'c_f = 0.664 / √Re_x',
              'C_D = 1.328 / √Re_L',
              'δ ≈ 0.37 x / Re_x^(1/5)  (turbulent)',
              'C_D = 0.074/Re_L^(1/5) − 1742/Re_L  (mixed)',
            ]}
          />
        </div>

        <div>
          <Card title="Growing Boundary Layer">
            <svg width="100%" height="260" viewBox="0 0 340 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {[60, 90, 120, 150].map((y) => (
                <g key={y}>
                  <line x1="8" y1={y} x2="40" y2={y} stroke={theme.colors.gray[400]} strokeWidth="1.5" />
                  <path d={`M 40 ${y} l -6 -4 m 6 4 l -6 4`} stroke={theme.colors.gray[400]} strokeWidth="1.5" fill="none" />
                </g>
              ))}
              <text x="8" y="44" fontSize="11" fill={theme.colors.text.secondary}>U</text>
              {data && <path d={layerPath} fill={turbulent ? theme.colors.warning : theme.colors.lightBlue[300]} fillOpacity="0.55" stroke={theme.colors.lightBlue[600]} strokeWidth="1.5" />}
              {transX !== null && (
                <>
                  <line x1={transX} y1={plateY - 90} x2={transX} y2={plateY} stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x={transX + 4} y={plateY - 92} fontSize="10" fill={theme.colors.error}>transition</text>
                </>
              )}
              <line x1={left} y1={plateY + 2} x2={right} y2={plateY + 2} stroke={theme.colors.text.primary} strokeWidth="5" />
              <text x={(left + right) / 2} y={plateY + 24} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>flat plate, length L</text>
              <text x={(left + right) / 2} y={plateY + 42} fontSize="10" textAnchor="middle" fill={theme.colors.text.light}>thickness exaggerated ×{exaggeration.toFixed(0)}</text>
            </svg>
          </Card>

          <Card title="Blasius Velocity Profile" last>
            {data && (
              <LineChart
                xs={data.velocity_profile.eta}
                series={[{ label: 'u / U', color: theme.colors.lightBlue[600], ys: data.velocity_profile.u_over_U }]}
                xLabel="η = y √(U/νx)"
                yLabel="u / U"
                marker={{ x: data.blasius_eta99, y: 0.99, label: `δ₉₉ at η = ${data.blasius_eta99.toFixed(2)}` }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

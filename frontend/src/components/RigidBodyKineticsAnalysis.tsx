/**
 * Rigid-Body Planar Kinetics - Interactive Topic
 *
 * Students release a round body (cylinder, hoop, sphere) on an incline and
 * change the angle, friction, and mass distribution to see rolling vs.
 * slipping, the friction the contact must supply, and the resulting motion.
 */

import { useState } from 'react'
import { useDynamicsControlsSimulation } from '../hooks/useDynamicsControlsSimulation'
import { theme } from '../styles/theme'
import { Panel, SliderRow, ResultRow, StatusPill, EquationList, LoadingAndError, LinePlot } from './DynCtrlWidgets'

interface RigidBodyKineticsData {
  shape: string
  shape_name: string
  k_squared: number
  inertia: number
  normal_force: number
  acceleration: number
  angular_acceleration: number
  friction_force: number
  friction_required: number
  mu_required: number
  slips: boolean
  final_time: number
  final_speed: number
  final_angular_speed: number
  time_series: number[]
  position_series: number[]
  speed_series: number[]
  angular_speed_series: number[]
  slip_speed_series: number[]
}

const SHAPES = {
  solid_cylinder: 'Solid cylinder',
  hollow_cylinder: 'Hoop',
  solid_sphere: 'Solid sphere',
  spherical_shell: 'Spherical shell',
}

export default function RigidBodyKineticsAnalysis() {
  const [shape, setShape] = useState<keyof typeof SHAPES>('solid_cylinder')
  const [mass, setMass] = useState(10)
  const [radius, setRadius] = useState(0.2)
  const [angle, setAngle] = useState(30)
  const [mu, setMu] = useState(0.5)
  const [length, setLength] = useState(3)
  const [progress, setProgress] = useState(0.6) // fraction of the run shown

  const { data, loading, error } = useDynamicsControlsSimulation<RigidBodyKineticsData, object>('/api/rigid-body-kinetics/compute', {
    shape,
    mass,
    radius,
    incline_angle_deg: angle,
    friction_coefficient: mu,
    incline_length: length,
  })

  const slips = data?.slips ?? false
  const statusColor = slips ? theme.colors.warning : theme.colors.success

  // --- Incline scene geometry (screen y points down) ---
  const th = (angle * Math.PI) / 180
  const lPx = Math.min(430, angle > 5 ? 190 / Math.sin(th) : 430)
  const bottom = { x: 520, y: 240 }
  const top = { x: bottom.x - lPx * Math.cos(th), y: bottom.y - lPx * Math.sin(th) }
  const d = { x: Math.cos(th), y: Math.sin(th) } // down-slope direction
  const n = { x: Math.sin(th), y: -Math.cos(th) } // outward surface normal
  const bodyR = 24

  // Body travels from just below the top to just above the bottom
  const startU = bodyR + 4
  const endU = lPx - bodyR - 4
  const tNow = data ? progress * data.final_time : 0
  const sNow = data ? 0.5 * data.acceleration * tNow * tNow : 0
  const frac = data && length > 0 ? Math.min(sNow / length, 1) : 0
  const u = startU + frac * (endU - startU)
  const centre = { x: top.x + d.x * u + n.x * bodyR, y: top.y + d.y * u + n.y * bodyR }
  const spinDeg = data ? ((0.5 * data.angular_acceleration * tNow * tNow) * 180) / Math.PI : 0

  const vNow = data ? data.acceleration * tNow : 0
  const omegaNow = data ? data.angular_acceleration * tNow : 0

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <Panel title="Body Shape">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
              {(Object.keys(SHAPES) as Array<keyof typeof SHAPES>).map((s) => (
                <button key={s} onClick={() => setShape(s)} className={shape === s ? 'btn btn-primary' : 'btn btn-secondary'}>
                  {SHAPES[s]}
                </button>
              ))}
            </div>
            {data && (
              <div style={{ marginTop: theme.spacing[3], padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                I_G = {data.k_squared.toFixed(3)} m r² = {data.inertia.toFixed(3)} kg·m²
              </div>
            )}
          </Panel>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label="Mass m" valueText={`${mass.toFixed(1)} kg`} min={1} max={50} step={0.5} value={mass} onChange={setMass} disabled={loading} />
            <SliderRow label="Radius r" valueText={`${radius.toFixed(2)} m`} min={0.05} max={0.5} step={0.01} value={radius} onChange={setRadius} disabled={loading} />
            <SliderRow label="Incline angle θ" valueText={`${angle.toFixed(0)}°`} min={0} max={60} step={1} value={angle} onChange={setAngle} disabled={loading} />
            <SliderRow label="Friction coefficient μ" valueText={mu.toFixed(2)} min={0} max={1} step={0.01} value={mu} onChange={setMu} disabled={loading} />
            <SliderRow label="Distance along incline s" valueText={`${length.toFixed(1)} m`} min={0.5} max={10} step={0.1} value={length} onChange={setLength} disabled={loading} />
          </div>

          <Panel title="Results">
            <LoadingAndError loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Acceleration (a_G)" value={`${data.acceleration.toFixed(3)} m/s²`} />
                <ResultRow label="Angular accel. (α)" value={`${data.angular_acceleration.toFixed(2)} rad/s²`} />
                <ResultRow label="Friction force (f)" value={`${data.friction_force.toFixed(2)} N`} />
                <ResultRow label="Friction needed to roll" value={`${data.friction_required.toFixed(2)} N`} />
                <ResultRow label="μ needed to roll" value={data.mu_required.toFixed(3)} />
                <ResultRow label="Speed after s" value={`${data.final_speed.toFixed(2)} m/s`} />
                <ResultRow label="Time to travel s" value={`${data.final_time.toFixed(2)} s`} />
                <StatusPill color={statusColor}>
                  {slips ? `SLIPS: μ = ${mu.toFixed(2)} < ${data.mu_required.toFixed(3)} needed to roll` : 'ROLLS WITHOUT SLIPPING (a = α r)'}
                </StatusPill>
              </div>
            )}
          </Panel>

          <Panel title="Key Equations" marginBottom={false}>
            <EquationList lines={['ΣF = m a_G', 'ΣM_G = I_G α', 'Rolling: a_G = α r', 'a = g sinθ / (1 + k²)', 'μ ≥ tanθ · k² / (1 + k²)']} />
          </Panel>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <Panel title="Release on an Incline">
            <svg width="100%" viewBox="0 0 560 280" role="img" aria-label="Round body rolling down an incline" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <path d={`M ${top.x} ${top.y} L ${bottom.x} ${bottom.y} L ${top.x} ${bottom.y} Z`} fill={theme.colors.gray[200]} stroke={theme.colors.text.primary} strokeWidth="2" />
              <path d={`M ${bottom.x - 60} ${bottom.y} A 60 60 0 0 0 ${bottom.x - 60 * Math.cos(th)} ${bottom.y - 60 * Math.sin(th)}`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
              <text x={bottom.x - 80} y={bottom.y - 6} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>θ = {angle}°</text>

              <g transform={`translate(${centre.x}, ${centre.y})`}>
                <g transform={`rotate(${spinDeg})`}>
                  <circle r={bodyR} fill={slips ? theme.colors.warning : theme.colors.lightBlue[100]} fillOpacity="0.85" stroke={theme.colors.text.primary} strokeWidth="2" />
                  <line x1="0" y1="0" x2={bodyR} y2="0" stroke={theme.colors.text.primary} strokeWidth="2" />
                  <line x1="0" y1="0" x2="0" y2={-bodyR} stroke={theme.colors.text.primary} strokeWidth="2" />
                  <circle r="2.5" fill={theme.colors.text.primary} />
                </g>
              </g>

              {/* Friction arrow at the contact point (acts up the slope) */}
              {data && data.friction_force > 0 && (
                <g>
                  <line x1={centre.x - n.x * bodyR} y1={centre.y - n.y * bodyR} x2={centre.x - n.x * bodyR - d.x * 34} y2={centre.y - n.y * bodyR - d.y * 34} stroke={theme.colors.error} strokeWidth="3" />
                  <text x={centre.x - n.x * bodyR - d.x * 40 + n.x * 10} y={centre.y - n.y * bodyR - d.y * 40 + n.y * 10} fontSize="11" fontWeight={700} fill={theme.colors.error}>f</text>
                </g>
              )}
            </svg>
            <div style={{ marginTop: theme.spacing[3] }}>
              <SliderRow label="Scrub through the run" valueText={`t = ${tNow.toFixed(2)} s, v = ${vNow.toFixed(2)} m/s, ω = ${omegaNow.toFixed(1)} rad/s`} min={0} max={1} step={0.01} value={progress} onChange={setProgress} />
            </div>
          </Panel>

          <Panel title="Contact-Point Check: v vs. ω r" marginBottom={false}>
            {data && data.time_series.length > 1 ? (
              <LinePlot
                ariaLabel="Centre speed and rim speed versus time"
                xLabel="time (s)"
                yLabel="speed (m/s)"
                series={[
                  { x: data.time_series, y: data.speed_series, color: theme.colors.lightBlue[600], label: 'v (centre)' },
                  { x: data.time_series, y: data.angular_speed_series.map((w) => w * radius), color: theme.colors.spectrum.coral, dash: '6 4', label: 'ω r (rim)' },
                ]}
                vLines={[{ value: tNow, color: theme.colors.accent[600] }]}
              />
            ) : (
              <div style={{ color: theme.colors.text.secondary }}>The body does not move at θ = 0°: no component of gravity along the surface.</div>
            )}
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              When the two curves coincide, the contact point has zero velocity — pure rolling. A gap means the surface is sliding under the body.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}

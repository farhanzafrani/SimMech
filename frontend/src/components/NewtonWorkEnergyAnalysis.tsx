/**
 * Newton's Second Law & Work-Energy Methods - Interactive Topic
 *
 * A braking mass is solved two ways: Newton's second law (find the
 * deceleration from F=ma, then use constant-acceleration kinematics for
 * the stopping distance) and the work-energy theorem (the work friction
 * does over that same distance must remove all the initial kinetic
 * energy). The two numbers always agree — that's the point.
 */

import { useState } from 'react'
import { useNewtonWorkEnergySimulation } from '../hooks/useNewtonWorkEnergySimulation'
import { theme, componentStyles } from '../styles/theme'

const PLOT_LEFT = 50
const PLOT_RIGHT = 380
const PLOT_TOP = 20
const PLOT_BOTTOM = 250

function formatNum(n: number | undefined, digits = 1): string {
  if (n === undefined || !isFinite(n)) return '—'
  return n.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export default function NewtonWorkEnergyAnalysis() {
  const [mass, setMass] = useState(1000) // kg
  const [initialSpeed, setInitialSpeed] = useState(25) // m/s
  const [frictionCoefficient, setFrictionCoefficient] = useState(0.7)

  const { data, loading, error } = useNewtonWorkEnergySimulation({
    mass,
    initial_speed: initialSpeed,
    friction_coefficient: frictionCoefficient,
  })

  const xMax = Math.max(data?.stopping_distance ?? 60, 1)
  const yMax = Math.max(initialSpeed, 1)

  function xToPx(d: number): number {
    const t = Math.min(Math.max(d / xMax, 0), 1)
    return PLOT_LEFT + t * (PLOT_RIGHT - PLOT_LEFT)
  }
  function yToPx(v: number): number {
    const t = Math.min(Math.max(v / yMax, 0), 1)
    return PLOT_BOTTOM - t * (PLOT_BOTTOM - PLOT_TOP)
  }

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * xMax * 10) / 10)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * yMax * 10) / 10)

  const agree = data ? Math.abs(data.initial_kinetic_energy - data.work_done_by_friction) < 0.01 * Math.max(data.initial_kinetic_energy, 1) : false

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              Braking Setup
            </h3>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Mass m</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{mass.toFixed(0)} kg</span>
              </label>
              <input type="range" min="200" max="3000" step="50" value={mass} onChange={(e) => setMass(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Initial speed v₁</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{initialSpeed.toFixed(1)} m/s</span>
              </label>
              <input type="range" min="2" max="40" step="0.5" value={initialSpeed} onChange={(e) => setInitialSpeed(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Friction coefficient μ</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{frictionCoefficient.toFixed(2)}</span>
              </label>
              <input type="range" min="0.1" max="1.0" step="0.05" value={frictionCoefficient} onChange={(e) => setFrictionCoefficient(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Results
            </h3>
            {loading && !data && (
              <div style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[2] }}>
                <span className="spinner"></span>
                Computing...
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: theme.colors.text.light, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: theme.spacing[1] }}>
                  Route 1 — F = ma
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Friction force</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{formatNum(data.friction_force, 0)} N</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Deceleration</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{formatNum(data.deceleration, 2)} m/s²</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Stopping time</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{formatNum(data.stopping_time, 2)} s</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Stopping distance</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{formatNum(data.stopping_distance, 1)} m</span>
                </div>

                <div style={{ fontSize: '12.5px', fontWeight: 700, color: theme.colors.text.light, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: theme.spacing[2] }}>
                  Route 2 — Work-Energy
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Initial kinetic energy</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{formatNum(data.initial_kinetic_energy, 0)} J</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Work done by friction</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{formatNum(data.work_done_by_friction, 0)} J</span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: agree ? theme.colors.success : theme.colors.warning,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  {agree
                    ? `Both routes agree: ${formatNum(data.stopping_distance, 1)} m to stop`
                    : 'Routes disagree — check inputs'}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>ΣF = m a  (friction: f = μ m g)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>d = v₁² / (2a)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>T₁ = ½ m v₁²,  U = f · d</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Speed vs. Distance Traveled
            </h3>
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: '#fafbfc' }}>
              {yTicks.map((v) => (
                <g key={v}>
                  <line x1={PLOT_LEFT} y1={yToPx(v)} x2={PLOT_RIGHT} y2={yToPx(v)} stroke={theme.colors.gray[200]} strokeWidth="1" />
                  <text x={PLOT_LEFT - 6} y={yToPx(v) + 3} textAnchor="end" fontSize="9" fill={theme.colors.text.light}>
                    {v}
                  </text>
                </g>
              ))}
              {xTicks.map((v) => (
                <g key={v}>
                  <line x1={xToPx(v)} y1={PLOT_TOP} x2={xToPx(v)} y2={PLOT_BOTTOM} stroke={theme.colors.gray[100]} strokeWidth="1" />
                  <text x={xToPx(v)} y={PLOT_BOTTOM + 14} textAnchor="middle" fontSize="9" fill={theme.colors.text.light}>
                    {v}
                  </text>
                </g>
              ))}

              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_TOP} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="290" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Distance traveled (m)
              </text>
              <text x="14" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 14 150)">
                Speed (m/s)
              </text>

              {data && (
                <polyline
                  points={data.curve.map((pt) => `${xToPx(pt.distance)},${yToPx(pt.speed)}`).join(' ')}
                  fill="none"
                  stroke={theme.colors.lightBlue[500]}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {data && (
                <circle cx={xToPx(data.stopping_distance)} cy={yToPx(0)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="2" />
              )}
            </svg>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              Speed falls off smoothly as the vehicle slides to a stop under constant deceleration. The red dot marks
              where it finally comes to rest — the same stopping distance you'd get from either F=ma or the
              work-energy theorem.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

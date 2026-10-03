/**
 * Rigid-Body Planar Kinematics: Instantaneous Center - Interactive Topic
 *
 * A wheel of radius r rolls without slipping at angular velocity omega.
 * Students pick a point on the rim (by its angle from the top) and see its
 * instantaneous velocity, found via the instantaneous-center method: the
 * ground contact point is momentarily at rest, and every other point's
 * speed is omega times its distance from that point.
 */

import { useState } from 'react'
import { useRigidBodyPlanarKinematicsSimulation } from '../hooks/useRigidBodyPlanarKinematicsSimulation'
import { theme, componentStyles } from '../styles/theme'

const PLOT_LEFT = 50
const PLOT_RIGHT = 380
const PLOT_TOP = 20
const PLOT_BOTTOM = 250

export default function RigidBodyPlanarKinematicsAnalysis() {
  const [radius, setRadius] = useState(0.35) // m
  const [angularVelocity, setAngularVelocity] = useState(8) // rad/s
  const [pointAngleDeg, setPointAngleDeg] = useState(0) // deg from top

  const { data, loading, error } = useRigidBodyPlanarKinematicsSimulation({
    radius,
    angular_velocity: angularVelocity,
    point_angle_deg: pointAngleDeg,
  })

  const curve = data?.curve ?? []
  const maxVelocity = data ? data.center_velocity * 2 : radius * angularVelocity * 2 || 1

  function xToPx(angleDeg: number): number {
    const t = Math.min(Math.max(angleDeg / 180, 0), 1)
    return PLOT_LEFT + t * (PLOT_RIGHT - PLOT_LEFT)
  }
  function yToPx(v: number): number {
    const t = Math.min(Math.max(v / maxVelocity, 0), 1)
    return PLOT_BOTTOM - t * (PLOT_BOTTOM - PLOT_TOP)
  }

  const xTicks = [0, 45, 90, 135, 180]
  const yTicks = Array.from({ length: 5 }, (_, i) => (maxVelocity * i) / 4)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              Wheel Parameters
            </h3>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Wheel radius r</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{radius.toFixed(2)} m</span>
              </label>
              <input type="range" min="0.1" max="1" step="0.01" value={radius} onChange={(e) => setRadius(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Angular velocity ω</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{angularVelocity.toFixed(1)} rad/s</span>
              </label>
              <input type="range" min="0" max="30" step="0.5" value={angularVelocity} onChange={(e) => setAngularVelocity(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Point angle from top (φ)</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{pointAngleDeg.toFixed(0)}°</span>
              </label>
              <input type="range" min="0" max="180" step="1" value={pointAngleDeg} onChange={(e) => setPointAngleDeg(parseFloat(e.target.value))} className="slider" disabled={loading} />
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
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Center velocity v_c</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.center_velocity.toFixed(3)} m/s</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Point velocity</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.point_velocity.toFixed(3)} m/s</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Ratio to center speed</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    {data.center_velocity > 0 ? (data.point_velocity / data.center_velocity).toFixed(3) : '—'}×
                  </span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: theme.colors.success,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  {pointAngleDeg === 0
                    ? 'Top of the wheel: moving at 2× the center speed'
                    : pointAngleDeg === 180
                    ? 'Ground contact point: this is the instantaneous center — momentarily at rest'
                    : `${(180 - pointAngleDeg).toFixed(0)}° from the contact point — speed scales with that distance`}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>v_c = ω r</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>d_IC = 2r cos(φ/2)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>v = ω × d_IC</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Point Velocity vs. Angle from Top
            </h3>
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: '#fafbfc' }}>
              {yTicks.map((v) => (
                <g key={v}>
                  <line x1={PLOT_LEFT} y1={yToPx(v)} x2={PLOT_RIGHT} y2={yToPx(v)} stroke={theme.colors.gray[200]} strokeWidth="1" />
                  <text x={PLOT_LEFT - 6} y={yToPx(v) + 3} textAnchor="end" fontSize="9" fill={theme.colors.text.light}>
                    {v.toFixed(1)}
                  </text>
                </g>
              ))}
              {xTicks.map((v) => (
                <g key={v}>
                  <line x1={xToPx(v)} y1={PLOT_TOP} x2={xToPx(v)} y2={PLOT_BOTTOM} stroke={theme.colors.gray[100]} strokeWidth="1" />
                  <text x={xToPx(v)} y={PLOT_BOTTOM + 14} textAnchor="middle" fontSize="9" fill={theme.colors.text.light}>
                    {v}°
                  </text>
                </g>
              ))}

              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_TOP} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="290" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Angle from top φ (deg)
              </text>
              <text x="14" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 14 150)">
                Speed (m/s)
              </text>

              <polyline
                points={curve.map((pt) => `${xToPx(pt.angle_deg)},${yToPx(pt.velocity)}`).join(' ')}
                fill="none"
                stroke={theme.colors.lightBlue[500]}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />

              {data && (
                <circle cx={xToPx(data.point_angle_deg)} cy={yToPx(data.point_velocity)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="2" />
              )}
            </svg>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              Speed falls off as a cosine of half the angle from the top, reaching a maximum of 2v_c directly overhead
              (φ = 0°) and zero at the ground contact point (φ = 180°) — the instantaneous center. The red dot marks
              the currently selected point.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

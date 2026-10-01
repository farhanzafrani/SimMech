/**
 * Kinematics of Particles: Tangential/Normal Acceleration - Interactive Topic
 *
 * Students set a particle's instantaneous speed, tangential acceleration
 * (rate of change of speed), and the path's radius of curvature. The
 * playground shows how the normal (centripetal) component a_n = v^2/rho
 * combines with the tangential component a_t to give the total
 * acceleration vector, and plots a_n against speed at the same radius to
 * show the quadratic growth.
 */

import { useState } from 'react'
import { useParticleKinematicsSimulation } from '../hooks/useParticleKinematicsSimulation'
import { theme, componentStyles } from '../styles/theme'

const PLOT_LEFT = 50
const PLOT_RIGHT = 380
const PLOT_TOP = 20
const PLOT_BOTTOM = 250

export default function ParticleKinematicsAnalysis() {
  const [speed, setSpeed] = useState(15) // m/s
  const [tangentialAccel, setTangentialAccel] = useState(2) // m/s^2
  const [radiusOfCurvature, setRadiusOfCurvature] = useState(50) // m

  const { data, loading, error } = useParticleKinematicsSimulation({
    speed,
    tangential_accel: tangentialAccel,
    radius_of_curvature: radiusOfCurvature,
  })

  const curve = data?.curve ?? []
  const maxSpeed = curve.length > 0 ? curve[curve.length - 1].speed : Math.max(speed * 2, 20)
  const maxNormalAccel = curve.length > 0 ? Math.max(...curve.map((p) => p.normal_accel), 1) : 1

  function xToPx(v: number): number {
    const t = Math.min(Math.max(v / maxSpeed, 0), 1)
    return PLOT_LEFT + t * (PLOT_RIGHT - PLOT_LEFT)
  }
  function yToPx(v: number): number {
    const t = Math.min(Math.max(v / maxNormalAccel, 0), 1)
    return PLOT_BOTTOM - t * (PLOT_BOTTOM - PLOT_TOP)
  }

  const xTicks = Array.from({ length: 5 }, (_, i) => (maxSpeed * i) / 4)
  const yTicks = Array.from({ length: 5 }, (_, i) => (maxNormalAccel * i) / 4)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              Motion Parameters
            </h3>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Speed v</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{speed.toFixed(1)} m/s</span>
              </label>
              <input type="range" min="0" max="60" step="0.5" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Tangential acceleration a_t</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{tangentialAccel.toFixed(1)} m/s²</span>
              </label>
              <input type="range" min="-10" max="10" step="0.5" value={tangentialAccel} onChange={(e) => setTangentialAccel(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Radius of curvature ρ</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{radiusOfCurvature.toFixed(0)} m</span>
              </label>
              <input type="range" min="5" max="200" step="1" value={radiusOfCurvature} onChange={(e) => setRadiusOfCurvature(parseFloat(e.target.value))} className="slider" disabled={loading} />
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
                  <span>Normal (centripetal) accel a_n</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.normal_accel.toFixed(3)} m/s²</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Total acceleration a</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.total_accel.toFixed(3)} m/s²</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Angle from tangent</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.angle_from_tangent_deg.toFixed(1)}°</span>
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
                  {tangentialAccel === 0
                    ? 'Pure circular motion: acceleration points straight at the center of curvature'
                    : tangentialAccel > 0
                    ? 'Speeding up while turning — acceleration leans toward the direction of travel'
                    : 'Slowing down while turning — acceleration leans backward, against travel'}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>a_n = v² / ρ</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>a = √(a_t² + a_n²)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>θ = atan2(a_n, a_t)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Normal Acceleration vs. Speed (at this ρ)
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
                    {v.toFixed(0)}
                  </text>
                </g>
              ))}

              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_TOP} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="290" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Speed v (m/s)
              </text>
              <text x="14" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 14 150)">
                a_n (m/s²)
              </text>

              <polyline
                points={curve.map((pt) => `${xToPx(pt.speed)},${yToPx(pt.normal_accel)}`).join(' ')}
                fill="none"
                stroke={theme.colors.lightBlue[500]}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />

              {data && (
                <circle cx={xToPx(data.speed)} cy={yToPx(data.normal_accel)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="2" />
              )}
            </svg>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              Because a_n = v²/ρ, the normal (centripetal) acceleration grows with the <em>square</em> of speed at a
              fixed radius of curvature — doubling speed quadruples a_n. The red dot marks the current operating
              point on the curve.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

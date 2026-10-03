/**
 * Fluid Statics & Bernoulli's Equation: Venturi Effect - Interactive Topic
 *
 * Students set the upstream pipe conditions (density, areas, velocity,
 * pressure) and see how the flow speeds up and pressure drops at a
 * constriction, via continuity (v2 = v1 A1/A2) and Bernoulli's equation
 * (p2 = p1 + 0.5 rho (v1^2 - v2^2)).
 */

import { useState } from 'react'
import { useFluidStaticsBernoulliSimulation } from '../hooks/useFluidStaticsBernoulliSimulation'
import { theme, componentStyles } from '../styles/theme'

const PLOT_LEFT = 50
const PLOT_RIGHT = 380
const PLOT_TOP = 20
const PLOT_BOTTOM = 250

export default function FluidStaticsBernoulliAnalysis() {
  const [density, setDensity] = useState(1000) // kg/m^3, water
  const [area1, setArea1] = useState(0.02) // m^2 (200 cm^2)
  const [area2, setArea2] = useState(0.005) // m^2 (50 cm^2)
  const [velocity1, setVelocity1] = useState(2) // m/s
  const [pressure1, setPressure1] = useState(300000) // Pa (300 kPa)

  const { data, loading, error } = useFluidStaticsBernoulliSimulation({
    density,
    area1,
    area2,
    velocity1,
    pressure1,
  })

  const curve = data?.curve ?? []
  const pressures = curve.map((p) => p.pressure2)
  const minP = pressures.length > 0 ? Math.min(...pressures, pressure1) : 0
  const maxP = pressures.length > 0 ? Math.max(...pressures, pressure1) : pressure1 || 1
  const pad = (maxP - minP) * 0.1 || 1

  function xToPx(ratio: number): number {
    const t = Math.min(Math.max(ratio, 0.1), 1)
    return PLOT_LEFT + ((t - 0.1) / 0.9) * (PLOT_RIGHT - PLOT_LEFT)
  }
  function yToPx(p: number): number {
    const t = (p - (minP - pad)) / (maxP - minP + 2 * pad)
    return PLOT_BOTTOM - Math.min(Math.max(t, 0), 1) * (PLOT_BOTTOM - PLOT_TOP)
  }

  const currentAreaRatio = area1 > 0 ? area2 / area1 : 0
  const xTicks = [0.1, 0.3, 0.5, 0.7, 0.9, 1.0]
  const yTicks = Array.from({ length: 5 }, (_, i) => minP - pad + ((maxP - minP + 2 * pad) * i) / 4)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              Flow Parameters
            </h3>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Fluid density ρ</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{density.toFixed(0)} kg/m³</span>
              </label>
              <input type="range" min="500" max="1500" step="10" value={density} onChange={(e) => setDensity(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Upstream area A1</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{(area1 * 10000).toFixed(0)} cm²</span>
              </label>
              <input type="range" min="0.005" max="0.05" step="0.001" value={area1} onChange={(e) => setArea1(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Constriction area A2</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{(area2 * 10000).toFixed(0)} cm²</span>
              </label>
              <input type="range" min="0.001" max={Math.max(area1 - 0.001, 0.002)} step="0.001" value={Math.min(area2, area1 - 0.001)} onChange={(e) => setArea2(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Upstream velocity v1</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{velocity1.toFixed(1)} m/s</span>
              </label>
              <input type="range" min="0.1" max="8" step="0.1" value={velocity1} onChange={(e) => setVelocity1(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Upstream pressure p1</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{(pressure1 / 1000).toFixed(0)} kPa</span>
              </label>
              <input type="range" min="100000" max="500000" step="1000" value={pressure1} onChange={(e) => setPressure1(parseFloat(e.target.value))} className="slider" disabled={loading} />
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
                  <span>Downstream velocity v2</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.velocity2.toFixed(2)} m/s</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Downstream pressure p2</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{(data.pressure2 / 1000).toFixed(1)} kPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Pressure change</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{(data.dynamic_pressure_change / 1000).toFixed(1)} kPa</span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: data.pressure2 < 0 ? theme.colors.error : theme.colors.success,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  {data.pressure2 < 0
                    ? 'Pressure has gone negative — cavitation risk at this constriction'
                    : `Flow speeds up ${(data.velocity2 / Math.max(data.velocity1, 0.001)).toFixed(1)}× while pressure drops`}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>v2 = v1 · A1 / A2</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>p1 + ½ρv1² = p2 + ½ρv2²</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>p2 = p1 + ½ρ(v1² − v2²)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Downstream Pressure vs. Area Ratio (A2/A1)
            </h3>
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: '#fafbfc' }}>
              {yTicks.map((v) => (
                <g key={v}>
                  <line x1={PLOT_LEFT} y1={yToPx(v)} x2={PLOT_RIGHT} y2={yToPx(v)} stroke={theme.colors.gray[200]} strokeWidth="1" />
                  <text x={PLOT_LEFT - 6} y={yToPx(v) + 3} textAnchor="end" fontSize="9" fill={theme.colors.text.light}>
                    {(v / 1000).toFixed(0)}
                  </text>
                </g>
              ))}
              {xTicks.map((v) => (
                <g key={v}>
                  <line x1={xToPx(v)} y1={PLOT_TOP} x2={xToPx(v)} y2={PLOT_BOTTOM} stroke={theme.colors.gray[100]} strokeWidth="1" />
                  <text x={xToPx(v)} y={PLOT_BOTTOM + 14} textAnchor="middle" fontSize="9" fill={theme.colors.text.light}>
                    {v.toFixed(1)}
                  </text>
                </g>
              ))}

              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_TOP} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="290" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Area ratio A2 / A1
              </text>
              <text x="14" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 14 150)">
                p2 (kPa)
              </text>

              <polyline
                points={curve.map((pt) => `${xToPx(pt.area_ratio)},${yToPx(pt.pressure2)}`).join(' ')}
                fill="none"
                stroke={theme.colors.lightBlue[500]}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />

              {data && (
                <circle cx={xToPx(currentAreaRatio)} cy={yToPx(data.pressure2)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="2" />
              )}
            </svg>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              As the constriction narrows (area ratio → 0), the flow speed grows without bound and pressure drops
              steeply — this is the same effect that lifts an airplane wing and draws fuel into a carburetor throat.
              The red dot marks the current operating point.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

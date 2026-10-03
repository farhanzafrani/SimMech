/**
 * Pipe Flow & Convective Heat Transfer - Interactive Topic
 *
 * Students set the fluid properties, pipe geometry, and wall/fluid
 * temperatures, and see the Reynolds number (laminar vs turbulent),
 * friction factor, Darcy-Weisbach head loss, and convective heat flux.
 */

import { useState } from 'react'
import { usePipeFlowHeatTransferSimulation } from '../hooks/usePipeFlowHeatTransferSimulation'
import { theme, componentStyles } from '../styles/theme'

const PLOT_LEFT = 50
const PLOT_RIGHT = 380
const PLOT_TOP = 20
const PLOT_BOTTOM = 250

export default function PipeFlowHeatTransferAnalysis() {
  const [density, setDensity] = useState(900) // kg/m^3, oil
  const [kinematicViscosity, setKinematicViscosity] = useState(0.0001) // m^2/s
  const [velocity, setVelocity] = useState(0.5) // m/s
  const [diameter, setDiameter] = useState(0.02) // m
  const [length, setLength] = useState(50) // m
  const [convectionCoefficient, setConvectionCoefficient] = useState(50) // W/(m^2 K)
  const [surfaceTemp, setSurfaceTemp] = useState(80) // deg C
  const [fluidTemp, setFluidTemp] = useState(20) // deg C

  const { data, loading, error } = usePipeFlowHeatTransferSimulation({
    density,
    kinematic_viscosity: kinematicViscosity,
    velocity,
    diameter,
    length,
    convection_coefficient: convectionCoefficient,
    surface_temp: surfaceTemp,
    fluid_temp: fluidTemp,
  })

  const curve = data?.curve ?? []
  const maxV = curve.length > 0 ? curve[curve.length - 1].velocity : velocity * 3
  const maxHeadLoss = curve.length > 0 ? Math.max(...curve.map((p) => p.head_loss), 1) : 1

  function xToPx(v: number): number {
    const t = Math.min(Math.max(v / maxV, 0), 1)
    return PLOT_LEFT + t * (PLOT_RIGHT - PLOT_LEFT)
  }
  function yToPx(v: number): number {
    const t = Math.min(Math.max(v / maxHeadLoss, 0), 1)
    return PLOT_BOTTOM - t * (PLOT_BOTTOM - PLOT_TOP)
  }

  const xTicks = Array.from({ length: 5 }, (_, i) => (maxV * i) / 4)
  const yTicks = Array.from({ length: 5 }, (_, i) => (maxHeadLoss * i) / 4)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              Fluid & Pipe Parameters
            </h3>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Density ρ</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{density.toFixed(0)} kg/m³</span>
              </label>
              <input type="range" min="700" max="1200" step="10" value={density} onChange={(e) => setDensity(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Kinematic viscosity ν</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{(kinematicViscosity * 1e6).toFixed(0)} mm²/s</span>
              </label>
              <input type="range" min="0.000001" max="0.001" step="0.000001" value={kinematicViscosity} onChange={(e) => setKinematicViscosity(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Flow velocity V</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{velocity.toFixed(2)} m/s</span>
              </label>
              <input type="range" min="0.05" max="5" step="0.05" value={velocity} onChange={(e) => setVelocity(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Pipe diameter D</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{(diameter * 1000).toFixed(0)} mm</span>
              </label>
              <input type="range" min="0.005" max="0.1" step="0.001" value={diameter} onChange={(e) => setDiameter(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Pipe length L</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{length.toFixed(0)} m</span>
              </label>
              <input type="range" min="1" max="200" step="1" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Convection coefficient h</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{convectionCoefficient.toFixed(0)} W/(m²·K)</span>
              </label>
              <input type="range" min="5" max="300" step="5" value={convectionCoefficient} onChange={(e) => setConvectionCoefficient(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Wall surface temp Ts</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{surfaceTemp.toFixed(0)} °C</span>
              </label>
              <input type="range" min="0" max="200" step="1" value={surfaceTemp} onChange={(e) => setSurfaceTemp(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Fluid temp T∞</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{fluidTemp.toFixed(0)} °C</span>
              </label>
              <input type="range" min="0" max="100" step="1" value={fluidTemp} onChange={(e) => setFluidTemp(parseFloat(e.target.value))} className="slider" disabled={loading} />
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
                  <span>Reynolds number Re</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.reynolds.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Flow regime</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, textTransform: 'capitalize' }}>{data.flow_regime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Friction factor f</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.friction_factor.toFixed(4)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Head loss</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.head_loss.toFixed(2)} m</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Pressure drop</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{(data.pressure_drop / 1000).toFixed(2)} kPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Heat flux q&apos;&apos;</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.heat_flux.toFixed(0)} W/m²</span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: data.flow_regime === 'laminar' ? theme.colors.lightBlue[500] : theme.colors.accent[500],
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  {data.flow_regime === 'laminar'
                    ? 'Laminar: friction factor falls smoothly as 64/Re'
                    : 'Turbulent: friction factor follows the Blasius correlation'}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>Re = VD / ν</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>f = 64/Re or 0.316 Re⁻⁰·²⁵</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>h_L = f (L/D)(V²/2g)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>q&apos;&apos; = h (Ts − T∞)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Head Loss vs. Velocity (at this geometry)
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
                    {v.toFixed(2)}
                  </text>
                </g>
              ))}

              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_TOP} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="290" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Velocity V (m/s)
              </text>
              <text x="14" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 14 150)">
                Head loss (m)
              </text>

              <polyline
                points={curve.map((pt) => `${xToPx(pt.velocity)},${yToPx(pt.head_loss)}`).join(' ')}
                fill="none"
                stroke={theme.colors.lightBlue[500]}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />

              {data && (
                <circle cx={xToPx(data.velocity)} cy={yToPx(data.head_loss)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="2" />
              )}
            </svg>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              Head loss grows quadratically with velocity once turbulent (roughly V^1.75 net after the friction factor
              itself falls with Re), and even faster relative to laminar flow, where it grows only linearly with V.
              The red dot marks the current operating point.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Torsion in Circular Shafts - Interactive Topic
 *
 * Students adjust torque, shaft diameter, and length to see the
 * resulting shear stress distribution and angle of twist update live.
 */

import { useState, useEffect } from 'react'
import { useTorsionSimulation } from '../hooks/useTorsionSimulation'
import { theme, componentStyles } from '../styles/theme'

const MATERIALS = {
  steel: { E: 210000, yield: 250, nu: 0.3 },
  aluminum: { E: 70000, yield: 270, nu: 0.33 },
  copper: { E: 130000, yield: 200, nu: 0.34 },
}

export default function TorsionAnalysis() {
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('steel')
  const [torque, setTorque] = useState(100)
  const [diameter, setDiameter] = useState(30)
  const [length, setLength] = useState(1.0)
  const [E, setE] = useState(MATERIALS.steel.E)
  const [yieldStress, setYieldStress] = useState(MATERIALS.steel.yield)
  const [nu, setNu] = useState(MATERIALS.steel.nu)
  const [customMode, setCustomMode] = useState(false)

  useEffect(() => {
    if (!customMode) {
      const mat = MATERIALS[material]
      setE(mat.E)
      setYieldStress(mat.yield)
      setNu(mat.nu)
    }
  }, [material, customMode])

  const { data, loading, error } = useTorsionSimulation({
    torque,
    diameter,
    length,
    youngs_modulus: E,
    poisson_ratio: nu,
    yield_stress: yieldStress,
  })

  const maxShearStress = data?.max_shear_stress ?? 0
  const angleDeg = data?.angle_of_twist_deg ?? 0
  const safetyFactor = data?.safety_factor ?? 0
  const distribution = data?.distribution ?? []
  const passes = safetyFactor >= 1.5

  const statusColor = passes ? theme.colors.success : theme.colors.error
  const radiusPx = 80

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Material Selection
            </h3>
            <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              {(Object.keys(MATERIALS) as Array<keyof typeof MATERIALS>).map((mat) => (
                <button
                  key={mat}
                  onClick={() => {
                    setMaterial(mat)
                    setCustomMode(false)
                  }}
                  className={material === mat && !customMode ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                >
                  {mat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCustomMode(!customMode)}
              className={customMode ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ width: '100%' }}
            >
              Custom
            </button>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Applied Torque T</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{torque.toFixed(0)} N·m</span>
              </label>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={torque}
                onChange={(e) => setTorque(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Shaft Diameter d</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{diameter.toFixed(0)} mm</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={diameter}
                onChange={(e) => setDiameter(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Shaft Length L</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{length.toFixed(2)} m</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.05"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Material Properties
            </h3>
            <div style={{ marginBottom: theme.spacing[2] }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Young's Modulus (E)</label>
              {customMode ? (
                <input type="number" value={E} onChange={(e) => setE(parseFloat(e.target.value))} className="input" />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  {E.toLocaleString()} MPa
                </div>
              )}
            </div>
            <div style={{ marginBottom: theme.spacing[2] }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Yield Stress (tension)</label>
              {customMode ? (
                <input type="number" value={yieldStress} onChange={(e) => setYieldStress(parseFloat(e.target.value))} className="input" />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  {yieldStress.toFixed(1)} MPa
                </div>
              )}
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Poisson's Ratio (ν)</label>
              {customMode ? (
                <input type="number" value={nu} step="0.01" min="0" max="0.5" onChange={(e) => setNu(parseFloat(e.target.value))} className="input" />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  {nu.toFixed(2)}
                </div>
              )}
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
                  <span>Shear modulus (G)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{(data.shear_modulus / 1000).toFixed(1)} GPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Max shear stress (τ_max)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{maxShearStress.toFixed(2)} MPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Angle of twist (θ)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    {angleDeg.toFixed(3)}° ({data.angle_of_twist_rad.toFixed(4)} rad)
                  </span>
                </div>
                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: statusColor,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  Safety factor {safetyFactor.toFixed(2)} — {passes ? 'PASSES' : 'FAILS'} (need ≥ 1.5)
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>J = π d⁴ / 32</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>τ(r) = T r / J</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>θ = T L / (G J)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>τ_yield = σ_yield / 2</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualizations */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Radial Shear Stress τ(r)
            </h3>
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <defs>
                <radialGradient id="torsionGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={theme.colors.bg.primary} />
                  <stop offset="100%" stopColor={statusColor} />
                </radialGradient>
              </defs>
              <circle cx="150" cy="150" r={radiusPx} fill="url(#torsionGradient)" stroke={theme.colors.text.primary} strokeWidth="2" />
              <circle cx="150" cy="150" r="2" fill={theme.colors.text.primary} />
              <text x="150" y="150" textAnchor="middle" dy="-6" fontSize="11" fill={theme.colors.text.secondary}>0</text>
              <line x1="150" y1="150" x2="150" y2={150 - radiusPx} stroke={theme.colors.text.primary} strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="230" y="150" fontSize="13" fontWeight={700} fill={statusColor}>
                τ_max = {maxShearStress.toFixed(1)} MPa
              </text>
              <text x="230" y="170" fontSize="12" fill={theme.colors.text.secondary}>at r = d/2</text>

              {/* Radial cross-section plot: stress vs radius */}
              {distribution.length > 1 && (
                <polyline
                  points={distribution
                    .map((pt, i) => {
                      const x = 30 + (i / (distribution.length - 1)) * 100
                      const y = 280 - (pt.shear_stress / (maxShearStress || 1)) * 60
                      return `${x},${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke={theme.colors.lightBlue[500]}
                  strokeWidth="2"
                />
              )}
              <text x="30" y="295" fontSize="10" fill={theme.colors.text.light}>r=0</text>
              <text x="120" y="295" fontSize="10" fill={theme.colors.text.light}>r=d/2</text>
            </svg>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Shaft Summary
            </h3>
            {data && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Polar moment (J)</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {(data.polar_moment * 1e8).toFixed(2)} cm⁴
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Shear yield (τ_yield)</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {data.shear_yield_stress.toFixed(1)} MPa
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

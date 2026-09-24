/**
 * Stress-Strain Analysis - Interactive Topic
 * MVP Component #1
 *
 * Students can adjust material properties and applied stress
 * to see real-time visualization of stress-strain behavior
 */

import { useState, useEffect } from 'react'
import { useSimulation } from '../hooks/useSimulation'
import { theme, componentStyles } from '../styles/theme'

const MATERIALS = {
  steel: { E: 210000, yield: 250, ultimate: 400, nu: 0.3 },
  aluminum: { E: 70000, yield: 270, ultimate: 310, nu: 0.33 },
  copper: { E: 130000, yield: 200, ultimate: 220, nu: 0.34 },
}

export default function StressStrainAnalysis() {
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('steel')
  const [appliedStress, setAppliedStress] = useState(150)
  const [E, setE] = useState(MATERIALS.steel.E)
  const [yieldStress, setYieldStress] = useState(MATERIALS.steel.yield)
  const [ultimateStress, setUltimateStress] = useState(MATERIALS.steel.ultimate)
  const [nu, setNu] = useState(MATERIALS.steel.nu)
  const [customMode, setCustomMode] = useState(false)

  // Switch material preset
  useEffect(() => {
    if (!customMode) {
      const mat = MATERIALS[material]
      setE(mat.E)
      setYieldStress(mat.yield)
      setUltimateStress(mat.ultimate)
      setNu(mat.nu)
    }
  }, [material, customMode])

  // Fetch simulation data from backend
  const { data, loading, error } = useSimulation({
    applied_stress: appliedStress,
    youngs_modulus: E,
    poisson_ratio: nu,
    yield_stress: yieldStress,
    ultimate_stress: ultimateStress,
  })

  const regionColor = {
    elastic: theme.colors.success,
    plastic: theme.colors.warning,
    fracture: theme.colors.error,
    none: theme.colors.gray[300],
  }

  const stressValue = data?.compute?.applied_stress ?? appliedStress
  const strainValue = data?.compute?.axial_strain ?? 0
  const lateralStrainValue = data?.compute?.lateral_strain ?? 0
  const volumetricStrainValue = data?.compute?.volumetric_strain ?? 0
  const region = data?.compute?.region ?? 'none'
  const curveData = data?.curve?.curve ?? []
  const deformation = data?.deformation3d

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: theme.spacing[6] }}>
        <h1 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '32px', fontWeight: 800, color: theme.colors.lightBlue[700], margin: 0, marginBottom: theme.spacing[2] }}>
          Stress-Strain Analysis
        </h1>
        <p style={{ color: theme.colors.text.secondary, margin: 0 }}>
          Explore how materials deform under stress and understand elastic vs. plastic behavior
        </p>
      </div>

      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          {/* Material Selection */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, color: theme.colors.lightBlue[500], marginBottom: theme.spacing[3] }}>
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

          {/* Applied Stress */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <div style={{ marginBottom: theme.spacing[3] }}>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Applied Stress</span>
                <span style={{ color: theme.colors.lightBlue[500], fontWeight: 700 }}>
                  {appliedStress.toFixed(1)} MPa
                </span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max={yieldStress * 2}
              step="5"
              value={appliedStress}
              onChange={(e) => setAppliedStress(parseFloat(e.target.value))}
              className="slider"
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1 }}
            />
          </div>

          {/* Material Properties */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, color: theme.colors.lightBlue[500], margin: 0, marginBottom: theme.spacing[3] }}>
              Material Properties
            </h3>

            <div style={{ marginBottom: theme.spacing[2] }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>
                Young's Modulus (E)
              </label>
              {customMode ? (
                <input
                  type="number"
                  value={E}
                  onChange={(e) => setE(parseFloat(e.target.value))}
                  className="input"
                />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  {E.toLocaleString()} MPa
                </div>
              )}
            </div>

            <div style={{ marginBottom: theme.spacing[2] }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>
                Yield Stress
              </label>
              {customMode ? (
                <input
                  type="number"
                  value={yieldStress}
                  onChange={(e) => setYieldStress(parseFloat(e.target.value))}
                  className="input"
                />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  {yieldStress.toFixed(1)} MPa
                </div>
              )}
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>
                Poisson's Ratio (ν)
              </label>
              {customMode ? (
                <input
                  type="number"
                  value={nu}
                  step="0.01"
                  min="0"
                  max="0.5"
                  onChange={(e) => setNu(parseFloat(e.target.value))}
                  className="input"
                />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  {nu.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, color: theme.colors.lightBlue[500], margin: 0, marginBottom: theme.spacing[3] }}>
              Results
            </h3>

            {loading && (
              <div style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[2] }}>
                <span className="spinner"></span>
                Computing...
              </div>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}

            {!loading && data && (
              <>
                <div style={{ display: 'grid', gap: theme.spacing[2] }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                    <span>Strain (ε)</span>
                    <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                      {(strainValue * 100).toFixed(4)}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                    <span>Lateral Strain</span>
                    <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                      {(lateralStrainValue * 100).toFixed(4)}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                    <span>Volumetric Strain</span>
                    <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                      {(volumetricStrainValue * 100).toFixed(4)}%
                    </span>
                  </div>

                  <div
                    style={{
                      padding: theme.spacing[3],
                      backgroundColor: regionColor[region as keyof typeof regionColor],
                      borderRadius: '6px',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      marginTop: theme.spacing[2],
                    }}
                  >
                    Region: {region.toUpperCase()}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Key Equations */}
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, color: theme.colors.lightBlue[500], margin: 0, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
                σ = F/A (Stress)
              </p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
                ε = ΔL/L₀ (Strain)
              </p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
                E = σ/ε (Young's Modulus)
              </p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
                ν = -ε_lateral/ε_axial (Poisson's Ratio)
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualizations */}
        <div>
          {/* Stress-Strain Curve */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, color: theme.colors.lightBlue[500], margin: 0, marginBottom: theme.spacing[3] }}>
              Stress-Strain Curve
            </h3>
            <svg
              width="100%"
              height="300"
              viewBox="0 0 400 300"
              style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: '#fafbfc' }}
            >
              {/* Axes */}
              <line x1="40" y1="260" x2="380" y2="260" stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1="40" y1="260" x2="40" y2="20" stroke={theme.colors.gray[400]} strokeWidth="2" />

              {/* Axis labels */}
              <text x="200" y="285" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Strain
              </text>
              <text x="15" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 15 150)">
                Stress (MPa)
              </text>

              {/* Curve */}
              {curveData.length > 1 && (
                <polyline
                  points={curveData
                    .map((pt) => {
                      const x = 40 + (pt.strain / 0.05) * 340
                      const y = 260 - (pt.stress / yieldStress) * 240
                      return `${x},${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke={theme.colors.lightBlue[500]}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Current point marker */}
              {data?.compute && (
                <circle
                  cx={40 + (strainValue / 0.05) * 340}
                  cy={260 - (stressValue / yieldStress) * 240}
                  r="4"
                  fill={regionColor[region as keyof typeof regionColor]}
                  stroke="white"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {/* 3D Deformation Cube */}
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, color: theme.colors.lightBlue[500], margin: 0, marginBottom: theme.spacing[3] }}>
              3D Cube Deformation
            </h3>
            {deformation && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Original</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {deformation.original.length.toFixed(2)} × {deformation.original.width.toFixed(2)} × {deformation.original.height.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Deformed</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {deformation.deformed.length.toFixed(2)} × {deformation.deformed.width.toFixed(2)} × {deformation.deformed.height.toFixed(2)}
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

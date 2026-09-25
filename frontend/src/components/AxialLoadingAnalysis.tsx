/**
 * Axial Loading - Interactive Topic
 *
 * Students adjust force, length, cross-section, and a temperature change
 * to see elongation (free bar) or thermal + mechanical stress (a bar fully
 * constrained at both ends, unable to expand) update live in "Single Bar"
 * mode, or switch to "Two-Rod (Indeterminate)" mode to see how a shared
 * load splits between two rods of different stiffness connected in
 * parallel between rigid plates (compatibility δ1 = δ2).
 */

import { useState, useEffect } from 'react'
import { useAxialLoadingSimulation, useTwoRodAxialLoadingSimulation } from '../hooks/useAxialLoadingSimulation'
import { theme, componentStyles } from '../styles/theme'

const MATERIALS = {
  steel: { E: 210000, yield: 250, alpha: 12e-6 },
  aluminum: { E: 70000, yield: 270, alpha: 23e-6 },
  copper: { E: 130000, yield: 200, alpha: 17e-6 },
}

type Mode = 'single' | 'two-rod'

export default function AxialLoadingAnalysis() {
  const [mode, setMode] = useState<Mode>('single')

  // Shared loading parameters (both modes)
  const [force, setForce] = useState(20000)
  const [length, setLength] = useState(1.0)

  // Single-bar mode state
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('steel')
  const [area, setArea] = useState(500)
  const [deltaT, setDeltaT] = useState(40)
  const [constrained, setConstrained] = useState(false)
  const [E, setE] = useState(MATERIALS.steel.E)
  const [yieldStress, setYieldStress] = useState(MATERIALS.steel.yield)
  const [alpha, setAlpha] = useState(MATERIALS.steel.alpha)
  const [customMode, setCustomMode] = useState(false)

  useEffect(() => {
    if (!customMode) {
      const mat = MATERIALS[material]
      setE(mat.E)
      setYieldStress(mat.yield)
      setAlpha(mat.alpha)
    }
  }, [material, customMode])

  const { data, loading, error } = useAxialLoadingSimulation({
    force,
    length,
    area,
    youngs_modulus: E,
    alpha,
    delta_t: deltaT,
    yield_stress: yieldStress,
    constrained,
  })

  const totalStress = data?.total_stress ?? 0
  const totalElongation = data?.total_elongation ?? 0
  const safetyFactor = data?.safety_factor ?? 0
  const passes = safetyFactor >= 1.5
  const statusColor = passes ? theme.colors.success : theme.colors.error

  // Exaggerated elongation for the free-bar diagram (real values are ~mm, far too small to see).
  const barLength = 340
  const exaggeratedStretch = Math.max(-40, Math.min(80, totalElongation * 4000))
  const stressFraction = Math.max(0, Math.min(1, totalStress / (yieldStress || 1)))

  // Two-rod (statically indeterminate) mode state
  const [material1, setMaterial1] = useState<keyof typeof MATERIALS>('steel')
  const [material2, setMaterial2] = useState<keyof typeof MATERIALS>('aluminum')
  const [area1, setArea1] = useState(300)
  const [area2, setArea2] = useState(300)

  const mat1 = MATERIALS[material1]
  const mat2 = MATERIALS[material2]

  const {
    data: twoRodData,
    loading: twoRodLoading,
    error: twoRodError,
  } = useTwoRodAxialLoadingSimulation({
    force,
    length,
    area_1: area1,
    area_2: area2,
    youngs_modulus_1: mat1.E,
    youngs_modulus_2: mat2.E,
    yield_stress_1: mat1.yield,
    yield_stress_2: mat2.yield,
  })

  const force1 = twoRodData?.force_1 ?? 0
  const force2 = twoRodData?.force_2 ?? 0
  const stress1 = twoRodData?.stress_1 ?? 0
  const stress2 = twoRodData?.stress_2 ?? 0
  const twoRodElongation = twoRodData?.elongation ?? 0
  const safetyFactor1 = twoRodData?.safety_factor_1 ?? 0
  const safetyFactor2 = twoRodData?.safety_factor_2 ?? 0
  const governingSafetyFactor = Math.min(safetyFactor1 || Infinity, safetyFactor2 || Infinity)
  const twoRodPasses = governingSafetyFactor >= 1.5
  const twoRodStatusColor = twoRodPasses ? theme.colors.success : theme.colors.error
  const forceShare1 = force > 0 ? force1 / force : 0.5
  const forceShare2 = force > 0 ? force2 / force : 0.5

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          {/* Analysis Mode */}
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Analysis Mode
            </h3>
            <div style={{ display: 'flex', gap: theme.spacing[2] }}>
              <button
                onClick={() => setMode('single')}
                className={mode === 'single' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ flex: 1 }}
              >
                Single Bar
              </button>
              <button
                onClick={() => setMode('two-rod')}
                className={mode === 'two-rod' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ flex: 1 }}
              >
                Two-Rod (Indeterminate)
              </button>
            </div>
          </div>

          {mode === 'single' ? (
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
          ) : (
            <div className="card" style={{ marginBottom: theme.spacing[4] }}>
              <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
                Rod Materials
              </h3>
              <div style={{ marginBottom: theme.spacing[3] }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Rod 1</label>
                <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                  {(Object.keys(MATERIALS) as Array<keyof typeof MATERIALS>).map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setMaterial1(mat)}
                      className={material1 === mat ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ flex: 1, textTransform: 'capitalize' }}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Rod 2</label>
                <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                  {(Object.keys(MATERIALS) as Array<keyof typeof MATERIALS>).map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setMaterial2(mat)}
                      className={material2 === mat ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ flex: 1, textTransform: 'capitalize' }}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>{mode === 'single' ? 'Force F' : 'Combined Force F'}</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{(force / 1000).toFixed(1)} kN</span>
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={force}
                onChange={(e) => setForce(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Length L</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{length.toFixed(2)} m</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.05"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>

            {mode === 'single' ? (
              <>
                <div>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Area A</span>
                    <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{area.toFixed(0)} mm²</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="10"
                    value={area}
                    onChange={(e) => setArea(parseFloat(e.target.value))}
                    className="slider"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Temperature change ΔT</span>
                    <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{deltaT.toFixed(0)} °C</span>
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="150"
                    step="5"
                    value={deltaT}
                    onChange={(e) => setDeltaT(parseFloat(e.target.value))}
                    className="slider"
                    disabled={loading}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], fontWeight: 600, cursor: 'pointer' }}>
                  <input type="checkbox" checked={constrained} onChange={(e) => setConstrained(e.target.checked)} />
                  Ends constrained (can't expand)
                </label>
              </>
            ) : (
              <>
                <div>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rod 1 Area A₁</span>
                    <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{area1.toFixed(0)} mm²</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="10"
                    value={area1}
                    onChange={(e) => setArea1(parseFloat(e.target.value))}
                    className="slider"
                    disabled={twoRodLoading}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rod 2 Area A₂</span>
                    <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{area2.toFixed(0)} mm²</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="10"
                    value={area2}
                    onChange={(e) => setArea2(parseFloat(e.target.value))}
                    className="slider"
                    disabled={twoRodLoading}
                  />
                </div>
              </>
            )}
          </div>

          {mode === 'single' && (
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
                <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Yield Stress</label>
                {customMode ? (
                  <input type="number" value={yieldStress} onChange={(e) => setYieldStress(parseFloat(e.target.value))} className="input" />
                ) : (
                  <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                    {yieldStress.toFixed(1)} MPa
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Thermal expansion (α)</label>
                {customMode ? (
                  <input type="number" value={alpha} step="1e-6" onChange={(e) => setAlpha(parseFloat(e.target.value))} className="input" />
                ) : (
                  <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                    {(alpha * 1e6).toFixed(1)} × 10⁻⁶ /°C
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'two-rod' && (
            <div className="card" style={{ marginBottom: theme.spacing[4] }}>
              <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
                Rod Stiffness (AE)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Rod 1: E₁, A₁E₁</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {mat1.E.toLocaleString()} MPa, {(area1 * mat1.E / 1000).toFixed(0)} kN
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Rod 2: E₂, A₂E₂</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {mat2.E.toLocaleString()} MPa, {(area2 * mat2.E / 1000).toFixed(0)} kN
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Results
            </h3>
            {mode === 'single' ? (
              <>
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
                      <span>Mechanical stress</span>
                      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.mechanical_stress.toFixed(2)} MPa</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                      <span>Thermal stress</span>
                      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.thermal_stress.toFixed(2)} MPa</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                      <span>{constrained ? 'Elongation (blocked)' : 'Total elongation'}</span>
                      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                        {(totalElongation * 1000).toFixed(3)} mm
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
              </>
            ) : (
              <>
                {twoRodLoading && !twoRodData && (
                  <div style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[2] }}>
                    <span className="spinner"></span>
                    Computing...
                  </div>
                )}
                {twoRodError && <div className="error-message">{twoRodError}</div>}
                {twoRodData && (
                  <div style={{ display: 'grid', gap: theme.spacing[2], opacity: twoRodLoading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                      <span>Force in Rod 1 (F₁)</span>
                      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                        {(force1 / 1000).toFixed(2)} kN ({(forceShare1 * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                      <span>Force in Rod 2 (F₂)</span>
                      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                        {(force2 / 1000).toFixed(2)} kN ({(forceShare2 * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                      <span>Stress: Rod 1 / Rod 2</span>
                      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                        {stress1.toFixed(2)} / {stress2.toFixed(2)} MPa
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                      <span>Common elongation (δ₁ = δ₂)</span>
                      <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                        {(twoRodElongation * 1000).toFixed(3)} mm
                      </span>
                    </div>
                    <div
                      style={{
                        padding: theme.spacing[3],
                        backgroundColor: twoRodStatusColor,
                        borderRadius: '6px',
                        color: 'white',
                        fontWeight: 600,
                        textAlign: 'center',
                        marginTop: theme.spacing[2],
                      }}
                    >
                      Safety factor {governingSafetyFactor.toFixed(2)} — {twoRodPasses ? 'PASSES' : 'FAILS'} (need ≥ 1.5)
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>δ = FL / (AE)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>δ_T = α ΔT L</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ_T = E α ΔT (constrained)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>δ₁ = δ₂ (indeterminate)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualizations */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              {mode === 'single' ? (constrained ? 'Blocked Expansion' : 'Bar Elongation') : 'Load Sharing Between Rods'}
            </h3>
            {mode === 'single' ? (
              <svg width="100%" height="220" viewBox="0 0 500 220" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
                {/* Left wall (always fixed) */}
                <line x1="60" y1="60" x2="60" y2="160" stroke={theme.colors.text.primary} strokeWidth="4" />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line key={i} x1={50} y1={70 + i * 18} x2={60} y2={80 + i * 18} stroke={theme.colors.text.light} strokeWidth="2" />
                ))}

                {constrained ? (
                  <>
                    {/* Right wall (also fixed) */}
                    <line x1="440" y1="60" x2="440" y2="160" stroke={theme.colors.text.primary} strokeWidth="4" />
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <line key={i} x1={440} y1={70 + i * 18} x2={450} y2={80 + i * 18} stroke={theme.colors.text.light} strokeWidth="2" />
                    ))}
                    <rect
                      x="60"
                      y="95"
                      width={barLength}
                      height="30"
                      fill={statusColor}
                      fillOpacity={0.15 + stressFraction * 0.5}
                      stroke={statusColor}
                      strokeWidth="2"
                    />
                    <text x="250" y="180" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
                      Length fixed — stress builds instead of strain
                    </text>
                  </>
                ) : (
                  <>
                    <rect
                      x="60"
                      y="95"
                      width={barLength + exaggeratedStretch}
                      height="30"
                      fill={theme.colors.lightBlue[100]}
                      stroke={theme.colors.lightBlue[600]}
                      strokeWidth="2"
                    />
                    {force > 0 && (
                      <>
                        <line
                          x1={60 + barLength + exaggeratedStretch + 60}
                          y1="110"
                          x2={60 + barLength + exaggeratedStretch + 10}
                          y2="110"
                          stroke={theme.colors.accent[500]}
                          strokeWidth="3"
                          markerEnd="url(#axialLiveArrow)"
                        />
                        <text x={60 + barLength + exaggeratedStretch + 65} y="100" fontSize="14" fontWeight={700} fill={theme.colors.accent[500]}>F</text>
                      </>
                    )}
                    <text x="250" y="180" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
                      Free to expand — elongation exaggerated ×4000 for visibility
                    </text>
                  </>
                )}

                <defs>
                  <marker id="axialLiveArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[500]} />
                  </marker>
                </defs>
              </svg>
            ) : (
              <svg width="100%" height="220" viewBox="0 0 500 220" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
                {/* Left rigid plate */}
                <line x1="60" y1="40" x2="60" y2="180" stroke={theme.colors.text.primary} strokeWidth="4" />
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`l${i}`} x1={50} y1={48 + i * 20} x2={60} y2={58 + i * 20} stroke={theme.colors.text.light} strokeWidth="2" />
                ))}
                {/* Right rigid plate */}
                <line x1="380" y1="40" x2="380" y2="180" stroke={theme.colors.text.primary} strokeWidth="4" />
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`r${i}`} x1={380} y1={48 + i * 20} x2={390} y2={58 + i * 20} stroke={theme.colors.text.light} strokeWidth="2" />
                ))}

                {/* Rod 1 */}
                <rect x="60" y="60" width="320" height="24" fill={theme.colors.lightBlue[100]} fillOpacity={0.3 + forceShare1 * 0.5} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
                <text x="220" y="76" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[700]}>
                  Rod 1: F₁ = {(force1 / 1000).toFixed(1)} kN
                </text>

                {/* Rod 2 */}
                <rect x="60" y="136" width="320" height="24" fill={theme.colors.accent.light} fillOpacity={0.25 + forceShare2 * 0.5} stroke={theme.colors.accent[600]} strokeWidth="2" />
                <text x="220" y="152" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>
                  Rod 2: F₂ = {(force2 / 1000).toFixed(1)} kN
                </text>

                {/* Combined external force arrow, splitting into both rods */}
                {force > 0 && (
                  <>
                    <line x1="470" y1="110" x2="392" y2="110" stroke={theme.colors.text.primary} strokeWidth="3" markerEnd="url(#twoRodArrow)" />
                    <text x="430" y="98" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>F</text>
                  </>
                )}

                <text x="220" y="195" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>
                  Both rods stretch equally (δ₁ = δ₂) — the stiffer rod carries more load
                </text>

                <defs>
                  <marker id="twoRodArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.text.primary} />
                  </marker>
                </defs>
              </svg>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              {mode === 'single' ? 'Bar Summary' : 'Rod Summary'}
            </h3>
            {mode === 'single' ? (
              data && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Total stress</div>
                    <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                      {data.total_stress.toFixed(2)} MPa
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Yield stress</div>
                    <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                      {yieldStress.toFixed(1)} MPa
                    </div>
                  </div>
                </div>
              )
            ) : (
              twoRodData && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Safety factor — Rod 1</div>
                    <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                      {safetyFactor1.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Safety factor — Rod 2</div>
                    <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                      {safetyFactor2.toFixed(2)}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

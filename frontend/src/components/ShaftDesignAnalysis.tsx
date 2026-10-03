/**
 * Shaft Design Under Combined Bending and Torsion - Interactive Topic
 *
 * Students adjust the alternating bending moment, steady torque, the
 * shoulder-fillet stress concentration (K_t, q), material fatigue
 * properties, and a target factor of safety, to see the ASME DE-Goodman
 * required shaft diameter and the resulting local stress at the fillet
 * update live.
 */

import { useState, useEffect } from 'react'
import { useShaftDesignSimulation } from '../hooks/useShaftDesignSimulation'
import { theme, componentStyles } from '../styles/theme'

const MATERIALS = {
  '1020 HR steel': { Se: 160, Sut: 380 },
  '1045 CD steel': { Se: 230, Sut: 630 },
  '4140 Q&T steel': { Se: 310, Sut: 950 },
  '4340 Q&T steel': { Se: 330, Sut: 1100 },
}

export default function ShaftDesignAnalysis() {
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('1045 CD steel')
  const [customMode, setCustomMode] = useState(false)
  const [Se, setSe] = useState(MATERIALS['1045 CD steel'].Se)
  const [Sut, setSut] = useState(MATERIALS['1045 CD steel'].Sut)
  const [alternatingMoment, setAlternatingMoment] = useState(100)
  const [meanTorque, setMeanTorque] = useState(50)
  const [kt, setKt] = useState(1.5)
  const [q, setQ] = useState(0.8)
  const [targetSafetyFactor, setTargetSafetyFactor] = useState(2.0)

  const handleMaterialSelect = (mat: keyof typeof MATERIALS) => {
    setMaterial(mat)
    setCustomMode(false)
    setSe(MATERIALS[mat].Se)
    setSut(MATERIALS[mat].Sut)
  }

  useEffect(() => {
    if (!customMode) {
      setSe(MATERIALS[material].Se)
      setSut(MATERIALS[material].Sut)
    }
  }, [material, customMode])

  const { data, loading, error } = useShaftDesignSimulation({
    alternating_moment: alternatingMoment,
    mean_torque: meanTorque,
    endurance_limit: Se,
    ultimate_strength: Sut,
    stress_concentration_factor: kt,
    notch_sensitivity: q,
    target_safety_factor: targetSafetyFactor,
  })

  const kf = data?.fatigue_stress_concentration_factor ?? 1
  const requiredDiameter = data?.required_diameter ?? 0
  const alternatingStress = data?.alternating_stress ?? 0
  const roundedDiameter = data?.rounded_diameter ?? 0
  const roundedSafetyFactor = data?.rounded_safety_factor ?? 0
  const distribution = data?.distribution ?? []

  const passes = roundedSafetyFactor >= targetSafetyFactor
  const statusColor = passes ? theme.colors.success : theme.colors.error

  // --- Diameter vs. safety-factor curve, clipped to a readable y-range ---
  const yMax = targetSafetyFactor * 3
  const plotW = 300
  const plotH = 190
  const padL = 36
  const padB = 24
  const innerW = plotW - padL - 10
  const innerH = plotH - padB - 10

  const xMin = distribution.length > 0 ? distribution[0].diameter_mm : 0
  const xMax = distribution.length > 0 ? distribution[distribution.length - 1].diameter_mm : 1
  const xScale = (d: number) => padL + ((d - xMin) / Math.max(xMax - xMin, 1e-6)) * innerW
  const yScale = (sf: number) => 10 + innerH - (Math.min(sf, yMax) / yMax) * innerH

  const curvePoints = distribution.map((pt) => `${xScale(pt.diameter_mm)},${yScale(pt.safety_factor)}`).join(' ')

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Material
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              {(Object.keys(MATERIALS) as Array<keyof typeof MATERIALS>).map((mat) => (
                <button
                  key={mat}
                  onClick={() => handleMaterialSelect(mat)}
                  className={material === mat && !customMode ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ fontSize: '13px' }}
                >
                  {mat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCustomMode(!customMode)}
              className={customMode ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ width: '100%', marginBottom: theme.spacing[2] }}
            >
              Custom
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1], fontSize: '13px' }}>Endurance limit S_e</label>
                {customMode ? (
                  <input type="number" value={Se} onChange={(e) => setSe(parseFloat(e.target.value))} className="input" />
                ) : (
                  <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                    {Se.toFixed(0)} MPa
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1], fontSize: '13px' }}>Ultimate S_ut</label>
                {customMode ? (
                  <input type="number" value={Sut} onChange={(e) => setSut(parseFloat(e.target.value))} className="input" />
                ) : (
                  <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                    {Sut.toFixed(0)} MPa
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Alternating moment M_a</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{alternatingMoment.toFixed(0)} N·m</span>
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={alternatingMoment}
                onChange={(e) => setAlternatingMoment(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Mean torque T_m</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{meanTorque.toFixed(0)} N·m</span>
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={meanTorque}
                onChange={(e) => setMeanTorque(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Stress concentration K_t</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{kt.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={kt}
                onChange={(e) => setKt(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Notch sensitivity q</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{q.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={q}
                onChange={(e) => setQ(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Target safety factor n</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{targetSafetyFactor.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={targetSafetyFactor}
                onChange={(e) => setTargetSafetyFactor(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
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
                  <span>Fatigue stress conc. (K_f)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{kf.toFixed(3)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Required diameter (d)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{requiredDiameter.toFixed(2)} mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Alternating stress at fillet (σ_a')</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{alternatingStress.toFixed(2)} MPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Rounded to stock size</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{roundedDiameter.toFixed(0)} mm</span>
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
                  At {roundedDiameter.toFixed(0)} mm: n = {roundedSafetyFactor.toFixed(2)} — {passes ? 'PASSES' : 'FAILS'} (need ≥ {targetSafetyFactor.toFixed(1)})
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>K_f = 1 + q(K_t − 1)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
                d³ = (32n/π)·√[(K_f M_a/S_e)² + (3/4)(K_fs T_m/S_ut)²]
              </p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ_a' = K_f · 32 M_a / (π d³)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualizations */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Safety Factor vs. Diameter
            </h3>
            <svg width="100%" height="220" viewBox={`0 0 ${plotW} ${plotH + 20}`} style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {/* Axes */}
              <line x1={padL} y1="10" x2={padL} y2={plotH - padB + 10} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <line x1={padL} y1={plotH - padB + 10} x2={plotW - 10} y2={plotH - padB + 10} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <text x={padL - 6} y="18" fontSize="9" fill={theme.colors.text.light} textAnchor="end">n={yMax.toFixed(1)}</text>
              <text x={padL - 6} y={plotH - padB + 12} fontSize="9" fill={theme.colors.text.light} textAnchor="end">0</text>
              <text x={padL} y={plotH + 18} fontSize="9" fill={theme.colors.text.light}>{xMin.toFixed(0)} mm</text>
              <text x={plotW - 14} y={plotH + 18} fontSize="9" fill={theme.colors.text.light} textAnchor="end">{xMax.toFixed(0)} mm</text>

              {/* Target safety factor reference line */}
              <line x1={padL} y1={yScale(targetSafetyFactor)} x2={plotW - 10} y2={yScale(targetSafetyFactor)} stroke={theme.colors.warning} strokeWidth="1" strokeDasharray="4 3" />
              <text x={plotW - 14} y={yScale(targetSafetyFactor) - 4} fontSize="9" fill={theme.colors.warning} textAnchor="end">target n</text>

              {/* Curve */}
              {distribution.length > 1 && (
                <polyline points={curvePoints} fill="none" stroke={theme.colors.lightBlue[500]} strokeWidth="2.5" />
              )}

              {/* Required-diameter marker */}
              {requiredDiameter > 0 && (
                <circle cx={xScale(requiredDiameter)} cy={yScale(targetSafetyFactor)} r="4" fill={statusColor} stroke={theme.colors.text.primary} strokeWidth="1" />
              )}
            </svg>
            <p style={{ fontSize: '12px', color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              A sharper fillet (higher K_t) or a higher target n shifts this curve — and the required diameter — up and to the right.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Shaft Cross-Section at the Fillet
            </h3>
            <svg width="100%" height="220" viewBox="0 0 300 220" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {(() => {
                const maxRadiusPx = 85
                const refDiameter = Math.max(requiredDiameter, 1)
                const radiusPx = Math.min(maxRadiusPx, 8 + refDiameter * 1.4)
                return (
                  <>
                    <circle cx="150" cy="105" r={radiusPx} fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
                    <circle cx="150" cy="105" r="2" fill={theme.colors.text.primary} />
                    <line x1="150" y1="105" x2={150 + radiusPx} y2="105" stroke={theme.colors.gray[500]} strokeWidth="1" strokeDasharray="3 3" />
                    <text x={150 + radiusPx / 2} y="98" fontSize="11" fill={theme.colors.text.secondary} textAnchor="middle">d/2</text>
                    <text x="150" y="200" textAnchor="middle" fontSize="14" fontWeight={700} fill={theme.colors.lightBlue[700]}>
                      d = {requiredDiameter.toFixed(2)} mm
                    </text>
                  </>
                )
              })()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

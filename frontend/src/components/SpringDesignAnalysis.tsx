/**
 * Helical Compression Spring Design - Interactive Topic
 *
 * Students adjust wire diameter, coil diameter, active coil count, and
 * applied axial force to see the spring index, Wahl factor, spring rate,
 * deflection, and corrected shear stress update live.
 */

import { useState, useEffect } from 'react'
import { useSpringDesignSimulation } from '../hooks/useSpringDesignSimulation'
import { theme, componentStyles } from '../styles/theme'

const MATERIALS = {
  music_wire: { label: 'Music Wire', G: 79300, allowable: 660 },
  stainless_302: { label: 'Stainless 302', G: 69000, allowable: 500 },
  phosphor_bronze: { label: 'Phosphor Bronze', G: 41000, allowable: 350 },
}

export default function SpringDesignAnalysis() {
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('music_wire')
  const [customMode, setCustomMode] = useState(false)
  const [G, setG] = useState(MATERIALS.music_wire.G)

  const [wireDiameter, setWireDiameter] = useState(3)
  const [coilDiameter, setCoilDiameter] = useState(24)
  const [activeCoils, setActiveCoils] = useState(10)
  const [appliedForce, setAppliedForce] = useState(50)

  const [checkSafety, setCheckSafety] = useState(true)
  const [allowableShear, setAllowableShear] = useState(MATERIALS.music_wire.allowable)

  useEffect(() => {
    if (!customMode) {
      setG(MATERIALS[material].G)
      setAllowableShear(MATERIALS[material].allowable)
    }
  }, [material, customMode])

  const { data, loading, error } = useSpringDesignSimulation({
    wire_diameter: wireDiameter,
    coil_diameter: coilDiameter,
    active_coils: activeCoils,
    shear_modulus: G,
    applied_force: appliedForce,
    allowable_shear_stress: checkSafety ? allowableShear : undefined,
  })

  const springIndex = data?.spring_index ?? coilDiameter / wireDiameter
  const wahlFactor = data?.wahl_factor ?? 0
  const springRate = data?.spring_rate ?? 0
  const deflection = data?.deflection ?? 0
  const maxShearStress = data?.max_shear_stress ?? 0
  const isPracticalRange = data?.is_practical_range ?? true
  const safetyFactor = data?.safety_factor ?? null

  const rangeColor = isPracticalRange ? theme.colors.success : theme.colors.warning
  const passesSafety = safetyFactor !== null && safetyFactor >= 1.5
  const safetyColor = passesSafety ? theme.colors.success : theme.colors.error

  // --- Visualization geometry ---
  // Purely illustrative free length: assumes a resting pitch of ~2.5 wire
  // diameters between active coils (a typical unloaded spring proportion).
  const freeLengthMm = Math.max(activeCoils * wireDiameter * 2.5, wireDiameter * 4)
  const solidHeightMm = activeCoils * wireDiameter * 1.05
  const compressedLengthMm = Math.max(freeLengthMm - deflection, solidHeightMm)

  const drawTop = 40
  const baseY = 290
  const maxSpanPx = baseY - drawTop
  const pxPerMm = maxSpanPx / freeLengthMm

  const freeHeightPx = freeLengthMm * pxPerMm
  const compressedHeightPx = compressedLengthMm * pxPerMm

  const topYFree = baseY - freeHeightPx
  const topYNow = baseY - compressedHeightPx

  const centerX = 150
  const rxPx = Math.min(70, Math.max(18, coilDiameter * 1.1))

  const renderTurns = Math.max(3, Math.min(Math.round(activeCoils), 18))
  const stepPx = compressedHeightPx / renderTurns

  let coilPath = `M ${centerX} ${topYNow}`
  for (let i = 0; i < renderTurns; i++) {
    const yMid = topYNow + stepPx * (i + 0.5)
    const yEnd = topYNow + stepPx * (i + 1)
    const sign = i % 2 === 0 ? 1 : -1
    coilPath += ` Q ${centerX + sign * rxPx} ${yMid} ${centerX} ${yEnd}`
  }

  const coilColor = passesSafety || safetyFactor === null ? theme.colors.lightBlue[600] : theme.colors.error

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Wire Material
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
                  style={{ flex: 1 }}
                >
                  {MATERIALS[mat].label}
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
            {customMode ? (
              <input type="number" value={G} onChange={(e) => setG(parseFloat(e.target.value))} className="input" />
            ) : (
              <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                G = {G.toLocaleString()} MPa
              </div>
            )}
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Wire Diameter d</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{wireDiameter.toFixed(1)} mm</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={wireDiameter}
                onChange={(e) => setWireDiameter(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Mean Coil Diameter D</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{coilDiameter.toFixed(1)} mm</span>
              </label>
              <input
                type="range"
                min="5"
                max="80"
                step="0.5"
                value={coilDiameter}
                onChange={(e) => setCoilDiameter(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Active Coils N</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{activeCoils.toFixed(0)}</span>
              </label>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={activeCoils}
                onChange={(e) => setActiveCoils(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Applied Force F</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{appliedForce.toFixed(0)} N</span>
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="1"
                value={appliedForce}
                onChange={(e) => setAppliedForce(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
              <input type="checkbox" checked={checkSafety} onChange={(e) => setCheckSafety(e.target.checked)} />
              Check safety factor against allowable shear stress
            </label>
            {checkSafety && (
              customMode ? (
                <input
                  type="number"
                  value={allowableShear}
                  onChange={(e) => setAllowableShear(parseFloat(e.target.value))}
                  className="input"
                />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  τ_allow = {allowableShear.toLocaleString()} MPa
                </div>
              )
            )}
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
                  <span>Spring index (C)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, color: rangeColor }}>{springIndex.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Wahl factor (K_w)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{wahlFactor.toFixed(3)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Spring rate (k)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{springRate.toFixed(2)} N/mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Deflection (δ)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{deflection.toFixed(2)} mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Max shear stress (τ)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{maxShearStress.toFixed(1)} MPa</span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[2],
                    backgroundColor: rangeColor,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    fontSize: '13px',
                  }}
                >
                  {isPracticalRange ? 'C is within the practical 4–12 range' : `C = ${springIndex.toFixed(1)} is outside the practical 4–12 range`}
                </div>

                {safetyFactor !== null && (
                  <div
                    style={{
                      padding: theme.spacing[3],
                      backgroundColor: safetyColor,
                      borderRadius: '6px',
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      marginTop: theme.spacing[1],
                    }}
                  >
                    Safety factor {safetyFactor.toFixed(2)} — {passesSafety ? 'PASSES' : 'FAILS'} (need ≥ 1.5)
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>k = G d⁴ / (8 D³ N)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>C = D / d</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>K_w = (4C−1)/(4C−4) + 0.615/C</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>τ = K_w · 8FD / (π d³)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>δ = F / k</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Coil Compression
            </h3>
            <svg width="100%" height="340" viewBox="0 0 300 340" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {/* Fixed base */}
              <line x1={centerX - 60} y1={baseY + 8} x2={centerX + 60} y2={baseY + 8} stroke={theme.colors.text.primary} strokeWidth="4" />
              {[-1, -0.5, 0, 0.5, 1].map((f) => (
                <line
                  key={f}
                  x1={centerX + f * 55}
                  y1={baseY + 8}
                  x2={centerX + f * 55 - 8}
                  y2={baseY + 20}
                  stroke={theme.colors.gray[500]}
                  strokeWidth="2"
                />
              ))}
              <line x1={centerX} y1={baseY + 8} x2={centerX} y2={baseY} stroke={theme.colors.text.primary} strokeWidth="3" />

              {/* Free (unloaded) length reference, dashed */}
              <line x1={centerX - rxPx - 15} y1={topYFree} x2={centerX + rxPx + 15} y2={topYFree} stroke={theme.colors.gray[500]} strokeWidth="1.5" strokeDasharray="4 4" />
              <text x={centerX + rxPx + 20} y={topYFree + 4} fontSize="10" fill={theme.colors.text.light}>free length</text>

              {/* Coil */}
              <path d={coilPath} fill="none" stroke={coilColor} strokeWidth="4" strokeLinecap="round" />

              {/* Top platen */}
              <line x1={centerX - rxPx - 10} y1={topYNow} x2={centerX + rxPx + 10} y2={topYNow} stroke={theme.colors.text.primary} strokeWidth="4" />

              {/* Deflection double-arrow */}
              {appliedForce > 0 && (
                <>
                  <line x1={centerX - rxPx - 30} y1={topYFree} x2={centerX - rxPx - 30} y2={topYNow} stroke={theme.colors.accent[600]} strokeWidth="1.5" markerStart="url(#springArrow)" markerEnd="url(#springArrow)" />
                  <text x={centerX - rxPx - 36} y={(topYFree + topYNow) / 2} fontSize="10" fill={theme.colors.accent[600]} textAnchor="end">δ</text>
                </>
              )}

              {/* Applied force arrow, pushing down on the top platen */}
              <line x1={centerX} y1={Math.max(topYNow - 40, 5)} x2={centerX} y2={topYNow - 4} stroke={theme.colors.error} strokeWidth="3" />
              <path d={`M ${centerX - 6} ${topYNow - 4} L ${centerX} ${topYNow + 6} L ${centerX + 6} ${topYNow - 4} Z`} fill={theme.colors.error} />
              <text x={centerX + 12} y={Math.max(topYNow - 40, 5) + 12} fontSize="13" fontWeight={700} fill={theme.colors.error}>F</text>

              <defs>
                <marker id="springArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.accent[600]} />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Spring Summary
            </h3>
            {data && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Wire diameter (d)</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{data.wire_diameter.toFixed(1)} mm</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Coil diameter (D)</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{data.coil_diameter.toFixed(1)} mm</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Active coils (N)</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{data.active_coils.toFixed(0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Applied force (F)</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{data.applied_force.toFixed(0)} N</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

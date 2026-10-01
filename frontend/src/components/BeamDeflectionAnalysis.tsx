/**
 * Beam Deflection - Interactive Topic
 *
 * Students adjust span, point load, load position, and section depth for a
 * simply supported beam and watch the elastic curve y(x), the maximum
 * deflection, and the L/360 serviceability check update live.
 */

import { useState, useEffect } from 'react'
import { useBeamDeflectionSimulation } from '../hooks/useBeamDeflectionSimulation'
import { theme, componentStyles } from '../styles/theme'

const MATERIALS = {
  steel: { E: 200000, yield: 250 },
  aluminum: { E: 69000, yield: 240 },
  timber: { E: 11000, yield: 24 },
}

const PLOT_LEFT = 50
const PLOT_RIGHT = 390
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT
const BEAM_Y = 90
const AMPLITUDE_PX = 90

export default function BeamDeflectionAnalysis() {
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('steel')
  const [length, setLength] = useState(4)
  const [loadKn, setLoadKn] = useState(10)
  const [positionPct, setPositionPct] = useState(50)
  const [heightMm, setHeightMm] = useState(200)
  const [E, setE] = useState(MATERIALS.steel.E)
  const [yieldStress, setYieldStress] = useState(MATERIALS.steel.yield)
  const [customMode, setCustomMode] = useState(false)

  useEffect(() => {
    if (!customMode) {
      const mat = MATERIALS[material]
      setE(mat.E)
      setYieldStress(mat.yield)
    }
  }, [material, customMode])

  const { data, loading, error } = useBeamDeflectionSimulation({
    length,
    load_kn: loadKn,
    position_pct: positionPct,
    height_mm: heightMm,
    youngs_modulus: E,
    yield_stress: yieldStress,
  })

  const curve = data?.deflection_curve ?? []
  const maxDeflectionMm = data?.max_deflection_mm ?? 0
  const deflectionLimitMm = data?.deflection_limit_mm ?? 1
  const strengthOk = data?.strength_ok ?? true
  const stiffnessOk = data?.stiffness_ok ?? true
  const statusColor = stiffnessOk ? theme.colors.success : theme.colors.error
  const strengthColor = strengthOk ? theme.colors.success : theme.colors.error

  const a = (length * positionPct) / 100

  const xToPx = (x: number) => PLOT_LEFT + (x / length) * PLOT_WIDTH
  const scaleMax = Math.max(maxDeflectionMm, deflectionLimitMm, 0.001)
  const yToPx = (yMm: number) => BEAM_Y + (yMm / scaleMax) * AMPLITUDE_PX

  const loadX = xToPx(a)
  const maxDeflectionX = xToPx(data?.max_deflection_location_m ?? a)
  const maxDeflectionY = yToPx(maxDeflectionMm)
  const limitY = yToPx(deflectionLimitMm)

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
                <span>Span L</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{length.toFixed(2)} m</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Point Load P</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{loadKn.toFixed(1)} kN</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={loadKn}
                onChange={(e) => setLoadKn(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Load position (from A)</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{positionPct.toFixed(0)}% of L</span>
              </label>
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={positionPct}
                onChange={(e) => setPositionPct(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Section depth h</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{heightMm.toFixed(0)} mm</span>
              </label>
              <input
                type="range"
                min="50"
                max="400"
                step="5"
                value={heightMm}
                onChange={(e) => setHeightMm(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.text.light }}>
              Rectangular section, width fixed at {data?.width_mm ?? 100} mm.
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
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Yield Stress</label>
              {customMode ? (
                <input type="number" value={yieldStress} onChange={(e) => setYieldStress(parseFloat(e.target.value))} className="input" />
              ) : (
                <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                  {yieldStress.toFixed(1)} MPa
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
                  <span>Reactions R_A / R_B</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    {data.reaction_a_kn.toFixed(2)} / {data.reaction_b_kn.toFixed(2)} kN
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Max moment (M_max)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.max_moment_knm.toFixed(2)} kN·m</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Max bending stress</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.max_bending_stress.toFixed(2)} MPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Deflection under load</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.deflection_under_load_mm.toFixed(3)} mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Max deflection (δ_max)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    {data.max_deflection_mm.toFixed(3)} mm at x={data.max_deflection_location_m.toFixed(2)} m
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Serviceability limit (L/360)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.deflection_limit_mm.toFixed(3)} mm</span>
                </div>
                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: strengthColor,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  Strength: safety factor {data.safety_factor.toFixed(2)} — {strengthOk ? 'PASSES' : 'FAILS'} (need ≥ 1.5)
                </div>
                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: statusColor,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  Stiffness (L/360): {stiffnessOk ? 'PASSES' : 'FAILS'} — δ_max is{' '}
                  {(data.max_deflection_mm / (data.deflection_limit_mm || 1) * 100).toFixed(0)}% of the limit
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>E I y″ = M(x)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>R_A = P b / L, R_B = P a / L</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>δ = P a² b² / (3 E I L)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>Serviceability limit: δ_max ≤ L / 360</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualizations */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Elastic Curve y(x)
            </h3>
            <svg width="100%" height="260" viewBox="0 0 440 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {/* Unloaded (straight) reference line */}
              <line x1={PLOT_LEFT} y1={BEAM_Y} x2={PLOT_RIGHT} y2={BEAM_Y} stroke={theme.colors.gray[400]} strokeWidth="1.5" strokeDasharray="5 4" />

              {/* Supports */}
              <path d={`M ${PLOT_LEFT} ${BEAM_Y + 4} L ${PLOT_LEFT - 10} ${BEAM_Y + 20} L ${PLOT_LEFT + 10} ${BEAM_Y + 20} Z`} fill="none" stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <path d={`M ${PLOT_RIGHT} ${BEAM_Y + 4} L ${PLOT_RIGHT - 10} ${BEAM_Y + 20} L ${PLOT_RIGHT + 10} ${BEAM_Y + 20} Z`} fill="none" stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <text x={PLOT_LEFT} y={BEAM_Y + 35} textAnchor="middle" fontSize="10" fill={theme.colors.text.light}>A (x=0)</text>
              <text x={PLOT_RIGHT} y={BEAM_Y + 35} textAnchor="middle" fontSize="10" fill={theme.colors.text.light}>B (x=L)</text>

              {/* Serviceability limit line */}
              <line x1={PLOT_LEFT} y1={limitY} x2={PLOT_RIGHT} y2={limitY} stroke={statusColor} strokeWidth="1" strokeDasharray="3 3" />
              <text x={PLOT_RIGHT} y={limitY - 4} textAnchor="end" fontSize="10" fill={statusColor}>L/360 limit</text>

              {/* Deflected shape */}
              {curve.length > 1 && (
                <polyline
                  points={curve.map((pt) => `${xToPx(pt.x)},${yToPx(pt.y_mm)}`).join(' ')}
                  fill="none"
                  stroke={theme.colors.lightBlue[600]}
                  strokeWidth="2.5"
                />
              )}

              {/* Point load arrow */}
              <line x1={loadX} y1={BEAM_Y - 45} x2={loadX} y2={BEAM_Y - 3} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#bdaArrow)" />
              <text x={loadX} y={BEAM_Y - 50} textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>P</text>

              {/* Max deflection marker */}
              <circle cx={maxDeflectionX} cy={maxDeflectionY} r="4" fill={statusColor} />
              <text x={maxDeflectionX} y={maxDeflectionY + 18} textAnchor="middle" fontSize="11" fontWeight={700} fill={statusColor}>
                δ_max = {maxDeflectionMm.toFixed(2)} mm
              </text>

              <defs>
                <marker id="bdaArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
                </marker>
              </defs>
            </svg>
            <div style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
              Deflection axis is to scale relative to the L/360 limit; the beam's own length is not — the sag is normally far too small to see.
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Beam Summary
            </h3>
            {data && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Second moment (I)</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {(data.moment_of_inertia * 1e12 / 1e6).toFixed(3)} × 10⁶ mm⁴
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Yield stress</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {yieldStress.toFixed(1)} MPa
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

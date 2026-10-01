/**
 * Fatigue Analysis: S-N Curves & the Goodman Diagram - Interactive Topic
 *
 * Students adjust mean stress and alternating stress for a part under
 * fluctuating load and see the modified-Goodman safety factor, the
 * safe/unsafe verdict, and (when outside the safe region) an
 * illustrative Basquin-equation cycle-to-failure estimate, all plotted
 * live on a Goodman diagram (mean stress vs. alternating stress).
 */

import { useState } from 'react'
import { useFatigueAnalysisSimulation } from '../hooks/useFatigueAnalysisSimulation'
import { theme, componentStyles } from '../styles/theme'

// Illustrative material presets — kept in sync by hand with
// FATIGUE_MATERIALS in python-engine/src/simmec_engine/topics/fatigue_analysis.py.
// These are representative magnitudes for a generic member of the
// family, not certified alloy/temper properties; see that module's
// docstring for sourcing notes. Aluminum has no true endurance limit —
// its "S_e" here is an illustrative fatigue strength at a large but
// finite cycle count, kept only so the same Goodman/Basquin machinery
// can be demonstrated for a non-ferrous material.
const MATERIALS = {
  steel: { label: 'Steel', ultimateStrength: 600, enduranceLimit: 300, sigmaF: 900, b: -0.085 },
  aluminum: { label: 'Aluminum', ultimateStrength: 310, enduranceLimit: 96, sigmaF: 470, b: -0.11 },
} as const

type MaterialKey = keyof typeof MATERIALS

const LIFE_LABEL: Record<string, string> = {
  infinite: 'Infinite life',
  finite: 'Finite life',
  finite_unquantified: 'Finite life (unquantified)',
  static_failure: 'Static failure',
  unknown: 'Unknown',
}

function formatCycles(n: number): string {
  if (!Number.isFinite(n)) return '∞'
  if (n < 1) return '< 1 cycle'
  return n.toExponential(2).replace('e+', ' × 10^')
}

export default function FatigueAnalysis() {
  const [material, setMaterial] = useState<MaterialKey>('steel')
  const [customMode, setCustomMode] = useState(false)
  const [ultimateStrength, setUltimateStrength] = useState<number>(MATERIALS.steel.ultimateStrength)
  const [enduranceLimit, setEnduranceLimit] = useState<number>(MATERIALS.steel.enduranceLimit)
  const [sigmaF, setSigmaF] = useState<number>(MATERIALS.steel.sigmaF)
  const [b, setB] = useState<number>(MATERIALS.steel.b)

  const [meanStress, setMeanStress] = useState(100)
  const [alternatingStress, setAlternatingStress] = useState(150)

  const handleMaterialSelect = (mat: MaterialKey) => {
    setMaterial(mat)
    setCustomMode(false)
    setUltimateStrength(MATERIALS[mat].ultimateStrength)
    setEnduranceLimit(MATERIALS[mat].enduranceLimit)
    setSigmaF(MATERIALS[mat].sigmaF)
    setB(MATERIALS[mat].b)
  }

  const { data, loading, error } = useFatigueAnalysisSimulation({
    mean_stress: meanStress,
    alternating_stress: alternatingStress,
    ultimate_strength: ultimateStrength,
    endurance_limit: enduranceLimit,
    fatigue_strength_coefficient: sigmaF,
    fatigue_strength_exponent: b,
  })

  const safetyFactor = data?.safety_factor ?? 0
  const isSafe = data?.is_safe ?? true
  const statusColor = isSafe ? theme.colors.success : theme.colors.error

  // --- Goodman diagram geometry -----------------------------------------
  const PLOT_W = 560
  const PLOT_H = 400
  const PAD = { left: 64, right: 24, top: 24, bottom: 48 }
  const domainMax = ultimateStrength * 1.15

  const toX = (sm: number) => PAD.left + (sm / domainMax) * (PLOT_W - PAD.left - PAD.right)
  const toY = (sa: number) => PLOT_H - PAD.bottom - (sa / domainMax) * (PLOT_H - PAD.top - PAD.bottom)

  const goodmanLine = data?.goodman_line ?? []
  const goodmanPoints = goodmanLine.map((p) => `${toX(p.mean_stress)},${toY(p.alternating_stress)}`).join(' ')

  // Safe-region shading: the polygon under the Goodman line, bounded by
  // the axes.
  const safeRegionPoints = [
    `${toX(0)},${toY(0)}`,
    ...goodmanLine.map((p) => `${toX(p.mean_stress)},${toY(p.alternating_stress)}`),
    `${toX(ultimateStrength)},${toY(0)}`,
  ].join(' ')

  const loadLine = data?.load_line ?? []
  const currentPoint = { mean_stress: meanStress, alternating_stress: alternatingStress }
  const intersection = data?.intersection_point ?? { mean_stress: 0, alternating_stress: enduranceLimit }

  const xAxisY = toY(0)
  const yAxisX = toX(0)

  const lifeRegime = data?.life_regime ?? 'infinite'
  const lifeText =
    lifeRegime === 'finite' && data?.cycles_to_failure != null
      ? `${LIFE_LABEL[lifeRegime]} — N ≈ ${formatCycles(data.cycles_to_failure)} cycles`
      : LIFE_LABEL[lifeRegime] ?? 'Unknown'

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Material
            </h3>
            <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              {(Object.keys(MATERIALS) as MaterialKey[]).map((mat) => (
                <button
                  key={mat}
                  onClick={() => handleMaterialSelect(mat)}
                  className={material === mat && !customMode ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ flex: 1, textTransform: 'capitalize' }}
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
              <div style={{ display: 'grid', gap: theme.spacing[2] }}>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>
                  S_ut (MPa)
                  <input type="number" value={ultimateStrength} onChange={(e) => setUltimateStrength(parseFloat(e.target.value))} className="input" />
                </label>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>
                  S_e (MPa)
                  <input type="number" value={enduranceLimit} onChange={(e) => setEnduranceLimit(parseFloat(e.target.value))} className="input" />
                </label>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>
                  σ_f′ (MPa)
                  <input type="number" value={sigmaF} onChange={(e) => setSigmaF(parseFloat(e.target.value))} className="input" />
                </label>
                <label style={{ fontSize: '13px', fontWeight: 600 }}>
                  b (exponent)
                  <input type="number" step="0.005" value={b} onChange={(e) => setB(parseFloat(e.target.value))} className="input" />
                </label>
              </div>
            ) : (
              <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', display: 'grid', gap: '4px' }}>
                <span>S_ut = {ultimateStrength} MPa</span>
                <span>S_e = {enduranceLimit} MPa</span>
                <span>σ_f′ = {sigmaF} MPa, b = {b}</span>
              </div>
            )}
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Mean Stress σ_m</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{meanStress.toFixed(0)} MPa</span>
              </label>
              <input
                type="range"
                min="0"
                max={(ultimateStrength * 1.1).toFixed(0)}
                step="1"
                value={meanStress}
                onChange={(e) => setMeanStress(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Alternating Stress σ_a</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{alternatingStress.toFixed(0)} MPa</span>
              </label>
              <input
                type="range"
                min="0"
                max={(ultimateStrength * 1.1).toFixed(0)}
                step="1"
                value={alternatingStress}
                onChange={(e) => setAlternatingStress(parseFloat(e.target.value))}
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
                  <span>Safety factor (n)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{Number.isFinite(safetyFactor) ? safetyFactor.toFixed(2) : '∞'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Failure point (this ratio)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    ({intersection.mean_stress.toFixed(0)}, {intersection.alternating_stress.toFixed(0)}) MPa
                  </span>
                </div>
                {data.equivalent_reversed_stress != null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                    <span>Equivalent σ_ar</span>
                    <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.equivalent_reversed_stress.toFixed(0)} MPa</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Estimated life</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, textAlign: 'right' }}>{lifeText}</span>
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
                  {isSafe ? 'SAFE — inside the Goodman line' : 'UNSAFE — outside the Goodman line'}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>n = 1 / (σ_a/S_e + σ_m/S_ut)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ_ar = σ_a / (1 − σ_m/S_ut)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>N = 0.5 (σ_ar / σ_f′)^(1/b)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Goodman Diagram */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Goodman Diagram
            </h3>
            <svg
              width="100%"
              height="420"
              viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
              role="img"
              aria-label="Goodman diagram: alternating stress vs. mean stress, with the safe region, the current load point, and its Goodman-line intersection"
              style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}
            >
              {/* Safe region shading */}
              {goodmanLine.length > 0 && (
                <polygon points={safeRegionPoints} fill={theme.colors.success} fillOpacity="0.12" />
              )}

              {/* Axes */}
              <line x1={yAxisX} y1={PAD.top} x2={yAxisX} y2={xAxisY} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <line x1={yAxisX} y1={xAxisY} x2={PLOT_W - PAD.right} y2={xAxisY} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <text x={(PLOT_W + PAD.left - PAD.right) / 2} y={PLOT_H - 10} textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
                Mean stress σ_m (MPa)
              </text>
              <text
                x={16}
                y={(PAD.top + xAxisY) / 2}
                textAnchor="middle"
                fontSize="13"
                fill={theme.colors.text.secondary}
                transform={`rotate(-90, 16, ${(PAD.top + xAxisY) / 2})`}
              >
                Alternating stress σ_a (MPa)
              </text>

              {/* S_e tick */}
              <line x1={yAxisX - 4} y1={toY(enduranceLimit)} x2={yAxisX} y2={toY(enduranceLimit)} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <text x={yAxisX - 8} y={toY(enduranceLimit) + 4} textAnchor="end" fontSize="11" fill={theme.colors.text.secondary}>S_e</text>

              {/* S_ut tick */}
              <line x1={toX(ultimateStrength)} y1={xAxisY} x2={toX(ultimateStrength)} y2={xAxisY + 4} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <text x={toX(ultimateStrength)} y={xAxisY + 18} textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>S_ut</text>

              {/* Goodman line */}
              {goodmanPoints && (
                <polyline points={goodmanPoints} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
              )}

              {/* Load line (origin through current point, extended) */}
              {loadLine.length > 1 && (
                <line
                  x1={toX(loadLine[0].mean_stress)}
                  y1={toY(loadLine[0].alternating_stress)}
                  x2={toX(loadLine[1].mean_stress)}
                  y2={toY(loadLine[1].alternating_stress)}
                  stroke={theme.colors.gray[500]}
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
              )}

              {/* Intersection ("failure point at this ratio") */}
              {data && (
                <g>
                  <circle cx={toX(intersection.mean_stress)} cy={toY(intersection.alternating_stress)} r="4" fill="none" stroke={theme.colors.gray[600]} strokeWidth="2" />
                </g>
              )}

              {/* Current stress point */}
              <circle cx={toX(currentPoint.mean_stress)} cy={toY(currentPoint.alternating_stress)} r="7" fill={statusColor} stroke={theme.colors.text.primary} strokeWidth="1.5" />

              {loadLine.length > 0 && (
                <text x={toX(currentPoint.mean_stress) + 12} y={toY(currentPoint.alternating_stress) - 10} fontSize="12" fontWeight={700} fill={statusColor}>
                  (σ_m, σ_a)
                </text>
              )}
            </svg>
            <p style={{ fontSize: '13px', color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              Shaded region: safe (infinite life or below S_ut statically). Solid line: the modified Goodman
              boundary from (0, S_e) to (S_ut, 0). Dashed line: the load line at the current stress ratio, with
              its Goodman-line crossing marked — the stress state at which this part would first fail if σ_m and
              σ_a were scaled up together.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

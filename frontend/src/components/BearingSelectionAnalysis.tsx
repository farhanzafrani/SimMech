/**
 * Rolling-Element Bearing Selection: L10 Life - Interactive Topic
 *
 * Students pick a bearing type (ball or roller), then either:
 *  - "Life from rating": give a catalog dynamic load rating C, an applied
 *    load P, and a shaft speed n, and see the resulting L10 life, or
 *  - "Required rating for target life": give a target service life and
 *    see the minimum dynamic load rating C needed to reach it.
 *
 * The log-scale plot shows why bearing life is so sensitive to load: L10
 * falls off as a steep power law (C/P)^k, and a larger k (roller, 10/3)
 * falls off FASTER with increasing load than a smaller k (ball, 3).
 */

import { useState } from 'react'
import { useBearingSelectionSimulation, type BearingType, type BearingSelectionMode } from '../hooks/useBearingSelectionSimulation'
import { theme, componentStyles } from '../styles/theme'

const BEARING_TYPES: Array<{ key: BearingType; label: string; k: number }> = [
  { key: 'ball', label: 'Ball (k = 3)', k: 3 },
  { key: 'roller', label: 'Roller (k = 10/3)', k: 10 / 3 },
]

const MODES: Array<{ key: BearingSelectionMode; label: string }> = [
  { key: 'life', label: 'Life from rating C' },
  { key: 'required_rating', label: 'Required C for target life' },
]

// Fixed log-scale plot domain, matching the range the backend generates
// its load_curve over.
const X_MIN = 0.5
const X_MAX = 20
const Y_MIN = 0.1
const Y_MAX = 30000

const PLOT_LEFT = 50
const PLOT_RIGHT = 380
const PLOT_TOP = 20
const PLOT_BOTTOM = 250

function xToPx(ratio: number): number {
  const r = Math.min(Math.max(ratio, X_MIN), X_MAX)
  const t = (Math.log10(r) - Math.log10(X_MIN)) / (Math.log10(X_MAX) - Math.log10(X_MIN))
  return PLOT_LEFT + t * (PLOT_RIGHT - PLOT_LEFT)
}

function yToPx(l10: number): number {
  const v = Math.min(Math.max(l10, Y_MIN), Y_MAX)
  const t = (Math.log10(v) - Math.log10(Y_MIN)) / (Math.log10(Y_MAX) - Math.log10(Y_MIN))
  return PLOT_BOTTOM - t * (PLOT_BOTTOM - PLOT_TOP)
}

function formatHours(hours: number): string {
  if (!isFinite(hours)) return '—'
  return hours.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export default function BearingSelectionAnalysis() {
  const [bearingType, setBearingType] = useState<BearingType>('ball')
  const [mode, setMode] = useState<BearingSelectionMode>('life')

  const [dynamicLoadRating, setDynamicLoadRating] = useState(25) // C, kN
  const [appliedLoad, setAppliedLoad] = useState(5) // P, kN
  const [shaftSpeed, setShaftSpeed] = useState(1500) // n, rpm
  const [targetLifeHours, setTargetLifeHours] = useState(20000) // hours

  const { data, loading, error } = useBearingSelectionSimulation({
    mode,
    bearing_type: bearingType,
    applied_load: appliedLoad,
    shaft_speed: shaftSpeed,
    dynamic_load_rating: mode === 'life' ? dynamicLoadRating : undefined,
    target_life_hours: mode === 'required_rating' ? targetLifeHours : undefined,
  })

  const currentRatio = data?.load_ratio ?? dynamicLoadRating / appliedLoad
  const currentL10 = data?.L10 ?? 0

  // Comparison curves for both bearing types over the same fixed ratio
  // range the backend uses, so the plot always shows both power laws
  // regardless of which type is currently selected.
  const ratioSamples: number[] =
    data?.load_curve.map((pt) => pt.load_ratio) ??
    Array.from({ length: 40 }, (_, i) => X_MIN * Math.pow(X_MAX / X_MIN, i / 39))
  const ballCurve = ratioSamples.map((r) => ({ ratio: r, l10: Math.pow(r, 3) }))
  const rollerCurve = ratioSamples.map((r) => ({ ratio: r, l10: Math.pow(r, 10 / 3) }))

  const yTicks = [0.1, 1, 10, 100, 1000, 10000]
  const xTicks = [0.5, 1, 2, 5, 10, 20]

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Bearing Type
            </h3>
            <div style={{ display: 'flex', gap: theme.spacing[2] }}>
              {BEARING_TYPES.map((bt) => (
                <button
                  key={bt.key}
                  onClick={() => setBearingType(bt.key)}
                  className={bearingType === bt.key ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ flex: 1 }}
                >
                  {bt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Mode
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={mode === m.key ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ width: '100%' }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            {mode === 'life' && (
              <div>
                <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Dynamic load rating C</span>
                  <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{dynamicLoadRating.toFixed(1)} kN</span>
                </label>
                <input type="range" min="1" max="100" step="0.5" value={dynamicLoadRating} onChange={(e) => setDynamicLoadRating(parseFloat(e.target.value))} className="slider" disabled={loading} />
              </div>
            )}

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Applied load P</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{appliedLoad.toFixed(1)} kN</span>
              </label>
              <input type="range" min="0.5" max="30" step="0.5" value={appliedLoad} onChange={(e) => setAppliedLoad(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Shaft speed n</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{shaftSpeed.toFixed(0)} rpm</span>
              </label>
              <input type="range" min="60" max="10000" step="10" value={shaftSpeed} onChange={(e) => setShaftSpeed(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            {mode === 'required_rating' && (
              <div>
                <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Target L10 life</span>
                  <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{formatHours(targetLifeHours)} h</span>
                </label>
                <input type="range" min="500" max="100000" step="500" value={targetLifeHours} onChange={(e) => setTargetLifeHours(parseFloat(e.target.value))} className="slider" disabled={loading} />
              </div>
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
                  <span>Life exponent (k)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.life_exponent.toFixed(3)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>{mode === 'required_rating' ? 'Required rating C' : 'Dynamic load rating C'}</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.dynamic_load_rating.toFixed(2)} kN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Load ratio (C / P)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.load_ratio.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>L10 life</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.L10.toFixed(2)} M rev</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>L10 life</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{formatHours(data.L10_hours)} h</span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: mode === 'required_rating' ? theme.colors.lightBlue[500] : theme.colors.success,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  {mode === 'required_rating'
                    ? `Need C ≥ ${data.required_dynamic_load_rating?.toFixed(2)} kN to reach the target life`
                    : `≈ ${data.L10_years_typical_duty.toFixed(1)} years at 8h/day, 5 days/week (illustrative)`}
                </div>
                {mode === 'required_rating' && (
                  <div style={{ fontSize: '12.5px', color: theme.colors.text.light, textAlign: 'center' }}>
                    ≈ {data.L10_years_typical_duty.toFixed(1)} years at 8h/day, 5 days/week (illustrative)
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
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>L10 = (C / P)^k</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>L10h = L10 × 10⁶ / (60 n)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>k = 3 (ball), 10/3 (roller)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              L10 Life vs. Load Ratio (log scale)
            </h3>
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: '#fafbfc' }}>
              {/* Horizontal gridlines + y ticks (powers of ten) */}
              {yTicks.map((v) => (
                <g key={v}>
                  <line x1={PLOT_LEFT} y1={yToPx(v)} x2={PLOT_RIGHT} y2={yToPx(v)} stroke={theme.colors.gray[200]} strokeWidth="1" />
                  <text x={PLOT_LEFT - 6} y={yToPx(v) + 3} textAnchor="end" fontSize="9" fill={theme.colors.text.light}>
                    {v}
                  </text>
                </g>
              ))}
              {/* Vertical ticks (ratio) */}
              {xTicks.map((v) => (
                <g key={v}>
                  <line x1={xToPx(v)} y1={PLOT_TOP} x2={xToPx(v)} y2={PLOT_BOTTOM} stroke={theme.colors.gray[100]} strokeWidth="1" />
                  <text x={xToPx(v)} y={PLOT_BOTTOM + 14} textAnchor="middle" fontSize="9" fill={theme.colors.text.light}>
                    {v}
                  </text>
                </g>
              ))}

              {/* Axes */}
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_TOP} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="290" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Load ratio C / P
              </text>
              <text x="14" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 14 150)">
                L10 (million rev)
              </text>

              {/* Roller curve (k = 10/3) — falls off faster at high load ratio */}
              <polyline
                points={rollerCurve.map((pt) => `${xToPx(pt.ratio)},${yToPx(pt.l10)}`).join(' ')}
                fill="none"
                stroke={theme.colors.accent[500]}
                strokeWidth={bearingType === 'roller' ? 2.5 : 1.5}
                strokeDasharray={bearingType === 'roller' ? undefined : '5 3'}
                opacity={bearingType === 'roller' ? 1 : 0.55}
                vectorEffect="non-scaling-stroke"
              />
              {/* Ball curve (k = 3) */}
              <polyline
                points={ballCurve.map((pt) => `${xToPx(pt.ratio)},${yToPx(pt.l10)}`).join(' ')}
                fill="none"
                stroke={theme.colors.lightBlue[500]}
                strokeWidth={bearingType === 'ball' ? 2.5 : 1.5}
                strokeDasharray={bearingType === 'ball' ? undefined : '5 3'}
                opacity={bearingType === 'ball' ? 1 : 0.55}
                vectorEffect="non-scaling-stroke"
              />

              {/* Current operating point */}
              {data && (
                <circle cx={xToPx(currentRatio)} cy={yToPx(currentL10)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="2" />
              )}

              {/* Legend */}
              <g>
                <line x1={PLOT_RIGHT - 110} y1={PLOT_TOP + 6} x2={PLOT_RIGHT - 90} y2={PLOT_TOP + 6} stroke={theme.colors.lightBlue[500]} strokeWidth="2.5" />
                <text x={PLOT_RIGHT - 84} y={PLOT_TOP + 9} fontSize="10" fill={theme.colors.text.secondary}>Ball (k=3)</text>
                <line x1={PLOT_RIGHT - 110} y1={PLOT_TOP + 20} x2={PLOT_RIGHT - 90} y2={PLOT_TOP + 20} stroke={theme.colors.accent[500]} strokeWidth="2.5" />
                <text x={PLOT_RIGHT - 84} y={PLOT_TOP + 23} fontSize="10" fill={theme.colors.text.secondary}>Roller (k=10/3)</text>
              </g>
            </svg>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              Both curves are the same shape on log axes, but the roller curve (k = 10/3 ≈ 3.33) is steeper than the ball
              curve (k = 3) — a <em>larger</em> exponent means life falls off <strong>faster</strong> as the load ratio
              drops. So for the same drop in C/P, a roller bearing loses more life than a ball bearing. The red dot marks
              the current operating point.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

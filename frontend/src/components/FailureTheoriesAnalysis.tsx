/**
 * Failure Theories: Von Mises & Tresca - Interactive Topic
 *
 * Students adjust a 2D plane-stress state (σx, σy, τxy) and a material
 * yield stress, and watch the principal stresses collapse into a von
 * Mises effective stress and a Tresca effective stress side by side —
 * plotted together as the classic failure-envelope diagram in normalized
 * (σ1/σy, σ2/σy) space, showing exactly where the two theories diverge.
 */

import { useState } from 'react'
import { useFailureTheoriesSimulation } from '../hooks/useFailureTheoriesSimulation'
import { theme, componentStyles } from '../styles/theme'

export default function FailureTheoriesAnalysis() {
  const [sigmaX, setSigmaX] = useState(150)
  const [sigmaY, setSigmaY] = useState(-50)
  const [tauXY, setTauXY] = useState(60)
  const [yieldStress, setYieldStress] = useState(250)

  const { data, loading, error } = useFailureTheoriesSimulation({
    sigma_x: sigmaX,
    sigma_y: sigmaY,
    tau_xy: tauXY,
    yield_stress: yieldStress,
  })

  const sigma1 = data?.sigma_1 ?? 0
  const sigma2 = data?.sigma_2 ?? 0
  const vonMisesStress = data?.von_mises_stress ?? 0
  const trescaStress = data?.tresca_stress ?? 0
  const safetyFactorVM = data?.safety_factor_von_mises ?? 0
  const safetyFactorTresca = data?.safety_factor_tresca ?? 0
  const governingTheory = data?.governing_theory ?? 'tresca'
  const designPoint = data?.design_point ?? { sigma_1: 0, sigma_2: 0 }
  const ellipse = data?.von_mises_ellipse ?? []
  const hexagon = data?.tresca_hexagon ?? []

  const safeVonMises = safetyFactorVM >= 1
  const safeTresca = safetyFactorTresca >= 1
  const overallSafe = safeVonMises && safeTresca

  // --- Failure-envelope geometry (SVG), normalized σ1/σy vs σ2/σy space ---
  const svgSize = 400
  const originPx = svgSize / 2
  const halfRange = Math.max(1.5, Math.abs(designPoint.sigma_1), Math.abs(designPoint.sigma_2)) * 1.3
  const scale = (svgSize / 2 - 40) / halfRange

  const toX = (s1: number) => originPx + s1 * scale
  const toY = (s2: number) => originPx - s2 * scale

  const ellipsePoints = ellipse.map((p) => `${toX(p.sigma_1)},${toY(p.sigma_2)}`).join(' ')
  const hexagonPoints = hexagon.map((p) => `${toX(p.sigma_1)},${toY(p.sigma_2)}`).join(' ')
  const designPx = { x: toX(designPoint.sigma_1), y: toY(designPoint.sigma_2) }

  const designColor = overallSafe ? theme.colors.success : theme.colors.error

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              2D Stress State
            </h3>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Normal stress σx</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{sigmaX.toFixed(0)} MPa</span>
              </label>
              <input
                type="range"
                min="-300"
                max="300"
                step="5"
                value={sigmaX}
                onChange={(e) => setSigmaX(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Normal stress σy</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{sigmaY.toFixed(0)} MPa</span>
              </label>
              <input
                type="range"
                min="-300"
                max="300"
                step="5"
                value={sigmaY}
                onChange={(e) => setSigmaY(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Shear stress τxy</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{tauXY.toFixed(0)} MPa</span>
              </label>
              <input
                type="range"
                min="-200"
                max="200"
                step="5"
                value={tauXY}
                onChange={(e) => setTauXY(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Yield stress σy</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{yieldStress.toFixed(0)} MPa</span>
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="5"
                value={yieldStress}
                onChange={(e) => setYieldStress(parseFloat(e.target.value))}
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
                  <span>Principal stresses</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    σ1 = {sigma1.toFixed(1)}, σ2 = {sigma2.toFixed(1)} MPa
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Von Mises effective stress σ'</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{vonMisesStress.toFixed(2)} MPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Tresca effective stress (σ1 − σ3)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{trescaStress.toFixed(2)} MPa</span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: theme.spacing[2],
                    marginTop: theme.spacing[2],
                  }}
                >
                  <div
                    style={{
                      padding: theme.spacing[3],
                      backgroundColor: safeVonMises ? theme.colors.success : theme.colors.error,
                      borderRadius: '6px',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '11px', opacity: 0.85 }}>Von Mises FoS</div>
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{safetyFactorVM.toFixed(2)}</div>
                    {governingTheory === 'von_mises' && (
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>more conservative</div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: theme.spacing[3],
                      backgroundColor: safeTresca ? theme.colors.success : theme.colors.error,
                      borderRadius: '6px',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '11px', opacity: 0.85 }}>Tresca FoS</div>
                    <div style={{ fontWeight: 700, fontSize: '18px' }}>{safetyFactorTresca.toFixed(2)}</div>
                    {governingTheory === 'tresca' && (
                      <div style={{ fontSize: '10px', marginTop: '2px' }}>more conservative</div>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: theme.colors.text.light, margin: `${theme.spacing[1]} 0 0` }}>
                  Tresca is always at least as conservative as von Mises — its factor of safety is never higher.
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ' = √(σ1² − σ1σ2 + σ2²)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ1 − σ3 = σy / n</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>n = σy / σ'</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Failure Envelope (σ1/σy vs σ2/σy)
            </h3>
            <svg
              width="100%"
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              role="img"
              aria-label="Von Mises ellipse and Tresca hexagon failure envelope with the current design point plotted"
              style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}
            >
              <defs>
                <marker id="failureAxisArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill={theme.colors.text.light} />
                </marker>
              </defs>

              {/* Axes */}
              <line x1={15} y1={originPx} x2={svgSize - 10} y2={originPx} stroke={theme.colors.text.light} strokeWidth="1.5" markerEnd="url(#failureAxisArrow)" />
              <text x={svgSize - 60} y={originPx - 8} fontSize="12" fill={theme.colors.text.secondary}>σ1 / σy</text>
              <line x1={originPx} y1={svgSize - 10} x2={originPx} y2={10} stroke={theme.colors.text.light} strokeWidth="1.5" markerEnd="url(#failureAxisArrow)" />
              <text x={originPx + 8} y={22} fontSize="12" fill={theme.colors.text.secondary}>σ2 / σy</text>

              {/* Von Mises ellipse (fill) */}
              {ellipsePoints && (
                <polygon points={ellipsePoints} fill={theme.colors.lightBlue[100]} fillOpacity={0.55} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
              )}

              {/* Tresca hexagon (inscribed, touches ellipse at vertices) */}
              {hexagonPoints && (
                <polygon points={hexagonPoints} fill="none" stroke={theme.colors.accent[600]} strokeWidth="2" strokeDasharray="6 3" />
              )}

              {/* Origin */}
              <circle cx={originPx} cy={originPx} r="2.5" fill={theme.colors.text.primary} />

              {/* Line from origin to design point */}
              <line x1={originPx} y1={originPx} x2={designPx.x} y2={designPx.y} stroke={designColor} strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Current design point */}
              <circle cx={designPx.x} cy={designPx.y} r="6" fill={designColor} stroke={theme.colors.text.primary} strokeWidth="1" />
              <text x={designPx.x + 10} y={designPx.y - 8} fontSize="12" fontWeight={700} fill={designColor}>
                design point
              </text>

              {/* Legend */}
              <g transform={`translate(16, ${svgSize - 46})`}>
                <line x1="0" y1="0" x2="18" y2="0" stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
                <text x="24" y="4" fontSize="11" fill={theme.colors.text.secondary}>Von Mises ellipse</text>
                <line x1="0" y1="16" x2="18" y2="16" stroke={theme.colors.accent[600]} strokeWidth="3" strokeDasharray="5 2" />
                <text x="24" y="20" fontSize="11" fill={theme.colors.text.secondary}>Tresca hexagon</text>
              </g>
            </svg>
            <p style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
              Inside a curve = safe under that theory, outside = predicted yield. The hexagon sits entirely inside the
              ellipse (they touch only at the six marked vertices), which is exactly why Tresca is never less
              conservative than von Mises.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Stress Summary
            </h3>
            {data && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Applied σx / σy</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>
                    {sigmaX.toFixed(0)} / {sigmaY.toFixed(0)} MPa
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Applied τxy</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{tauXY.toFixed(0)} MPa</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Out-of-plane σ3</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{(data.sigma_3).toFixed(1)} MPa</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Max shear stress τmax</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{data.max_shear_stress.toFixed(2)} MPa</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

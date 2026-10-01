/**
 * Combined Loading & Mohr's Circle - Interactive Topic
 *
 * Students adjust the 2D plane-stress state (σx, σy, τxy) and watch
 * Mohr's circle redraw live — the center, radius, the two principal
 * stresses where the circle crosses the σ-axis, and the principal angle.
 */

import { useState } from 'react'
import { useMohrsCircleSimulation } from '../hooks/useMohrsCircleSimulation'
import { theme, componentStyles } from '../styles/theme'

export default function MohrsCircleAnalysis() {
  const [sigmaX, setSigmaX] = useState(100)
  const [sigmaY, setSigmaY] = useState(-40)
  const [tauXY, setTauXY] = useState(30)

  const { data, loading, error } = useMohrsCircleSimulation({
    sigma_x: sigmaX,
    sigma_y: sigmaY,
    tau_xy: tauXY,
  })

  const sigmaAvg = data?.sigma_avg ?? (sigmaX + sigmaY) / 2
  const radius = data?.radius ?? 0
  const sigma1 = data?.sigma_1 ?? sigmaAvg
  const sigma2 = data?.sigma_2 ?? sigmaAvg
  const thetaP = data?.theta_p_deg ?? 0
  const maxShear = data?.max_shear ?? radius
  const pointX = data?.point_x ?? { sigma: sigmaX, tau: tauXY }
  const pointY = data?.point_y ?? { sigma: sigmaY, tau: -tauXY }

  // --- Mohr's circle geometry (SVG) ---
  // σ plotted left→right, τ plotted with standard Cartesian sign (up = positive),
  // matching the engine's convention: point_x = (σx, τxy), point_y = (σy, −τxy).
  const svgW = 440
  const svgH = 340
  const originPxX = svgW / 2
  const originPxY = svgH / 2

  const halfRange = Math.max(Math.abs(sigma1), Math.abs(sigma2), radius, 20) * 1.35
  const scale = (Math.min(svgW, svgH) / 2 - 55) / halfRange

  const sigmaToX = (s: number) => originPxX + s * scale
  const tauToY = (t: number) => originPxY - t * scale

  const centerPx = { x: sigmaToX(sigmaAvg), y: tauToY(0) }
  const radiusPx = radius * scale
  const pointXPx = { x: sigmaToX(pointX.sigma), y: tauToY(pointX.tau) }
  const pointYPx = { x: sigmaToX(pointY.sigma), y: tauToY(pointY.tau) }
  const sigma1Px = { x: sigmaToX(sigma1), y: tauToY(0) }
  const sigma2Px = { x: sigmaToX(sigma2), y: tauToY(0) }
  const topPx = { x: sigmaToX(sigmaAvg), y: tauToY(radius) }

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
                min="-200"
                max="200"
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
                min="-200"
                max="200"
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
                min="-150"
                max="150"
                step="5"
                value={tauXY}
                onChange={(e) => setTauXY(parseFloat(e.target.value))}
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
                  <span>Average stress (σ_avg)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{sigmaAvg.toFixed(2)} MPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Circle radius (R = τ_max)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{maxShear.toFixed(2)} MPa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Principal angle (θ_p)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{thetaP.toFixed(2)}°</span>
                </div>
                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: theme.colors.gray[900],
                    borderRadius: '6px',
                    color: theme.colors.bg.primary,
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <span>σ_1 = {sigma1.toFixed(1)} MPa</span>
                  <span>σ_2 = {sigma2.toFixed(1)} MPa</span>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ_avg = (σx + σy) / 2</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>R = √[((σx − σy)/2)² + τxy²]</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ_1,2 = σ_avg ± R</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>θ_p = ½ atan2(2τxy, σx − σy)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Mohr's Circle
            </h3>
            <svg
              width="100%"
              height="340"
              viewBox={`0 0 ${svgW} ${svgH}`}
              style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}
            >
              <defs>
                <marker id="mohrsAxisArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L7,3 z" fill={theme.colors.text.light} />
                </marker>
              </defs>

              {/* Axes */}
              <line x1={20} y1={originPxY} x2={svgW - 15} y2={originPxY} stroke={theme.colors.text.light} strokeWidth="1.5" markerEnd="url(#mohrsAxisArrow)" />
              <text x={svgW - 30} y={originPxY - 8} fontSize="12" fill={theme.colors.text.secondary}>σ (MPa)</text>
              <line x1={originPxX} y1={svgH - 15} x2={originPxX} y2={15} stroke={theme.colors.text.light} strokeWidth="1.5" markerEnd="url(#mohrsAxisArrow)" />
              <text x={originPxX + 8} y={22} fontSize="12" fill={theme.colors.text.secondary}>τ (MPa)</text>

              {/* The circle itself */}
              <circle cx={centerPx.x} cy={centerPx.y} r={Math.max(radiusPx, 0)} fill={theme.colors.lightBlue[100]} fillOpacity={0.4} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />

              {/* Diametral line through the two physical stress points */}
              <line x1={pointXPx.x} y1={pointXPx.y} x2={pointYPx.x} y2={pointYPx.y} stroke={theme.colors.text.light} strokeWidth="1.5" strokeDasharray="4 3" />

              {/* Center of circle */}
              <circle cx={centerPx.x} cy={centerPx.y} r="3" fill={theme.colors.text.primary} />

              {/* Max shear point (top of circle) */}
              <circle cx={topPx.x} cy={topPx.y} r="4" fill={theme.colors.gray[600]} />
              <text x={topPx.x + 8} y={topPx.y + 4} fontSize="11" fill={theme.colors.gray[700]}>τ_max</text>

              {/* Principal stress points */}
              <circle cx={sigma1Px.x} cy={sigma1Px.y} r="5" fill={theme.colors.accent[600]} />
              <text x={sigma1Px.x} y={sigma1Px.y - 12} textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>
                σ_1 = {sigma1.toFixed(1)}
              </text>
              <circle cx={sigma2Px.x} cy={sigma2Px.y} r="5" fill={theme.colors.accent[600]} />
              <text x={sigma2Px.x} y={sigma2Px.y - 12} textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>
                σ_2 = {sigma2.toFixed(1)}
              </text>

              {/* Current stress-state points (X and Y faces) */}
              <circle cx={pointXPx.x} cy={pointXPx.y} r="5" fill={theme.colors.lightBlue[600]} />
              <text x={pointXPx.x + 8} y={pointXPx.y - 8} fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>
                X (σx, τxy)
              </text>
              <circle cx={pointYPx.x} cy={pointYPx.y} r="5" fill={theme.colors.lightBlue[600]} />
              <text x={pointYPx.x + 8} y={pointYPx.y + 16} fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>
                Y (σy, −τxy)
              </text>
            </svg>
            <p style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
              Blue dots are the current stress state on the x- and y-faces; orange dots are the principal stresses where the
              circle crosses the τ = 0 axis.
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
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Max shear stress</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{maxShear.toFixed(2)} MPa</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>Principal plane angle</div>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{thetaP.toFixed(2)}°</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

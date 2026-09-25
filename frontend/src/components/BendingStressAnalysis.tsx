/**
 * Bending Stress in Beams - Interactive Topic
 *
 * Students adjust the applied bending moment and rectangular section
 * dimensions to see the resulting linear through-thickness stress
 * distribution update live.
 */

import { useState } from 'react'
import { useBendingStressSimulation } from '../hooks/useBendingStressSimulation'
import { theme, componentStyles } from '../styles/theme'

export default function BendingStressAnalysis() {
  const [moment, setMoment] = useState(10000)
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(200)

  const { data, loading, error } = useBendingStressSimulation({ moment, width, height })

  const secondMoment = data?.second_moment ?? 0
  const c = data?.c ?? 0
  const maxStress = data?.max_bending_stress ?? 0
  const distribution = data?.distribution ?? []

  // Cross-section drawing geometry (px)
  const sectionW = 140
  const sectionH = 220
  const sectionX = 130
  const sectionY = 40

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              Loading &amp; Section
            </h3>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Bending Moment M</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{moment.toFixed(0)} N·m</span>
              </label>
              <input
                type="range"
                min="100"
                max="30000"
                step="100"
                value={moment}
                onChange={(e) => setMoment(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Section Width b</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{width.toFixed(0)} mm</span>
              </label>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Section Height h</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{height.toFixed(0)} mm</span>
              </label>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
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
                  <span>Second moment of area (I)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    {(secondMoment / 1e6).toFixed(3)} × 10⁶ mm⁴
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Distance to outer fiber (c)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{c.toFixed(1)} mm</span>
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
                  }}
                >
                  σ_max = {maxStress.toFixed(2)} MPa
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ = M y / I</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>I = b h³ / 12</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>σ_max = M c / I</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Through-Thickness Stress σ(y)
            </h3>
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <defs>
                <linearGradient id="bendingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={theme.colors.lightBlue[500]} />
                  <stop offset="50%" stopColor={theme.colors.bg.primary} />
                  <stop offset="100%" stopColor={theme.colors.accent[500]} />
                </linearGradient>
              </defs>

              <rect x={sectionX} y={sectionY} width={sectionW} height={sectionH} fill="url(#bendingGradient)" stroke={theme.colors.text.primary} strokeWidth="2" />

              {/* Neutral axis */}
              <line
                x1={sectionX - 20}
                y1={sectionY + sectionH / 2}
                x2={sectionX + sectionW + 60}
                y2={sectionY + sectionH / 2}
                stroke={theme.colors.text.primary}
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x={sectionX + sectionW + 65} y={sectionY + sectionH / 2 + 4} fontSize="12" fill={theme.colors.text.secondary}>
                neutral axis
              </text>

              {/* Compression / tension labels */}
              <text x={sectionX + sectionW / 2} y={sectionY - 10} textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>
                compression
              </text>
              <text x={sectionX + sectionW / 2} y={sectionY + sectionH + 20} textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>
                tension
              </text>

              <text x={sectionX + sectionW + 10} y={sectionY + 8} fontSize="12" fill={theme.colors.lightBlue[600]}>
                +σ_max = {maxStress.toFixed(1)} MPa
              </text>
              <text x={sectionX + sectionW + 10} y={sectionY + sectionH} fontSize="12" fill={theme.colors.accent[600]}>
                −σ_max = {maxStress.toFixed(1)} MPa
              </text>

              {/* Stress profile curve, plotted alongside the section */}
              {distribution.length > 1 && (
                <polyline
                  points={distribution
                    .map((pt) => {
                      const frac = c > 0 ? pt.y_mm / c : 0 // -1 (bottom) .. +1 (top)
                      const x = 60 + frac * 45
                      const y = sectionY + sectionH / 2 - frac * (sectionH / 2)
                      return `${x},${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke={theme.colors.text.primary}
                  strokeWidth="2"
                />
              )}
              <line x1="60" y1={sectionY} x2="60" y2={sectionY + sectionH} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="2 3" />
              <text x="20" y={sectionY + sectionH / 2 + 4} fontSize="10" fill={theme.colors.text.light}>σ=0</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

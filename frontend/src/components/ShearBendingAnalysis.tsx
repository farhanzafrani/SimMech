/**
 * Shear Force & Bending Moment Diagrams - Interactive Topic
 *
 * Students choose a point load or a uniformly distributed load on a simply
 * supported beam and watch the shear-force and bending-moment diagrams
 * build live.
 */

import { useState } from 'react'
import { useShearBendingSimulation } from '../hooks/useShearBendingSimulation'
import { theme, componentStyles } from '../styles/theme'

const PLOT_LEFT = 40
const PLOT_RIGHT = 380
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT

export default function ShearBendingAnalysis() {
  const [loadType, setLoadType] = useState<'point' | 'udl'>('point')
  const [length, setLength] = useState(4)
  const [magnitude, setMagnitude] = useState(1000)
  const [positionFrac, setPositionFrac] = useState(0.5)

  const { data, loading, error } = useShearBendingSimulation({
    length,
    load_type: loadType,
    magnitude,
    position_frac: positionFrac,
  })

  const distribution = data?.distribution ?? []
  const vMax = data?.v_max ?? 1
  const mMax = data?.m_max ?? 1

  const xToPx = (x: number) => PLOT_LEFT + (x / length) * PLOT_WIDTH
  const shearToPx = (v: number) => 75 - (v / (vMax || 1)) * 55
  const momentToPx = (m: number) => 20 + (m / (mMax || 1)) * 100

  const loadX = xToPx(positionFrac * length)
  const mMaxX = data ? xToPx(data.m_max_location) : null

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Load Type
            </h3>
            <div style={{ display: 'flex', gap: theme.spacing[2] }}>
              <button
                onClick={() => setLoadType('point')}
                className={loadType === 'point' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ flex: 1 }}
              >
                Point Load
              </button>
              <button
                onClick={() => setLoadType('udl')}
                className={loadType === 'udl' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ flex: 1 }}
              >
                Distributed (UDL)
              </button>
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Span L</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{length.toFixed(1)} m</span>
              </label>
              <input type="range" min="2" max="10" step="0.5" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>{loadType === 'point' ? 'Load P' : 'Intensity w'}</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>
                  {magnitude.toFixed(0)} {loadType === 'point' ? 'N' : 'N/m'}
                </span>
              </label>
              <input
                type="range"
                min={loadType === 'point' ? 100 : 50}
                max={loadType === 'point' ? 5000 : 2000}
                step="10"
                value={magnitude}
                onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            {loadType === 'point' && (
              <div>
                <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Load position</span>
                  <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{(positionFrac * 100).toFixed(0)}% of L</span>
                </label>
                <input type="range" min="0.05" max="0.95" step="0.01" value={positionFrac} onChange={(e) => setPositionFrac(parseFloat(e.target.value))} className="slider" disabled={loading} />
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
                  <span>Reaction R_A / R_B</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    {data.reaction_a.toFixed(0)} / {data.reaction_b.toFixed(0)} N
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>V_max</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>
                    {data.v_max.toFixed(0)} N at x={data.v_max_location.toFixed(2)} m
                  </span>
                </div>
                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: theme.colors.accent[600],
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  M_max = {data.m_max.toFixed(0)} N·m at x = {data.m_max_location.toFixed(2)} m
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>dV/dx = −w(x)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>dM/dx = V(x)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>ΔV = −P (at a point load)</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Diagrams */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Loading Diagram
            </h3>
            <svg width="100%" height="120" viewBox="0 0 420 120" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <line x1={PLOT_LEFT} y1="60" x2={PLOT_RIGHT} y2="60" stroke={theme.colors.gray[400]} strokeWidth="4" />
              <path d={`M ${PLOT_LEFT} 60 L ${PLOT_LEFT - 10} 78 L ${PLOT_LEFT + 10} 78 Z`} fill="none" stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <path d={`M ${PLOT_RIGHT} 60 L ${PLOT_RIGHT - 10} 78 L ${PLOT_RIGHT + 10} 78 Z`} fill="none" stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <circle cx={PLOT_RIGHT - 10} cy="82" r="3" stroke={theme.colors.text.primary} fill="none" />
              <circle cx={PLOT_RIGHT + 10} cy="82" r="3" stroke={theme.colors.text.primary} fill="none" />

              {loadType === 'point' ? (
                <>
                  <line x1={loadX} y1="15" x2={loadX} y2="55" stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#sbLoadArrow)" />
                  <text x={loadX} y="10" textAnchor="middle" fontSize="12" fill={theme.colors.accent[600]}>P</text>
                </>
              ) : (
                <>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const x = PLOT_LEFT + (PLOT_WIDTH * i) / 9
                    return <line key={i} x1={x} y1="25" x2={x} y2="55" stroke={theme.colors.accent[600]} strokeWidth="2" markerEnd="url(#sbLoadArrow)" />
                  })}
                  <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="18" textAnchor="middle" fontSize="12" fill={theme.colors.accent[600]}>w</text>
                </>
              )}

              <defs>
                <marker id="sbLoadArrow" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
                  <path d="M0,0 L4,6 L8,0 z" fill={theme.colors.accent[600]} />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Shear Force Diagram V(x)
            </h3>
            <svg width="100%" height="150" viewBox="0 0 420 150" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <line x1={PLOT_LEFT} y1="75" x2={PLOT_RIGHT} y2="75" stroke={theme.colors.gray[400]} strokeWidth="1.5" />
              {distribution.length > 1 && (
                <polygon
                  points={[
                    `${PLOT_LEFT},75`,
                    ...distribution.map((pt) => `${xToPx(pt.x)},${shearToPx(pt.shear)}`),
                    `${PLOT_RIGHT},75`,
                  ].join(' ')}
                  fill={theme.colors.lightBlue[500]}
                  fillOpacity="0.2"
                  stroke={theme.colors.lightBlue[600]}
                  strokeWidth="2"
                />
              )}
              {mMaxX !== null && (
                <line x1={mMaxX} y1="15" x2={mMaxX} y2="105" stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="3 3" />
              )}
              <text x={PLOT_LEFT} y="95" fontSize="10" fill={theme.colors.text.light}>0</text>
              <text x={PLOT_RIGHT} y="95" textAnchor="end" fontSize="10" fill={theme.colors.text.light}>L</text>
              {mMaxX !== null && (
                <text x={mMaxX} y="112" textAnchor="middle" fontSize="10" fill={theme.colors.accent[600]}>V=0</text>
              )}
            </svg>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Bending Moment Diagram M(x)
            </h3>
            <svg width="100%" height="150" viewBox="0 0 420 150" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <line x1={PLOT_LEFT} y1="20" x2={PLOT_LEFT} y2="130" stroke={theme.colors.gray[300]} strokeWidth="1" strokeDasharray="3 3" />
              <line x1={PLOT_LEFT} y1="20" x2={PLOT_RIGHT} y2="20" stroke={theme.colors.gray[400]} strokeWidth="1.5" />
              {distribution.length > 1 && (
                <polygon
                  points={[
                    `${PLOT_LEFT},20`,
                    ...distribution.map((pt) => `${xToPx(pt.x)},${momentToPx(pt.moment)}`),
                    `${PLOT_RIGHT},20`,
                  ].join(' ')}
                  fill={theme.colors.accent[500]}
                  fillOpacity="0.2"
                  stroke={theme.colors.accent[600]}
                  strokeWidth="2"
                />
              )}
              {mMaxX !== null && data && (
                <>
                  <line x1={mMaxX} y1="20" x2={mMaxX} y2={momentToPx(data.m_max)} stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx={mMaxX} cy={momentToPx(data.m_max)} r="3" fill={theme.colors.accent[600]} />
                  <text x={mMaxX} y={momentToPx(data.m_max) + 14} textAnchor="middle" fontSize="10" fontWeight={700} fill={theme.colors.accent[600]}>M_max</text>
                </>
              )}
              <text x={PLOT_LEFT} y="140" fontSize="10" fill={theme.colors.text.light}>0</text>
              <text x={PLOT_RIGHT} y="140" textAnchor="end" fontSize="10" fill={theme.colors.text.light}>L</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

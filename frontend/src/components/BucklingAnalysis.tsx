/**
 * Columns & Buckling - Interactive Topic
 *
 * Students adjust column length, cross-section, end conditions, and
 * applied load to see the Euler critical load and buckled mode shape
 * update live.
 */

import { useState } from 'react'
import { useBucklingSimulation } from '../hooks/useBucklingSimulation'
import { theme, componentStyles } from '../styles/theme'

const MATERIALS = {
  steel: { E: 200000 },
  aluminum: { E: 70000 },
}

const END_CONDITIONS: Array<{ key: string; label: string }> = [
  { key: 'pinned-pinned', label: 'Pinned-Pinned' },
  { key: 'fixed-free', label: 'Fixed-Free' },
  { key: 'fixed-pinned', label: 'Fixed-Pinned' },
  { key: 'fixed-fixed', label: 'Fixed-Fixed' },
]

export default function BucklingAnalysis() {
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('steel')
  const [customMode, setCustomMode] = useState(false)
  const [E, setE] = useState(MATERIALS.steel.E)
  const [endCondition, setEndCondition] = useState('pinned-pinned')
  const [length, setLength] = useState(3.0)
  const [width, setWidth] = useState(50)
  const [height, setHeight] = useState(30)
  const [appliedLoad, setAppliedLoad] = useState(10)

  const handleMaterialSelect = (mat: keyof typeof MATERIALS) => {
    setMaterial(mat)
    setCustomMode(false)
    setE(MATERIALS[mat].E)
  }

  const { data, loading, error } = useBucklingSimulation({
    length,
    end_condition: endCondition,
    youngs_modulus: E,
    width,
    height,
    applied_load: appliedLoad,
  })

  const criticalLoad = data?.critical_load ?? 0
  const safetyFactor = data?.safety_factor ?? 0
  const modeShape = data?.mode_shape ?? []
  const passes = safetyFactor >= 1.5
  const statusColor = passes ? theme.colors.success : theme.colors.error

  // How close the applied load is to the critical load, capped for the visual.
  const loadRatio = criticalLoad > 0 ? appliedLoad / criticalLoad : 0
  const bowAmplitudePx = Math.min(loadRatio, 1.3) * 70
  const columnColor = loadRatio >= 1 ? theme.colors.error : loadRatio >= 0.75 ? theme.colors.warning : theme.colors.text.primary

  const columnTopY = 40
  const columnBottomY = 280
  const columnX = 150

  const bowedPoints = modeShape.map((pt, i) => {
    const t = modeShape.length > 1 ? i / (modeShape.length - 1) : 0
    const y = columnTopY + t * (columnBottomY - columnTopY)
    const x = columnX + pt.y * bowAmplitudePx
    return `${x},${y}`
  })

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
              {(Object.keys(MATERIALS) as Array<keyof typeof MATERIALS>).map((mat) => (
                <button
                  key={mat}
                  onClick={() => handleMaterialSelect(mat)}
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
              style={{ width: '100%', marginBottom: theme.spacing[2] }}
            >
              Custom
            </button>
            {customMode ? (
              <input type="number" value={E} onChange={(e) => setE(parseFloat(e.target.value))} className="input" />
            ) : (
              <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
                E = {E.toLocaleString()} MPa
              </div>
            )}
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              End Condition
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2] }}>
              {END_CONDITIONS.map((ec) => (
                <button
                  key={ec.key}
                  onClick={() => setEndCondition(ec.key)}
                  className={endCondition === ec.key ? 'btn btn-primary' : 'btn btn-secondary'}
                >
                  {ec.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Column Length L</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{length.toFixed(2)} m</span>
              </label>
              <input type="range" min="0.5" max="6" step="0.1" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Section Width</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{width.toFixed(0)} mm</span>
              </label>
              <input type="range" min="10" max="150" step="1" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Section Height</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{height.toFixed(0)} mm</span>
              </label>
              <input type="range" min="10" max="150" step="1" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Applied Load P</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{appliedLoad.toFixed(1)} kN</span>
              </label>
              <input type="range" min="0.5" max="100" step="0.5" value={appliedLoad} onChange={(e) => setAppliedLoad(parseFloat(e.target.value))} className="slider" disabled={loading} />
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
                  <span>Second moment (I)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.moment_of_inertia.toFixed(0)} mm⁴</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Radius of gyration (r)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.radius_of_gyration.toFixed(2)} mm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Slenderness ratio (λ)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.slenderness_ratio.toFixed(1)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Critical load (P_cr)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{criticalLoad.toFixed(2)} kN</span>
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
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>P_cr = π² E I / (K L)²</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>r = √(I / A)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>λ = K L / r</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Buckled Shape
            </h3>
            <svg width="100%" height="340" viewBox="0 0 300 340" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {/* Ground/base */}
              <line x1="100" y1={columnBottomY + 10} x2="200" y2={columnBottomY + 10} stroke={theme.colors.text.primary} strokeWidth="4" />

              {/* Load arrow */}
              <line x1={columnX} y1="10" x2={columnX} y2={columnTopY - 4} stroke={theme.colors.accent[500]} strokeWidth="3" />
              <path d={`M ${columnX - 6} ${columnTopY - 4} L ${columnX} ${columnTopY + 6} L ${columnX + 6} ${columnTopY - 4} Z`} fill={theme.colors.accent[500]} />
              <text x={columnX + 12} y="20" fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>P</text>

              {bowedPoints.length > 1 ? (
                <polyline points={bowedPoints.join(' ')} fill="none" stroke={columnColor} strokeWidth="8" strokeLinecap="round" />
              ) : (
                <line x1={columnX} y1={columnTopY} x2={columnX} y2={columnBottomY} stroke={columnColor} strokeWidth="8" strokeLinecap="round" />
              )}

              {loadRatio >= 1 && (
                <text x="150" y="330" textAnchor="middle" fontSize="14" fontWeight={700} fill={theme.colors.error}>BUCKLED</text>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

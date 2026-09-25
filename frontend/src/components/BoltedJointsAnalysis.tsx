/**
 * Bolted Joint Design & Preload - Interactive Topic
 *
 * Students adjust bolt stiffness, clamped-member stiffness, bolt proof
 * load, and the external tensile load to see how the joint stiffness
 * constant C splits that load between the bolt and the clamped members —
 * and where the joint separates.
 */

import { useState } from 'react'
import { useBoltedJointsSimulation } from '../hooks/useBoltedJointsSimulation'
import { theme, componentStyles } from '../styles/theme'

export default function BoltedJointsAnalysis() {
  const [boltStiffness, setBoltStiffness] = useState(500)
  const [memberStiffness, setMemberStiffness] = useState(2000)
  const [proofLoad, setProofLoad] = useState(20000)
  const [externalLoad, setExternalLoad] = useState(5000)

  const { data, loading, error } = useBoltedJointsSimulation({
    bolt_stiffness: boltStiffness,
    member_stiffness: memberStiffness,
    proof_load: proofLoad,
    external_load: externalLoad,
  })

  const jointConstant = data?.joint_constant ?? 0
  const preload = data?.preload ?? 0
  const boltLoad = data?.bolt_load ?? 0
  const memberLoad = data?.member_load ?? 0
  const isSeparated = data?.is_separated ?? false
  const safetyFactorYield = data?.safety_factor_yield ?? 0
  const separationLoad = data?.separation_load ?? 0
  const safetyFactorSeparation = data?.safety_factor_separation ?? 0
  const points = data?.points ?? []

  const yieldPasses = safetyFactorYield >= 1.5
  const jointStatusColor = isSeparated ? theme.colors.error : theme.colors.success
  const yieldStatusColor = yieldPasses ? theme.colors.success : theme.colors.error

  // ---- Chart geometry: F_b(P) and F_m(P) vs P ----
  const chartWidth = 400
  const chartHeight = 260
  const marginLeft = 56
  const marginRight = 16
  const marginTop = 16
  const marginBottom = 34
  const plotWidth = chartWidth - marginLeft - marginRight
  const plotHeight = chartHeight - marginTop - marginBottom

  const xMax = points.length > 0 ? points[points.length - 1].p : 1
  const yValues = points.length > 0
    ? points.flatMap((pt) => [pt.bolt_load, pt.member_load])
    : [0, preload]
  const yMax = Math.max(...yValues, preload, 1) * 1.05
  const yMin = Math.min(...yValues, 0) * 1.05

  const xScale = (p: number) => marginLeft + (xMax > 0 ? (p / xMax) * plotWidth : 0)
  const yScale = (v: number) =>
    marginTop + plotHeight - ((v - yMin) / (yMax - yMin || 1)) * plotHeight

  const boltLinePoints = points.map((pt) => `${xScale(pt.p)},${yScale(pt.bolt_load)}`).join(' ')
  const memberLinePoints = points.map((pt) => `${xScale(pt.p)},${yScale(pt.member_load)}`).join(' ')

  const zeroY = yScale(0)
  const operatingX = xScale(externalLoad)
  const separationX = separationLoad <= xMax ? xScale(separationLoad) : null

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              Joint Parameters
            </h3>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Bolt Stiffness k_b</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{boltStiffness.toFixed(0)} N/mm</span>
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={boltStiffness}
                onChange={(e) => setBoltStiffness(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Member Stiffness k_m</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{memberStiffness.toFixed(0)} N/mm</span>
              </label>
              <input
                type="range"
                min="500"
                max="20000"
                step="100"
                value={memberStiffness}
                onChange={(e) => setMemberStiffness(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Bolt Proof Load F_p</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{proofLoad.toFixed(0)} N</span>
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="500"
                value={proofLoad}
                onChange={(e) => setProofLoad(parseFloat(e.target.value))}
                className="slider"
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>External Load P</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{externalLoad.toFixed(0)} N</span>
              </label>
              <input
                type="range"
                min="0"
                max="50000"
                step="100"
                value={externalLoad}
                onChange={(e) => setExternalLoad(parseFloat(e.target.value))}
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
                  <span>Joint constant (C)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{jointConstant.toFixed(3)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Preload (F_i)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{preload.toFixed(0)} N</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Bolt load (F_b)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, color: theme.colors.accent[600] }}>{boltLoad.toFixed(0)} N</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Member load (F_m)</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono, color: theme.colors.lightBlue[600] }}>{memberLoad.toFixed(0)} N</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Separation load</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{separationLoad.toFixed(0)} N</span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: jointStatusColor,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  {isSeparated ? `SEPARATED — F_m ≤ 0` : `CLAMPED — F_m > 0`}
                </div>
                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: yieldStatusColor,
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  Yield safety factor {safetyFactorYield.toFixed(2)} — {yieldPasses ? 'PASSES' : 'FAILS'} (need ≥ 1.5)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: theme.spacing[1] }}>
                  <span>Separation safety factor</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{safetyFactorSeparation.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>C = k_b / (k_b + k_m)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>F_i = 0.75 F_p</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>F_b = F_i + C·P</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>F_m = F_i − (1−C)·P</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Bolt &amp; Member Load vs External Load
            </h3>
            <svg
              width="100%"
              height="320"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}
            >
              {/* Axes */}
              <line x1={marginLeft} y1={marginTop} x2={marginLeft} y2={marginTop + plotHeight} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <line x1={marginLeft} y1={zeroY} x2={marginLeft + plotWidth} y2={zeroY} stroke={theme.colors.text.primary} strokeWidth="1.5" />

              {/* Y axis labels */}
              <text x={marginLeft - 6} y={marginTop + 4} textAnchor="end" fontSize="10" fill={theme.colors.text.light}>{yMax.toFixed(0)}</text>
              <text x={marginLeft - 6} y={zeroY + 4} textAnchor="end" fontSize="10" fill={theme.colors.text.light}>0</text>

              {/* Separation load marker */}
              {separationX !== null && (
                <>
                  <line x1={separationX} y1={marginTop} x2={separationX} y2={marginTop + plotHeight} stroke={theme.colors.warning} strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x={separationX} y={marginTop + plotHeight + 14} textAnchor="middle" fontSize="9" fill={theme.colors.warning}>separation</text>
                </>
              )}

              {/* Operating point marker */}
              <line x1={operatingX} y1={marginTop} x2={operatingX} y2={marginTop + plotHeight} stroke={theme.colors.text.light} strokeWidth="1" strokeDasharray="2 3" />

              {/* F_b and F_m lines */}
              {points.length > 1 && (
                <>
                  <polyline points={boltLinePoints} fill="none" stroke={theme.colors.accent[500]} strokeWidth="2.5" />
                  <polyline points={memberLinePoints} fill="none" stroke={theme.colors.lightBlue[500]} strokeWidth="2.5" />
                </>
              )}

              {/* Current operating points */}
              <circle cx={operatingX} cy={yScale(boltLoad)} r="4.5" fill={theme.colors.accent[500]} stroke={theme.colors.bg.primary} strokeWidth="1.5" />
              <circle cx={operatingX} cy={yScale(memberLoad)} r="4.5" fill={theme.colors.lightBlue[500]} stroke={theme.colors.bg.primary} strokeWidth="1.5" />

              {/* X axis label */}
              <text x={marginLeft + plotWidth / 2} y={chartHeight - 6} textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>External load P (N)</text>

              {/* Legend */}
              <rect x={marginLeft + 4} y={marginTop + 2} width="10" height="10" fill={theme.colors.accent[500]} />
              <text x={marginLeft + 18} y={marginTop + 11} fontSize="10" fill={theme.colors.text.secondary}>F_b (bolt)</text>
              <rect x={marginLeft + 90} y={marginTop + 2} width="10" height="10" fill={theme.colors.lightBlue[500]} />
              <text x={marginLeft + 104} y={marginTop + 11} fontSize="10" fill={theme.colors.text.secondary}>F_m (member)</text>
            </svg>
            <p style={{ marginTop: theme.spacing[2], fontSize: '12px', color: theme.colors.text.light }}>
              F_b rises from F_i with slope C; F_m falls from F_i with slope −(1−C) and reaches zero at the separation load.
              The dashed vertical line marks the current operating point.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

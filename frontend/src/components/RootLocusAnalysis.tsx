/**
 * Root Locus & Stability (Routh-Hurwitz) - Interactive Topic
 *
 * Students sweep the loop gain K of L(s) = K / (s(s+a)(s+b)) and watch the
 * closed-loop poles travel along the root locus, cross the imaginary axis at
 * K_crit, and match the sign changes in the Routh array.
 */

import { useState } from 'react'
import { useDynamicsControlsSimulation } from '../hooks/useDynamicsControlsSimulation'
import { theme } from '../styles/theme'
import { Panel, SliderRow, ResultRow, StatusPill, EquationList, LoadingAndError } from './DynCtrlWidgets'

interface Pt {
  re: number
  im: number
}

interface RootLocusData {
  pole_a: number
  pole_b: number
  gain: number
  closed_loop_poles: Pt[]
  routh_array: { power: number; row: number[] }[]
  sign_changes: number
  rhp_poles: number
  critical_gain: number
  crossing_frequency: number
  breakaway_point: number | null
  breakaway_gain: number | null
  asymptote_centroid: number
  asymptote_angles_deg: number[]
  status: string
  dominant_damping_ratio: number | null
  dominant_wn: number
  locus_gains: number[]
  locus_branches: Pt[][]
}

const STATUS_COLORS: Record<string, string> = {
  stable: theme.colors.success,
  marginal: theme.colors.warning,
  unstable: theme.colors.error,
}

const BRANCH_COLORS = [theme.colors.lightBlue[500], theme.colors.spectrum.violet, theme.colors.spectrum.coral]

export default function RootLocusAnalysis() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(2)
  const [gain, setGain] = useState(2)

  const { data, loading, error } = useDynamicsControlsSimulation<RootLocusData, object>('/api/root-locus-stability/compute', {
    pole_a: a,
    pole_b: b,
    gain,
  })

  // --- s-plane geometry (equal axis scaling) ---
  const W = 560
  const H = 320
  let xMin = -(a + b) - 1
  let xMax = 1
  let yMax = 2
  if (data) {
    const all = data.locus_branches.flat()
    xMin = Math.min(-(Math.max(a, b)) - 0.5, ...all.map((p) => p.re)) - 0.3
    xMax = Math.max(0.5, ...all.map((p) => p.re)) + 0.3
    yMax = Math.max(1, ...all.map((p) => Math.abs(p.im))) * 1.1
  }
  const scale = Math.min((W - 40) / (xMax - xMin), (H - 30) / (2 * yMax))
  const x0 = 20 + (W - 40 - scale * (xMax - xMin)) / 2
  const sx = (re: number) => x0 + (re - xMin) * scale
  const sy = (im: number) => H / 2 - im * scale

  const statusColor = data ? STATUS_COLORS[data.status] ?? theme.colors.info : theme.colors.info
  const kMax = 3 * (data?.critical_gain ?? a * b * (a + b))

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700 }}>L(s) = K / ( s (s + a)(s + b) )</h3>
            <SliderRow label="Pole at −a" valueText={`a = ${a.toFixed(1)}`} min={0.5} max={5} step={0.1} value={a} onChange={setA} disabled={loading} />
            <SliderRow label="Pole at −b" valueText={`b = ${b.toFixed(1)}`} min={0.5} max={5} step={0.1} value={b} onChange={setB} disabled={loading} />
            <SliderRow label="Loop gain K" valueText={gain.toFixed(2)} min={0} max={kMax} step={kMax / 300} value={Math.min(gain, kMax)} onChange={setGain} disabled={loading} />
          </div>

          <Panel title="Results">
            <LoadingAndError loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Critical gain K_crit = ab(a+b)" value={data.critical_gain.toFixed(3)} />
                <ResultRow label="jω crossing at K_crit" value={`±${data.crossing_frequency.toFixed(3)} rad/s`} />
                <ResultRow label="Breakaway point" value={data.breakaway_point !== null ? `s = ${data.breakaway_point.toFixed(3)}` : '—'} />
                <ResultRow label="Asymptote centroid" value={`σ = ${data.asymptote_centroid.toFixed(3)}`} />
                <ResultRow label="Poles in RHP" value={`${data.rhp_poles}`} />
                <ResultRow label="Routh sign changes" value={`${data.sign_changes}`} />
                <ResultRow label="Dominant-pole ζ" value={data.dominant_damping_ratio !== null ? data.dominant_damping_ratio.toFixed(3) : '—'} last />
                <StatusPill color={statusColor}>
                  {data.status === 'stable' ? `STABLE: K < ${data.critical_gain.toFixed(2)}` : data.status === 'marginal' ? 'MARGINALLY STABLE (poles on jω axis)' : `UNSTABLE: K > ${data.critical_gain.toFixed(2)}`}
                </StatusPill>
              </div>
            )}
          </Panel>

          <Panel title="Routh Array" marginBottom={false}>
            {data && (
              <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', display: 'grid', gap: theme.spacing[1] }}>
                {data.routh_array.map((r, i) => {
                  const first = r.row[0]
                  const firstColor = first < 0 ? theme.colors.error : theme.colors.text.primary
                  return (
                    <div key={r.power} style={{ display: 'flex', gap: theme.spacing[3] }}>
                      <span style={{ width: '32px', color: theme.colors.text.light }}>s^{r.power}</span>
                      <span style={{ width: '90px', fontWeight: 700, color: firstColor }}>{first.toFixed(3)}</span>
                      <span style={{ color: theme.colors.text.secondary }}>{i < 3 ? r.row[1].toFixed(3) : ''}</span>
                    </div>
                  )
                })}
                <p style={{ fontFamily: theme.typography.fontFamily.base, color: theme.colors.text.secondary, fontSize: '12px', marginTop: theme.spacing[2] }}>
                  Each sign change in the first column is one closed-loop pole in the right half-plane.
                </p>
              </div>
            )}
          </Panel>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <Panel title="Root Locus (s-plane)" marginBottom={false}>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Root locus plot in the s-plane" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {/* unstable half-plane */}
              <rect x={sx(0)} y="0" width={Math.max(0, W - sx(0))} height={H} fill={theme.colors.error} fillOpacity="0.07" />
              <line x1="0" y1={sy(0)} x2={W} y2={sy(0)} stroke={theme.colors.gray[400]} strokeWidth="1" />
              <line x1={sx(0)} y1="0" x2={sx(0)} y2={H} stroke={theme.colors.gray[600]} strokeWidth="1.5" />
              <text x={W - 6} y={sy(0) - 6} fontSize="10" textAnchor="end" fill={theme.colors.text.light}>Re</text>
              <text x={sx(0) + 5} y="12" fontSize="10" fill={theme.colors.text.light}>jω</text>

              {data && (
                <>
                  {/* asymptotes from the centroid (60°, 180°, 300°) */}
                  {data.asymptote_angles_deg.map((ang) => {
                    const rad = (ang * Math.PI) / 180
                    const len = Math.max(xMax - xMin, yMax) * 1.5
                    return (
                      <line
                        key={ang}
                        x1={sx(data.asymptote_centroid)}
                        y1={sy(0)}
                        x2={sx(data.asymptote_centroid + len * Math.cos(rad))}
                        y2={sy(len * Math.sin(rad))}
                        stroke={theme.colors.gray[400]}
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    )
                  })}

                  {/* locus branches */}
                  {data.locus_branches.map((br, i) => (
                    <path key={i} d={br.map((p, j) => `${j === 0 ? 'M' : 'L'} ${sx(p.re).toFixed(1)} ${sy(p.im).toFixed(1)}`).join(' ')} fill="none" stroke={BRANCH_COLORS[i]} strokeWidth="2" strokeOpacity="0.85" />
                  ))}

                  {/* breakaway */}
                  {data.breakaway_point !== null && (
                    <g>
                      <circle cx={sx(data.breakaway_point)} cy={sy(0)} r="4" fill="white" stroke={theme.colors.text.primary} strokeWidth="1.5" />
                      <text x={sx(data.breakaway_point)} y={sy(0) + 16} fontSize="10" textAnchor="middle" fill={theme.colors.text.secondary}>breakaway</text>
                    </g>
                  )}

                  {/* jω crossing points at K_crit */}
                  {[data.crossing_frequency, -data.crossing_frequency].map((w) => (
                    <circle key={w} cx={sx(0)} cy={sy(w)} r="4" fill="white" stroke={theme.colors.error} strokeWidth="2" />
                  ))}

                  {/* open-loop poles: x at 0, -a, -b */}
                  {[0, -a, -b].map((p, i) => (
                    <g key={i} stroke={theme.colors.text.primary} strokeWidth="2.5">
                      <line x1={sx(p) - 5} y1={sy(0) - 5} x2={sx(p) + 5} y2={sy(0) + 5} />
                      <line x1={sx(p) - 5} y1={sy(0) + 5} x2={sx(p) + 5} y2={sy(0) - 5} />
                    </g>
                  ))}

                  {/* closed-loop poles at the chosen K */}
                  {data.closed_loop_poles.map((p, i) => (
                    <circle key={i} cx={sx(p.re)} cy={sy(p.im)} r="6" fill={statusColor} stroke="white" strokeWidth="2" />
                  ))}
                </>
              )}
            </svg>
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              ✕ open-loop poles (K = 0), ● closed-loop poles at your K, ○ jω-axis crossing at K_crit. Dashed lines are the asymptotes.
            </p>
            <div style={{ marginTop: theme.spacing[3] }}>
              <EquationList lines={['s³ + (a+b)s² + ab·s + K = 0', 'Routh s¹ row: (ab(a+b) − K) / (a+b) > 0  ⇒  K < ab(a+b)', 'Breakaway: 3s² + 2(a+b)s + ab = 0']} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

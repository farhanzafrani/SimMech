/**
 * Truss Analysis - Interactive Topic
 *
 * A Warren truss with a pin and a roller support and one vertical joint
 * load. Members are colored by tension (blue) or compression (red) with
 * thickness proportional to force magnitude.
 */

import { useState } from 'react'
import { useStaticsMachineSimulation } from '../hooks/useStaticsMachineSimulation'
import { theme } from '../styles/theme'
import { CardTitle, EquationsCard, ResultRow, ResultsShell, SliderRow } from './StaticsMachineUi'

interface TrussMember {
  start: number
  end: number
  kind: string
  length: number
  force: number
  state: string
}

interface TrussData {
  nodes: number[][]
  members: TrussMember[]
  reaction_ax: number
  reaction_ay: number
  reaction_by: number
  max_tension: number
  max_compression: number
  midspan_moment: number
  midspan_chord_estimate: number
}

export default function StaticsTrussAnalysis() {
  const [span, setSpan] = useState(8)
  const [height, setHeight] = useState(3)
  const [panels, setPanels] = useState(2)
  const [load, setLoad] = useState(20)
  const [loadJoint, setLoadJoint] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)

  const joint = Math.min(loadJoint, panels)
  const { data, loading, error } = useStaticsMachineSimulation<TrussData>('/api/statics-truss/compute', {
    span,
    height,
    panels,
    load,
    load_joint: joint,
  })

  const maxF = data ? Math.max(data.max_tension, data.max_compression, 1e-9) : 1
  const sx = 280 / span
  const X = (x: number) => 30 + x * sx
  const Y = (y: number) => 200 - y * Math.min(sx, 80 / height)
  const tensionColor = theme.colors.lightBlue[600]
  const compColor = theme.colors.error
  const sel = data && selected !== null ? data.members[selected] : null

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label="Span L" valueText={`${span.toFixed(1)} m`} min={4} max={20} step={0.5} value={span} onChange={setSpan} />
            <SliderRow label="Truss Depth h" valueText={`${height.toFixed(1)} m`} min={1} max={6} step={0.25} value={height} onChange={setHeight} />
            <SliderRow label="Panels n" valueText={`${panels}`} min={2} max={8} step={1} value={panels} onChange={(v) => { setPanels(v); setSelected(null) }} />
            <SliderRow label="Load P" valueText={`${load.toFixed(0)} kN`} min={0} max={100} step={1} value={load} onChange={setLoad} />
            <SliderRow label="Loaded bottom joint" valueText={`joint ${joint}`} min={0} max={panels} step={1} value={joint} onChange={setLoadJoint} />
          </div>

          <ResultsShell loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Reaction Aₓ" value={`${data.reaction_ax.toFixed(2)} kN`} />
                <ResultRow label="Reaction A_y" value={`${data.reaction_ay.toFixed(2)} kN`} />
                <ResultRow label="Reaction B_y" value={`${data.reaction_by.toFixed(2)} kN`} />
                <ResultRow label="Largest tension" value={`${data.max_tension.toFixed(2)} kN`} color={tensionColor} />
                <ResultRow label="Largest compression" value={`${data.max_compression.toFixed(2)} kN`} color={compColor} />
                <ResultRow label="Midspan moment M" value={`${data.midspan_moment.toFixed(1)} kN·m`} />
                <ResultRow label="Section check M / h" value={`${data.midspan_chord_estimate.toFixed(2)} kN`} last />
                {sel && (
                  <div style={{ padding: theme.spacing[2], border: `1px solid ${theme.colors.border}`, borderRadius: '6px', fontSize: '13px' }}>
                    Selected {sel.kind} ({sel.start}–{sel.end}), length {sel.length.toFixed(2)} m:{' '}
                    <strong style={{ color: sel.state === 'compression' ? compColor : tensionColor }}>
                      {Math.abs(sel.force).toFixed(2)} kN {sel.state}
                    </strong>
                  </div>
                )}
              </>
            )}
          </ResultsShell>

          <EquationsCard lines={['m + r = 2j  (determinate)', 'Joints: ΣFx = 0, ΣFy = 0', 'Sections: ΣM about a joint = 0', 'Chord force at midspan ≈ M / h']} />
        </div>

        <div>
          <div className="card">
            <CardTitle>Member Forces</CardTitle>
            <svg width="100%" height="260" viewBox="0 0 340 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label="Warren truss with members colored by tension or compression">
              {data?.members.map((m, i) => {
                const a = data.nodes[m.start]
                const b = data.nodes[m.end]
                const color = m.state === 'compression' ? compColor : m.state === 'tension' ? tensionColor : theme.colors.gray[400]
                return (
                  <line
                    key={i}
                    x1={X(a[0])} y1={Y(a[1])} x2={X(b[0])} y2={Y(b[1])}
                    stroke={color}
                    strokeWidth={selected === i ? 9 : 2 + (Math.abs(m.force) / maxF) * 6}
                    strokeLinecap="round"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelected(selected === i ? null : i)}
                  />
                )
              })}
              {data?.nodes.map((n, i) => (
                <circle key={i} cx={X(n[0])} cy={Y(n[1])} r="3.5" fill={theme.colors.text.primary} />
              ))}
              {/* Supports */}
              <polygon points={`${X(0)},${Y(0) + 4} ${X(0) - 10},${Y(0) + 22} ${X(0) + 10},${Y(0) + 22}`} fill="none" stroke={theme.colors.text.primary} strokeWidth="2" />
              <circle cx={X(span)} cy={Y(0) + 14} r="8" fill="none" stroke={theme.colors.text.primary} strokeWidth="2" />
              {/* Load */}
              {load > 0 && (
                <>
                  <line x1={X((joint * span) / panels)} y1={Y(0) + 6} x2={X((joint * span) / panels)} y2={Y(0) + 48} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#trussArrow)" />
                  <text x={X((joint * span) / panels) + 8} y={Y(0) + 44} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>P</text>
                </>
              )}
              <defs>
                <marker id="trussArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
                </marker>
              </defs>
            </svg>
            <div style={{ display: 'flex', gap: theme.spacing[4], fontSize: '12px', marginTop: theme.spacing[2], color: theme.colors.text.secondary }}>
              <span><span style={{ color: tensionColor, fontWeight: 700 }}>━</span> tension</span>
              <span><span style={{ color: compColor, fontWeight: 700 }}>━</span> compression</span>
              <span>Click a member for its force.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

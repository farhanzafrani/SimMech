/**
 * Centroids & Area Moments of Inertia - Interactive Topic
 *
 * Build a T, I or hollow-box section from rectangles (plus a circular hole)
 * and see the composite centroid and centroidal Ix, Iy via the parallel-axis
 * theorem, part by part.
 */

import { useState } from 'react'
import { useStaticsMachineSimulation } from '../hooks/useStaticsMachineSimulation'
import { theme } from '../styles/theme'
import { CardTitle, EquationsCard, ModeTabs, ResultRow, ResultsShell, SliderRow } from './StaticsMachineUi'

interface PartRow {
  shape: string
  sign: number
  area: number
  cy: number
  dy: number
  own_ix: number
  transfer_ix: number
}

interface SectionData {
  area: number
  x_bar: number
  y_bar: number
  ix: number
  iy: number
  rx: number
  ry: number
  section_modulus_top: number
  section_modulus_bottom: number
  parts: PartRow[]
}

type Shape = 'T' | 'I' | 'box'

interface Part {
  shape: 'rect' | 'circle'
  cx: number
  cy: number
  w?: number
  h?: number
  d?: number
  sign: number
}

export default function StaticsCentroidsAnalysis() {
  const [shape, setShape] = useState<Shape>('T')
  const [bf, setBf] = useState(100) // flange width
  const [tf, setTf] = useState(20) // flange thickness
  const [hw, setHw] = useState(80) // web height
  const [tw, setTw] = useState(20) // web thickness
  const [hole, setHole] = useState(30) // hole diameter (box)

  const cx = bf / 2
  let parts: Part[]
  let totalH: number
  if (shape === 'T') {
    totalH = hw + tf
    parts = [
      { shape: 'rect', cx, cy: hw + tf / 2, w: bf, h: tf, sign: 1 },
      { shape: 'rect', cx, cy: hw / 2, w: tw, h: hw, sign: 1 },
    ]
  } else if (shape === 'I') {
    totalH = hw + 2 * tf
    parts = [
      { shape: 'rect', cx, cy: tf / 2, w: bf, h: tf, sign: 1 },
      { shape: 'rect', cx, cy: tf + hw / 2, w: tw, h: hw, sign: 1 },
      { shape: 'rect', cx, cy: tf + hw + tf / 2, w: bf, h: tf, sign: 1 },
    ]
  } else {
    totalH = hw
    parts = [
      { shape: 'rect', cx, cy: hw / 2, w: bf, h: hw, sign: 1 },
      { shape: 'circle', cx, cy: hw / 2, d: Math.min(hole, Math.min(bf, hw) - 1), sign: -1 },
    ]
  }

  const { data, loading, error } = useStaticsMachineSimulation<SectionData>('/api/statics-centroids/compute', { parts })

  // Drawing: scale section into a 220x200 box
  const sc = Math.min(220 / bf, 200 / totalH)
  const ox = 50
  const oy = 230
  const X = (x: number) => ox + x * sc
  const Y = (y: number) => oy - y * sc

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <ModeTabs<Shape> modes={[{ id: 'T', label: 'T-section' }, { id: 'I', label: 'I-section' }, { id: 'box', label: 'Plate with hole' }]} value={shape} onChange={setShape} />
      <div className="grid-container">
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label={shape === 'box' ? 'Plate Width b' : 'Flange Width b'} valueText={`${bf} mm`} min={40} max={200} step={5} value={bf} onChange={setBf} />
            {shape !== 'box' && <SliderRow label="Flange Thickness tf" valueText={`${tf} mm`} min={5} max={50} step={1} value={tf} onChange={setTf} />}
            <SliderRow label={shape === 'box' ? 'Plate Height h' : 'Web Height'} valueText={`${hw} mm`} min={30} max={200} step={5} value={hw} onChange={setHw} />
            {shape !== 'box' && <SliderRow label="Web Thickness tw" valueText={`${tw} mm`} min={5} max={Math.max(5, bf)} step={1} value={Math.min(tw, bf)} onChange={setTw} />}
            {shape === 'box' && <SliderRow label="Hole Diameter" valueText={`${Math.min(hole, Math.min(bf, hw) - 1).toFixed(0)} mm`} min={1} max={Math.max(2, Math.min(bf, hw) - 1)} step={1} value={Math.min(hole, Math.min(bf, hw) - 1)} onChange={setHole} />}
          </div>

          <ResultsShell loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Area A" value={`${data.area.toFixed(0)} mm²`} />
                <ResultRow label="Centroid ȳ (from base)" value={`${data.y_bar.toFixed(2)} mm`} />
                <ResultRow label="Centroid x̄" value={`${data.x_bar.toFixed(2)} mm`} />
                <ResultRow label="Iₓ (about centroid)" value={`${(data.ix / 1e6).toFixed(3)} ×10⁶ mm⁴`} />
                <ResultRow label="I_y (about centroid)" value={`${(data.iy / 1e6).toFixed(3)} ×10⁶ mm⁴`} />
                <ResultRow label="Radii of gyration kₓ, k_y" value={`${data.rx.toFixed(1)}, ${data.ry.toFixed(1)} mm`} />
                <ResultRow label="Section modulus S (top / bottom)" value={`${(data.section_modulus_top / 1e3).toFixed(1)} / ${(data.section_modulus_bottom / 1e3).toFixed(1)} ×10³ mm³`} last />
              </>
            )}
          </ResultsShell>

          {data && (
            <div className="card" style={{ marginBottom: theme.spacing[4], overflowX: 'auto' }}>
              <CardTitle>Parallel-Axis Table</CardTitle>
              <table style={{ width: '100%', fontSize: '12px', fontFamily: theme.typography.fontFamily.mono, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'right', color: theme.colors.text.secondary }}>
                    <th style={{ textAlign: 'left' }}>Part</th><th>A</th><th>d_y</th><th>I_own</th><th>A·d²</th>
                  </tr>
                </thead>
                <tbody>
                  {data.parts.map((p, i) => (
                    <tr key={i} style={{ textAlign: 'right', borderTop: `1px solid ${theme.colors.border}` }}>
                      <td style={{ textAlign: 'left' }}>{p.sign < 0 ? 'hole' : p.shape} {i + 1}</td>
                      <td>{(p.sign * p.area).toFixed(0)}</td>
                      <td>{p.dy.toFixed(1)}</td>
                      <td>{(p.sign * p.own_ix).toExponential(2)}</td>
                      <td>{(p.sign * p.transfer_ix).toExponential(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <EquationsCard lines={['ȳ = ΣAᵢyᵢ / ΣAᵢ', 'I = Σ(Iᵢ + Aᵢdᵢ²)', 'rect: I = b h³ / 12', 'circle: I = π d⁴ / 64', 'S = I / c']} />
        </div>

        <div>
          <div className="card">
            <CardTitle>Section</CardTitle>
            <svg width="100%" height="260" viewBox="0 0 320 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label="Composite cross-section with its centroid marked">
              {parts.map((p, i) =>
                p.shape === 'rect' ? (
                  <rect key={i} x={X(p.cx - (p.w ?? 0) / 2)} y={Y(p.cy + (p.h ?? 0) / 2)} width={(p.w ?? 0) * sc} height={(p.h ?? 0) * sc} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="1.5" />
                ) : (
                  <circle key={i} cx={X(p.cx)} cy={Y(p.cy)} r={((p.d ?? 0) / 2) * sc} fill={theme.colors.bg.secondary} stroke={theme.colors.text.primary} strokeWidth="1.5" strokeDasharray="4 3" />
                ),
              )}
              {data && (
                <>
                  <line x1={X(0) - 10} y1={Y(data.y_bar)} x2={X(bf) + 10} y2={Y(data.y_bar)} stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="5 3" />
                  <line x1={X(data.x_bar)} y1={Y(0) + 10} x2={X(data.x_bar)} y2={Y(totalH) - 10} stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="5 3" />
                  <circle cx={X(data.x_bar)} cy={Y(data.y_bar)} r="5" fill={theme.colors.error} />
                  <text x={X(bf) + 12} y={Y(data.y_bar) + 4} fontSize="11" fill={theme.colors.error}>ȳ = {data.y_bar.toFixed(1)}</text>
                </>
              )}
              <line x1={X(0) - 18} y1={Y(0)} x2={X(0) - 18} y2={Y(totalH)} stroke={theme.colors.text.secondary} strokeWidth="1" />
              <text x={X(0) - 22} y={Y(totalH / 2)} fontSize="10" textAnchor="end" fill={theme.colors.text.secondary}>{totalH} mm</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Force Equilibrium & Free-Body Diagrams - Interactive Topic
 *
 * 2D: a pin-and-roller beam with two point loads, a uniform load and an
 * applied couple; the reactions come from sum Fx = sum Fy = sum M = 0.
 * 3D: a plate on three vertical supports; sum Fz, sum Mx, sum My give the
 * reactions and show when the plate would tip.
 */

import { useState } from 'react'
import { useStaticsMachineSimulation } from '../hooks/useStaticsMachineSimulation'
import { theme } from '../styles/theme'
import { Banner, CardTitle, EquationsCard, ModeTabs, ResultRow, ResultsShell, SliderRow } from './StaticsMachineUi'

interface Beam2D {
  ax: number
  ay: number
  by: number
  total_distributed: number
  residual_fx: number
  residual_fy: number
  residual_m: number
}

interface Plate3D {
  ra: number
  rb: number
  rc: number
  residual_fz: number
  tips: boolean
}

type Mode = '2d' | '3d'

export default function StaticsEquilibriumAnalysis() {
  const [mode, setMode] = useState<Mode>('2d')

  // 2D
  const [span, setSpan] = useState(6)
  const [p1, setP1] = useState(12)
  const [x1, setX1] = useState(2)
  const [a1, setA1] = useState(270)
  const [p2, setP2] = useState(0)
  const [x2, setX2] = useState(5)
  const [w, setW] = useState(3)
  const [moment, setMoment] = useState(0)

  // 3D
  const [la, setLa] = useState(2)
  const [lb, setLb] = useState(1.5)
  const [load, setLoad] = useState(12)
  const [lx, setLx] = useState(1.2)
  const [ly, setLy] = useState(0.5)

  const beam = useStaticsMachineSimulation<Beam2D>(mode === '2d' ? '/api/statics-equilibrium/beam-2d' : null, {
    span,
    loads: [
      { magnitude: p1, position: Math.min(x1, span), angle_deg: a1 },
      { magnitude: p2, position: Math.min(x2, span), angle_deg: 270 },
    ],
    distributed_load: w,
    applied_moment: moment,
  })
  const plate = useStaticsMachineSimulation<Plate3D>(mode === '3d' ? '/api/statics-equilibrium/plate-3d' : null, {
    length_a: la,
    length_b: lb,
    load,
    load_x: Math.min(lx, la),
    load_y: Math.min(ly, lb),
  })
  const active = mode === '2d' ? beam : plate

  // --- 2D drawing geometry ---
  const bx0 = 40
  const bx1 = 280
  const by = 130
  const sx = (x: number) => bx0 + (x / span) * (bx1 - bx0)
  const arrowLen = (f: number) => Math.min(70, 8 + Math.abs(f) * 3)
  const rad = (a1 * Math.PI) / 180

  // --- 3D drawing geometry (top view) ---
  const pw = 220
  const ph = Math.min(180, (pw * lb) / la)
  const ox = 50
  const oy = 40
  const px = (x: number) => ox + (x / la) * pw
  const py = (y: number) => oy + ph - (y / lb) * ph

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <ModeTabs<Mode> modes={[{ id: '2d', label: '2D beam (pin + roller)' }, { id: '3d', label: '3D plate (3 supports)' }]} value={mode} onChange={setMode} />
      <div className="grid-container">
        <div>
          {mode === '2d' ? (
            <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Span L" valueText={`${span.toFixed(1)} m`} min={2} max={12} step={0.5} value={span} onChange={setSpan} />
              <SliderRow label="Load P₁" valueText={`${p1.toFixed(1)} kN`} min={0} max={50} step={0.5} value={p1} onChange={setP1} />
              <SliderRow label="Position of P₁" valueText={`${Math.min(x1, span).toFixed(1)} m`} min={0} max={span} step={0.1} value={Math.min(x1, span)} onChange={setX1} />
              <SliderRow label="Direction of P₁ (270° = down)" valueText={`${a1.toFixed(0)}°`} min={180} max={360} step={5} value={a1} onChange={setA1} />
              <SliderRow label="Load P₂ (down)" valueText={`${p2.toFixed(1)} kN`} min={0} max={50} step={0.5} value={p2} onChange={setP2} />
              <SliderRow label="Position of P₂" valueText={`${Math.min(x2, span).toFixed(1)} m`} min={0} max={span} step={0.1} value={Math.min(x2, span)} onChange={setX2} />
              <SliderRow label="Uniform load w" valueText={`${w.toFixed(1)} kN/m`} min={0} max={10} step={0.5} value={w} onChange={setW} />
              <SliderRow label="Applied couple M (ccw +)" valueText={`${moment.toFixed(0)} kN·m`} min={-50} max={50} step={1} value={moment} onChange={setMoment} />
            </div>
          ) : (
            <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Plate side a (x)" valueText={`${la.toFixed(1)} m`} min={0.5} max={4} step={0.1} value={la} onChange={setLa} />
              <SliderRow label="Plate side b (y)" valueText={`${lb.toFixed(1)} m`} min={0.5} max={4} step={0.1} value={lb} onChange={setLb} />
              <SliderRow label="Load P (down)" valueText={`${load.toFixed(1)} kN`} min={0} max={50} step={0.5} value={load} onChange={setLoad} />
              <SliderRow label="Load x" valueText={`${Math.min(lx, la).toFixed(2)} m`} min={0} max={la} step={0.05} value={Math.min(lx, la)} onChange={setLx} />
              <SliderRow label="Load y" valueText={`${Math.min(ly, lb).toFixed(2)} m`} min={0} max={lb} step={0.05} value={Math.min(ly, lb)} onChange={setLy} />
            </div>
          )}

          <ResultsShell loading={active.loading} error={active.error} hasData={!!active.data}>
            {mode === '2d' && beam.data && (
              <>
                <ResultRow label="Pin reaction Aₓ" value={`${beam.data.ax.toFixed(2)} kN`} />
                <ResultRow label="Pin reaction A_y" value={`${beam.data.ay.toFixed(2)} kN`} />
                <ResultRow label="Roller reaction B_y" value={`${beam.data.by.toFixed(2)} kN`} />
                <ResultRow label="UDL resultant wL" value={`${beam.data.total_distributed.toFixed(1)} kN`} />
                <ResultRow
                  label="Check Σ residuals"
                  value={Math.max(Math.abs(beam.data.residual_fx), Math.abs(beam.data.residual_fy), Math.abs(beam.data.residual_m)) < 1e-6 ? 'ΣF = ΣM = 0 ✓' : 'not in equilibrium'}
                  last
                />
              </>
            )}
            {mode === '3d' && plate.data && (
              <>
                <ResultRow label="Reaction at A (0,0)" value={`${plate.data.ra.toFixed(2)} kN`} color={plate.data.ra < 0 ? theme.colors.error : undefined} />
                <ResultRow label="Reaction at B (a,0)" value={`${plate.data.rb.toFixed(2)} kN`} />
                <ResultRow label="Reaction at C (0,b)" value={`${plate.data.rc.toFixed(2)} kN`} />
                <ResultRow label="Check ΣFz − P" value={plate.data.residual_fz.toExponential(1)} last />
                <Banner color={plate.data.tips ? theme.colors.error : theme.colors.success}>
                  {plate.data.tips ? 'Rₐ < 0: support A would need to pull down — the plate tips' : 'All supports in compression: plate stays down'}
                </Banner>
              </>
            )}
          </ResultsShell>

          <EquationsCard
            lines={
              mode === '2d'
                ? ['ΣFx = 0', 'ΣFy = 0', 'ΣM_A = 0  →  B_y L = Σ(x·F_y-load)', 'UDL ≡ wL at L/2']
                : ['ΣFz = 0:  Rₐ + R_b + R_c = P', 'ΣMx = 0:  R_c b = P y', 'ΣMy = 0:  R_b a = P x']
            }
          />
        </div>

        <div>
          <div className="card">
            <CardTitle>{mode === '2d' ? 'Free-Body Diagram' : 'Plate (top view)'}</CardTitle>
            {mode === '2d' ? (
              <svg width="100%" height="260" viewBox="0 0 320 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label="Free-body diagram of a pin-and-roller beam with applied loads and reactions">
                <line x1={bx0} y1={by} x2={bx1} y2={by} stroke={theme.colors.text.primary} strokeWidth="6" strokeLinecap="round" />
                {/* Pin A and roller B */}
                <polygon points={`${bx0},${by + 3} ${bx0 - 12},${by + 24} ${bx0 + 12},${by + 24}`} fill="none" stroke={theme.colors.text.primary} strokeWidth="2" />
                <circle cx={bx1} cy={by + 18} r="8" fill="none" stroke={theme.colors.text.primary} strokeWidth="2" />
                <text x={bx0} y={by + 42} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>A</text>
                <text x={bx1} y={by + 42} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>B</text>
                {/* UDL */}
                {w > 0 && [0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => (
                  <line key={f} x1={bx0 + f * (bx1 - bx0)} y1={by - 28} x2={bx0 + f * (bx1 - bx0)} y2={by - 8} stroke={theme.colors.gray[500]} strokeWidth="2" />
                ))}
                {w > 0 && <text x={(bx0 + bx1) / 2} y={by - 34} fontSize="11" textAnchor="middle" fill={theme.colors.gray[600]}>w</text>}
                {/* P1 : drawn with its tip at the beam */}
                {p1 > 0 && (
                  <>
                    <line x1={sx(Math.min(x1, span)) - 40 * Math.cos(rad)} y1={by + 40 * Math.sin(rad)} x2={sx(Math.min(x1, span))} y2={by} stroke={theme.colors.error} strokeWidth="3" />
                    <text x={sx(Math.min(x1, span)) - 40 * Math.cos(rad) + 4} y={by + 40 * Math.sin(rad) - 4} fontSize="12" fontWeight={700} fill={theme.colors.error}>P₁</text>
                  </>
                )}
                {p2 > 0 && (
                  <>
                    <line x1={sx(Math.min(x2, span))} y1={by - 45} x2={sx(Math.min(x2, span))} y2={by - 2} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#statEqArrow)" />
                    <text x={sx(Math.min(x2, span)) + 6} y={by - 40} fontSize="12" fontWeight={700} fill={theme.colors.error}>P₂</text>
                  </>
                )}
                {/* Reactions (up if positive) */}
                {beam.data && (
                  <>
                    <line x1={bx0 + 22} y1={by + 24 + arrowLen(beam.data.ay) * (beam.data.ay >= 0 ? 1 : -1)} x2={bx0 + 22} y2={by + 24} stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#statEqArrowG)" />
                    <text x={bx0 + 28} y={by + 24 + arrowLen(beam.data.ay)} fontSize="11" fill={theme.colors.success}>A_y={beam.data.ay.toFixed(1)}</text>
                    <line x1={bx1 + 22} y1={by + 26 + arrowLen(beam.data.by) * (beam.data.by >= 0 ? 1 : -1)} x2={bx1 + 22} y2={by + 26} stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#statEqArrowG)" />
                    <text x={bx1 - 30} y={by + 26 + arrowLen(beam.data.by) + 12} fontSize="11" fill={theme.colors.success}>B_y={beam.data.by.toFixed(1)}</text>
                    {Math.abs(beam.data.ax) > 1e-6 && (
                      <>
                        <line x1={bx0 - 40} y1={by} x2={bx0 - 14} y2={by} stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#statEqArrowG)" transform={beam.data.ax < 0 ? `rotate(180 ${bx0 - 27} ${by})` : undefined} />
                        <text x={bx0 - 40} y={by - 8} fontSize="11" fill={theme.colors.success}>Aₓ={beam.data.ax.toFixed(1)}</text>
                      </>
                    )}
                  </>
                )}
                <defs>
                  <marker id="statEqArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
                  </marker>
                  <marker id="statEqArrowG" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.success} />
                  </marker>
                </defs>
              </svg>
            ) : (
              <svg width="100%" height="260" viewBox="0 0 320 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label="Top view of a plate on three supports with the load position">
                <rect x={ox} y={oy} width={pw} height={ph} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
                <polygon points={`${px(0)},${py(0)} ${px(la)},${py(0)} ${px(0)},${py(lb)}`} fill="none" stroke={theme.colors.gray[500]} strokeWidth="1.5" strokeDasharray="4 3" />
                {[
                  { x: 0, y: 0, name: 'A', r: plate.data?.ra },
                  { x: la, y: 0, name: 'B', r: plate.data?.rb },
                  { x: 0, y: lb, name: 'C', r: plate.data?.rc },
                ].map((s) => (
                  <g key={s.name}>
                    <circle cx={px(s.x)} cy={py(s.y)} r={6 + Math.min(10, Math.abs(s.r ?? 0) * 0.8)} fill={(s.r ?? 0) < 0 ? theme.colors.error : theme.colors.success} fillOpacity="0.55" />
                    <text x={px(s.x) + (s.x === 0 ? -16 : 8)} y={py(s.y) + (s.y === 0 ? 18 : -8)} fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>{s.name}</text>
                  </g>
                ))}
                <circle cx={px(Math.min(lx, la))} cy={py(Math.min(ly, lb))} r="6" fill={theme.colors.error} />
                <text x={px(Math.min(lx, la)) + 9} y={py(Math.min(ly, lb)) - 6} fontSize="12" fontWeight={700} fill={theme.colors.error}>P</text>
              </svg>
            )}
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              {mode === '2d'
                ? 'Green arrows are the support reactions; they would have to balance the red loads for the beam to stay at rest.'
                : 'Dashed triangle ABC: the plate stays down while the load lies inside it. Support circles grow with their reaction.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

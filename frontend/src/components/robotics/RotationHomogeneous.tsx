/**
 * Rotation Matrices & Homogeneous Transforms - Interactive Topic
 *
 * Students set the orientation (ZYX Euler angles) and position of frame {B}
 * relative to {A}, and see R, the 4x4 transform T, and how a point maps.
 */

import { useState } from 'react'
import { theme } from '../../styles/theme'
import { useRoboticsCompute, Card, SliderField, ResultRow, Status, EquationBox, Banner, svgFrameStyle } from './roboticsShared'

interface TfData {
  rotation: number[][]
  translation: number[]
  transform: number[][]
  transform_inverse: number[][]
  point_in_b: number[]
  point_in_a: number[]
  point_round_trip_error: number
  determinant: number
  orthonormality_error: number
  trace: number
  axis_angle_deg: number
  axis: number[]
  x_axis_of_b: number[]
  y_axis_of_b: number[]
  z_axis_of_b: number[]
  gimbal_lock: boolean
}

function MatrixView({ m, label }: { m: number[][]; label: string }) {
  return (
    <div style={{ marginBottom: theme.spacing[2] }}>
      <div style={{ fontSize: '12px', color: theme.colors.text.secondary, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${m[0].length}, 1fr)`, gap: 2, fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', background: theme.colors.bg.secondary, border: `1px solid ${theme.colors.border}`, borderRadius: '4px', padding: '6px 8px' }}>
        {m.flat().map((v, i) => (
          <span key={i} style={{ textAlign: 'right' }}>{(Math.abs(v) < 5e-4 ? 0 : v).toFixed(3)}</span>
        ))}
      </div>
    </div>
  )
}

export default function RotationHomogeneous() {
  const [roll, setRoll] = useState(0)
  const [pitch, setPitch] = useState(0)
  const [yaw, setYaw] = useState(90)
  const [tx, setTx] = useState(1)
  const [ty, setTy] = useState(2)
  const [tz, setTz] = useState(0)
  const [px, setPx] = useState(1)
  const [py, setPy] = useState(0)
  const [pz, setPz] = useState(0)

  const { data, loading, error } = useRoboticsCompute<TfData>('/api/robotics/transform', { roll, pitch, yaw, tx, ty, tz, px, py, pz })

  // Oblique projection of 3D {A} coordinates onto the page: x right, y toward the upper-right, z up
  const ox = 90
  const oy = 270
  const u = 42
  const proj = (v: number[]) => [ox + (v[0] + 0.5 * v[1]) * u, oy - (v[2] + 0.5 * v[1]) * u] as const
  const [bx, by] = data ? proj(data.translation) : [ox, oy]

  const axes: { v: number[] | undefined; color: string; name: string }[] = [
    { v: data?.x_axis_of_b, color: theme.colors.error, name: 'x_B' },
    { v: data?.y_axis_of_b, color: theme.colors.success, name: 'y_B' },
    { v: data?.z_axis_of_b, color: theme.colors.lightBlue[600], name: 'z_B' },
  ]

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Frame {B} relative to {A}">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="Yaw (about z)" value={yaw} unit="°" min={-180} max={180} step={1} digits={0} onChange={setYaw} />
              <SliderField label="Pitch (about y)" value={pitch} unit="°" min={-90} max={90} step={1} digits={0} onChange={setPitch} />
              <SliderField label="Roll (about x)" value={roll} unit="°" min={-180} max={180} step={1} digits={0} onChange={setRoll} />
              <SliderField label="Translation tₓ" value={tx} unit="m" min={-3} max={3} step={0.1} onChange={setTx} />
              <SliderField label="Translation tᵧ" value={ty} unit="m" min={-3} max={3} step={0.1} onChange={setTy} />
              <SliderField label="Translation t_z" value={tz} unit="m" min={-3} max={3} step={0.1} onChange={setTz} />
            </div>
          </Card>

          <Card title="Point expressed in {B}">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="ᴮpₓ" value={px} unit="m" min={-3} max={3} step={0.1} onChange={setPx} />
              <SliderField label="ᴮpᵧ" value={py} unit="m" min={-3} max={3} step={0.1} onChange={setPy} />
              <SliderField label="ᴮp_z" value={pz} unit="m" min={-3} max={3} step={0.1} onChange={setPz} />
            </div>
          </Card>

          <Card title="Results">
            <Status loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <MatrixView m={data.rotation} label="Rotation R (R = Rz·Ry·Rx)" />
                <MatrixView m={data.transform} label="Homogeneous transform T = [R p; 0 1]" />
                <div style={{ display: 'grid', gap: theme.spacing[2] }}>
                  <ResultRow label="ᴬp = R·ᴮp + t" value={`(${data.point_in_a.map((v) => v.toFixed(2)).join(', ')})`} />
                  <ResultRow label="det R" value={data.determinant.toFixed(4)} />
                  <ResultRow label="‖RᵀR − I‖" value={data.orthonormality_error.toExponential(1)} />
                  <ResultRow label="Rotation angle θ" value={`${data.axis_angle_deg.toFixed(1)}°`} />
                  <ResultRow label="Rotation axis ω̂" value={`(${data.axis.map((v) => v.toFixed(2)).join(', ')})`} last />
                  {data.gimbal_lock && <Banner color={theme.colors.warning}>Pitch ≈ ±90°: gimbal lock, roll and yaw describe the same rotation</Banner>}
                </div>
              </div>
            )}
          </Card>

          <Card title="Key Equations">
            <EquationBox lines={['RᵀR = I,  det R = +1', 'ᴬp = ᴬR_B ᴮp + ᴬt_B', 'T⁻¹ = [Rᵀ  −Rᵀt; 0  1]', 'cosθ = (tr R − 1) / 2']} />
          </Card>
        </div>

        <div>
          <Card title="Frames {A} and {B}">
            <svg width="100%" height="380" viewBox="0 0 340 380" style={svgFrameStyle}>
              <defs>
                {axes.map((a) => (
                  <marker key={a.name} id={`roboTf-${a.name}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 z" fill={a.color} />
                  </marker>
                ))}
                <marker id="roboTfA" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 z" fill={theme.colors.gray[500]} />
                </marker>
              </defs>
              {/* Frame {A}: grey axes */}
              {[[1, 0, 0, 'x_A'], [0, 1, 0, 'y_A'], [0, 0, 1, 'z_A']].map(([a, b, c, name]) => {
                const [ex, ey] = proj([Number(a) * 1.4, Number(b) * 1.4, Number(c) * 1.4])
                return (
                  <g key={String(name)}>
                    <line x1={ox} y1={oy} x2={ex} y2={ey} stroke={theme.colors.gray[500]} strokeWidth="2" markerEnd="url(#roboTfA)" />
                    <text x={ex + 4} y={ey - 4} fontSize="11" fill={theme.colors.gray[500]}>{String(name)}</text>
                  </g>
                )
              })}
              {data && (
                <>
                  {/* Frame {B}: coloured axes drawn from its origin */}
                  {axes.map((a) => {
                    const tip = proj([data.translation[0] + (a.v?.[0] ?? 0), data.translation[1] + (a.v?.[1] ?? 0), data.translation[2] + (a.v?.[2] ?? 0)])
                    return (
                      <g key={a.name}>
                        <line x1={bx} y1={by} x2={tip[0]} y2={tip[1]} stroke={a.color} strokeWidth="3" markerEnd={`url(#roboTf-${a.name})`} />
                        <text x={tip[0] + 4} y={tip[1] - 4} fontSize="11" fontWeight={700} fill={a.color}>{a.name}</text>
                      </g>
                    )
                  })}
                  {/* The point, in {A} coordinates */}
                  {(() => {
                    const [qx, qy] = proj(data.point_in_a)
                    return (
                      <>
                        <line x1={bx} y1={by} x2={qx} y2={qy} stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx={qx} cy={qy} r="5" fill={theme.colors.accent[600]} />
                        <text x={qx + 8} y={qy + 4} fontSize="11" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.accent[600]}>p</text>
                      </>
                    )
                  })()}
                </>
              )}
            </svg>
            <div style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
              Oblique view. Grey axes are {'{A}'}; the colored axes are the columns of R drawn at the origin of {'{B}'}.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

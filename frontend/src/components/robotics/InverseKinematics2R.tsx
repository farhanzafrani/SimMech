/**
 * Inverse Kinematics (analytic 2R) & Singularities - Interactive Topic
 *
 * Students pick a target point for the tip and see both elbow-up and
 * elbow-down solutions, reachability, and the singular boundary.
 */

import { useState } from 'react'
import { theme } from '../../styles/theme'
import { useRoboticsCompute, Card, SliderField, ResultRow, Status, EquationBox, Banner, Arm2RSvg, svgFrameStyle } from './roboticsShared'

interface IkSolution {
  label: string
  theta1: number
  theta2: number
  elbow: [number, number]
  fk_error: number
}

interface IkData {
  target_distance: number
  r_min: number
  r_max: number
  cos_theta2: number
  reachable: boolean
  solutions: IkSolution[]
  selected: IkSolution | null
  closest_point: [number, number] | null
  singular: boolean
  jacobian_det: number | null
}

export default function InverseKinematics2R() {
  const [l1, setL1] = useState(0.5)
  const [l2, setL2] = useState(0.3)
  const [x, setX] = useState(0.4)
  const [y, setY] = useState(0.4)
  const [elbowUp, setElbowUp] = useState(true)

  const { data, loading, error } = useRoboticsCompute<IkData>('/api/robotics/inverse-kinematics', { l1, l2, x, y, elbow_up: elbowUp })

  const scale = 120 / Math.max(l1 + l2, 0.2)
  const ox = 170
  const oy = 190
  const other = data?.solutions.find((s) => s !== data.selected)

  const statusColor = !data ? theme.colors.gray[500] : !data.reachable ? theme.colors.error : data.singular ? theme.colors.warning : theme.colors.success
  const statusText = !data ? '' : !data.reachable
    ? `Unreachable: target is ${data.target_distance.toFixed(2)} m away, workspace is ${data.r_min.toFixed(2)}–${data.r_max.toFixed(2)} m`
    : data.singular
      ? 'Near a singularity: arm is almost fully stretched or folded, det J ≈ 0'
      : 'Reachable: two distinct solutions'

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Target & Arm">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="Target x" value={x} unit="m" min={-1} max={1} step={0.01} digits={2} onChange={setX} />
              <SliderField label="Target y" value={y} unit="m" min={-1} max={1} step={0.01} digits={2} onChange={setY} />
              <SliderField label="Link 1 length L₁" value={l1} unit="m" min={0.1} max={1} step={0.05} digits={2} onChange={setL1} />
              <SliderField label="Link 2 length L₂" value={l2} unit="m" min={0.1} max={1} step={0.05} digits={2} onChange={setL2} />
              <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                <button className={elbowUp ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }} onClick={() => setElbowUp(true)}>Elbow up</button>
                <button className={!elbowUp ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }} onClick={() => setElbowUp(false)}>Elbow down</button>
              </div>
            </div>
          </Card>

          <Card title="Results">
            <Status loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="cos θ₂" value={data.cos_theta2.toFixed(4)} />
                {data.selected && (
                  <>
                    <ResultRow label={`θ₁ (${data.selected.label})`} value={`${data.selected.theta1.toFixed(2)}°`} />
                    <ResultRow label={`θ₂ (${data.selected.label})`} value={`${data.selected.theta2.toFixed(2)}°`} />
                  </>
                )}
                {other && <ResultRow label={`Other branch (${other.label})`} value={`${other.theta1.toFixed(1)}°, ${other.theta2.toFixed(1)}°`} />}
                <ResultRow label="det J = L₁L₂ sinθ₂" value={data.jacobian_det === null ? 'n/a' : data.jacobian_det.toFixed(4)} last />
                <Banner color={statusColor}>{statusText}</Banner>
              </div>
            )}
          </Card>

          <Card title="Key Equations">
            <EquationBox lines={['cosθ₂ = (x²+y²−L₁²−L₂²) / (2L₁L₂)', 'θ₂ = ±acos(cosθ₂)', 'θ₁ = atan2(y,x) − atan2(L₂sinθ₂, L₁+L₂cosθ₂)']} />
          </Card>
        </div>

        <div>
          <Card title="Two Ways to Reach the Same Point">
            <svg width="100%" height="380" viewBox="0 0 340 380" style={svgFrameStyle}>
              <circle cx={ox} cy={oy} r={(l1 + l2) * scale} fill="none" stroke={theme.colors.lightBlue[500]} strokeWidth="1" strokeDasharray="4 4" />
              <circle cx={ox} cy={oy} r={Math.abs(l1 - l2) * scale} fill="none" stroke={theme.colors.lightBlue[500]} strokeWidth="1" strokeDasharray="4 4" />
              {data?.selected && (
                <Arm2RSvg
                  l1={l1} l2={l2}
                  elbow={data.selected.elbow} tip={[x, y]}
                  scale={scale} ox={ox} oy={oy}
                  color={theme.colors.lightBlue[600]}
                  ghost={other ? { elbow: other.elbow, tip: [x, y] } : undefined}
                />
              )}
              {data?.closest_point && (
                <line x1={ox + x * scale} y1={oy - y * scale} x2={ox + data.closest_point[0] * scale} y2={oy - data.closest_point[1] * scale} stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="3 3" />
              )}
              {/* Target marker */}
              <g stroke={data && !data.reachable ? theme.colors.error : theme.colors.accent[600]} strokeWidth="2.5">
                <line x1={ox + x * scale - 7} y1={oy - y * scale} x2={ox + x * scale + 7} y2={oy - y * scale} />
                <line x1={ox + x * scale} y1={oy - y * scale - 7} x2={ox + x * scale} y2={oy - y * scale + 7} />
              </g>
            </svg>
            <div style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
              Solid arm = selected branch, dashed grey = the other branch. Dashed circles bound the workspace.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

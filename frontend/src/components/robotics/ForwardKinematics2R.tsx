/**
 * Planar 2-Link Forward Kinematics & Workspace - Interactive Topic
 *
 * Students set link lengths and joint angles and watch the elbow, tip
 * position, and reachable-workspace annulus update live.
 */

import { useState } from 'react'
import { theme } from '../../styles/theme'
import { useRoboticsCompute, Card, SliderField, ResultRow, Status, EquationBox, Arm2RSvg, svgFrameStyle } from './roboticsShared'

interface FkData {
  elbow: [number, number]
  end_effector: [number, number]
  orientation_deg: number
  reach: number
  r_min: number
  r_max: number
  workspace_area: number
}

export default function ForwardKinematics2R() {
  const [l1, setL1] = useState(0.5)
  const [l2, setL2] = useState(0.3)
  const [theta1, setTheta1] = useState(30)
  const [theta2, setTheta2] = useState(45)

  const { data, loading, error } = useRoboticsCompute<FkData>('/api/robotics/forward-kinematics', { l1, l2, theta1, theta2 })

  // Metre -> pixel scale chosen so the full workspace always fits
  const scale = 120 / Math.max(l1 + l2, 0.2) * 1.0
  const ox = 170
  const oy = 190
  const rMax = (data?.r_max ?? l1 + l2) * scale
  const rMin = (data?.r_min ?? Math.abs(l1 - l2)) * scale

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Arm Geometry">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="Link 1 length L₁" value={l1} unit="m" min={0.1} max={1} step={0.05} digits={2} onChange={setL1} />
              <SliderField label="Link 2 length L₂" value={l2} unit="m" min={0.1} max={1} step={0.05} digits={2} onChange={setL2} />
              <SliderField label="Joint 1 angle θ₁" value={theta1} unit="°" min={-180} max={180} step={1} digits={0} onChange={setTheta1} />
              <SliderField label="Joint 2 angle θ₂" value={theta2} unit="°" min={-180} max={180} step={1} digits={0} onChange={setTheta2} />
            </div>
          </Card>

          <Card title="Results">
            <Status loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Tip x" value={`${data.end_effector[0].toFixed(3)} m`} />
                <ResultRow label="Tip y" value={`${data.end_effector[1].toFixed(3)} m`} />
                <ResultRow label="Tip orientation φ = θ₁+θ₂" value={`${data.orientation_deg.toFixed(1)}°`} />
                <ResultRow label="Distance from base" value={`${data.reach.toFixed(3)} m`} />
                <ResultRow label="Workspace radii" value={`${data.r_min.toFixed(2)} – ${data.r_max.toFixed(2)} m`} />
                <ResultRow label="Workspace area" value={`${data.workspace_area.toFixed(3)} m²`} last />
              </div>
            )}
          </Card>

          <Card title="Key Equations">
            <EquationBox lines={['x = L₁cosθ₁ + L₂cos(θ₁+θ₂)', 'y = L₁sinθ₁ + L₂sin(θ₁+θ₂)', 'r_max = L₁ + L₂,  r_min = |L₁ − L₂|']} />
          </Card>
        </div>

        <div>
          <Card title="Arm & Reachable Workspace">
            <svg width="100%" height="380" viewBox="0 0 340 380" style={svgFrameStyle}>
              {/* Workspace annulus (even-odd fill leaves the inner hole empty) */}
              <path
                d={`M ${ox - rMax} ${oy} a ${rMax} ${rMax} 0 1 0 ${2 * rMax} 0 a ${rMax} ${rMax} 0 1 0 ${-2 * rMax} 0 M ${ox - rMin} ${oy} a ${rMin} ${rMin} 0 1 0 ${2 * rMin} 0 a ${rMin} ${rMin} 0 1 0 ${-2 * rMin} 0`}
                fill={theme.colors.lightBlue[100]}
                fillRule="evenodd"
                stroke={theme.colors.lightBlue[500]}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line x1={ox - 160} y1={oy} x2={ox + 160} y2={oy} stroke={theme.colors.gray[300]} strokeWidth="1" />
              <line x1={ox} y1={oy - 185} x2={ox} y2={oy + 185} stroke={theme.colors.gray[300]} strokeWidth="1" />
              {data && (
                <>
                  <Arm2RSvg l1={l1} l2={l2} elbow={data.elbow} tip={data.end_effector} scale={scale} ox={ox} oy={oy} color={theme.colors.lightBlue[600]} />
                  <text x={ox + data.end_effector[0] * scale + 10} y={oy - data.end_effector[1] * scale - 8} fontSize="11" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.accent[600]}>
                    ({data.end_effector[0].toFixed(2)}, {data.end_effector[1].toFixed(2)})
                  </text>
                </>
              )}
            </svg>
          </Card>
        </div>
      </div>
    </div>
  )
}

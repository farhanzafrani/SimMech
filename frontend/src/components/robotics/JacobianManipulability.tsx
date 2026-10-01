/**
 * Jacobian, Velocity/Force Mapping & Manipulability - Interactive Topic
 *
 * Students set joint rates and a tip force and see the tip velocity
 * (v = J q̇), required joint torques (τ = Jᵀ F), and the velocity
 * manipulability ellipse that collapses at a singularity.
 */

import { useState } from 'react'
import { theme } from '../../styles/theme'
import { useRoboticsCompute, Card, SliderField, ResultRow, Status, EquationBox, Banner, Arm2RSvg, svgFrameStyle } from './roboticsShared'

interface JacData {
  jacobian: number[][]
  elbow: [number, number]
  end_effector: [number, number]
  tip_velocity: [number, number]
  tip_speed: number
  joint_torques: [number, number]
  determinant: number
  manipulability: number
  max_manipulability: number
  sigma_max: number
  sigma_min: number
  condition_number: number | null
  ellipse_axis_dir_deg: number
  is_near_singular: boolean
}

export default function JacobianManipulability() {
  const [l1, setL1] = useState(0.5)
  const [l2, setL2] = useState(0.3)
  const [theta1, setTheta1] = useState(30)
  const [theta2, setTheta2] = useState(45)
  const [qdot1, setQdot1] = useState(1)
  const [qdot2, setQdot2] = useState(0.5)
  const [fx, setFx] = useState(10)
  const [fy, setFy] = useState(0)

  const { data, loading, error } = useRoboticsCompute<JacData>('/api/robotics/jacobian', { l1, l2, theta1, theta2, qdot1, qdot2, fx, fy })

  const scale = 110 / Math.max(l1 + l2, 0.2)
  const ox = 120
  const oy = 190
  const tipPx = data ? [ox + data.end_effector[0] * scale, oy - data.end_effector[1] * scale] : [ox, oy]
  // Ellipse drawn at the tip: 1 rad/s of joint speed -> sigma metres/s, shown at 0.35 m per m/s
  const ellipseScale = 0.5 * scale

  const manipRatio = data ? data.manipulability / data.max_manipulability : 0
  const manipColor = !data ? theme.colors.gray[500] : data.is_near_singular ? theme.colors.error : manipRatio < 0.5 ? theme.colors.warning : theme.colors.success

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Pose">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="Joint 1 angle θ₁" value={theta1} unit="°" min={-180} max={180} step={1} digits={0} onChange={setTheta1} />
              <SliderField label="Joint 2 angle θ₂" value={theta2} unit="°" min={-180} max={180} step={1} digits={0} onChange={setTheta2} />
              <SliderField label="Link 1 length L₁" value={l1} unit="m" min={0.1} max={1} step={0.05} digits={2} onChange={setL1} />
              <SliderField label="Link 2 length L₂" value={l2} unit="m" min={0.1} max={1} step={0.05} digits={2} onChange={setL2} />
            </div>
          </Card>

          <Card title="Joint Rates & Tip Force">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="Joint 1 rate q̇₁" value={qdot1} unit="rad/s" min={-3} max={3} step={0.1} onChange={setQdot1} />
              <SliderField label="Joint 2 rate q̇₂" value={qdot2} unit="rad/s" min={-3} max={3} step={0.1} onChange={setQdot2} />
              <SliderField label="Tip force Fₓ" value={fx} unit="N" min={-50} max={50} step={1} digits={0} onChange={setFx} />
              <SliderField label="Tip force Fᵧ" value={fy} unit="N" min={-50} max={50} step={1} digits={0} onChange={setFy} />
            </div>
          </Card>

          <Card title="Results">
            <Status loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="J row 1" value={`[${data.jacobian[0][0].toFixed(3)}, ${data.jacobian[0][1].toFixed(3)}]`} />
                <ResultRow label="J row 2" value={`[${data.jacobian[1][0].toFixed(3)}, ${data.jacobian[1][1].toFixed(3)}]`} />
                <ResultRow label="Tip velocity v" value={`(${data.tip_velocity[0].toFixed(3)}, ${data.tip_velocity[1].toFixed(3)}) m/s`} />
                <ResultRow label="Joint torques τ = Jᵀ F" value={`(${data.joint_torques[0].toFixed(2)}, ${data.joint_torques[1].toFixed(2)}) N·m`} />
                <ResultRow label="det J" value={data.determinant.toFixed(4)} />
                <ResultRow label="Manipulability w = |det J|" value={data.manipulability.toFixed(4)} color={manipColor} />
                <ResultRow label="Singular values σ₁, σ₂" value={`${data.sigma_max.toFixed(3)}, ${data.sigma_min.toFixed(3)}`} />
                <ResultRow label="Condition number" value={data.condition_number === null ? '∞' : data.condition_number.toFixed(2)} last />
                <Banner color={manipColor}>
                  {data.is_near_singular
                    ? 'Near singularity: the tip cannot move along one direction'
                    : `Manipulability is ${(manipRatio * 100).toFixed(0)}% of its maximum (L₁L₂)`}
                </Banner>
              </div>
            )}
          </Card>

          <Card title="Key Equations">
            <EquationBox lines={['v = J(θ) q̇', 'τ = Jᵀ(θ) F', 'det J = L₁L₂ sinθ₂', 'w = |det J| = σ₁σ₂']} />
          </Card>
        </div>

        <div>
          <Card title="Velocity Ellipse & Tip Motion">
            <svg width="100%" height="380" viewBox="0 0 340 380" style={svgFrameStyle}>
              <defs>
                <marker id="roboJacArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.error} />
                </marker>
                <marker id="roboJacForce" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.success} />
                </marker>
              </defs>
              {data && (
                <>
                  {/* Velocity ellipse: image of the unit circle of joint rates, major axis along the first left singular vector */}
                  <ellipse
                    cx={tipPx[0]} cy={tipPx[1]}
                    rx={Math.max(data.sigma_max * ellipseScale, 0.5)} ry={Math.max(data.sigma_min * ellipseScale, 0.5)}
                    transform={`rotate(${-data.ellipse_axis_dir_deg} ${tipPx[0]} ${tipPx[1]})`}
                    fill={theme.colors.accent.light} fillOpacity="0.45" stroke={theme.colors.accent[600]} strokeWidth="1.5"
                  />
                  <Arm2RSvg l1={l1} l2={l2} elbow={data.elbow} tip={data.end_effector} scale={scale} ox={ox} oy={oy} color={theme.colors.lightBlue[600]} />
                  {/* Tip velocity (red) */}
                  <line x1={tipPx[0]} y1={tipPx[1]} x2={tipPx[0] + data.tip_velocity[0] * ellipseScale} y2={tipPx[1] - data.tip_velocity[1] * ellipseScale} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#roboJacArrow)" />
                  {/* Applied tip force (green), 1 N -> 1.2 px */}
                  <line x1={tipPx[0]} y1={tipPx[1]} x2={tipPx[0] + fx * 1.2} y2={tipPx[1] - fy * 1.2} stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#roboJacForce)" />
                </>
              )}
            </svg>
            <div style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
              Shaded ellipse: all tip velocities reachable with unit joint speed. Red = tip velocity, green = applied force.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * DC Motor + Gearhead Sizing - Interactive Topic
 *
 * Students pick a motor, gear ratio and load, and see the output-shaft
 * torque-speed line with the load operating point, the reflected inertia,
 * and whether the motor can deliver the required torque at speed.
 */

import { useState } from 'react'
import { theme } from '../../styles/theme'
import { useRoboticsCompute, Card, SliderField, ResultRow, Status, EquationBox, Banner, svgFrameStyle } from './roboticsShared'

interface MotorData {
  stall_torque: number
  no_load_speed: number
  no_load_speed_rpm: number
  stall_current: number
  output_stall_torque: number
  output_no_load_speed: number
  output_no_load_speed_rpm: number
  motor_speed_at_load: number
  torque_required: number
  torque_available: number
  current_required: number
  reflected_inertia: number
  load_inertia_reflected: number
  optimal_gear_ratio: number
  load_acceleration: number | null
  speed_feasible: boolean
  torque_feasible: boolean
  peak_output_power: number
  curve: { speed: number; torque: number; power: number }[]
}

export default function MotorGearheadSizing() {
  const [voltage, setVoltage] = useState(24)
  const [resistance, setResistance] = useState(1.2)
  const [kt, setKt] = useState(0.05)
  const [rotorInertiaE6, setRotorInertiaE6] = useState(10) // x1e-6 kg*m^2
  const [gearRatio, setGearRatio] = useState(50)
  const [efficiency, setEfficiency] = useState(0.8)
  const [loadInertia, setLoadInertia] = useState(0.02)
  const [loadTorque, setLoadTorque] = useState(2)
  const [loadSpeed, setLoadSpeed] = useState(5)

  const { data, loading, error } = useRoboticsCompute<MotorData>('/api/robotics/motor-gearhead', {
    voltage,
    resistance,
    torque_constant: kt,
    rotor_inertia: rotorInertiaE6 * 1e-6,
    gear_ratio: gearRatio,
    gear_efficiency: efficiency,
    load_inertia: loadInertia,
    load_torque: loadTorque,
    load_speed: loadSpeed,
  })

  // Plot area for the torque-speed line
  const W = 340
  const H = 300
  const m = { l: 48, r: 14, t: 16, b: 40 }
  const pw = W - m.l - m.r
  const ph = H - m.t - m.b
  const xMax = data ? Math.max(data.output_no_load_speed, loadSpeed) * 1.1 : 1
  const yMax = data ? Math.max(data.output_stall_torque, loadTorque) * 1.1 : 1
  const X = (s: number) => m.l + (s / xMax) * pw
  const Y = (t: number) => m.t + ph - (t / yMax) * ph

  const ok = data?.torque_feasible
  const opColor = !data ? theme.colors.gray[500] : ok ? theme.colors.success : theme.colors.error
  const statusText = !data ? '' : !data.speed_feasible
    ? 'Load speed exceeds the geared no-load speed: pick a lower ratio or higher voltage'
    : ok
      ? 'Feasible: the motor delivers the required torque at this speed'
      : 'Not feasible: required torque lies above the torque-speed line'

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Motor">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="Supply voltage V" value={voltage} unit="V" min={6} max={48} step={1} digits={0} onChange={setVoltage} />
              <SliderField label="Winding resistance R" value={resistance} unit="Ω" min={0.2} max={5} step={0.1} onChange={setResistance} />
              <SliderField label="Torque constant kₜ" value={kt} unit="N·m/A" min={0.01} max={0.15} step={0.005} digits={3} onChange={setKt} />
              <SliderField label="Rotor inertia Jₘ" value={rotorInertiaE6} unit="×10⁻⁶ kg·m²" min={1} max={100} step={1} digits={0} onChange={setRotorInertiaE6} />
            </div>
          </Card>

          <Card title="Gearhead & Load">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderField label="Gear ratio N" value={gearRatio} unit=": 1" min={1} max={200} step={1} digits={0} onChange={setGearRatio} />
              <SliderField label="Gearhead efficiency η" value={efficiency} unit="" min={0.3} max={1} step={0.01} digits={2} onChange={setEfficiency} />
              <SliderField label="Load inertia J_L" value={loadInertia} unit="kg·m²" min={0} max={0.1} step={0.002} digits={3} onChange={setLoadInertia} />
              <SliderField label="Load torque τ_L" value={loadTorque} unit="N·m" min={0} max={40} step={0.5} onChange={setLoadTorque} />
              <SliderField label="Load speed ω_L" value={loadSpeed} unit="rad/s" min={0} max={30} step={0.5} onChange={setLoadSpeed} />
            </div>
          </Card>

          <Card title="Results">
            <Status loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Motor stall torque" value={`${data.stall_torque.toFixed(3)} N·m`} />
                <ResultRow label="Motor no-load speed" value={`${data.no_load_speed_rpm.toFixed(0)} rpm`} />
                <ResultRow label="Output stall torque" value={`${data.output_stall_torque.toFixed(2)} N·m`} />
                <ResultRow label="Output no-load speed" value={`${data.output_no_load_speed.toFixed(2)} rad/s`} />
                <ResultRow label="Motor torque needed / available" value={`${data.torque_required.toFixed(3)} / ${data.torque_available.toFixed(3)} N·m`} color={opColor} />
                <ResultRow label="Current at load" value={`${data.current_required.toFixed(2)} A`} />
                <ResultRow label="Reflected inertia J_ref" value={`${(data.reflected_inertia * 1e6).toFixed(1)} ×10⁻⁶ kg·m²`} />
                <ResultRow label="Inertia-matched ratio √(J_L/Jₘ)" value={data.optimal_gear_ratio.toFixed(1)} />
                <ResultRow label="Spare load acceleration" value={data.load_acceleration === null ? 'n/a' : `${data.load_acceleration.toFixed(0)} rad/s²`} last />
                <Banner color={opColor}>{statusText}</Banner>
              </div>
            )}
          </Card>

          <Card title="Key Equations">
            <EquationBox lines={['τ_stall = kₜV/R,  ω₀ = V/kₜ', 'τ_m(ω) = τ_stall (1 − ω/ω₀)', 'J_ref = Jₘ + J_L / N²', 'τ_m,req = τ_L / (N η),  ω_m = N ω_L', 'N_opt = √(J_L / Jₘ)']} />
          </Card>
        </div>

        <div>
          <Card title="Output Torque-Speed Curve">
            <svg width="100%" height="320" viewBox={`0 0 ${W} ${H + 20}`} style={svgFrameStyle}>
              {/* Axes */}
              <line x1={m.l} y1={m.t} x2={m.l} y2={m.t + ph} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <line x1={m.l} y1={m.t + ph} x2={m.l + pw} y2={m.t + ph} stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <text x={m.l + pw / 2} y={H + 8} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>Output speed (rad/s)</text>
              <text x={12} y={m.t + ph / 2} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary} transform={`rotate(-90 12 ${m.t + ph / 2})`}>Output torque (N·m)</text>
              {data && (
                <>
                  {[0, 0.5, 1].map((f) => (
                    <g key={f}>
                      <text x={m.l - 5} y={Y(f * yMax / 1.1) + 4} fontSize="10" textAnchor="end" fill={theme.colors.text.light}>{(f * yMax / 1.1).toFixed(1)}</text>
                      <text x={X(f * xMax / 1.1)} y={m.t + ph + 14} fontSize="10" textAnchor="middle" fill={theme.colors.text.light}>{(f * xMax / 1.1).toFixed(1)}</text>
                    </g>
                  ))}
                  {/* Feasible region under the line */}
                  <polygon
                    points={`${X(0)},${Y(0)} ${X(0)},${Y(data.output_stall_torque)} ${X(data.output_no_load_speed)},${Y(0)}`}
                    fill={theme.colors.lightBlue[100]} fillOpacity="0.7"
                  />
                  <polyline
                    points={data.curve.map((p) => `${X(p.speed)},${Y(p.torque)}`).join(' ')}
                    fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="3"
                  />
                  {/* Load operating point */}
                  <circle cx={X(loadSpeed)} cy={Y(loadTorque)} r="7" fill={opColor} stroke="white" strokeWidth="2" />
                  <text x={X(loadSpeed) + 10} y={Y(loadTorque) - 8} fontSize="11" fontWeight={700} fill={opColor}>load</text>
                </>
              )}
            </svg>
            <div style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
              Any load point inside the shaded triangle can be driven continuously at this voltage (ignoring thermal limits).
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/**
 * Control-Volume Momentum - Interactive Topic
 *
 * Students aim a water jet at a vane, change the turning angle and the vane
 * speed, and watch the momentum-balance force, wheel power and efficiency update.
 */

import { useState } from 'react'
import { useFluidsSimulation } from '../hooks/useFluidsSimulation'
import { theme } from '../styles/theme'
import { Banner, Card, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './fluids/FluidsUI'

interface CVData {
  jet_area: number
  mass_flow: number
  relative_velocity: number
  fixed_force_x: number
  fixed_force_y: number
  single_force_x: number
  single_force_y: number
  wheel_force_x: number
  wheel_power: number
  jet_power: number
  wheel_efficiency: number
  efficiency_curve: { speed_ratio: number[]; efficiency: number[] }
}

export default function ControlVolumeMomentumAnalysis() {
  const [diameterMm, setDiameterMm] = useState(50)
  const [velocity, setVelocity] = useState(20)
  const [angle, setAngle] = useState(180)
  const [vaneSpeed, setVaneSpeed] = useState(0)

  const u = Math.min(vaneSpeed, velocity)
  const { data, loading, error } = useFluidsSimulation<CVData>('/api/control-volume-momentum/compute', {
    jet_diameter: diameterMm / 1000,
    jet_velocity: velocity,
    density: 1000,
    turning_angle: angle,
    vane_velocity: u,
  })

  // --- Visualization geometry ---
  const theta = (angle * Math.PI) / 180
  const hitX = 200
  const hitY = 150
  const jetPx = 6 + diameterMm * 0.2
  const outLen = 110
  const outX = hitX + outLen * Math.cos(theta)
  const outY = hitY - outLen * Math.sin(theta)
  const forceLen = 20 + 100 * ((1 - Math.cos(theta)) / 2)
  const efficiency = data ? data.wheel_efficiency : 0

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Jet Diameter d" value={diameterMm} display={`${diameterMm.toFixed(0)} mm`} min={10} max={100} step={1} onChange={setDiameterMm} disabled={loading} />
              <SliderRow label="Jet Speed V" value={velocity} display={`${velocity.toFixed(0)} m/s`} min={5} max={50} step={1} onChange={setVelocity} disabled={loading} />
              <SliderRow label="Turning Angle θ" value={angle} display={`${angle.toFixed(0)}°`} min={0} max={180} step={1} onChange={setAngle} disabled={loading} />
              <SliderRow label="Vane Speed u" value={u} display={`${u.toFixed(1)} m/s`} min={0} max={velocity} step={0.5} onChange={setVaneSpeed} disabled={loading} />
            </div>
            <div style={{ marginTop: theme.spacing[3], padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono }}>
              Water, ρ = 1000 kg/m³
            </div>
          </Card>

          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Mass flow (ṁ = ρAV)" value={`${data.mass_flow.toFixed(2)} kg/s`} />
                <ResultRow label="Force, fixed vane (x)" value={`${data.fixed_force_x.toFixed(0)} N`} />
                <ResultRow label="Force, fixed vane (y)" value={`${data.fixed_force_y.toFixed(0)} N`} />
                <ResultRow label="Force, single moving vane (x)" value={`${data.single_force_x.toFixed(0)} N`} />
                <ResultRow label="Force, wheel of vanes (x)" value={`${data.wheel_force_x.toFixed(0)} N`} />
                <ResultRow label="Wheel power (F·u)" value={`${(data.wheel_power / 1000).toFixed(2)} kW`} />
                <ResultRow label="Jet power (½ṁV²)" value={`${(data.jet_power / 1000).toFixed(2)} kW`} />
                <Banner color={efficiency > 0.8 ? theme.colors.success : theme.colors.warning}>
                  Wheel efficiency {(efficiency * 100).toFixed(1)}%
                </Banner>
              </>
            )}
          </ResultsCard>

          <EquationsCard
            lines={[
              'Fixed: F = ρAV²(1 − cos θ)',
              'Single moving: F = ρA(V−u)²(1 − cos θ)',
              'Wheel: F = ρAV(V−u)(1 − cos θ)',
              'η = 2(u/V)(1 − u/V)(1 − cos θ)',
            ]}
          />
        </div>

        <div>
          <Card title="Jet on a Vane">
            <svg width="100%" height="300" viewBox="0 0 340 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              {/* Incoming jet */}
              <rect x="10" y={hitY - jetPx / 2} width={hitX - 10} height={jetPx} fill={theme.colors.lightBlue[300]} />
              <text x="14" y={hitY - jetPx / 2 - 8} fontSize="11" fill={theme.colors.text.secondary}>jet V</text>
              {/* Outgoing (deflected) jet */}
              <line x1={hitX} y1={hitY} x2={outX} y2={outY} stroke={theme.colors.lightBlue[300]} strokeWidth={jetPx} strokeLinecap="butt" />
              {/* Vane */}
              <circle cx={hitX} cy={hitY} r="6" fill={theme.colors.text.primary} />
              <line x1={hitX} y1={hitY} x2={hitX + 45 * Math.cos(theta)} y2={hitY - 45 * Math.sin(theta)} stroke={theme.colors.text.primary} strokeWidth="5" strokeLinecap="round" />
              {/* Force on vane */}
              <line x1={hitX} y1={hitY + 60} x2={hitX + forceLen} y2={hitY + 60} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#cvArrow)" />
              <text x={hitX + 4} y={hitY + 80} fontSize="12" fontWeight={700} fill={theme.colors.error}>F on vane</text>
              {/* Angle label */}
              <path d={`M ${hitX + 36} ${hitY} A 36 36 0 0 0 ${hitX + 36 * Math.cos(theta)} ${hitY - 36 * Math.sin(theta)}`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
              <text x={hitX + 44} y={hitY - 14} fontSize="12" fill={theme.colors.accent[600]}>θ = {angle.toFixed(0)}°</text>
              {u > 0 && (
                <text x={hitX - 20} y={hitY + 30} fontSize="11" fill={theme.colors.text.secondary}>vane moves at u →</text>
              )}
              <defs>
                <marker id="cvArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.error} />
                </marker>
              </defs>
            </svg>
          </Card>

          <Card title="Wheel Efficiency vs Speed Ratio" last>
            {data && (
              <LineChart
                xs={data.efficiency_curve.speed_ratio}
                series={[{ label: 'η = 2(u/V)(1 − u/V)(1 − cos θ)', color: theme.colors.lightBlue[600], ys: data.efficiency_curve.efficiency }]}
                xLabel="u / V"
                yLabel="Efficiency"
                marker={{ x: velocity > 0 ? u / velocity : 0, y: efficiency, label: `${(efficiency * 100).toFixed(0)}%` }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

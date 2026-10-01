/**
 * Belt & Chain Drives - Interactive Topic
 *
 * Belt mode: pulley sizes, center distance, friction and tight-side tension
 * give the wrap angle, capstan tension ratio, slack tension and power at the
 * verge of slipping. Chain mode: sprocket teeth and chain pull give the speed
 * ratio, chain speed and power.
 */

import { useState } from 'react'
import { useStaticsMachineSimulation } from '../hooks/useStaticsMachineSimulation'
import { theme } from '../styles/theme'
import { CardTitle, EquationsCard, ModeTabs, ResultRow, ResultsShell, SliderRow } from './StaticsMachineUi'

interface BeltData {
  speed_ratio: number
  driven_rpm: number
  belt_speed: number
  wrap_angle_deg: number
  belt_length: number
  effective_friction: number
  tension_ratio: number
  slack_tension: number
  power_kw: number
  torque_driver: number
}

interface ChainData {
  speed_ratio: number
  driven_rpm: number
  driver_pitch_diameter: number
  driven_pitch_diameter: number
  chain_speed: number
  power_kw: number
  torque_driver: number
}

type Mode = 'belt' | 'chain'

export default function BeltChainDrivesAnalysis() {
  const [mode, setMode] = useState<Mode>('belt')

  // Belt
  const [d1, setD1] = useState(150)
  const [d2, setD2] = useState(300)
  const [center, setCenter] = useState(432)
  const [rpm, setRpm] = useState(1750)
  const [mu, setMu] = useState(0.3)
  const [t1, setT1] = useState(500)
  const [vBelt, setVBelt] = useState(false)

  // Chain
  const [pitch, setPitch] = useState(12.7)
  const [z1, setZ1] = useState(19)
  const [z2, setZ2] = useState(38)
  const [chainRpm, setChainRpm] = useState(1000)
  const [pull, setPull] = useState(1500)

  const belt = useStaticsMachineSimulation<BeltData>(
    mode === 'belt' ? '/api/belt-chain-drives/belt' : null,
    { driver_diameter: d1, driven_diameter: d2, center_distance: center, driver_rpm: rpm, friction_coefficient: mu, tight_tension: t1, groove_angle_deg: vBelt ? 40 : undefined },
  )
  const chain = useStaticsMachineSimulation<ChainData>(
    mode === 'chain' ? '/api/belt-chain-drives/chain' : null,
    { chain_pitch: pitch, driver_teeth: z1, driven_teeth: z2, driver_rpm: chainRpm, chain_pull: pull },
  )

  const active = mode === 'belt' ? belt : chain

  // --- Belt schematic (open belt, tangent lines) ---
  const scale = 240 / Math.max(center, 1)
  const r1 = Math.min(70, (d1 / 2) * scale)
  const r2 = Math.min(70, (d2 / 2) * scale)
  const x1 = 40 + Math.max(r1, r2)
  const x2 = x1 + center * scale
  const cy = 130
  const alpha = Math.asin(Math.min(0.999, Math.abs(r2 - r1) / (x2 - x1)))
  // Tangent points for an open belt: upper/lower common tangents
  const sgn = r2 >= r1 ? 1 : -1
  const ang = Math.PI / 2 + sgn * alpha
  const p = (x: number, r: number, a: number, s: number) => `${x + r * Math.cos(a)},${cy - s * r * Math.sin(a)}`
  const beltPath = `M ${p(x1, r1, ang, 1)} L ${p(x2, r2, ang, 1)} L ${p(x2, r2, ang, -1)} L ${p(x1, r1, ang, -1)} Z`

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <ModeTabs<Mode> modes={[{ id: 'belt', label: 'Belt drive' }, { id: 'chain', label: 'Chain drive' }]} value={mode} onChange={setMode} />
      <div className="grid-container">
        <div>
          {mode === 'belt' ? (
            <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Driver Pulley d₁" valueText={`${d1} mm`} min={50} max={400} step={5} value={d1} onChange={setD1} />
              <SliderRow label="Driven Pulley d₂" valueText={`${d2} mm`} min={50} max={600} step={5} value={d2} onChange={setD2} />
              <SliderRow label="Center Distance C" valueText={`${center} mm`} min={200} max={1500} step={5} value={center} onChange={setCenter} />
              <SliderRow label="Driver Speed N₁" valueText={`${rpm} rpm`} min={100} max={5000} step={50} value={rpm} onChange={setRpm} />
              <SliderRow label="Friction Coefficient μ" valueText={mu.toFixed(2)} min={0.1} max={0.8} step={0.01} value={mu} onChange={setMu} />
              <SliderRow label="Tight-Side Tension T₁" valueText={`${t1} N`} min={50} max={2000} step={10} value={t1} onChange={setT1} />
              <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <input type="checkbox" checked={vBelt} onChange={(e) => setVBelt(e.target.checked)} />
                V-belt (40° groove: μ_eff = μ / sin 20°)
              </label>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Chain Pitch p" valueText={`${pitch.toFixed(1)} mm`} min={6.35} max={25.4} step={0.05} value={pitch} onChange={setPitch} />
              <SliderRow label="Driver Sprocket z₁" valueText={`${z1} teeth`} min={9} max={60} step={1} value={z1} onChange={setZ1} />
              <SliderRow label="Driven Sprocket z₂" valueText={`${z2} teeth`} min={9} max={120} step={1} value={z2} onChange={setZ2} />
              <SliderRow label="Driver Speed N₁" valueText={`${chainRpm} rpm`} min={50} max={5000} step={50} value={chainRpm} onChange={setChainRpm} />
              <SliderRow label="Chain Pull F" valueText={`${pull} N`} min={50} max={5000} step={50} value={pull} onChange={setPull} />
            </div>
          )}

          <ResultsShell loading={active.loading} error={active.error} hasData={!!active.data}>
            {mode === 'belt' && belt.data && (
              <>
                <ResultRow label="Output speed N₂" value={`${belt.data.driven_rpm.toFixed(0)} rpm`} />
                <ResultRow label="Belt speed v" value={`${belt.data.belt_speed.toFixed(2)} m/s`} />
                <ResultRow label="Wrap angle θ (small pulley)" value={`${belt.data.wrap_angle_deg.toFixed(1)}°`} color={belt.data.wrap_angle_deg < 120 ? theme.colors.warning : undefined} />
                <ResultRow label="Tension ratio e^(μθ)" value={belt.data.tension_ratio.toFixed(2)} />
                <ResultRow label="Slack-side tension T₂" value={`${belt.data.slack_tension.toFixed(0)} N`} />
                <ResultRow label="Belt length" value={`${belt.data.belt_length.toFixed(0)} mm`} />
                <ResultRow label="Torque on driver" value={`${belt.data.torque_driver.toFixed(1)} N·m`} />
                <ResultRow label="Power at slip limit" value={`${belt.data.power_kw.toFixed(2)} kW`} last />
              </>
            )}
            {mode === 'chain' && chain.data && (
              <>
                <ResultRow label="Output speed N₂" value={`${chain.data.driven_rpm.toFixed(0)} rpm`} />
                <ResultRow label="Speed ratio z₁/z₂" value={chain.data.speed_ratio.toFixed(3)} />
                <ResultRow label="Driver pitch diameter" value={`${chain.data.driver_pitch_diameter.toFixed(1)} mm`} />
                <ResultRow label="Driven pitch diameter" value={`${chain.data.driven_pitch_diameter.toFixed(1)} mm`} />
                <ResultRow label="Chain speed v" value={`${chain.data.chain_speed.toFixed(2)} m/s`} />
                <ResultRow label="Torque on driver" value={`${chain.data.torque_driver.toFixed(1)} N·m`} />
                <ResultRow label="Power" value={`${chain.data.power_kw.toFixed(2)} kW`} last />
              </>
            )}
          </ResultsShell>

          <EquationsCard
            lines={
              mode === 'belt'
                ? ['N₂/N₁ = d₁/d₂', 'θ = π − 2 asin((d₂−d₁)/2C)', 'T₁/T₂ = e^(μθ)', 'P = (T₁ − T₂) v']
                : ['N₂/N₁ = z₁/z₂', 'd = p / sin(π/z)', 'v = z p N / 60', 'P = F v']
            }
          />
        </div>

        <div>
          <div className="card">
            <CardTitle>{mode === 'belt' ? 'Open Belt Drive' : 'Chain Drive'}</CardTitle>
            {mode === 'belt' ? (
              <svg width="100%" height="260" viewBox="0 0 340 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label="Open belt drive between two pulleys">
                <path d={beltPath} fill="none" stroke={theme.colors.gray[600]} strokeWidth="3" />
                <circle cx={x1} cy={cy} r={r1} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
                <circle cx={x2} cy={cy} r={r2} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
                <circle cx={x1} cy={cy} r="3" fill={theme.colors.text.primary} />
                <circle cx={x2} cy={cy} r="3" fill={theme.colors.text.primary} />
                <text x={x1} y={cy + r1 + 16} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>driver</text>
                <text x={x2} y={cy + r2 + 16} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>driven</text>
                <text x={(x1 + x2) / 2} y={cy - Math.max(r1, r2) - 14} fontSize="12" fontWeight={700} fill={theme.colors.error} textAnchor="middle">T₁ (tight)</text>
                <text x={(x1 + x2) / 2} y={cy + Math.max(r1, r2) + 22} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]} textAnchor="middle">T₂ (slack)</text>
              </svg>
            ) : (
              <svg width="100%" height="260" viewBox="0 0 340 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label="Chain drive between two sprockets">
                {(() => {
                  const rr1 = Math.min(60, 12 + z1 * 1.1)
                  const rr2 = Math.min(90, 12 + z2 * 1.1)
                  const ax = 40 + rr2
                  const bx = 300 - rr1 - 10
                  return (
                    <>
                      <line x1={ax} y1={130 - rr2} x2={bx} y2={130 - rr1} stroke={theme.colors.gray[600]} strokeWidth="3" strokeDasharray="6 3" />
                      <line x1={ax} y1={130 + rr2} x2={bx} y2={130 + rr1} stroke={theme.colors.gray[600]} strokeWidth="3" strokeDasharray="6 3" />
                      <circle cx={ax} cy={130} r={rr2} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" strokeDasharray="3 3" />
                      <circle cx={bx} cy={130} r={rr1} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" strokeDasharray="3 3" />
                      <text x={bx} y={130 + rr1 + 16} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>{z1}T driver</text>
                      <text x={ax} y={130 + rr2 + 16} fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>{z2}T driven</text>
                    </>
                  )
                })()}
              </svg>
            )}
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              {mode === 'belt'
                ? 'Pulley and belt drawn to a common scale. Power is computed with the belt on the verge of slipping on the smaller pulley.'
                : 'A chain engages sprocket teeth, so it does not slip: capacity is limited by chain strength, not friction.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

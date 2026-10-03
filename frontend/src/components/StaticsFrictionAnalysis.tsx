/**
 * Friction & Impending Slip - Interactive Topic
 *
 * Three classic dry-friction problems: a block on an incline pushed by P,
 * a wedge lifting a guided block, and a rope wrapped around a fixed post.
 */

import { useState } from 'react'
import { useStaticsMachineSimulation } from '../hooks/useStaticsMachineSimulation'
import { theme } from '../styles/theme'
import { Banner, CardTitle, EquationsCard, ModeTabs, ResultRow, ResultsShell, SliderRow } from './StaticsMachineUi'

interface InclineData {
  normal_force: number
  max_friction: number
  required_friction: number
  p_min: number
  p_max: number
  friction_angle_deg: number
  self_locking: boolean
  status: string
  utilization: number
}

interface WedgeData {
  friction_angle_deg: number
  drive_force: number
  release_force: number
  self_locking: boolean
  mechanical_advantage: number
}

interface CapstanData {
  wrap_angle_rad: number
  tension_ratio: number
  holding_force: number
}

type Mode = 'incline' | 'wedge' | 'capstan'

export default function StaticsFrictionAnalysis() {
  const [mode, setMode] = useState<Mode>('incline')
  const [weight, setWeight] = useState(500)
  const [angle, setAngle] = useState(20)
  const [mu, setMu] = useState(0.35)
  const [push, setPush] = useState(0)
  const [wedgeAngle, setWedgeAngle] = useState(10)
  const [turns, setTurns] = useState(1.5)

  const incline = useStaticsMachineSimulation<InclineData>(mode === 'incline' ? '/api/statics-friction/incline' : null, {
    weight, angle_deg: angle, mu, applied_force: push,
  })
  const wedge = useStaticsMachineSimulation<WedgeData>(mode === 'wedge' ? '/api/statics-friction/wedge' : null, {
    weight, wedge_angle_deg: wedgeAngle, mu,
  })
  const capstan = useStaticsMachineSimulation<CapstanData>(mode === 'capstan' ? '/api/statics-friction/capstan' : null, {
    load: weight, mu, wrap_turns: turns,
  })
  const active = mode === 'incline' ? incline : mode === 'wedge' ? wedge : capstan

  const statusColor = incline.data?.status === 'static' ? theme.colors.success : theme.colors.error

  // Incline drawing
  const a = (angle * Math.PI) / 180
  const L = 200
  const bx = 40
  const by = 220
  const topX = bx + L * Math.cos(a)
  const topY = by - L * Math.sin(a)
  const blockT = 0.5
  const cxp = bx + L * blockT * Math.cos(a)
  const cyp = by - L * blockT * Math.sin(a)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <ModeTabs<Mode>
        modes={[{ id: 'incline', label: 'Block on incline' }, { id: 'wedge', label: 'Wedge' }, { id: 'capstan', label: 'Rope on post' }]}
        value={mode}
        onChange={setMode}
      />
      <div className="grid-container">
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label={mode === 'capstan' ? 'Load T₁' : 'Weight W'} valueText={`${weight} N`} min={50} max={5000} step={50} value={weight} onChange={setWeight} />
            <SliderRow label="Friction Coefficient μ" valueText={mu.toFixed(2)} min={0} max={1} step={0.01} value={mu} onChange={setMu} />
            {mode === 'incline' && (
              <>
                <SliderRow label="Incline Angle α" valueText={`${angle}°`} min={0} max={60} step={1} value={angle} onChange={setAngle} />
                <SliderRow label="Push P (up-slope)" valueText={`${push} N`} min={0} max={Math.max(100, weight * 1.5)} step={5} value={push} onChange={setPush} />
              </>
            )}
            {mode === 'wedge' && <SliderRow label="Wedge Angle θ" valueText={`${wedgeAngle}°`} min={1} max={40} step={1} value={wedgeAngle} onChange={setWedgeAngle} />}
            {mode === 'capstan' && <SliderRow label="Turns of Rope" valueText={turns.toFixed(2)} min={0} max={4} step={0.05} value={turns} onChange={setTurns} />}
          </div>

          <ResultsShell loading={active.loading} error={active.error} hasData={!!active.data}>
            {mode === 'incline' && incline.data && (
              <>
                <ResultRow label="Normal force N" value={`${incline.data.normal_force.toFixed(1)} N`} />
                <ResultRow label="Max friction μN" value={`${incline.data.max_friction.toFixed(1)} N`} />
                <ResultRow label="Friction needed for rest" value={`${incline.data.required_friction.toFixed(1)} N`} />
                <ResultRow label="Smallest P to hold (no down-slip)" value={`${incline.data.p_min.toFixed(1)} N`} />
                <ResultRow label="Largest P before up-slip" value={`${incline.data.p_max.toFixed(1)} N`} />
                <ResultRow label="Friction angle φ = atan μ" value={`${incline.data.friction_angle_deg.toFixed(1)}°`} last />
                <Banner color={statusColor}>
                  {incline.data.status === 'static' ? `At rest (using ${(incline.data.utilization * 100).toFixed(0)}% of available friction)` : `Block ${incline.data.status}`}
                </Banner>
                {incline.data.self_locking && <Banner color={theme.colors.accent[600]}>α ≤ φ: self-locking, holds with P = 0</Banner>}
              </>
            )}
            {mode === 'wedge' && wedge.data && (
              <>
                <ResultRow label="Friction angle φ" value={`${wedge.data.friction_angle_deg.toFixed(1)}°`} />
                <ResultRow label="Force to drive wedge in" value={`${wedge.data.drive_force.toFixed(0)} N`} />
                <ResultRow label="Force to pull wedge out" value={`${wedge.data.release_force.toFixed(0)} N`} />
                <ResultRow label="Mechanical advantage W/P" value={wedge.data.mechanical_advantage.toFixed(2)} last />
                <Banner color={wedge.data.self_locking ? theme.colors.success : theme.colors.warning}>
                  {wedge.data.self_locking ? 'θ ≤ 2φ: self-locking, stays in when released' : 'θ > 2φ: wedge pops out when released'}
                </Banner>
              </>
            )}
            {mode === 'capstan' && capstan.data && (
              <>
                <ResultRow label="Wrap angle β" value={`${capstan.data.wrap_angle_rad.toFixed(2)} rad`} />
                <ResultRow label="Tension ratio e^(μβ)" value={capstan.data.tension_ratio.toFixed(2)} />
                <ResultRow label="Holding force T₂" value={`${capstan.data.holding_force.toFixed(1)} N`} last />
              </>
            )}
          </ResultsShell>

          <EquationsCard
            lines={
              mode === 'incline'
                ? ['F ≤ μN,  N = W cos α', 'P_min = W(sin α − μ cos α)', 'P_max = W(sin α + μ cos α)', 'φ = atan μ']
                : mode === 'wedge'
                  ? ['P_in = W[tan(θ+φ) + tan φ]', 'P_out = W[tan φ − tan(θ−φ)]', 'self-locking if θ ≤ 2φ']
                  : ['T₁ / T₂ = e^(μβ)', 'β = 2π × turns']
            }
          />
        </div>

        <div>
          <div className="card">
            <CardTitle>{mode === 'incline' ? 'Block on Incline' : mode === 'wedge' ? 'Wedge' : 'Rope Around a Post'}</CardTitle>
            <svg width="100%" height="260" viewBox="0 0 320 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label={`Friction illustration: ${mode}`}>
              {mode === 'incline' && (
                <>
                  <polygon points={`${bx},${by} ${topX},${by} ${topX},${topY}`} fill={theme.colors.gray[200]} stroke={theme.colors.text.primary} strokeWidth="2" />
                  <g transform={`translate(${cxp} ${cyp}) rotate(${-angle})`}>
                    <rect x="-25" y="-34" width="50" height="34" fill={incline.data && incline.data.status !== 'static' ? theme.colors.error : theme.colors.lightBlue[600]} fillOpacity="0.85" stroke={theme.colors.text.primary} strokeWidth="2" />
                    {push > 0 && (
                      <>
                        <line x1="0" y1="-17" x2="70" y2="-17" stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#fricArrow)" />
                        <text x="40" y="-24" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>P</text>
                      </>
                    )}
                  </g>
                  <path d={`M ${bx + 40} ${by} A 40 40 0 0 0 ${bx + 40 * Math.cos(a)} ${by - 40 * Math.sin(a)}`} fill="none" stroke={theme.colors.text.secondary} />
                  <text x={bx + 48} y={by - 6} fontSize="12" fill={theme.colors.text.secondary}>α</text>
                </>
              )}
              {mode === 'wedge' && (() => {
                const t = (wedgeAngle * Math.PI) / 180
                const wl = Math.min(160, 110 / Math.tan(t))
                const wh = wl * Math.tan(t)
                return (
                  <>
                    <line x1="20" y1="200" x2="300" y2="200" stroke={theme.colors.text.primary} strokeWidth="4" />
                    <polygon points={`80,200 ${80 + wl},200 ${80 + wl},${200 - wh}`} fill={theme.colors.lightBlue[600]} fillOpacity="0.8" stroke={theme.colors.text.primary} strokeWidth="2" />
                    <polygon
                      points={`110,${200 - 30 * Math.tan(t)} 190,${200 - 110 * Math.tan(t)} 190,${200 - wl * Math.tan(t) - 40} 110,${200 - wl * Math.tan(t) - 40}`}
                      fill={theme.colors.gray[300]}
                      stroke={theme.colors.text.primary}
                      strokeWidth="2"
                    />
                    <line x1="150" y1={200 - wl * Math.tan(t) - 40 - 38} x2="150" y2={200 - wl * Math.tan(t) - 42} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#fricArrowR)" />
                    <line x1={80 + wl + 40} y1="190" x2={80 + wl + 4} y2="190" stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#fricArrow)" />
                    <text x={80 + wl + 20} y="182" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>P</text>
                    <text x="160" y={200 - wl * Math.tan(t) - 62} fontSize="12" fontWeight={700} fill={theme.colors.error}>W ↓</text>
                    <text x="108" y="195" fontSize="12" fill="white">θ</text>
                  </>
                )
              })()}
              {mode === 'capstan' && (
                <>
                  <circle cx="160" cy="130" r="45" fill={theme.colors.gray[300]} stroke={theme.colors.text.primary} strokeWidth="2" />
                  <path d={`M 115 130 A 45 45 0 0 0 205 130`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="4" />
                  <line x1="115" y1="130" x2="115" y2="30" stroke={theme.colors.accent[600]} strokeWidth="4" />
                  <line x1="205" y1="130" x2="205" y2="200" stroke={theme.colors.accent[600]} strokeWidth="4" />
                  <text x="105" y="40" fontSize="12" fontWeight={700} fill={theme.colors.error} textAnchor="end">T₁ = load</text>
                  <text x="215" y="190" fontSize="12" fontWeight={700} fill={theme.colors.success}>T₂ = hold</text>
                  <text x="160" y="240" fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>{turns.toFixed(2)} turns wrapped</text>
                </>
              )}
              <defs>
                <marker id="fricArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
                </marker>
                <marker id="fricArrowR" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

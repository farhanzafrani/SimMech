/**
 * Free & Damped Vibration - Interactive Topic
 *
 * Students set mass, stiffness, damping ratio and initial conditions of a
 * single-DOF mass-spring-damper and watch the free response change character
 * from undamped to underdamped, critically damped, and overdamped.
 */

import { useState } from 'react'
import { useDynamicsControlsSimulation } from '../hooks/useDynamicsControlsSimulation'
import { theme } from '../styles/theme'
import { Panel, SliderRow, ResultRow, StatusPill, EquationList, LoadingAndError, LinePlot } from './DynCtrlWidgets'

interface FreeVibrationData {
  natural_frequency: number
  natural_frequency_hz: number
  critical_damping: number
  damping_ratio: number
  damped_frequency: number | null
  period: number | null
  log_decrement: number | null
  amplitude_ratio_per_cycle: number | null
  settling_time: number | null
  regime: string
  time_series: number[]
  displacement_series: number[]
  envelope_series: number[] | null
}

const REGIME_COLORS: Record<string, string> = {
  undamped: theme.colors.warning,
  underdamped: theme.colors.success,
  'critically damped': theme.colors.info,
  overdamped: theme.colors.spectrum.violet,
}

export default function FreeVibrationAnalysis() {
  const [mass, setMass] = useState(2)
  const [stiffness, setStiffness] = useState(800)
  const [zeta, setZeta] = useState(0.1)
  const [x0mm, setX0mm] = useState(50)
  const [v0, setV0] = useState(0)
  const [progress, setProgress] = useState(0)

  // The student sets zeta; the engine takes the physical damper c = 2 zeta sqrt(k m)
  const damping = 2 * zeta * Math.sqrt(stiffness * mass)

  const { data, loading, error } = useDynamicsControlsSimulation<FreeVibrationData, object>('/api/free-vibration/compute', {
    mass,
    stiffness,
    damping,
    initial_displacement: x0mm / 1000,
    initial_velocity: v0 / 1000,
  })

  const regimeColor = data ? REGIME_COLORS[data.regime] ?? theme.colors.info : theme.colors.info

  // Scrubber -> sample index -> mass position
  const idx = data ? Math.min(Math.round(progress * (data.time_series.length - 1)), data.time_series.length - 1) : 0
  const tNow = data ? data.time_series[idx] : 0
  const xNow = data ? data.displacement_series[idx] : 0
  const xScale = data ? Math.max(...data.displacement_series.map(Math.abs), 1e-9) : 1
  const massX = 250 + (xNow / xScale) * 70

  const springPath = (() => {
    const xStart = 40
    const xEnd = massX - 30
    const coils = 10
    let p = `M ${xStart} 90 L ${xStart + 10} 90`
    const run = xEnd - xStart - 20
    for (let i = 0; i < coils; i++) {
      p += ` L ${xStart + 10 + (run * (i + 0.5)) / coils} ${i % 2 === 0 ? 74 : 106}`
    }
    p += ` L ${xEnd - 10} 90 L ${xEnd} 90`
    return p
  })()

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label="Mass m" valueText={`${mass.toFixed(1)} kg`} min={0.5} max={10} step={0.1} value={mass} onChange={setMass} disabled={loading} />
            <SliderRow label="Stiffness k" valueText={`${stiffness.toFixed(0)} N/m`} min={100} max={5000} step={50} value={stiffness} onChange={setStiffness} disabled={loading} />
            <SliderRow label="Damping ratio ζ" valueText={`${zeta.toFixed(2)}  (c = ${damping.toFixed(1)} N·s/m)`} min={0} max={2} step={0.01} value={zeta} onChange={setZeta} disabled={loading} />
            <SliderRow label="Initial displacement x₀" valueText={`${x0mm.toFixed(0)} mm`} min={-100} max={100} step={1} value={x0mm} onChange={setX0mm} disabled={loading} />
            <SliderRow label="Initial velocity v₀" valueText={`${v0.toFixed(0)} mm/s`} min={-1000} max={1000} step={10} value={v0} onChange={setV0} disabled={loading} />
          </div>

          <Panel title="Results">
            <LoadingAndError loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Natural frequency (ωₙ)" value={`${data.natural_frequency.toFixed(2)} rad/s (${data.natural_frequency_hz.toFixed(2)} Hz)`} />
                <ResultRow label="Critical damping (c_c)" value={`${data.critical_damping.toFixed(1)} N·s/m`} />
                <ResultRow label="Damping ratio (ζ)" value={data.damping_ratio.toFixed(3)} />
                <ResultRow label="Damped frequency (ω_d)" value={data.damped_frequency !== null ? `${data.damped_frequency.toFixed(2)} rad/s` : '—'} />
                <ResultRow label="Damped period" value={data.period !== null ? `${data.period.toFixed(3)} s` : '—'} />
                <ResultRow label="Log decrement (δ)" value={data.log_decrement !== null ? data.log_decrement.toFixed(3) : '—'} />
                <ResultRow label="Peak ratio per cycle" value={data.amplitude_ratio_per_cycle !== null ? `${data.amplitude_ratio_per_cycle.toFixed(2)} : 1` : '—'} />
                <ResultRow label="Settling time (≈ 4/ζωₙ)" value={data.settling_time !== null ? `${data.settling_time.toFixed(2)} s` : '∞ (no damping)'} />
                <StatusPill color={regimeColor}>{data.regime.toUpperCase()} (ζ = {data.damping_ratio.toFixed(2)})</StatusPill>
              </div>
            )}
          </Panel>

          <Panel title="Key Equations" marginBottom={false}>
            <EquationList lines={['m ẍ + c ẋ + k x = 0', 'ωₙ = √(k/m),  ζ = c / (2√(km))', 'ω_d = ωₙ √(1 − ζ²)', 'δ = 2πζ / √(1 − ζ²)', 'x(t) = e^(−ζωₙt)(A cos ω_d t + B sin ω_d t)']} />
          </Panel>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <Panel title="Mass-Spring-Damper">
            <svg width="100%" viewBox="0 0 400 180" role="img" aria-label="Mass-spring-damper with displaced mass" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <line x1="40" y1="30" x2="40" y2="150" stroke={theme.colors.text.primary} strokeWidth="4" />
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="40" y1={40 + i * 25} x2="30" y2={50 + i * 25} stroke={theme.colors.gray[500]} strokeWidth="2" />
              ))}
              <path d={springPath} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
              {/* damper: cylinder + piston below the spring */}
              <line x1="40" y1="140" x2={massX - 70} y2="140" stroke={theme.colors.gray[500]} strokeWidth="2" />
              <rect x={massX - 70} y="130" width="40" height="20" fill="none" stroke={theme.colors.gray[600]} strokeWidth="2" />
              <line x1={massX - 60} y1="140" x2={massX - 30} y2="140" stroke={theme.colors.gray[600]} strokeWidth="2" />
              <line x1={massX - 30} y1="140" x2={massX - 30} y2="90" stroke={theme.colors.gray[500]} strokeWidth="2" />
              <rect x={massX - 30} y="60" width="60" height="60" rx="4" fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
              <text x={massX} y="95" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>m</text>
              <line x1="250" y1="35" x2="250" y2="55" stroke={theme.colors.gray[500]} strokeDasharray="3 3" />
              <text x="250" y="30" textAnchor="middle" fontSize="10" fill={theme.colors.text.light}>x = 0</text>
            </svg>
            <div style={{ marginTop: theme.spacing[3] }}>
              <SliderRow label="Scrub through time" valueText={`t = ${tNow.toFixed(2)} s, x = ${(xNow * 1000).toFixed(1)} mm`} min={0} max={1} step={0.005} value={progress} onChange={setProgress} />
            </div>
          </Panel>

          <Panel title="Free Response x(t)" marginBottom={false}>
            {data && (
              <LinePlot
                ariaLabel="Free vibration displacement versus time"
                xLabel="time (s)"
                yLabel="displacement x (m)"
                series={[
                  ...(data.envelope_series
                    ? [
                        { x: data.time_series, y: data.envelope_series, color: theme.colors.gray[400], dash: '5 4', width: 1.5, label: '± envelope' },
                        { x: data.time_series, y: data.envelope_series.map((v) => -v), color: theme.colors.gray[400], dash: '5 4', width: 1.5 },
                      ]
                    : []),
                  { x: data.time_series, y: data.displacement_series, color: theme.colors.lightBlue[600], label: 'x(t)' },
                ]}
                hLines={[{ value: 0, color: theme.colors.gray[500] }]}
                points={[{ x: tNow, y: xNow, color: theme.colors.error }]}
              />
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}

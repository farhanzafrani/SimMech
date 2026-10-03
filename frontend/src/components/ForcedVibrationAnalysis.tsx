/**
 * Forced Vibration & Resonance - Interactive Topic
 *
 * Students sweep the forcing frequency ratio of a harmonically driven
 * mass-spring-damper and read off the magnification factor, phase, and the
 * transmissibility that governs vibration isolation.
 */

import { useState, useEffect } from 'react'
import { useDynamicsControlsSimulation } from '../hooks/useDynamicsControlsSimulation'
import { theme } from '../styles/theme'
import { Panel, SliderRow, ResultRow, StatusPill, EquationList, LoadingAndError, LinePlot } from './DynCtrlWidgets'

interface ForcedVibrationData {
  natural_frequency: number
  natural_frequency_hz: number
  damping_ratio: number
  frequency_ratio: number
  static_deflection: number
  magnification: number
  amplitude: number
  phase_deg: number
  transmissibility: number
  force_transmitted: number
  peak_ratio: number | null
  peak_magnification: number | null
  in_isolation_region: boolean
  near_resonance: boolean
  r_series: number[]
  magnification_series: number[]
  transmissibility_series: number[]
  phase_series: number[]
}

export default function ForcedVibrationAnalysis() {
  const [mass, setMass] = useState(10)
  const [stiffness, setStiffness] = useState(4000)
  const [zeta, setZeta] = useState(0.1)
  const [force, setForce] = useState(100)
  const [ratio, setRatio] = useState(0.5)

  const wn = Math.sqrt(stiffness / mass)
  const damping = 2 * zeta * Math.sqrt(stiffness * mass)

  const { data, loading, error } = useDynamicsControlsSimulation<ForcedVibrationData, object>('/api/forced-vibration/compute', {
    mass,
    stiffness,
    damping,
    force_amplitude: force,
    forcing_frequency: ratio * wn,
  })

  // Animated mass: slowed-down visual frequency, true amplitude ratio and phase
  const [phaseT, setPhaseT] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      setPhaseT((now - start) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const mag = data?.magnification ?? 0
  const phaseRad = data ? (data.phase_deg * Math.PI) / 180 : 0
  const ampPx = Math.min(55, 14 * mag)
  const visualW = 2 * Math.PI * 0.7
  const massX = 260 + ampPx * Math.sin(visualW * phaseT - phaseRad)
  const forceArrow = 22 * Math.sin(visualW * phaseT)

  const status = data
    ? data.near_resonance
      ? { color: theme.colors.error, text: `NEAR RESONANCE: amplitude is ${data.magnification.toFixed(1)}× the static deflection` }
      : data.in_isolation_region
        ? { color: theme.colors.success, text: `ISOLATION REGION (r > √2): only ${(data.transmissibility * 100).toFixed(0)}% of the force reaches the support` }
        : { color: theme.colors.info, text: data.frequency_ratio < 1 ? 'Below resonance: mass moves roughly in phase with the force' : 'Between resonance and √2: motion is amplified' }
    : null

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label="Mass m" valueText={`${mass.toFixed(1)} kg`} min={1} max={50} step={0.5} value={mass} onChange={setMass} disabled={loading} />
            <SliderRow label="Stiffness k" valueText={`${stiffness.toFixed(0)} N/m`} min={500} max={20000} step={100} value={stiffness} onChange={setStiffness} disabled={loading} />
            <SliderRow label="Damping ratio ζ" valueText={zeta.toFixed(2)} min={0} max={1.5} step={0.01} value={zeta} onChange={setZeta} disabled={loading} />
            <SliderRow label="Force amplitude F₀" valueText={`${force.toFixed(0)} N`} min={0} max={500} step={5} value={force} onChange={setForce} disabled={loading} />
            <SliderRow label="Frequency ratio r = ω/ωₙ" valueText={`${ratio.toFixed(2)}  (ω = ${(ratio * wn).toFixed(1)} rad/s)`} min={0} max={3} step={0.01} value={ratio} onChange={setRatio} disabled={loading} />
          </div>

          <Panel title="Results">
            <LoadingAndError loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Natural frequency (ωₙ)" value={`${data.natural_frequency.toFixed(2)} rad/s (${data.natural_frequency_hz.toFixed(2)} Hz)`} />
                <ResultRow label="Static deflection (F₀/k)" value={`${(data.static_deflection * 1000).toFixed(2)} mm`} />
                <ResultRow label="Magnification (M)" value={data.magnification.toFixed(3)} />
                <ResultRow label="Steady-state amplitude (X)" value={`${(data.amplitude * 1000).toFixed(2)} mm`} />
                <ResultRow label="Phase lag (φ)" value={`${data.phase_deg.toFixed(1)}°`} />
                <ResultRow label="Transmissibility (TR)" value={data.transmissibility.toFixed(3)} />
                <ResultRow label="Force into support" value={`${data.force_transmitted.toFixed(1)} N`} />
                <ResultRow
                  label="Resonant peak"
                  value={data.peak_ratio !== null ? `r = ${data.peak_ratio.toFixed(2)}${data.peak_magnification !== null ? `, M = ${data.peak_magnification.toFixed(2)}` : ''}` : 'none (ζ ≥ 0.707)'}
                  last
                />
                {status && <StatusPill color={status.color}>{status.text}</StatusPill>}
              </div>
            )}
          </Panel>

          <Panel title="Key Equations" marginBottom={false}>
            <EquationList lines={['m ẍ + c ẋ + k x = F₀ sin ωt', 'M = 1 / √((1−r²)² + (2ζr)²)', 'X = (F₀/k) · M', 'φ = atan2(2ζr, 1−r²)', 'TR = √(1+(2ζr)²) / √((1−r²)²+(2ζr)²)']} />
          </Panel>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <Panel title="Driven Mass">
            <svg width="100%" viewBox="0 0 400 150" role="img" aria-label="Harmonically driven mass-spring-damper" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <line x1="30" y1="25" x2="30" y2="125" stroke={theme.colors.text.primary} strokeWidth="4" />
              <path d={`M 30 60 L 50 60 ${Array.from({ length: 8 }, (_, i) => `L ${50 + ((massX - 30 - 50 - 20) * (i + 0.5)) / 8} ${i % 2 === 0 ? 46 : 74}`).join(' ')} L ${massX - 30} 60`} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
              <line x1="30" y1="100" x2={massX - 60} y2="100" stroke={theme.colors.gray[500]} strokeWidth="2" />
              <rect x={massX - 60} y="90" width="30" height="20" fill="none" stroke={theme.colors.gray[600]} strokeWidth="2" />
              <line x1={massX - 50} y1="100" x2={massX - 30} y2="100" stroke={theme.colors.gray[600]} strokeWidth="2" />
              <rect x={massX - 30} y="40" width="60" height="60" rx="4" fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
              <text x={massX} y="76" textAnchor="middle" fontSize="13" fontWeight={700}>m</text>
              {/* Applied force arrow, length oscillating with the drive */}
              <line x1={massX + 30} y1="70" x2={massX + 30 + 30 + forceArrow} y2="70" stroke={theme.colors.error} strokeWidth="3" />
              <text x={massX + 66 + forceArrow} y="66" fontSize="12" fontWeight={700} fill={theme.colors.error}>F₀ sin ωt</text>
            </svg>
            <p style={{ color: theme.colors.text.secondary, fontSize: '12px', marginTop: theme.spacing[2] }}>
              Animation is slowed to a fixed speed; relative amplitude and phase lag follow the computed M and φ.
            </p>
          </Panel>

          <Panel title="Magnification M(r)">
            {data && (
              <LinePlot
                ariaLabel="Magnification factor versus frequency ratio"
                xLabel="frequency ratio r = ω/ωₙ"
                yLabel="M"
                series={[{ x: data.r_series, y: data.magnification_series, color: theme.colors.lightBlue[600] }]}
                xMin={0}
                xMax={3}
                yMin={0}
                yMax={6}
                vLines={[{ value: 1, label: 'resonance', color: theme.colors.error }]}
                points={[{ x: data.frequency_ratio, y: Math.min(data.magnification, 6), color: theme.colors.accent[600], label: 'you' }]}
              />
            )}
          </Panel>

          <Panel title="Transmissibility TR(r)" marginBottom={false}>
            {data && (
              <LinePlot
                ariaLabel="Transmissibility versus frequency ratio"
                xLabel="frequency ratio r = ω/ωₙ"
                yLabel="TR"
                series={[{ x: data.r_series, y: data.transmissibility_series, color: theme.colors.spectrum.violet }]}
                xMin={0}
                xMax={3}
                yMin={0}
                yMax={6}
                hLines={[{ value: 1, label: 'TR = 1', color: theme.colors.gray[500] }]}
                vLines={[{ value: Math.SQRT2, label: '√2: isolation starts', color: theme.colors.success }]}
                points={[{ x: data.frequency_ratio, y: Math.min(data.transmissibility, 6), color: theme.colors.accent[600], label: 'you' }]}
              />
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}

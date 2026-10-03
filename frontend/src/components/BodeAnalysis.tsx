/**
 * Frequency Response & Bode Plots - Interactive Topic
 *
 * Students adjust the loop gain and the two lag time constants of
 * L(s) = K / (s(τ1 s + 1)(τ2 s + 1)) and read the gain and phase margins
 * straight off the Bode magnitude and phase plots.
 */

import { useState } from 'react'
import { useDynamicsControlsSimulation } from '../hooks/useDynamicsControlsSimulation'
import { theme } from '../styles/theme'
import { Panel, SliderRow, ResultRow, StatusPill, EquationList, LoadingAndError, LinePlot } from './DynCtrlWidgets'

interface BodeData {
  gain: number
  tau1: number
  tau2: number
  frequency_series: number[]
  magnitude_db_series: number[]
  phase_deg_series: number[]
  gain_crossover: number | null
  phase_margin_deg: number | null
  phase_crossover: number
  gain_margin: number
  gain_margin_db: number
  critical_gain: number
  is_stable: boolean
  damping_estimate: number | null
}

export default function BodeAnalysis() {
  const [gain, setGain] = useState(2)
  const [tau1, setTau1] = useState(1)
  const [tau2, setTau2] = useState(0.1)

  const { data, loading, error } = useDynamicsControlsSimulation<BodeData, object>('/api/frequency-response-bode/compute', {
    gain,
    tau1,
    tau2,
  })

  const pm = data?.phase_margin_deg ?? null
  const pmColor = pm === null ? theme.colors.gray[500] : pm >= 45 ? theme.colors.success : pm > 0 ? theme.colors.warning : theme.colors.error
  const gmColor = data ? (data.gain_margin_db >= 6 ? theme.colors.success : data.gain_margin_db > 0 ? theme.colors.warning : theme.colors.error) : theme.colors.gray[500]

  const phaseAtGc = data && data.gain_crossover !== null && pm !== null ? pm - 180 : null

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700 }}>L(s) = K / ( s (τ₁s + 1)(τ₂s + 1) )</h3>
            <SliderRow label="Loop gain K" valueText={gain.toFixed(2)} min={0.1} max={20} step={0.1} value={gain} onChange={setGain} disabled={loading} />
            <SliderRow label="Lag τ₁" valueText={`${tau1.toFixed(2)} s`} min={0.05} max={5} step={0.05} value={tau1} onChange={setTau1} disabled={loading} />
            <SliderRow label="Lag τ₂" valueText={`${tau2.toFixed(2)} s`} min={0.01} max={1} step={0.01} value={tau2} onChange={setTau2} disabled={loading} />
          </div>

          <Panel title="Results">
            <LoadingAndError loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Gain crossover ω_gc" value={data.gain_crossover !== null ? `${data.gain_crossover.toFixed(3)} rad/s` : '—'} />
                <ResultRow label="Phase margin (PM)" value={pm !== null ? `${pm.toFixed(1)}°` : '—'} color={pmColor} />
                <ResultRow label="Phase crossover ω_pc" value={`${data.phase_crossover.toFixed(3)} rad/s`} />
                <ResultRow label="Gain margin (GM)" value={`${data.gain_margin.toFixed(2)}  (${data.gain_margin_db.toFixed(1)} dB)`} color={gmColor} />
                <ResultRow label="K at instability" value={data.critical_gain.toFixed(2)} />
                <ResultRow label="Damping estimate ζ ≈ PM/100" value={data.damping_estimate !== null ? data.damping_estimate.toFixed(2) : '—'} last />
                <StatusPill color={data.is_stable ? (pm !== null && pm >= 30 ? theme.colors.success : theme.colors.warning) : theme.colors.error}>
                  {data.is_stable ? (pm !== null && pm >= 30 ? 'CLOSED LOOP STABLE with healthy margins' : 'STABLE but thin margins: expect ringing') : 'CLOSED LOOP UNSTABLE (negative margin)'}
                </StatusPill>
              </div>
            )}
          </Panel>

          <Panel title="Key Equations" marginBottom={false}>
            <EquationList lines={['|L(jω)|_dB = 20 log₁₀ |L(jω)|', '∠L = −90° − atan(ωτ₁) − atan(ωτ₂)', 'PM = 180° + ∠L(jω_gc),  |L(jω_gc)| = 1', 'GM = 1 / |L(jω_pc)|,  ∠L(jω_pc) = −180°', 'ω_pc = 1/√(τ₁τ₂)']} />
          </Panel>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <Panel title="Bode Magnitude">
            {data && (
              <LinePlot
                ariaLabel="Bode magnitude plot"
                xLog
                xLabel="frequency ω (rad/s)"
                yLabel="|L| (dB)"
                series={[{ x: data.frequency_series, y: data.magnitude_db_series, color: theme.colors.lightBlue[600] }]}
                hLines={[{ value: 0, label: '0 dB', color: theme.colors.gray[600] }]}
                vLines={[
                  ...(data.gain_crossover !== null ? [{ value: data.gain_crossover, label: 'ω_gc', color: theme.colors.accent[600] }] : []),
                  { value: data.phase_crossover, label: 'ω_pc', color: theme.colors.spectrum.coral },
                ]}
                points={[{ x: data.phase_crossover, y: -data.gain_margin_db, color: theme.colors.spectrum.coral, label: `GM ${data.gain_margin_db.toFixed(1)} dB` }]}
              />
            )}
          </Panel>

          <Panel title="Bode Phase" marginBottom={false}>
            {data && (
              <LinePlot
                ariaLabel="Bode phase plot"
                xLog
                xLabel="frequency ω (rad/s)"
                yLabel="∠L (deg)"
                series={[{ x: data.frequency_series, y: data.phase_deg_series, color: theme.colors.spectrum.violet }]}
                yMin={-200}
                yMax={0}
                hLines={[{ value: -180, label: '−180°', color: theme.colors.error }]}
                vLines={[
                  ...(data.gain_crossover !== null ? [{ value: data.gain_crossover, label: 'ω_gc', color: theme.colors.accent[600] }] : []),
                  { value: data.phase_crossover, label: 'ω_pc', color: theme.colors.spectrum.coral },
                ]}
                points={data.gain_crossover !== null && phaseAtGc !== null ? [{ x: data.gain_crossover, y: phaseAtGc, color: theme.colors.accent[600], label: `PM ${pm?.toFixed(1)}°` }] : []}
              />
            )}
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              Phase margin is the gap between the phase at ω_gc and −180°. Gain margin is how far the magnitude sits below 0 dB at ω_pc.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}

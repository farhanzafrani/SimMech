/**
 * PID Control & Tuning - Interactive Topic
 *
 * Students close a PID loop around a first-order-plus-dead-time process and
 * tune Kp, Ti, Td by hand (or load the Ziegler-Nichols rule) while watching
 * overshoot, settling time, and the control effort.
 */

import { useState } from 'react'
import { useDynamicsControlsSimulation } from '../hooks/useDynamicsControlsSimulation'
import { theme } from '../styles/theme'
import { Panel, SliderRow, ResultRow, StatusPill, EquationList, LoadingAndError, LinePlot } from './DynCtrlWidgets'

interface PidTuningData {
  time_series: number[]
  output_series: number[]
  control_series: number[]
  overshoot_percent: number | null
  rise_time: number | null
  settling_time: number | null
  steady_state_error: number | null
  iae: number | null
  is_stable: boolean
  ki: number
  kd: number
  zn_pid: { Kp: number; Ti: number | null; Td: number } | null
}

export default function PidTuningAnalysis() {
  const [plantGain, setPlantGain] = useState(1)
  const [plantTau, setPlantTau] = useState(10)
  const [plantDelay, setPlantDelay] = useState(2)

  const [kp, setKp] = useState(2)
  const [useI, setUseI] = useState(true)
  const [ti, setTi] = useState(8)
  const [td, setTd] = useState(0)

  const { data, loading, error } = useDynamicsControlsSimulation<PidTuningData, object>('/api/pid-tuning/compute', {
    plant_gain: plantGain,
    plant_tau: plantTau,
    plant_delay: plantDelay,
    kp,
    ti: useI ? ti : null,
    td,
    t_end: 60,
  })

  const applyZn = () => {
    if (!data?.zn_pid) return
    setKp(Math.min(20, data.zn_pid.Kp))
    setUseI(true)
    setTi(Math.min(40, Math.max(0.5, data.zn_pid.Ti ?? 8)))
    setTd(Math.min(10, data.zn_pid.Td))
  }

  const fmt = (v: number | null, unit = '') => (v === null ? '—' : `${v.toFixed(2)}${unit}`)

  const pickColor = (os: number | null) => (os === null ? theme.colors.error : os > 25 ? theme.colors.warning : theme.colors.success)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700 }}>Process  G(s) = K e^(−θs) / (τs + 1)</h3>
            <SliderRow label="Process gain K" valueText={plantGain.toFixed(2)} min={0.2} max={4} step={0.05} value={plantGain} onChange={setPlantGain} disabled={loading} />
            <SliderRow label="Time constant τ" valueText={`${plantTau.toFixed(1)} s`} min={1} max={30} step={0.5} value={plantTau} onChange={setPlantTau} disabled={loading} />
            <SliderRow label="Dead time θ" valueText={`${plantDelay.toFixed(1)} s`} min={0} max={10} step={0.1} value={plantDelay} onChange={setPlantDelay} disabled={loading} />
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700 }}>Controller</h3>
            <SliderRow label="Proportional gain Kp" valueText={kp.toFixed(2)} min={0} max={20} step={0.05} value={kp} onChange={setKp} disabled={loading} />
            <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
              <input type="checkbox" checked={useI} onChange={(e) => setUseI(e.target.checked)} />
              Integral action
            </label>
            {useI && <SliderRow label="Integral time Ti" valueText={`${ti.toFixed(1)} s`} min={0.5} max={40} step={0.5} value={ti} onChange={setTi} disabled={loading} />}
            <SliderRow label="Derivative time Td" valueText={`${td.toFixed(2)} s`} min={0} max={10} step={0.05} value={td} onChange={setTd} disabled={loading} />
            <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => { setUseI(false); setTd(0) }}>P only</button>
              <button className="btn btn-secondary" onClick={() => { setUseI(true); setTd(0) }}>PI</button>
              <button className="btn btn-primary" onClick={applyZn} disabled={!data?.zn_pid} title={data?.zn_pid ? undefined : 'Ziegler-Nichols needs dead time θ > 0'}>
                Ziegler–Nichols PID
              </button>
            </div>
            {data && (
              <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
                Ki = Kp/Ti = {data.ki.toFixed(3)}, Kd = Kp·Td = {data.kd.toFixed(3)}
              </div>
            )}
          </div>

          <Panel title="Results">
            <LoadingAndError loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Overshoot" value={data.overshoot_percent === null ? 'diverges' : `${data.overshoot_percent.toFixed(1)} %`} color={pickColor(data.overshoot_percent)} />
                <ResultRow label="Rise time (10–90%)" value={fmt(data.rise_time, ' s')} />
                <ResultRow label="Settling time (2%)" value={data.is_stable ? fmt(data.settling_time, ' s') : '—'} />
                <ResultRow label="Steady-state error" value={data.steady_state_error === null ? '—' : data.steady_state_error.toFixed(3)} />
                <ResultRow label="IAE (∫|e| dt)" value={fmt(data.iae)} last />
                <StatusPill color={!data.is_stable ? theme.colors.error : data.steady_state_error !== null && Math.abs(data.steady_state_error) > 0.02 ? theme.colors.warning : theme.colors.success}>
                  {!data.is_stable ? 'UNSTABLE — loop diverges' : data.steady_state_error !== null && Math.abs(data.steady_state_error) > 0.02 ? 'Settles with steady-state error (needs integral action)' : 'Tracks the setpoint'}
                </StatusPill>
              </div>
            )}
          </Panel>

          <Panel title="Key Equations" marginBottom={false}>
            <EquationList lines={['u = Kp [ e + (1/Ti)∫e dt − Td dy/dt ]', 'ZN (open loop): Kp = 1.2τ/(Kθ)', 'Ti = 2θ,  Td = 0.5θ', 'PI: Kp = 0.9τ/(Kθ),  Ti = 3.33θ']} />
          </Panel>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <Panel title="Closed-Loop Setpoint Step">
            {data && (
              <LinePlot
                ariaLabel="Process output versus time for a unit setpoint step"
                xLabel="time (s)"
                yLabel="output y(t)"
                series={[{ x: data.time_series, y: data.output_series, color: theme.colors.lightBlue[600], label: 'y(t)' }]}
                yMin={0}
                yMax={Math.max(1.6, Math.min(3, ...[Math.max(...data.output_series) * 1.05]))}
                hLines={[{ value: 1, label: 'setpoint', color: theme.colors.success }]}
                height={280}
              />
            )}
          </Panel>

          <Panel title="Controller Output u(t)" marginBottom={false}>
            {data && (
              <LinePlot
                ariaLabel="Controller output versus time"
                xLabel="time (s)"
                yLabel="control effort u"
                series={[{ x: data.time_series, y: data.control_series, color: theme.colors.spectrum.coral }]}
                hLines={[{ value: 0, color: theme.colors.gray[400] }]}
                yMin={Math.min(0, ...data.control_series)}
                yMax={Math.min(30, Math.max(1, ...data.control_series) * 1.05)}
              />
            )}
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              Large, spiky u(t) means an aggressive controller: expensive on real actuators and sensitive to noise. Derivative acts on the measurement, so a setpoint step causes no derivative kick.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}

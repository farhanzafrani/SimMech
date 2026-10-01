/**
 * Step Response of First/Second-Order Systems - Interactive Topic
 *
 * Students move the poles of a first- or second-order system (via time
 * constant, natural frequency and damping ratio) and see the unit-step
 * response, its time-domain specs, and the pole locations on the s-plane.
 */

import { useState } from 'react'
import { useDynamicsControlsSimulation } from '../hooks/useDynamicsControlsSimulation'
import { theme } from '../styles/theme'
import { Panel, SliderRow, ResultRow, StatusPill, EquationList, LoadingAndError, LinePlot } from './DynCtrlWidgets'

interface StepResponseData {
  order: number
  gain: number
  final_value: number
  poles: { re: number; im: number }[]
  time_series: number[]
  response_series: number[]
  rise_time: number | null
  settling_time: number | null
  settling_estimate: number | null
  overshoot_percent: number
  peak_time: number | null
  damped_frequency: number | null
  regime: string
}

export default function StepResponseAnalysis() {
  const [order, setOrder] = useState<1 | 2>(2)
  const [gain, setGain] = useState(1)
  const [tau, setTau] = useState(1)
  const [wn, setWn] = useState(10)
  const [zeta, setZeta] = useState(0.5)

  const { data, loading, error } = useDynamicsControlsSimulation<StepResponseData, object>('/api/step-response/compute', {
    order,
    gain,
    time_constant: tau,
    natural_frequency: wn,
    damping_ratio: zeta,
  })

  const fmtT = (v: number | null) => (v === null ? '—' : `${v.toFixed(3)} s`)

  // --- s-plane pole map ---
  const poles = data?.poles ?? []
  const reMax = Math.max(1, ...poles.map((p) => Math.abs(p.re)))
  const imMax = Math.max(1, ...poles.map((p) => Math.abs(p.im)))
  const span = Math.max(reMax, imMax) * 1.3
  const mapX = (re: number) => 100 + (re / span) * 85
  const mapY = (im: number) => 90 - (im / span) * 75

  const final = data ? data.final_value : gain

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <Panel title="System Order">
            <div style={{ display: 'flex', gap: theme.spacing[2] }}>
              <button onClick={() => setOrder(1)} className={order === 1 ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>First order</button>
              <button onClick={() => setOrder(2)} className={order === 2 ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>Second order</button>
            </div>
          </Panel>

          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label="DC gain K" valueText={gain.toFixed(2)} min={0.2} max={5} step={0.05} value={gain} onChange={setGain} disabled={loading} />
            {order === 1 ? (
              <SliderRow label="Time constant τ" valueText={`${tau.toFixed(2)} s`} min={0.1} max={5} step={0.05} value={tau} onChange={setTau} disabled={loading} />
            ) : (
              <>
                <SliderRow label="Natural frequency ωₙ" valueText={`${wn.toFixed(1)} rad/s`} min={1} max={30} step={0.5} value={wn} onChange={setWn} disabled={loading} />
                <SliderRow label="Damping ratio ζ" valueText={zeta.toFixed(2)} min={0} max={2} step={0.01} value={zeta} onChange={setZeta} disabled={loading} />
              </>
            )}
          </div>

          <Panel title="Results">
            <LoadingAndError loading={loading} error={error} hasData={!!data} />
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <ResultRow label="Final value (K)" value={data.final_value.toFixed(3)} />
                <ResultRow label="Rise time (10–90%)" value={fmtT(data.rise_time)} />
                <ResultRow label="Settling time (2%)" value={data.settling_time === null ? 'does not settle' : fmtT(data.settling_time)} />
                {data.settling_estimate !== null && (
                  <ResultRow label={order === 1 ? 'Estimate 4τ' : 'Estimate 4/(ζωₙ)'} value={fmtT(data.settling_estimate)} />
                )}
                {order === 2 && (
                  <>
                    <ResultRow label="Percent overshoot" value={`${data.overshoot_percent.toFixed(1)} %`} />
                    <ResultRow label="Peak time" value={fmtT(data.peak_time)} />
                  </>
                )}
                <ResultRow
                  label="Poles"
                  value={data.poles.length === 1 || data.poles[0].im === 0 ? data.poles.map((p) => p.re.toFixed(2)).join(', ') : `${data.poles[0].re.toFixed(2)} ± ${data.poles[0].im.toFixed(2)}j`}
                  last
                />
                <StatusPill color={data.regime === 'underdamped' ? theme.colors.warning : data.regime === 'undamped' ? theme.colors.error : theme.colors.success}>
                  {data.regime.toUpperCase()}
                </StatusPill>
              </div>
            )}
          </Panel>

          <Panel title="Key Equations" marginBottom={false}>
            <EquationList
              lines={
                order === 1
                  ? ['G(s) = K / (τs + 1)', 'y(t) = K (1 − e^(−t/τ))', 't_r = τ ln 9 ≈ 2.2τ', 't_s(2%) = τ ln 50 ≈ 3.9τ']
                  : ['G(s) = K ωₙ² / (s² + 2ζωₙs + ωₙ²)', '%OS = 100 · exp(−πζ / √(1−ζ²))', 't_p = π / ω_d', 't_s ≈ 4 / (ζωₙ)']
              }
            />
          </Panel>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <Panel title="Unit-Step Response">
            {data && (
              <LinePlot
                ariaLabel="Unit step response"
                xLabel="time (s)"
                yLabel="output y(t)"
                series={[{ x: data.time_series, y: data.response_series, color: theme.colors.lightBlue[600], label: 'y(t)' }]}
                yMin={0}
                yMax={Math.max(final * 1.05, ...data.response_series) * 1.05}
                hLines={[
                  { value: final, label: 'final value', color: theme.colors.gray[500] },
                  { value: final * 1.02, color: theme.colors.success },
                  { value: final * 0.98, color: theme.colors.success },
                ]}
                vLines={[
                  ...(data.settling_time ? [{ value: data.settling_time, label: 't_s', color: theme.colors.success }] : []),
                  ...(order === 2 && data.peak_time ? [{ value: data.peak_time, label: 't_p', color: theme.colors.error }] : []),
                ]}
                height={280}
              />
            )}
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              Green dashed lines mark the ±2% settling band around the final value.
            </p>
          </Panel>

          <Panel title="Pole Map (s-plane)" marginBottom={false}>
            <svg width="100%" viewBox="0 0 280 180" role="img" aria-label="Pole locations in the s-plane" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary, maxHeight: '260px' }}>
              <rect x="100" y="0" width="180" height="180" fill={theme.colors.error} fillOpacity="0.07" />
              <line x1="0" y1="90" x2="280" y2="90" stroke={theme.colors.gray[400]} strokeWidth="1" />
              <line x1="100" y1="0" x2="100" y2="180" stroke={theme.colors.gray[600]} strokeWidth="1.5" />
              <text x="270" y="84" fontSize="10" textAnchor="end" fill={theme.colors.text.light}>Re</text>
              <text x="104" y="12" fontSize="10" fill={theme.colors.text.light}>jω</text>
              <text x="270" y="170" fontSize="10" textAnchor="end" fill={theme.colors.error}>unstable half-plane</text>
              {poles.map((p, i) => (
                <g key={i} stroke={theme.colors.lightBlue[600]} strokeWidth="3">
                  <line x1={mapX(p.re) - 5} y1={mapY(p.im) - 5} x2={mapX(p.re) + 5} y2={mapY(p.im) + 5} />
                  <line x1={mapX(p.re) - 5} y1={mapY(p.im) + 5} x2={mapX(p.re) + 5} y2={mapY(p.im) - 5} />
                </g>
              ))}
            </svg>
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              Farther left = faster decay. Higher up = faster oscillation. Poles on the jω axis (ζ = 0) never decay.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}

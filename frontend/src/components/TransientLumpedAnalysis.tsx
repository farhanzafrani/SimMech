/**
 * Transient Conduction: Lumped Capacitance & Biot Number - Interactive Topic
 *
 * Students quench or heat a plate, cylinder, or sphere, and see the lumped
 * (uniform-temperature) model against the exact centre temperature, so the
 * Bi < 0.1 rule becomes visible instead of memorized.
 */

import { useState } from 'react'
import { useThermalPost } from '../hooks/useThermalPost'
import { theme } from '../styles/theme'
import { Banner, Card, ChoiceButtons, Controls, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './thermal/ThermalShared'

interface TransientData {
  characteristic_length: number
  biot: number
  biot_exact: number
  lumped_valid: boolean
  time_constant: number
  fourier: number
  temperature: number
  centre_temperature: number | null
  time_to_target: number | null
  curve: { t: number[]; lumped: number[]; centre: (number | null)[] }
}

type Shape = 'plate' | 'cylinder' | 'sphere'

// rho (kg/m3), c (J/kg K), k (W/m K) near 300 K
const SOLIDS = {
  copper: { label: 'Copper', rho: 8933, c: 385, k: 401 },
  aluminium: { label: 'Aluminium', rho: 2702, c: 903, k: 237 },
  steel: { label: 'Steel AISI 1010', rho: 7832, c: 434, k: 63.9 },
  stainless: { label: 'Stainless 304', rho: 7900, c: 477, k: 14.9 },
}

export default function TransientLumpedAnalysis() {
  const [shape, setShape] = useState<Shape>('sphere')
  const [solid, setSolid] = useState<keyof typeof SOLIDS>('copper')
  const [dimension, setDimension] = useState(10)
  const [h, setH] = useState(100)
  const [tInit, setTInit] = useState(200)
  const [tAmb, setTAmb] = useState(25)
  const [time, setTime] = useState(60)

  const mat = SOLIDS[solid]
  // aim the "time to reach" readout halfway between initial and ambient
  const tTarget = (tInit + tAmb) / 2

  const { data, loading, error } = useThermalPost<TransientData>('/api/transient-lumped/compute', {
    shape,
    dimension,
    density: mat.rho,
    specific_heat: mat.c,
    conductivity: mat.k,
    h,
    t_initial: tInit,
    t_ambient: tAmb === tInit ? tAmb - 1 : tAmb,
    time,
    t_target: tTarget,
  })

  const dimLabel = shape === 'plate' ? 'Half-thickness L' : 'Radius r₀'
  const biotColor = data ? (data.lumped_valid ? theme.colors.success : theme.colors.error) : undefined

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Body">
            <ChoiceButtons
              options={[
                { value: 'plate', label: 'Plate' },
                { value: 'cylinder', label: 'Cylinder' },
                { value: 'sphere', label: 'Sphere' },
              ]}
              value={shape}
              onChange={setShape}
            />
            <div style={{ marginTop: theme.spacing[3] }}>
              <ChoiceButtons
                options={(Object.keys(SOLIDS) as Array<keyof typeof SOLIDS>).map((s) => ({ value: s, label: SOLIDS[s].label }))}
                value={solid}
                onChange={setSolid}
              />
            </div>
            <div style={{ marginTop: theme.spacing[2], fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
              ρ = {mat.rho} kg/m³, c = {mat.c} J/kg·K, k = {mat.k} W/m·K
            </div>
          </Card>

          <Controls>
            <SliderRow label={dimLabel} value={dimension} unit="mm" min={1} max={100} step={1} digits={0} onChange={setDimension} />
            <SliderRow label="Convection h" value={h} unit="W/m²K" min={5} max={5000} step={5} digits={0} onChange={setH} />
            <SliderRow label="Initial temperature" value={tInit} unit="°C" min={-50} max={1000} step={5} digits={0} onChange={setTInit} />
            <SliderRow label="Fluid temperature" value={tAmb} unit="°C" min={-50} max={500} step={5} digits={0} onChange={setTAmb} />
            <SliderRow label="Time t" value={time} unit="s" min={0} max={1500} step={5} digits={0} onChange={setTime} />
          </Controls>

          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Characteristic length L_c = V/A" value={`${data.characteristic_length.toFixed(2)} mm`} />
                <ResultRow label="Biot number h·L_c/k" value={data.biot.toPrecision(3)} color={biotColor} />
                <ResultRow label="Time constant τ" value={`${data.time_constant.toFixed(1)} s`} />
                <ResultRow label="Temperature at t (lumped)" value={`${data.temperature.toFixed(1)} °C`} color={theme.colors.accent[600]} />
                <ResultRow label="Exact centre temperature (1-term)" value={data.centre_temperature === null ? `n/a (Fo = ${data.fourier.toFixed(2)} < 0.2)` : `${data.centre_temperature.toFixed(1)} °C`} />
                <ResultRow label={`Time to reach ${tTarget.toFixed(0)} °C (lumped)`} value={data.time_to_target === null ? '—' : `${data.time_to_target.toFixed(0)} s`} last />
                <Banner
                  color={biotColor ?? theme.colors.gray[500]}
                  text={data.lumped_valid ? 'Bi < 0.1: the lumped model is valid' : 'Bi ≥ 0.1: temperature gradients inside the body matter, lumped model is not valid'}
                />
              </>
            )}
          </ResultsCard>
        </div>

        <div>
          <Card title="Temperature History">
            {data && (
              <LineChart
                xLabel="Time (s)"
                yLabel="Temperature (°C)"
                series={[
                  { label: 'Lumped model', color: theme.colors.accent[600], points: data.curve.t.map((t, i) => ({ x: t, y: data.curve.lumped[i] })) },
                  { label: 'Exact centre (Fo ≥ 0.2)', color: theme.colors.error, dashed: true, points: data.curve.t.map((t, i) => ({ x: t, y: data.curve.centre[i] })) },
                ]}
                markers={[{ x: time, y: data.temperature, color: theme.colors.success, label: 'now' }]}
                xMin={0}
              />
            )}
          </Card>

          <EquationsCard
            lines={[
              'L_c = V / A_s  (plate L, cylinder r/2, sphere r/3)',
              'Bi = h L_c / k  <  0.1',
              'τ = ρ c L_c / h',
              '(T − T∞)/(T_i − T∞) = exp(−t/τ)',
              'Fo = α t / r₀²,  α = k / ρc',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

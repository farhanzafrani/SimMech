/**
 * Fins (Extended Surfaces) - Interactive Topic
 *
 * Students size a pin or rectangular fin, choose its tip condition, and see
 * the heat rate, fin efficiency, effectiveness, and how temperature decays
 * along the fin.
 */

import { useState } from 'react'
import { useThermalPost } from '../hooks/useThermalPost'
import { theme } from '../styles/theme'
import { Banner, Card, ChoiceButtons, Controls, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './thermal/ThermalShared'

interface FinData {
  perimeter: number
  area_c: number
  m: number
  ml: number
  heat_rate: number
  efficiency: number
  effectiveness: number
  tip_temperature: number
  biot: number
  infinite_fin_valid: boolean
  profile: { x: number[]; T: number[] }
}

type Tip = 'convective' | 'adiabatic' | 'infinite'

const FIN_MATERIALS = [
  { label: 'Copper', k: 400 },
  { label: 'Aluminium', k: 200 },
  { label: 'Carbon steel', k: 45 },
  { label: 'Stainless', k: 15 },
]

export default function FinHeatTransferAnalysis() {
  const [shape, setShape] = useState<'pin' | 'rectangular'>('pin')
  const [tip, setTip] = useState<Tip>('convective')
  const [dim1, setDim1] = useState(5)
  const [dim2, setDim2] = useState(3)
  const [length, setLength] = useState(50)
  const [k, setK] = useState(200)
  const [h, setH] = useState(50)
  const [tBase, setTBase] = useState(100)
  const [tAmb, setTAmb] = useState(25)

  const { data, loading, error } = useThermalPost<FinData>('/api/fin-heat-transfer/compute', {
    shape,
    dim_1: dim1,
    dim_2: dim2,
    length,
    conductivity: k,
    h,
    t_base: tBase,
    t_ambient: tAmb,
    tip,
  })

  const good = data ? data.effectiveness > 2 : true

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Fin Type">
            <ChoiceButtons
              options={[
                { value: 'pin', label: 'Pin (round)' },
                { value: 'rectangular', label: 'Rectangular' },
              ]}
              value={shape}
              onChange={setShape}
            />
            <div style={{ marginTop: theme.spacing[3] }}>
              <ChoiceButtons
                options={[
                  { value: 'convective', label: 'Convective tip' },
                  { value: 'adiabatic', label: 'Adiabatic tip' },
                  { value: 'infinite', label: 'Infinite fin' },
                ]}
                value={tip}
                onChange={setTip}
              />
            </div>
          </Card>

          <Card title="Fin Material">
            <ChoiceButtons options={FIN_MATERIALS.map((m) => ({ value: String(m.k), label: m.label }))} value={String(k)} onChange={(v) => setK(parseFloat(v))} />
          </Card>

          <Controls>
            <SliderRow label={shape === 'pin' ? 'Diameter D' : 'Width w'} value={dim1} unit="mm" min={1} max={30} step={0.5} onChange={setDim1} />
            {shape === 'rectangular' && <SliderRow label="Thickness t" value={dim2} unit="mm" min={0.5} max={10} step={0.5} onChange={setDim2} />}
            <SliderRow label="Length L" value={length} unit="mm" min={5} max={200} step={1} digits={0} onChange={setLength} />
            <SliderRow label="Conductivity k" value={k} unit="W/m·K" min={10} max={400} step={5} digits={0} onChange={setK} />
            <SliderRow label="Convection h" value={h} unit="W/m²K" min={5} max={500} step={5} digits={0} onChange={setH} />
            <SliderRow label="Base temperature" value={tBase} unit="°C" min={40} max={300} step={5} digits={0} onChange={setTBase} />
            <SliderRow label="Ambient temperature" value={tAmb} unit="°C" min={-20} max={40} step={1} digits={0} onChange={setTAmb} />
          </Controls>
        </div>

        <div>
          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Fin parameter m" value={`${data.m.toFixed(2)} 1/m`} />
                <ResultRow label="mL" value={data.ml.toFixed(3)} />
                <ResultRow label="Heat rate q_f" value={`${data.heat_rate.toFixed(3)} W`} color={theme.colors.accent[600]} />
                <ResultRow label="Fin efficiency η_f" value={`${(data.efficiency * 100).toFixed(1)} %`} />
                <ResultRow label="Fin effectiveness ε_f" value={data.effectiveness.toFixed(1)} color={good ? theme.colors.success : theme.colors.warning} />
                <ResultRow label="Tip temperature" value={`${data.tip_temperature.toFixed(1)} °C`} />
                <ResultRow label="Transverse Biot h·A_c/(P·k)" value={data.biot.toFixed(4)} last />
                <Banner
                  color={tip === 'infinite' && !data.infinite_fin_valid ? theme.colors.error : good ? theme.colors.success : theme.colors.warning}
                  text={
                    tip === 'infinite' && !data.infinite_fin_valid
                      ? 'mL < 2.65: the infinite-fin assumption is not valid here'
                      : good
                        ? 'Fin is worthwhile (ε_f > 2)'
                        : 'Fin barely helps (ε_f ≤ 2): h is too high or k too low'
                  }
                />
              </>
            )}
          </ResultsCard>

          <Card title="Temperature Along the Fin">
            {data && (
              <LineChart
                xLabel="Distance from base x (mm)"
                yLabel="Temperature (°C)"
                series={[
                  { label: 'Fin T(x)', color: theme.colors.accent[600], points: data.profile.x.map((x, i) => ({ x, y: data.profile.T[i] })) },
                  { label: 'Ambient', color: theme.colors.lightBlue[600], dashed: true, points: [{ x: 0, y: tAmb }, { x: length, y: tAmb }] },
                ]}
                xMin={0}
                xMax={length}
              />
            )}
          </Card>

          <EquationsCard
            lines={[
              'm = √(hP / kA_c)',
              'θ(x)/θ_b = cosh m(L−x) / cosh mL  (adiabatic tip)',
              'q_f = √(hPkA_c) θ_b tanh mL  (adiabatic tip)',
              'q_f = M (tanh mL + h/mk) / (1 + (h/mk) tanh mL)',
              'η_f = q_f / (h A_f θ_b),  ε_f = q_f / (h A_c θ_b)',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

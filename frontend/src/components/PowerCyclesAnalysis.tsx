/**
 * Ideal Rankine & Brayton Cycles - Interactive Topic
 *
 * A toggle switches between the steam Rankine cycle (real steam properties)
 * and the cold-air-standard Brayton gas-turbine cycle. Both show the T-s
 * diagram, state data, and the efficiency trade-offs.
 */

import { useState } from 'react'
import { useThermalPost } from '../hooks/useThermalPost'
import { theme } from '../styles/theme'
import { Banner, Card, ChoiceButtons, Controls, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './thermal/ThermalShared'

interface TsPoint {
  s: number
  T: number
}

interface RankineData {
  t_sat_boiler: number
  t_sat_condenser: number
  h1: number
  h2: number
  h3: number
  h4: number
  quality_exit: number | null
  exit_superheated: boolean
  w_pump: number
  w_turbine: number
  w_net: number
  q_in: number
  q_out: number
  thermal_efficiency: number
  back_work_ratio: number
  steam_rate: number
  carnot_efficiency: number
  ts_path: TsPoint[]
  dome: { s_liquid: number[]; s_vapor: number[]; T: number[] }
}

interface BraytonData {
  t2: number
  t4: number
  w_compressor: number
  w_turbine: number
  w_net: number
  q_in: number
  q_out: number
  thermal_efficiency: number
  ideal_efficiency: number
  back_work_ratio: number
  optimal_pressure_ratio: number
  ts_path: TsPoint[]
  sweep: { pressure_ratio: number[]; efficiency: number[]; net_work: number[] }
}

function RankinePanel() {
  const [pBoiler, setPBoiler] = useState(8)
  const [tTurbine, setTTurbine] = useState(500)
  const [pCond, setPCond] = useState(0.01)
  const [etaT, setEtaT] = useState(1)
  const [etaP, setEtaP] = useState(1)

  const { data, loading, error } = useThermalPost<RankineData>('/api/power-cycles/rankine', {
    boiler_pressure: pBoiler,
    turbine_inlet_temp: tTurbine,
    condenser_pressure: pCond,
    turbine_efficiency: etaT,
    pump_efficiency: etaP,
  })

  const path = data?.ts_path ?? []
  const iMax = path.length ? path.reduce((b, p, i) => (p.T > path[b].T ? i : b), 0) : 0

  return (
    <div className="grid-container">
      <div>
        <Controls>
          <SliderRow label="Boiler pressure" value={pBoiler} unit="MPa" min={1} max={20} step={0.5} onChange={setPBoiler} />
          <SliderRow label="Turbine inlet temperature" value={tTurbine} unit="°C" min={250} max={650} step={10} digits={0} onChange={setTTurbine} />
          <SliderRow label="Condenser pressure" value={pCond} unit="MPa" min={0.005} max={0.1} step={0.005} digits={3} onChange={setPCond} />
          <SliderRow label="Turbine isentropic efficiency" value={etaT} min={0.6} max={1} step={0.01} digits={2} onChange={setEtaT} />
          <SliderRow label="Pump isentropic efficiency" value={etaP} min={0.6} max={1} step={0.01} digits={2} onChange={setEtaP} />
        </Controls>

        <ResultsCard loading={loading} error={error} hasData={!!data}>
          {data && (
            <>
              <ResultRow label="T_sat boiler / condenser" value={`${data.t_sat_boiler.toFixed(0)} / ${data.t_sat_condenser.toFixed(1)} °C`} />
              <ResultRow label="h₁ → h₂ (pump)" value={`${data.h1.toFixed(1)} → ${data.h2.toFixed(1)} kJ/kg`} />
              <ResultRow label="h₃ → h₄ (turbine)" value={`${data.h3.toFixed(1)} → ${data.h4.toFixed(1)} kJ/kg`} />
              <ResultRow label="Exit quality x₄" value={data.quality_exit === null ? 'superheated' : data.quality_exit.toFixed(3)} color={data.quality_exit !== null && data.quality_exit < 0.85 ? theme.colors.warning : undefined} />
              <ResultRow label="Pump work" value={`${data.w_pump.toFixed(2)} kJ/kg`} />
              <ResultRow label="Turbine work" value={`${data.w_turbine.toFixed(1)} kJ/kg`} />
              <ResultRow label="Heat input q_in" value={`${data.q_in.toFixed(1)} kJ/kg`} />
              <ResultRow label="Net work" value={`${data.w_net.toFixed(1)} kJ/kg`} />
              <ResultRow label="Back-work ratio" value={`${(data.back_work_ratio * 100).toFixed(2)} %`} />
              <ResultRow label="Steam rate" value={`${data.steam_rate.toFixed(2)} kg/kWh`} />
              <ResultRow label="Thermal efficiency" value={`${(data.thermal_efficiency * 100).toFixed(1)} %`} color={theme.colors.accent[600]} last />
              <Banner
                color={data.quality_exit !== null && data.quality_exit < 0.85 ? theme.colors.warning : theme.colors.success}
                text={data.quality_exit !== null && data.quality_exit < 0.85 ? 'Wet exhaust (x < 0.85): blade erosion risk' : `Carnot limit between the same extremes: ${(data.carnot_efficiency * 100).toFixed(1)} %`}
              />
            </>
          )}
        </ResultsCard>

        <EquationsCard
          lines={[
            'w_pump = v₁ (p_b − p_c)',
            'q_in = h₃ − h₂',
            'w_turbine = h₃ − h₄,  s₄ = s₃ (ideal)',
            'η = (w_t − w_p) / q_in',
            'Steam: IAPWS-IF97 table, ±1 %',
          ]}
        />
      </div>
      <div>
        <Card title="T–s Diagram" last>
          {data && (
            <LineChart
              xLabel="Entropy s (kJ/kg·K)"
              yLabel="Temperature (°C)"
              xMin={0}
              xMax={10}
              yMin={0}
              series={[
                { label: 'Saturated liquid', color: theme.colors.gray[500], dashed: true, points: data.dome.s_liquid.map((s, i) => ({ x: s, y: data.dome.T[i] })) },
                { label: 'Saturated vapor', color: theme.colors.gray[500], dashed: true, points: data.dome.s_vapor.map((s, i) => ({ x: s, y: data.dome.T[i] })) },
                { label: 'Cycle', color: theme.colors.accent[600], points: path.map((p) => ({ x: p.s, y: p.T })) },
              ]}
              markers={[
                { x: path[0].s, y: path[0].T, color: theme.colors.lightBlue[600], label: '1,2' },
                { x: path[iMax].s, y: path[iMax].T, color: theme.colors.error, label: '3' },
                { x: path[path.length - 2].s, y: path[path.length - 2].T, color: theme.colors.success, label: '4' },
              ]}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

function BraytonPanel() {
  const [t1, setT1] = useState(300)
  const [rp, setRp] = useState(8)
  const [t3, setT3] = useState(1300)
  const [etaC, setEtaC] = useState(1)
  const [etaT, setEtaT] = useState(1)

  const { data, loading, error } = useThermalPost<BraytonData>('/api/power-cycles/brayton', {
    inlet_temp: t1,
    pressure_ratio: rp,
    turbine_inlet_temp: t3,
    compressor_efficiency: etaC,
    turbine_efficiency: etaT,
  })

  const path = data?.ts_path ?? []

  return (
    <div className="grid-container">
      <div>
        <Controls>
          <SliderRow label="Compressor inlet T₁" value={t1} unit="K" min={250} max={350} step={5} digits={0} onChange={setT1} />
          <SliderRow label="Pressure ratio r_p" value={rp} min={2} max={30} step={0.5} onChange={setRp} />
          <SliderRow label="Turbine inlet T₃" value={t3} unit="K" min={900} max={1800} step={25} digits={0} onChange={setT3} />
          <SliderRow label="Compressor isentropic efficiency" value={etaC} min={0.6} max={1} step={0.01} digits={2} onChange={setEtaC} />
          <SliderRow label="Turbine isentropic efficiency" value={etaT} min={0.6} max={1} step={0.01} digits={2} onChange={setEtaT} />
        </Controls>

        <ResultsCard loading={loading} error={error} hasData={!!data}>
          {data && (
            <>
              <ResultRow label="T₂ (compressor exit)" value={`${data.t2.toFixed(1)} K`} />
              <ResultRow label="T₄ (turbine exit)" value={`${data.t4.toFixed(1)} K`} />
              <ResultRow label="Compressor work" value={`${data.w_compressor.toFixed(1)} kJ/kg`} />
              <ResultRow label="Turbine work" value={`${data.w_turbine.toFixed(1)} kJ/kg`} />
              <ResultRow label="Net work" value={`${data.w_net.toFixed(1)} kJ/kg`} />
              <ResultRow label="Heat input q_in" value={`${data.q_in.toFixed(1)} kJ/kg`} />
              <ResultRow label="Back-work ratio" value={`${(data.back_work_ratio * 100).toFixed(1)} %`} />
              <ResultRow label="Ideal efficiency 1 − r_p^−(k−1)/k" value={`${(data.ideal_efficiency * 100).toFixed(1)} %`} />
              <ResultRow label="Thermal efficiency" value={`${(data.thermal_efficiency * 100).toFixed(1)} %`} color={theme.colors.accent[600]} last />
              <Banner color={theme.colors.success} text={`Max net work near r_p ≈ ${data.optimal_pressure_ratio.toFixed(1)} (ideal)`} />
            </>
          )}
        </ResultsCard>

        <EquationsCard
          lines={[
            'T₂ₛ = T₁ r_p^((k−1)/k)',
            'w_c = cp (T₂ − T₁)',
            'w_t = cp (T₃ − T₄)',
            'η = w_net / q_in',
            'r_p,opt = (T₃/T₁)^(k / 2(k−1))',
            'Air: cp = 1.005 kJ/kg·K, k = 1.4',
          ]}
        />
      </div>
      <div>
        <Card title="T–s Diagram">
          {data && (
            <LineChart
              xLabel="Entropy change s − s₁ (kJ/kg·K)"
              yLabel="Temperature (K)"
              series={[{ label: 'Cycle', color: theme.colors.accent[600], points: path.map((p) => ({ x: p.s, y: p.T })) }]}
              markers={[
                { x: path[0].s, y: path[0].T, color: theme.colors.lightBlue[600], label: '1' },
                { x: path[1].s, y: path[1].T, color: theme.colors.warning, label: '2' },
                { x: path[10].s, y: path[10].T, color: theme.colors.error, label: '3' },
                { x: path[11].s, y: path[11].T, color: theme.colors.success, label: '4' },
              ]}
            />
          )}
        </Card>
        <Card title="Efficiency and Net Work vs Pressure Ratio" last>
          {data && (
            <LineChart
              xLabel="Pressure ratio r_p"
              yLabel="Efficiency (%) / net work (÷10 kJ/kg)"
              yMin={0}
              series={[
                { label: 'Efficiency %', color: theme.colors.accent[600], points: data.sweep.pressure_ratio.map((x, i) => ({ x, y: data.sweep.efficiency[i] * 100 })) },
                { label: 'Net work /10', color: theme.colors.lightBlue[600], points: data.sweep.pressure_ratio.map((x, i) => ({ x, y: data.sweep.net_work[i] / 10 })) },
              ]}
              markers={[{ x: rp, y: data.thermal_efficiency * 100, color: theme.colors.error, label: 'now' }]}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default function PowerCyclesAnalysis() {
  const [cycle, setCycle] = useState<'rankine' | 'brayton'>('rankine')
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <Card title="Cycle">
        <ChoiceButtons
          options={[
            { value: 'rankine', label: 'Rankine (steam)' },
            { value: 'brayton', label: 'Brayton (gas turbine)' },
          ]}
          value={cycle}
          onChange={setCycle}
        />
      </Card>
      {cycle === 'rankine' ? <RankinePanel /> : <BraytonPanel />}
    </div>
  )
}

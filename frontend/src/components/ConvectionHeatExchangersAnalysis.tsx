/**
 * Forced Convection & Heat Exchangers - Interactive Topic
 *
 * Cold water flows through the tubes of a heat exchanger; students set tube
 * geometry and flow rates, and the page chains the Nusselt correlation, the
 * overall coefficient U, the effectiveness-NTU duty, and an LMTD cross-check.
 */

import { useState } from 'react'
import { useThermalPost } from '../hooks/useThermalPost'
import { theme } from '../styles/theme'
import { Banner, Card, ChoiceButtons, Controls, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './thermal/ThermalShared'

interface HxData {
  velocity: number
  reynolds: number
  prandtl: number
  regime: string
  correlation: string
  nusselt: number
  h_inside: number
  u_overall: number
  area: number
  ua: number
  c_hot: number
  c_cold: number
  c_ratio: number
  ntu: number
  effectiveness: number
  q: number
  t_cold_out: number
  t_hot_out: number
  lmtd: number
  f_correction: number
  q_lmtd: number
  profile: { x: number[]; hot: number[]; cold: number[] }
  eps_curve: { ntu: number[]; effectiveness: number[] }
}

type Arrangement = 'counterflow' | 'parallel' | 'shell_tube'

// Liquid water at 1 atm, from the IAPWS-IF97 / IAPWS R12 / R15 formulations
const WATER = {
  '20': { label: 'Water 20 °C', rho: 998.2, mu: 1.0016e-3, k: 0.598, cp: 4185 },
  '40': { label: 'Water 40 °C', rho: 992.2, mu: 6.527e-4, k: 0.6285, cp: 4179 },
  '60': { label: 'Water 60 °C', rho: 983.2, mu: 4.66e-4, k: 0.651, cp: 4183 },
}

export default function ConvectionHeatExchangersAnalysis() {
  const [arrangement, setArrangement] = useState<Arrangement>('counterflow')
  const [water, setWater] = useState<keyof typeof WATER>('40')
  const [diameter, setDiameter] = useState(20)
  const [tubeLength, setTubeLength] = useState(3000)
  const [numTubes, setNumTubes] = useState(8)
  const [mCold, setMCold] = useState(1.5)
  const [tColdIn, setTColdIn] = useState(20)
  const [hOut, setHOut] = useState(2000)
  const [mHot, setMHot] = useState(1)
  const [cpHot, setCpHot] = useState(4000)
  const [tHotIn, setTHotIn] = useState(90)

  const w = WATER[water]
  const { data, loading, error } = useThermalPost<HxData>('/api/convection-heat-exchangers/compute', {
    arrangement,
    tube_diameter: diameter,
    tube_length: tubeLength,
    num_tubes: numTubes,
    m_cold: mCold,
    t_cold_in: tColdIn,
    rho: w.rho,
    mu: w.mu,
    k_fluid: w.k,
    cp_cold: w.cp,
    h_outside: hOut,
    m_hot: mHot,
    cp_hot: cpHot,
    t_hot_in: Math.max(tHotIn, tColdIn + 5),
  })

  const regimeColor = data ? (data.regime === 'laminar' ? theme.colors.warning : data.regime === 'transitional' ? theme.colors.error : theme.colors.success) : undefined

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Exchanger">
            <ChoiceButtons
              options={[
                { value: 'counterflow', label: 'Counterflow' },
                { value: 'parallel', label: 'Parallel flow' },
                { value: 'shell_tube', label: 'Shell & tube (1 shell pass)' },
              ]}
              value={arrangement}
              onChange={setArrangement}
            />
            <div style={{ marginTop: theme.spacing[3] }}>
              <ChoiceButtons
                options={(Object.keys(WATER) as Array<keyof typeof WATER>).map((k) => ({ value: k, label: WATER[k].label }))}
                value={water}
                onChange={setWater}
              />
            </div>
          </Card>

          <Controls>
            <div style={{ fontWeight: 700 }}>Tube side (cold water)</div>
            <SliderRow label="Tube inner diameter D" value={diameter} unit="mm" min={8} max={50} step={1} digits={0} onChange={setDiameter} />
            <SliderRow label="Tube length L" value={tubeLength} unit="mm" min={500} max={6000} step={100} digits={0} onChange={setTubeLength} />
            <SliderRow label="Number of tubes N" value={numTubes} min={1} max={60} step={1} digits={0} onChange={setNumTubes} />
            <SliderRow label="Cold flow rate" value={mCold} unit="kg/s" min={0.05} max={6} step={0.05} digits={2} onChange={setMCold} />
            <SliderRow label="Cold inlet temperature" value={tColdIn} unit="°C" min={0} max={50} step={1} digits={0} onChange={setTColdIn} />
          </Controls>

          <Controls>
            <div style={{ fontWeight: 700 }}>Shell side (hot stream)</div>
            <SliderRow label="Outside coefficient h_o" value={hOut} unit="W/m²K" min={100} max={8000} step={50} digits={0} onChange={setHOut} />
            <SliderRow label="Hot flow rate" value={mHot} unit="kg/s" min={0.1} max={6} step={0.1} onChange={setMHot} />
            <SliderRow label="Hot specific heat c_p" value={cpHot} unit="J/kg·K" min={1000} max={4200} step={100} digits={0} onChange={setCpHot} />
            <SliderRow label="Hot inlet temperature" value={tHotIn} unit="°C" min={30} max={200} step={1} digits={0} onChange={setTHotIn} />
          </Controls>
        </div>

        <div>
          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Velocity in tubes" value={`${data.velocity.toFixed(2)} m/s`} />
                <ResultRow label="Reynolds / Prandtl" value={`${data.reynolds.toFixed(0)} / ${data.prandtl.toFixed(2)}`} color={regimeColor} />
                <ResultRow label="Nusselt number" value={`${data.nusselt.toFixed(1)} (${data.correlation})`} />
                <ResultRow label="h inside" value={`${data.h_inside.toFixed(0)} W/m²K`} />
                <ResultRow label="Overall U" value={`${data.u_overall.toFixed(0)} W/m²K`} />
                <ResultRow label="UA" value={`${data.ua.toFixed(0)} W/K`} />
                <ResultRow label="C_r = C_min / C_max" value={data.c_ratio.toFixed(3)} />
                <ResultRow label="NTU = UA / C_min" value={data.ntu.toFixed(3)} />
                <ResultRow label="Effectiveness ε" value={data.effectiveness.toFixed(3)} />
                <ResultRow label="Heat duty Q (ε-NTU)" value={`${(data.q / 1000).toFixed(2)} kW`} color={theme.colors.accent[600]} />
                <ResultRow label="Heat duty Q (U·A·F·ΔT_lm)" value={`${(data.q_lmtd / 1000).toFixed(2)} kW`} />
                <ResultRow label="ΔT_lm / F" value={`${data.lmtd.toFixed(1)} K / ${data.f_correction.toFixed(3)}`} />
                <ResultRow label="Outlet temps (cold / hot)" value={`${data.t_cold_out.toFixed(1)} / ${data.t_hot_out.toFixed(1)} °C`} last />
                <Banner
                  color={regimeColor ?? theme.colors.gray[500]}
                  text={data.regime === 'turbulent' ? 'Turbulent tube flow: high h' : data.regime === 'laminar' ? 'Laminar tube flow (Nu = 3.66): h is low, try fewer tubes' : 'Transitional flow: correlation is only an estimate'}
                />
              </>
            )}
          </ResultsCard>

          {data && data.profile.x.length > 0 && (
            <Card title="Temperature Along the Exchanger">
              <LineChart
                xLabel="Fraction of exchanger area"
                yLabel="Temperature (°C)"
                series={[
                  { label: 'Hot stream', color: theme.colors.error, points: data.profile.x.map((x, i) => ({ x, y: data.profile.hot[i] })) },
                  { label: 'Cold stream', color: theme.colors.lightBlue[600], points: data.profile.x.map((x, i) => ({ x, y: data.profile.cold[i] })) },
                ]}
                xMin={0}
                xMax={1}
              />
              <div style={{ fontSize: '12px', color: theme.colors.text.secondary, marginTop: theme.spacing[1] }}>
                {arrangement === 'counterflow' ? 'Hot enters at x = 0; cold enters at x = 1.' : 'Both streams enter at x = 0.'}
              </div>
            </Card>
          )}

          <Card title="Effectiveness vs NTU (at this C_r)">
            {data && (
              <LineChart
                xLabel="NTU"
                yLabel="Effectiveness ε"
                yMin={0}
                yMax={1}
                xMin={0}
                xMax={5}
                series={[{ label: 'ε(NTU, C_r)', color: theme.colors.accent[600], points: data.eps_curve.ntu.map((x, i) => ({ x, y: data.eps_curve.effectiveness[i] })) }]}
                markers={[{ x: Math.min(data.ntu, 5), y: data.effectiveness, color: theme.colors.error, label: 'now' }]}
              />
            )}
          </Card>

          <EquationsCard
            lines={[
              'Re = 4ṁ_tube / (π D μ),  Nu = 0.023 Re^0.8 Pr^0.4',
              'h = Nu k / D,  U = 1 / (1/h_i + 1/h_o)',
              'NTU = UA / C_min,  Q = ε C_min (T_h,in − T_c,in)',
              'ε_cf = (1 − e^{−NTU(1−C_r)}) / (1 − C_r e^{−NTU(1−C_r)})',
              'Q = U A F ΔT_lm',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

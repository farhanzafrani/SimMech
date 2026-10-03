/**
 * Pumps and System Curves - Interactive Topic
 *
 * Students change the piping system (static head, pipe size, length, valve
 * losses) and the suction conditions, and watch the pump and system curves
 * intersect at the operating point while NPSH available is checked against
 * NPSH required.
 */

import { useState } from 'react'
import { useFluidsSimulation } from '../hooks/useFluidsSimulation'
import { theme } from '../styles/theme'
import { Banner, Card, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './fluids/FluidsUI'

// Pump datasheet (fixed for the exercise): H0 = 40 m shutoff, 30 m at 20 L/s, BEP at 20 L/s
const PUMP = { shutoff_head: 40, rated_flow: 0.02, rated_head: 30, peak_efficiency: 0.75, npsh_required: 3.0 }

interface PumpData {
  operating_flow: number
  operating_head: number
  velocity: number
  reynolds: number
  friction_factor: number
  efficiency: number
  hydraulic_power: number
  shaft_power: number | null
  flow_vs_bep: number
  npsh_available: number
  npsh_required: number
  npsh_margin: number
  cavitation_risk: boolean
  curves: { flow: number[]; pump_head: number[]; system_head: number[]; efficiency: number[] }
}

export default function PumpSystemAnalysis() {
  const [staticHead, setStaticHead] = useState(15)
  const [diameterMm, setDiameterMm] = useState(100)
  const [length, setLength] = useState(100)
  const [minorK, setMinorK] = useState(5)
  const [suctionHead, setSuctionHead] = useState(-4)
  const [suctionK, setSuctionK] = useState(1.5)
  const [vaporKpa, setVaporKpa] = useState(2.339)

  const { data, loading, error } = useFluidsSimulation<PumpData>('/api/pump-system/compute', {
    ...PUMP,
    static_head: staticHead,
    pipe_diameter: diameterMm / 1000,
    pipe_length: length,
    minor_loss_k: minorK,
    roughness: 4.6e-5,
    density: 1000,
    viscosity: 1.0e-3,
    atmospheric_pressure: 101325,
    vapor_pressure: vaporKpa * 1000,
    suction_head: suctionHead,
    suction_loss_k: suctionK,
  })

  const npshColor = !data ? theme.colors.gray[500] : data.cavitation_risk ? theme.colors.error : data.npsh_margin < 1 ? theme.colors.warning : theme.colors.success

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Piping System">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Static Head H_static" value={staticHead} display={`${staticHead.toFixed(0)} m`} min={0} max={38} step={1} onChange={setStaticHead} disabled={loading} />
              <SliderRow label="Pipe Diameter D" value={diameterMm} display={`${diameterMm.toFixed(0)} mm`} min={50} max={200} step={5} onChange={setDiameterMm} disabled={loading} />
              <SliderRow label="Pipe Length L" value={length} display={`${length.toFixed(0)} m`} min={10} max={500} step={10} onChange={setLength} disabled={loading} />
              <SliderRow label="Minor Losses ΣK (valves, bends)" value={minorK} display={minorK.toFixed(1)} min={0} max={50} step={0.5} onChange={setMinorK} disabled={loading} />
            </div>
          </Card>

          <Card title="Suction Conditions (Water)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <SliderRow label="Liquid Level above Pump z_s" value={suctionHead} display={`${suctionHead.toFixed(1)} m`} min={-9} max={5} step={0.5} onChange={setSuctionHead} disabled={loading} />
              <SliderRow label="Suction Losses ΣK_s" value={suctionK} display={suctionK.toFixed(1)} min={0} max={10} step={0.5} onChange={setSuctionK} disabled={loading} />
              <SliderRow label="Vapor Pressure p_v" value={vaporKpa} display={`${vaporKpa.toFixed(1)} kPa`} min={2.3} max={47.4} step={0.1} onChange={setVaporKpa} disabled={loading} />
            </div>
            <div style={{ marginTop: theme.spacing[3], padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono, fontSize: '12px' }}>
              Pump: H₀ = 40 m, 30 m @ 20 L/s (BEP), NPSHr = 3 m. p_atm = 101.3 kPa. Water vapor pressure: 2.3 kPa @ 20°C, 47.4 kPa @ 80°C.
            </div>
          </Card>

          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Operating flow Q" value={`${(data.operating_flow * 1000).toFixed(2)} L/s`} />
                <ResultRow label="Operating head H" value={`${data.operating_head.toFixed(2)} m`} />
                <ResultRow label="Pipe velocity" value={`${data.velocity.toFixed(2)} m/s`} />
                <ResultRow label="Friction factor f" value={data.friction_factor.toFixed(4)} />
                <ResultRow label="Pump efficiency η" value={`${(data.efficiency * 100).toFixed(1)}% (Q/Q_BEP = ${data.flow_vs_bep.toFixed(2)})`} />
                <ResultRow label="Hydraulic power ρgQH" value={`${(data.hydraulic_power / 1000).toFixed(2)} kW`} />
                <ResultRow label="Shaft power" value={data.shaft_power === null ? '—' : `${(data.shaft_power / 1000).toFixed(2)} kW`} />
                <ResultRow label="NPSH available" value={`${data.npsh_available.toFixed(2)} m`} color={npshColor} />
                <ResultRow label="NPSH required" value={`${data.npsh_required.toFixed(2)} m`} />
                <Banner color={npshColor}>
                  {data.cavitation_risk
                    ? `Cavitation risk: NPSHa is ${Math.abs(data.npsh_margin).toFixed(2)} m below NPSHr`
                    : `NPSHa exceeds NPSHr by ${data.npsh_margin.toFixed(2)} m`}
                </Banner>
              </>
            )}
          </ResultsCard>

          <EquationsCard
            lines={[
              'H_pump = H₀ − a Q²',
              'H_sys = H_static + (fL/D + ΣK) V²/2g',
              'Operating point: H_pump = H_sys',
              'P_hyd = ρ g Q H,  P_shaft = P_hyd / η',
              'NPSHa = (p_atm − p_v)/ρg + z_s − ΣK_s V²/2g',
            ]}
          />
        </div>

        <div>
          <Card title="Pump Curve vs System Curve" last>
            {data && (
              <LineChart
                xs={data.curves.flow.map((q) => q * 1000)}
                series={[
                  { label: 'Pump head', color: theme.colors.lightBlue[600], ys: data.curves.pump_head },
                  { label: 'System head', color: theme.colors.error, ys: data.curves.system_head },
                  { label: 'Pump efficiency × 50 (m scale)', color: theme.colors.success, ys: data.curves.efficiency.map((e) => e * 50), dashed: true },
                ]}
                xLabel="Flow Q (L/s)"
                yLabel="Head (m)"
                marker={{ x: data.operating_flow * 1000, y: data.operating_head, label: `${(data.operating_flow * 1000).toFixed(1)} L/s, ${data.operating_head.toFixed(1)} m` }}
                height={300}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

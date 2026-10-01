/**
 * Steady 1D Conduction & Thermal Resistance Networks - Interactive Topic
 *
 * Students build a layered wall or insulated pipe between two fluids, tune
 * each layer's thickness and conductivity, and watch the resistance network,
 * heat rate, and temperature profile respond.
 */

import { useState } from 'react'
import { useThermalPost } from '../hooks/useThermalPost'
import { theme } from '../styles/theme'
import { Banner, Card, ChoiceButtons, Controls, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './thermal/ThermalShared'

interface NetworkData {
  geometry: 'plane' | 'cylinder'
  heat_rate: number
  r_total: number
  labels: string[]
  resistances: number[]
  temp_drops: number[]
  node_temps: number[]
  profile: { pos: number; T: number }[]
  heat_flux?: number
  heat_rate_per_length?: number
  critical_radius?: number
  outer_radius?: number
}

// Representative conductivities near room temperature, W/(m K)
const MATERIALS: Record<string, number> = {
  Copper: 400,
  Aluminium: 237,
  'Carbon steel': 45,
  'Stainless steel': 15,
  Concrete: 1.4,
  'Brick (common)': 0.7,
  'Glass-fibre insulation': 0.04,
  'Polyurethane foam': 0.03,
}

const LAYER_COLORS = [theme.colors.error, theme.colors.warning, theme.colors.lightBlue[600], theme.colors.success]

function kFromLog(v: number) {
  return Math.pow(10, v)
}

export default function ConductionNetworksAnalysis() {
  const [geometry, setGeometry] = useState<'plane' | 'cylinder'>('plane')
  const [numLayers, setNumLayers] = useState(3)
  const [thick, setThick] = useState([120, 80, 5])        // mm
  const [logK, setLogK] = useState([0, Math.log10(0.05), Math.log10(45)])
  const [hIn, setHIn] = useState(25)
  const [hOut, setHOut] = useState(10)
  const [tIn, setTIn] = useState(800)
  const [tOut, setTOut] = useState(25)
  const [innerRadius, setInnerRadius] = useState(50)      // mm
  const [length, setLength] = useState(1)

  const ks = logK.slice(0, numLayers).map(kFromLog)
  const ts = thick.slice(0, numLayers)

  const { data, loading, error } = useThermalPost<NetworkData>('/api/conduction-networks/compute', {
    geometry,
    thicknesses: ts.map((t) => t / 1000),
    conductivities: ks,
    h_inside: hIn,
    h_outside: hOut,
    t_inside: tIn,
    t_outside: tOut,
    area: 1,
    inner_radius: innerRadius / 1000,
    length,
  })

  const setAt = (arr: number[], set: (a: number[]) => void, i: number, v: number) => {
    const c = [...arr]
    c[i] = v
    set(c)
  }

  const rTot = data?.r_total ?? 1
  const posUnit = geometry === 'plane' ? 'x (mm)' : 'r (mm)'

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Geometry">
            <ChoiceButtons
              options={[
                { value: 'plane', label: 'Plane wall (1 m²)' },
                { value: 'cylinder', label: 'Cylindrical pipe' },
              ]}
              value={geometry}
              onChange={setGeometry}
            />
            <div style={{ marginTop: theme.spacing[3] }}>
              <ChoiceButtons
                options={[1, 2, 3, 4].map((n) => ({ value: String(n), label: `${n} layer${n > 1 ? 's' : ''}` }))}
                value={String(numLayers)}
                onChange={(v) => setNumLayers(parseInt(v))}
              />
            </div>
          </Card>

          {ts.map((t, i) => (
            <Controls key={i}>
              <div style={{ fontWeight: 700, color: LAYER_COLORS[i] }}>Layer {i + 1}</div>
              <select
                className="input"
                value=""
                onChange={(e) => e.target.value && setAt(logK, setLogK, i, Math.log10(MATERIALS[e.target.value]))}
              >
                <option value="">Material preset…</option>
                {Object.keys(MATERIALS).map((m) => (
                  <option key={m} value={m}>{m} ({MATERIALS[m]} W/m·K)</option>
                ))}
              </select>
              <SliderRow label="Thickness" value={t} unit="mm" min={1} max={300} step={1} digits={0} onChange={(v) => setAt(thick, setThick, i, v)} />
              <SliderRow label="Conductivity k (log scale)" value={logK[i]} min={-1.7} max={2.7} step={0.01} digits={2} unit="= log₁₀ k" onChange={(v) => setAt(logK, setLogK, i, v)} />
              <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>k = {ks[i].toPrecision(3)} W/(m·K)</div>
            </Controls>
          ))}

          <Controls>
            <SliderRow label="Inside fluid temperature" value={tIn} unit="°C" min={0} max={1000} step={5} digits={0} onChange={setTIn} />
            <SliderRow label="Outside fluid temperature" value={tOut} unit="°C" min={-30} max={100} step={1} digits={0} onChange={setTOut} />
            <SliderRow label="Inside h" value={hIn} unit="W/m²K" min={2} max={2000} step={1} digits={0} onChange={setHIn} />
            <SliderRow label="Outside h" value={hOut} unit="W/m²K" min={2} max={500} step={1} digits={0} onChange={setHOut} />
            {geometry === 'cylinder' && (
              <>
                <SliderRow label="Inner radius" value={innerRadius} unit="mm" min={5} max={300} step={1} digits={0} onChange={setInnerRadius} />
                <SliderRow label="Pipe length" value={length} unit="m" min={0.5} max={10} step={0.5} onChange={setLength} />
              </>
            )}
          </Controls>
        </div>

        <div>
          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Total resistance" value={`${data.r_total.toPrecision(4)} K/W`} />
                <ResultRow label="Heat rate q" value={`${data.heat_rate.toFixed(1)} W`} color={theme.colors.accent[600]} />
                {data.heat_flux !== undefined && <ResultRow label="Heat flux q″" value={`${data.heat_flux.toFixed(1)} W/m²`} />}
                {data.heat_rate_per_length !== undefined && <ResultRow label="Heat loss per metre" value={`${data.heat_rate_per_length.toFixed(1)} W/m`} />}
                {data.node_temps.map((t, i) => (
                  <ResultRow key={i} label={i === 0 ? 'T∞ inside' : i === data.node_temps.length - 1 ? 'T∞ outside' : i === 1 ? 'Inside surface' : i === data.node_temps.length - 2 ? 'Outside surface' : `Interface ${i - 1}`} value={`${t.toFixed(1)} °C`} last={i === data.node_temps.length - 1} />
                ))}
                {data.critical_radius !== undefined && data.outer_radius !== undefined && (
                  <Banner
                    color={data.outer_radius < data.critical_radius ? theme.colors.warning : theme.colors.success}
                    text={`Critical radius k/h = ${(data.critical_radius * 1000).toFixed(1)} mm; outer radius ${(data.outer_radius * 1000).toFixed(1)} mm${data.outer_radius < data.critical_radius ? ' (adding insulation here raises heat loss)' : ''}`}
                  />
                )}
              </>
            )}
          </ResultsCard>

          <Card title="Resistance Network (width ∝ R)">
            {data && (
              <div>
                <div style={{ display: 'flex', width: '100%', height: '46px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${theme.colors.border}` }}>
                  {data.resistances.map((r, i) => (
                    <div
                      key={i}
                      title={`${data.labels[i]}: ${r.toPrecision(3)} K/W`}
                      style={{
                        width: `${Math.max((r / rTot) * 100, 0.6)}%`,
                        backgroundColor: i === 0 || i === data.resistances.length - 1 ? theme.colors.gray[400] : LAYER_COLORS[i - 1],
                        borderRight: '1px solid white',
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[1], marginTop: theme.spacing[2], fontSize: '12px', fontFamily: theme.typography.fontFamily.mono }}>
                  {data.resistances.map((r, i) => (
                    <div key={i}>
                      {data.labels[i]}: R = {r.toPrecision(3)}, ΔT = {data.temp_drops[i].toFixed(1)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card title="Temperature Profile Through the Wall">
            {data && (
              <LineChart
                xLabel={`Position ${posUnit}`}
                yLabel="Temperature (°C)"
                series={[{ label: 'Wall temperature', color: theme.colors.accent[600], points: data.profile.map((p) => ({ x: p.pos * 1000, y: p.T })) }]}
              />
            )}
          </Card>

          <EquationsCard
            lines={[
              'Plane: R = L / (k A),  R_conv = 1 / (h A)',
              'Cylinder: R = ln(r₂/r₁) / (2π k L)',
              'q = (T∞,1 − T∞,2) / ΣR',
              'ΔT_i = q · R_i',
              'r_crit = k / h  (cylinder insulation)',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

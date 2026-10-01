/**
 * Material Selection (Ashby Performance Index) - Interactive Topic
 *
 * Students pick a design requirement (stiff beam, strong tie, spring ...),
 * apply optional screening limits, and see materials ranked by the Ashby
 * index on a log-log property chart with the index guideline drawn through
 * the winner.
 */

import { useState } from 'react'
import { useMatMfgSimulation } from '../hooks/useMatMfgSimulation'
import { theme } from '../styles/theme'
import { CardTitle, SliderRow, ResultRow, Banner, Loading, EquationBox, TwoColumn, svgFrame } from './matmfg/MatMfgUi'

interface MaterialRow {
  id: string
  name: string
  E: number
  rho: number
  sigma_y: number
  index_value: number
  relative_index: number
  mass_ratio: number | null
  passes_screening: boolean
}

interface MaterialSelectionData {
  index: string
  index_label: string
  index_latex: string
  reference: string
  reference_index: number
  materials: MaterialRow[]
  best_id: string | null
}

// kind: which property pairs go on the chart axes; slope of the guideline on log-log axes
const INDICES: Record<string, { label: string; formula: string; chart: 'E-rho' | 'S-rho' | 'S-E'; slope: number; power: number }> = {
  stiff_beam: { label: 'Light, stiff beam', formula: 'M = E^½ / ρ', chart: 'E-rho', slope: 2, power: 0.5 },
  stiff_panel: { label: 'Light, stiff panel', formula: 'M = E^⅓ / ρ', chart: 'E-rho', slope: 3, power: 1 / 3 },
  stiff_tie: { label: 'Light, stiff tie', formula: 'M = E / ρ', chart: 'E-rho', slope: 1, power: 1 },
  strong_beam: { label: 'Light, strong beam', formula: 'M = σᵧ^⅔ / ρ', chart: 'S-rho', slope: 1.5, power: 2 / 3 },
  strong_tie: { label: 'Light, strong tie', formula: 'M = σᵧ / ρ', chart: 'S-rho', slope: 1, power: 1 },
  spring: { label: 'Spring (energy / volume)', formula: 'M = σᵧ² / E', chart: 'S-E', slope: 0.5, power: 2 },
}

const REFERENCES: Record<string, string> = {
  steel_1020: 'Mild steel',
  al_6061: 'Al 6061',
  ti_6al4v: 'Ti-6Al-4V',
}

export default function MaterialSelectionAnalysis() {
  const [index, setIndex] = useState('stiff_beam')
  const [reference, setReference] = useState('steel_1020')
  const [useYield, setUseYield] = useState(false)
  const [minYield, setMinYield] = useState(300)
  const [useDensity, setUseDensity] = useState(false)
  const [maxDensity, setMaxDensity] = useState(5)

  const { data, loading, error } = useMatMfgSimulation<MaterialSelectionData>('/api/material-selection/compute', {
    index,
    reference,
    min_yield: useYield ? minYield : undefined,
    max_density: useDensity ? maxDensity : undefined,
  })

  const spec = INDICES[index]
  const best = data?.materials.find((m) => m.id === data.best_id)
  const maxIndex = Math.max(...(data?.materials.map((m) => m.index_value) ?? [1]), 1e-9)

  // --- log-log property chart ---
  const xOf = (m: MaterialRow) => (spec.chart === 'S-E' ? m.E : m.rho)
  const yOf = (m: MaterialRow) => (spec.chart === 'E-rho' ? m.E : m.sigma_y)
  const xRange = spec.chart === 'S-E' ? [1, 300] : [0.3, 10]
  const yRange = spec.chart === 'E-rho' ? [1, 300] : [20, 1000]
  const W = 300
  const H = 230
  const pad = { l: 40, r: 10, t: 10, b: 32 }
  const px = (x: number) => pad.l + ((Math.log10(x) - Math.log10(xRange[0])) / (Math.log10(xRange[1]) - Math.log10(xRange[0]))) * (W - pad.l - pad.r)
  const py = (y: number) => H - pad.b - ((Math.log10(y) - Math.log10(yRange[0])) / (Math.log10(yRange[1]) - Math.log10(yRange[0]))) * (H - pad.t - pad.b)

  // Guideline of constant M through the best material: log y = slope * log x + c
  let guide: { x1: number; y1: number; x2: number; y2: number } | null = null
  if (best) {
    const c = Math.log10(yOf(best)) - spec.slope * Math.log10(xOf(best))
    const xa = xRange[0]
    const xb = xRange[1]
    guide = { x1: px(xa), y1: py(Math.pow(10, spec.slope * Math.log10(xa) + c)), x2: px(xb), y2: py(Math.pow(10, spec.slope * Math.log10(xb) + c)) }
  }
  const xLabel = spec.chart === 'S-E' ? 'Young’s modulus E (GPa)' : 'Density ρ (Mg/m³)'
  const yLabel = spec.chart === 'E-rho' ? 'E (GPa)' : 'σᵧ (MPa)'
  const xTicks = spec.chart === 'S-E' ? [1, 10, 100] : [0.3, 1, 3, 10]
  const yTicks = spec.chart === 'E-rho' ? [1, 10, 100] : [20, 100, 1000]

  const left = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Design Requirement</CardTitle>
        <select value={index} onChange={(e) => setIndex(e.target.value)} className="input" style={{ width: '100%', marginBottom: theme.spacing[3] }}>
          {Object.entries(INDICES).map(([id, s]) => (
            <option key={id} value={id}>{s.label} — {s.formula}</option>
          ))}
        </select>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: theme.spacing[1] }}>Compare mass against</label>
        <div style={{ display: 'flex', gap: theme.spacing[2] }}>
          {Object.entries(REFERENCES).map(([id, label]) => (
            <button key={id} onClick={() => setReference(id)} className={reference === id ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>Screening Limits</CardTitle>
        <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <input type="checkbox" checked={useYield} onChange={(e) => setUseYield(e.target.checked)} />
          Require minimum yield strength
        </label>
        {useYield && <SliderRow label="σᵧ ≥" value={minYield} display={`${minYield} MPa`} min={50} max={900} step={10} onChange={setMinYield} />}
        <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <input type="checkbox" checked={useDensity} onChange={(e) => setUseDensity(e.target.checked)} />
          Limit maximum density
        </label>
        {useDensity && <SliderRow label="ρ ≤" value={maxDensity} display={`${maxDensity.toFixed(1)} Mg/m³`} min={0.5} max={8} step={0.1} onChange={setMaxDensity} />}
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Ranking</CardTitle>
        {loading && !data && <Loading />}
        {error && <div className="error-message">{error}</div>}
        {data && (
          <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
            {data.materials.map((m, i) => (
              <div key={m.id} style={{ opacity: m.passes_screening ? 1 : 0.4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: m.id === data.best_id ? 700 : 500 }}>{i + 1}. {m.name}</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono }}>
                    M = {m.index_value >= 100 ? m.index_value.toFixed(0) : m.index_value.toFixed(2)}
                    {m.mass_ratio !== null && ` · ${m.mass_ratio.toFixed(2)}× mass`}
                  </span>
                </div>
                <div style={{ height: '8px', background: theme.colors.gray[200], borderRadius: '4px', marginTop: '2px' }}>
                  <div style={{ height: '8px', width: `${(m.index_value / maxIndex) * 100}%`, background: m.id === data.best_id ? theme.colors.success : theme.colors.lightBlue[500], borderRadius: '4px' }} />
                </div>
              </div>
            ))}
            {best ? (
              <Banner color={theme.colors.success}>Best choice: {best.name}</Banner>
            ) : (
              <Banner color={theme.colors.error}>No material passes the screening limits</Banner>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <CardTitle>Key Equations</CardTitle>
        <EquationBox lines={['Beam: M = E^½ / ρ', 'Panel: M = E^⅓ / ρ', 'Tie: M = E / ρ', 'Strong beam: M = σᵧ^⅔ / ρ', 'Strong tie: M = σᵧ / ρ', 'Spring: M = σᵧ² / E', 'Mass ratio: m/m_ref = M_ref / M']} />
      </div>
    </>
  )

  const right = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Ashby Chart ({yLabel} vs {spec.chart === 'S-E' ? 'E' : 'ρ'})</CardTitle>
        <svg width="100%" height="270" viewBox={`0 0 ${W} 270`} style={svgFrame}>
          <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={theme.colors.text.primary} strokeWidth="1.5" />
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={theme.colors.text.primary} strokeWidth="1.5" />
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={px(t)} y1={pad.t} x2={px(t)} y2={H - pad.b} stroke={theme.colors.gray[300]} strokeWidth="0.5" />
              <text x={px(t)} y={H - pad.b + 12} fontSize="9" textAnchor="middle" fill={theme.colors.text.light}>{t}</text>
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={pad.l} y1={py(t)} x2={W - pad.r} y2={py(t)} stroke={theme.colors.gray[300]} strokeWidth="0.5" />
              <text x={pad.l - 4} y={py(t) + 3} fontSize="9" textAnchor="end" fill={theme.colors.text.light}>{t}</text>
            </g>
          ))}
          {guide && <line x1={guide.x1} y1={guide.y1} x2={guide.x2} y2={guide.y2} stroke={theme.colors.success} strokeWidth="1.5" strokeDasharray="5 3" />}
          {data?.materials.map((m) => (
            <g key={m.id} opacity={m.passes_screening ? 1 : 0.3}>
              <circle cx={px(xOf(m))} cy={py(yOf(m))} r={m.id === data.best_id ? 6 : 4} fill={m.id === data.best_id ? theme.colors.success : theme.colors.lightBlue[600]} stroke="white" strokeWidth="1" />
              <text x={px(xOf(m)) + 7} y={py(yOf(m)) + 3} fontSize="8" fill={theme.colors.text.secondary}>{m.name.split(' ')[0]}</text>
            </g>
          ))}
          <text x={(pad.l + W - pad.r) / 2} y={H - 6} fontSize="10" textAnchor="middle" fill={theme.colors.text.secondary}>{xLabel}</text>
          <text x="10" y={H / 2} fontSize="10" fill={theme.colors.text.secondary} transform={`rotate(-90 10 ${H / 2})`} textAnchor="middle">{yLabel}</text>
          <text x={W - pad.r} y="262" fontSize="9" textAnchor="end" fill={theme.colors.success}>- - guideline of constant M (slope {spec.slope})</text>
        </svg>
      </div>

      <div className="card">
        <CardTitle>Selected Material</CardTitle>
        {best && data && (
          <div style={{ display: 'grid', gap: theme.spacing[2] }}>
            <ResultRow label="Material" value={best.name} />
            <ResultRow label="Modulus E" value={`${best.E} GPa`} />
            <ResultRow label="Density ρ" value={`${best.rho} Mg/m³`} />
            <ResultRow label="Yield σᵧ" value={`${best.sigma_y} MPa`} />
            <ResultRow label="Index vs reference" value={`${best.relative_index.toFixed(2)}×`} />
            {best.mass_ratio !== null && <ResultRow label="Part mass vs reference" value={`${(best.mass_ratio * 100).toFixed(0)}%`} />}
          </div>
        )}
        <p style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[3] }}>
          Property values are representative handbook figures; real grades, tempers and composite lay-ups vary.
        </p>
      </div>
    </>
  )

  return <TwoColumn left={left} right={right} />
}

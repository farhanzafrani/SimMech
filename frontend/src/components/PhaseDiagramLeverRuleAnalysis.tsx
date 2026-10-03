/**
 * Phase Diagrams & the Lever Rule - Interactive Topic
 *
 * Students slide the carbon content of a slow-cooled plain-carbon steel and
 * read off the phase fractions (ferrite / cementite) and microconstituent
 * fractions (proeutectoid phase / pearlite). A second card applies the
 * lever rule to any binary tie line.
 */

import { useState } from 'react'
import { useMatMfgSimulation } from '../hooks/useMatMfgSimulation'
import { theme } from '../styles/theme'
import { CardTitle, SliderRow, ResultRow, Banner, Loading, EquationBox, TwoColumn, svgFrame } from './matmfg/MatMfgUi'

interface PhaseData {
  carbon: number
  steel_class: string
  ferrite_fraction: number
  cementite_fraction: number
  proeutectoid_name: string
  proeutectoid_fraction: number
  pearlite_fraction: number
  ferrite_in_pearlite: number
  eutectoid_temperature: number
}

interface TieLineData {
  fraction_a: number
  fraction_b: number
}

const PRESETS = [
  { label: '0.20 (low-C)', value: 0.2 },
  { label: '0.40 (medium-C)', value: 0.4 },
  { label: '0.76 (eutectoid)', value: 0.76 },
  { label: '1.20 (tool steel)', value: 1.2 },
]

function StackedBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  return (
    <div>
      <div style={{ display: 'flex', height: '26px', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${theme.colors.border}` }}>
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${p.value * 100}%`, background: p.color, transition: 'width 150ms ease-in-out' }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[3], marginTop: theme.spacing[1], fontSize: '12px' }}>
        {parts.filter((p) => p.value > 0).map((p) => (
          <span key={p.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: 10, height: 10, background: p.color, borderRadius: 2, display: 'inline-block' }} />
            {p.label} {(p.value * 100).toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  )
}

export default function PhaseDiagramLeverRuleAnalysis() {
  const [carbon, setCarbon] = useState(0.4)
  const [tieC0, setTieC0] = useState(35)
  const [tieA, setTieA] = useState(31.5)
  const [tieB, setTieB] = useState(42.5)

  const { data, loading, error } = useMatMfgSimulation<PhaseData>('/api/phase-diagram-lever-rule/compute', { carbon })
  const tie = useMatMfgSimulation<TieLineData>('/api/phase-diagram-lever-rule/tie-line', {
    overall: tieC0,
    phase_a_composition: tieA,
    phase_b_composition: tieB,
  })

  // --- schematic Fe-C steel corner (straight-line approximations of the A3 / Acm boundaries) ---
  const W = 300
  const H = 280
  const pad = { l: 42, r: 12, t: 14, b: 36 }
  const cMax = 2.14
  const tMin = 600
  const tMax = 1000
  const X = (c: number) => pad.l + (c / cMax) * (W - pad.l - pad.r)
  const Y = (t: number) => H - pad.b - ((t - tMin) / (tMax - tMin)) * (H - pad.t - pad.b)
  const acmClipC = 0.76 + ((tMax - 727) / (1147 - 727)) * (cMax - 0.76)

  const pearliteColor = theme.colors.lightBlue[500]
  const ferriteColor = theme.colors.gray[300]
  const cementiteColor = theme.colors.error
  const proColor = data && data.carbon > 0.76 ? cementiteColor : ferriteColor

  const left = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>Steel Composition</CardTitle>
        <SliderRow label="Carbon content C₀" value={carbon} display={`${carbon.toFixed(2)} wt% C`} min={0.01} max={2.14} step={0.01} onChange={setCarbon} disabled={loading} />
        <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
          {PRESETS.map((p) => (
            <button key={p.value} onClick={() => setCarbon(p.value)} className={carbon === p.value ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: '1 1 40%' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Equilibrium Microstructure (just below 727 °C)</CardTitle>
        {loading && !data && <Loading />}
        {error && <div className="error-message">{error}</div>}
        {data && (
          <div style={{ display: 'grid', gap: theme.spacing[3], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
            <Banner color={theme.colors.lightBlue[600]}>{data.steel_class}</Banner>
            <div>
              <div style={{ fontWeight: 600, marginBottom: theme.spacing[1] }}>Phases (lever rule across α + Fe₃C)</div>
              <StackedBar
                parts={[
                  { label: 'Ferrite (α)', value: data.ferrite_fraction, color: ferriteColor },
                  { label: 'Cementite (Fe₃C)', value: data.cementite_fraction, color: cementiteColor },
                ]}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: theme.spacing[1] }}>Microconstituents</div>
              <StackedBar
                parts={[
                  { label: data.proeutectoid_name === 'None' ? 'Proeutectoid' : data.proeutectoid_name, value: data.proeutectoid_fraction, color: proColor },
                  { label: 'Pearlite', value: data.pearlite_fraction, color: pearliteColor },
                ]}
              />
            </div>
            <ResultRow label="Total ferrite" value={`${(data.ferrite_fraction * 100).toFixed(1)} %`} />
            <ResultRow label="Total cementite" value={`${(data.cementite_fraction * 100).toFixed(1)} %`} />
            <ResultRow label="Pearlite" value={`${(data.pearlite_fraction * 100).toFixed(1)} %`} />
            <ResultRow label="Ferrite inside pearlite" value={`${(data.ferrite_in_pearlite * 100).toFixed(1)} %`} />
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>Any Binary Tie Line</CardTitle>
        <SliderRow label="Alloy composition C₀" value={tieC0} display={`${tieC0.toFixed(1)} wt%`} min={tieA} max={tieB} step={0.1} onChange={setTieC0} />
        <SliderRow label="Phase A boundary (e.g. α)" value={tieA} display={`${tieA.toFixed(1)} wt%`} min={0} max={Math.max(tieB - 1, 1)} step={0.5} onChange={(v) => { setTieA(v); setTieC0(Math.min(Math.max(tieC0, v), tieB)) }} />
        <SliderRow label="Phase B boundary (e.g. L)" value={tieB} display={`${tieB.toFixed(1)} wt%`} min={tieA + 1} max={100} step={0.5} onChange={(v) => { setTieB(v); setTieC0(Math.min(Math.max(tieC0, tieA), v)) }} />
        {tie.error && <div className="error-message">{tie.error}</div>}
        {tie.data && (
          <>
            <StackedBar
              parts={[
                { label: 'Phase A', value: tie.data.fraction_a, color: theme.colors.lightBlue[400] },
                { label: 'Phase B', value: tie.data.fraction_b, color: theme.colors.warning },
              ]}
            />
            <p style={{ fontSize: '12px', color: theme.colors.text.light, margin: 0 }}>
              Defaults are the Cu–Ni tie line at 1250 °C (α = 42.5, L = 31.5 wt% Ni): swap A/B to match your own diagram.
            </p>
          </>
        )}
      </div>

      <div className="card">
        <CardTitle>Key Equations</CardTitle>
        <EquationBox
          lines={['W_A = (C_B − C₀) / (C_B − C_A)', 'W_B = (C₀ − C_A) / (C_B − C_A)', 'Hypoeutectoid: W_α′ = (0.76 − C₀)/(0.76 − 0.022)', 'Hypereutectoid: W_Fe₃C′ = (C₀ − 0.76)/(6.70 − 0.76)', 'Total α: (6.70 − C₀)/(6.70 − 0.022)']}
        />
      </div>
    </>
  )

  const right = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Fe–C Steel Corner (schematic)</CardTitle>
        <svg width="100%" height="300" viewBox={`0 0 ${W} 300`} style={svgFrame}>
          <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={theme.colors.text.primary} strokeWidth="1.5" />
          <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke={theme.colors.text.primary} strokeWidth="1.5" />
          {[0, 0.5, 1, 1.5, 2].map((c) => (
            <text key={c} x={X(c)} y={H - pad.b + 13} fontSize="9" textAnchor="middle" fill={theme.colors.text.light}>{c}</text>
          ))}
          {[600, 727, 800, 912].map((t) => (
            <text key={t} x={pad.l - 4} y={Y(t) + 3} fontSize="9" textAnchor="end" fill={theme.colors.text.light}>{t}</text>
          ))}
          {/* A3: (0, 912) -> (0.76, 727); Acm: (0.76, 727) -> clipped at top; A1 at 727 */}
          <polyline points={`${X(0)},${Y(912)} ${X(0.76)},${Y(727)} ${X(acmClipC)},${Y(tMax)}`} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="2" />
          <line x1={X(0)} y1={Y(727)} x2={X(cMax)} y2={Y(727)} stroke={theme.colors.lightBlue[700]} strokeWidth="2" />
          <text x={X(0.9)} y={Y(900)} fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>γ</text>
          <text x={X(0.12)} y={Y(790)} fontSize="10" fill={theme.colors.text.secondary}>α+γ</text>
          <text x={X(1.5)} y={Y(790)} fontSize="10" fill={theme.colors.text.secondary}>γ+Fe₃C</text>
          <text x={X(0.2)} y={Y(660)} fontSize="10" fill={theme.colors.text.secondary}>α + Fe₃C</text>
          <text x={X(1.4)} y={Y(660)} fontSize="10" fill={theme.colors.text.secondary}>pearlite + Fe₃C</text>
          <text x={X(0.76) + 3} y={Y(727) + 11} fontSize="8" fill={theme.colors.text.light}>0.76</text>
          {/* Selected alloy */}
          <line x1={X(carbon)} y1={pad.t} x2={X(carbon)} y2={H - pad.b} stroke={theme.colors.error} strokeWidth="2" strokeDasharray="5 3" />
          <circle cx={X(carbon)} cy={Y(727)} r="4" fill={theme.colors.error} />
          <text x={(pad.l + W - pad.r) / 2} y={H - 6} fontSize="10" textAnchor="middle" fill={theme.colors.text.secondary}>wt% C</text>
          <text x="10" y={H / 2} fontSize="10" fill={theme.colors.text.secondary} transform={`rotate(-90 10 ${H / 2})`} textAnchor="middle">Temperature (°C)</text>
          <text x={W - pad.r} y="294" fontSize="8" textAnchor="end" fill={theme.colors.text.light}>Boundaries drawn as straight lines for illustration</text>
        </svg>
      </div>

      <div className="card">
        <CardTitle>Reading the Lever</CardTitle>
        {data && (
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: theme.colors.text.secondary }}>
            At C₀ = {data.carbon.toFixed(2)} wt% C the alloy sits {data.carbon < 0.76 ? 'left' : data.carbon > 0.76 ? 'right' : 'exactly on'} the eutectoid
            composition (0.76 wt% C). Just above 727 °C the tie line runs from the austenite boundary to the{' '}
            {data.carbon < 0.76 ? 'ferrite (0.022 wt% C)' : 'cementite (6.70 wt% C)'} end, and the fraction of each is the opposite arm of the lever over the
            whole tie line. All remaining austenite transforms to pearlite at 727 °C, which is {(data.ferrite_in_pearlite * 100).toFixed(1)}% ferrite and the rest cementite by weight.
          </p>
        )}
      </div>
    </>
  )

  return <TwoColumn left={left} right={right} />
}

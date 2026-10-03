/**
 * Sheet-Metal Bending & Springback - Interactive Topic
 *
 * Students adjust sheet thickness, bend radius, angle and K-factor to see
 * bend allowance, flat-pattern length and V-die force, and adjust the
 * material to see how much springback the tool must overbend to cancel.
 */

import { useState, useEffect } from 'react'
import { useMatMfgSimulation } from '../hooks/useMatMfgSimulation'
import { theme } from '../styles/theme'
import { CardTitle, SliderRow, ResultRow, Banner, Loading, EquationBox, TwoColumn, svgFrame } from './matmfg/MatMfgUi'

interface BendData {
  bend_allowance: number
  outside_setback: number
  bend_deduction: number
  flat_length: number
  bend_force: number
  neutral_radius: number
  springback_parameter: number
  fully_elastic: boolean
  springback_factor: number
  tool_angle: number | null
  springback_angle: number | null
  final_neutral_radius: number | null
  radius_to_thickness: number
}

// Representative room-temperature sheet properties (MPa)
const MATERIALS = {
  mild_steel: { label: 'Mild steel', Y: 250, UTS: 400, E: 200000 },
  al_5052: { label: 'Al 5052-H32', Y: 195, UTS: 230, E: 70000 },
  ss_304: { label: 'Stainless 304', Y: 215, UTS: 505, E: 193000 },
  ahss: { label: 'High-strength steel', Y: 600, UTS: 800, E: 200000 },
}

export default function SheetMetalBendingAnalysis() {
  const [material, setMaterial] = useState<keyof typeof MATERIALS>('ahss')
  const [Y, setY] = useState(MATERIALS.ahss.Y)
  const [UTS, setUTS] = useState(MATERIALS.ahss.UTS)
  const [E, setE] = useState(MATERIALS.ahss.E)

  const [thickness, setThickness] = useState(1.5)
  const [radius, setRadius] = useState(6)
  const [angle, setAngle] = useState(90)
  const [kFactor, setKFactor] = useState(0.4)
  const [flangeA, setFlangeA] = useState(40)
  const [flangeB, setFlangeB] = useState(60)
  const [dieOpening, setDieOpening] = useState(12)
  const [bendLength, setBendLength] = useState(100)

  useEffect(() => {
    setY(MATERIALS[material].Y)
    setUTS(MATERIALS[material].UTS)
    setE(MATERIALS[material].E)
  }, [material])

  const { data, loading, error } = useMatMfgSimulation<BendData>('/api/sheet-metal-bending/compute', {
    thickness,
    inner_radius: radius,
    bend_angle: angle,
    k_factor: kFactor,
    flange_a: flangeA,
    flange_b: flangeB,
    yield_strength: Y,
    youngs_modulus: E,
    ultimate_strength: UTS,
    die_opening: dieOpening,
    bend_length: bendLength,
  })

  // --- Side view of the bend (neutral axis path, drawn thick as the sheet) ---
  const rN = data?.neutral_radius ?? radius + thickness / 2
  const s = Math.min(5, 60 / Math.max(rN, 10))
  const rPx = Math.max(rN * s, 3)
  const flangePx = 70
  const x0 = 40
  const y0 = 230
  const x1 = x0 + 60
  const bendPath = (deg: number) => {
    const th = (deg * Math.PI) / 180
    const ex = x1 + rPx * Math.sin(th)
    const ey = y0 - rPx + rPx * Math.cos(th)
    const fx = ex + flangePx * Math.cos(th)
    const fy = ey - flangePx * Math.sin(th)
    return `M ${x0} ${y0} L ${x1} ${y0} A ${rPx} ${rPx} 0 0 0 ${ex} ${ey} L ${fx} ${fy}`
  }
  const sheetPx = Math.max(thickness * s, 3)
  const showOverbend = data && !data.fully_elastic && data.tool_angle !== null

  const left = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Sheet Material</CardTitle>
        <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap', marginBottom: theme.spacing[3] }}>
          {(Object.keys(MATERIALS) as Array<keyof typeof MATERIALS>).map((m) => (
            <button key={m} onClick={() => setMaterial(m)} className={material === m ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: '1 1 40%' }}>
              {MATERIALS[m].label}
            </button>
          ))}
        </div>
        <div style={{ padding: '8px 12px', backgroundColor: theme.colors.bg.secondary, borderRadius: '4px', fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
          Y = {Y} MPa · UTS = {UTS} MPa · E = {(E / 1000).toFixed(0)} GPa
        </div>
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>Bend Geometry</CardTitle>
        <SliderRow label="Thickness t" value={thickness} display={`${thickness.toFixed(1)} mm`} min={0.5} max={6} step={0.1} onChange={setThickness} disabled={loading} />
        <SliderRow label="Inside bend radius r" value={radius} display={`${radius.toFixed(1)} mm`} min={0} max={30} step={0.5} onChange={setRadius} disabled={loading} />
        <SliderRow label="Final bend angle θ" value={angle} display={`${angle.toFixed(0)}°`} min={10} max={170} step={1} onChange={setAngle} disabled={loading} />
        <SliderRow label="K-factor" value={kFactor} display={kFactor.toFixed(2)} min={0.3} max={0.5} step={0.01} onChange={setKFactor} disabled={loading} />
        <SliderRow label="Outside flange a" value={flangeA} display={`${flangeA.toFixed(0)} mm`} min={10} max={150} step={1} onChange={setFlangeA} disabled={loading} />
        <SliderRow label="Outside flange b" value={flangeB} display={`${flangeB.toFixed(0)} mm`} min={10} max={150} step={1} onChange={setFlangeB} disabled={loading} />
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>V-Die Setup</CardTitle>
        <SliderRow label="Die opening W" value={dieOpening} display={`${dieOpening.toFixed(0)} mm`} min={4} max={60} step={1} onChange={setDieOpening} disabled={loading} />
        <SliderRow label="Bend length L" value={bendLength} display={`${bendLength.toFixed(0)} mm`} min={10} max={1000} step={10} onChange={setBendLength} disabled={loading} />
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Results</CardTitle>
        {loading && !data && <Loading />}
        {error && <div className="error-message">{error}</div>}
        {data && (
          <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
            <ResultRow label="Bend allowance (BA)" value={`${data.bend_allowance.toFixed(2)} mm`} />
            <ResultRow label="Outside setback" value={`${data.outside_setback.toFixed(2)} mm`} />
            <ResultRow label="Bend deduction (BD)" value={`${data.bend_deduction.toFixed(2)} mm`} />
            <ResultRow label="Flat blank length" value={`${data.flat_length.toFixed(2)} mm`} />
            <ResultRow label="V-die bend force" value={`${data.bend_force.toFixed(1)} kN`} />
            <ResultRow label="Springback parameter x" value={data.springback_parameter.toFixed(4)} />
            {data.fully_elastic ? (
              <Banner color={theme.colors.error}>x ≥ 0.5: sheet never yields through — it springs back flat. Reduce the radius or thicken the sheet.</Banner>
            ) : (
              <>
                <ResultRow label="Springback factor (θ_f/θ_i)" value={data.springback_factor.toFixed(4)} />
                <ResultRow label="Tool (overbend) angle" value={`${data.tool_angle!.toFixed(2)}°`} />
                <ResultRow label="Springback" value={`${data.springback_angle!.toFixed(2)}°`} color={data.springback_angle! > 3 ? theme.colors.warning : undefined} />
                <Banner color={data.springback_angle! > 3 ? theme.colors.warning : theme.colors.success}>
                  Form to {data.tool_angle!.toFixed(1)}° to land on {angle}° after release
                </Banner>
              </>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <CardTitle>Key Equations</CardTitle>
        <EquationBox
          lines={['BA = θ (r + K t)', 'BD = 2 (r + t) tan(θ/2) − BA', 'Flat length = a + b − BD', 'F = 1.33 · UTS · L t² / W', 'R_i/R_f = 4x³ − 3x + 1', 'x = R_i Y / (E t),  θ_f/θ_i = R_i/R_f']}
        />
      </div>
    </>
  )

  const right = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Bend and Springback (side view)</CardTitle>
        <svg width="100%" height="280" viewBox="0 0 300 280" style={svgFrame}>
          <path d={bendPath(angle)} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth={sheetPx} strokeLinejoin="round" />
          {showOverbend && (
            <path d={bendPath(data!.tool_angle!)} fill="none" stroke={theme.colors.warning} strokeWidth="2" strokeDasharray="5 4" />
          )}
          <circle cx={x1} cy={y0 - rPx} r="2.5" fill={theme.colors.text.primary} />
          <text x={x1 + 6} y={y0 - rPx - 4} fontSize="10" fill={theme.colors.text.light}>bend centre</text>
          <text x="12" y="268" fontSize="10" fill={theme.colors.lightBlue[600]}>— final part (θ = {angle}°)</text>
          {showOverbend && <text x="150" y="268" fontSize="10" fill={theme.colors.warning}>- - tool shape ({data!.tool_angle!.toFixed(1)}°)</text>}
        </svg>
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Flat Pattern</CardTitle>
        {data && (
          <>
            <svg width="100%" height="70" viewBox="0 0 300 70" style={svgFrame}>
              {(() => {
                const total = flangeA + flangeB
                const k = 260 / total
                const aPx = Math.max((flangeA - data.outside_setback) * k, 1)
                const bendPx = Math.max(data.bend_allowance * k, 2)
                const bPx = Math.max((flangeB - data.outside_setback) * k, 1)
                return (
                  <g>
                    <rect x="20" y="22" width={aPx} height="24" fill={theme.colors.lightBlue[300]} />
                    <rect x={20 + aPx} y="22" width={bendPx} height="24" fill={theme.colors.warning} />
                    <rect x={20 + aPx + bendPx} y="22" width={bPx} height="24" fill={theme.colors.lightBlue[300]} />
                    <text x={20 + aPx + bendPx / 2} y="16" fontSize="9" textAnchor="middle" fill={theme.colors.text.secondary}>BA</text>
                    <text x="150" y="62" fontSize="10" textAnchor="middle" fill={theme.colors.text.secondary}>flat length {data.flat_length.toFixed(1)} mm</text>
                  </g>
                )
              })()}
            </svg>
          </>
        )}
        <p style={{ fontSize: '12px', color: theme.colors.text.light, marginTop: theme.spacing[2] }}>
          K ≈ 0.33 for tight bends (r &lt; 2t), rising toward 0.5 as the radius grows. Springback uses an elastic–perfectly-plastic sheet model.
        </p>
      </div>
    </>
  )

  return <TwoColumn left={left} right={right} />
}

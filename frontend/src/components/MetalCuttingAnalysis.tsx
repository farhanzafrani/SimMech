/**
 * Metal Cutting Mechanics - Interactive Topic
 *
 * Students adjust uncut chip thickness, width of cut, rake and friction
 * angles, work-material shear strength, and cutting speed to see the
 * Merchant force circle, cutting power, and Taylor tool life update live.
 */

import { useState } from 'react'
import { useMatMfgSimulation } from '../hooks/useMatMfgSimulation'
import { theme, componentStyles } from '../styles/theme'
import { CardTitle, SliderRow, ResultRow, Banner, Loading, EquationBox, TwoColumn, svgFrame } from './matmfg/MatMfgUi'

interface MetalCuttingData {
  shear_angle: number
  chip_ratio: number
  chip_thickness: number
  shear_force: number
  resultant_force: number
  cutting_force: number
  thrust_force: number
  friction_force: number
  normal_force: number
  friction_coefficient: number
  specific_energy: number
  cutting_power: number
  material_removal_rate: number
  tool_life: number
}

export default function MetalCuttingAnalysis() {
  const [t0, setT0] = useState(0.25)
  const [width, setWidth] = useState(3)
  const [rake, setRake] = useState(10)
  const [friction, setFriction] = useState(30)
  const [tauS, setTauS] = useState(350)
  const [speed, setSpeed] = useState(120)
  const [taylorN, setTaylorN] = useState(0.25)
  const [taylorC, setTaylorC] = useState(300)

  const { data, loading, error } = useMatMfgSimulation<MetalCuttingData>('/api/metal-cutting/compute', {
    uncut_thickness: t0,
    width_of_cut: width,
    rake_angle: rake,
    friction_angle: friction,
    shear_strength: tauS,
    cutting_speed: speed,
    taylor_n: taylorN,
    taylor_c: taylorC,
  })

  // --- Merchant circle geometry (x = cutting direction, y = thrust, math orientation) ---
  const cx = 150
  const cy = 190
  const rad = (d: number) => (d * Math.PI) / 180
  const R = data?.resultant_force ?? 1
  const scale = 140 / R
  const pt = (len: number, angDeg: number) => ({
    x: cx + len * scale * Math.cos(rad(angDeg)),
    y: cy - len * scale * Math.sin(rad(angDeg)),
  })
  const theta = friction - rake
  const pR = pt(R, theta)
  const pFc = pt(data?.cutting_force ?? 0, 0)
  const pFt = pt(data?.thrust_force ?? 0, 90)
  const pFs = pt(data?.shear_force ?? 0, -(data?.shear_angle ?? 0))
  const pN = pt(data?.normal_force ?? 0, -rake)
  const pF = pt(data?.friction_force ?? 0, 90 - rake)
  const circleCx = (cx + pR.x) / 2
  const circleCy = (cy + pR.y) / 2
  const circleR = 70

  // --- Taylor tool-life curve (log-log style plot of T vs V) ---
  const vMin = 20
  const vMax = 400
  const plotW = 270
  const plotH = 140
  const lifeAt = (v: number) => Math.pow(taylorC / v, 1 / taylorN)
  const logMin = Math.log10(0.5)
  const logMax = Math.log10(500)
  const xOf = (v: number) => 30 + ((Math.log10(v) - Math.log10(vMin)) / (Math.log10(vMax) - Math.log10(vMin))) * plotW
  const yOf = (T: number) => 10 + plotH - ((Math.log10(Math.min(Math.max(T, 0.5), 500)) - logMin) / (logMax - logMin)) * plotH
  const curvePoints = Array.from({ length: 40 }, (_, i) => {
    const v = vMin * Math.pow(vMax / vMin, i / 39)
    return `${xOf(v).toFixed(1)},${yOf(lifeAt(v)).toFixed(1)}`
  }).join(' ')

  const toolLife = data?.tool_life ?? 0
  const lifeColor = toolLife >= 15 ? theme.colors.success : toolLife >= 5 ? theme.colors.warning : theme.colors.error
  const lifeLabel = toolLife >= 15 ? 'Economical tool life' : toolLife >= 5 ? 'Short tool life - consider slowing down' : 'Very short tool life'

  const left = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>Cutting Conditions</CardTitle>
        <SliderRow label="Uncut chip thickness t₀ (feed)" value={t0} display={`${t0.toFixed(2)} mm`} min={0.05} max={1} step={0.05} onChange={setT0} disabled={loading} />
        <SliderRow label="Width of cut w" value={width} display={`${width.toFixed(1)} mm`} min={0.5} max={10} step={0.5} onChange={setWidth} disabled={loading} />
        <SliderRow label="Rake angle α" value={rake} display={`${rake.toFixed(0)}°`} min={-10} max={30} step={1} onChange={setRake} disabled={loading} />
        <SliderRow label="Friction angle β (tan β = μ)" value={friction} display={`${friction.toFixed(0)}°`} min={5} max={50} step={1} onChange={setFriction} disabled={loading} />
        <SliderRow label="Work shear strength τₛ" value={tauS} display={`${tauS.toFixed(0)} MPa`} min={100} max={800} step={10} onChange={setTauS} disabled={loading} />
        <SliderRow label="Cutting speed V" value={speed} display={`${speed.toFixed(0)} m/min`} min={20} max={400} step={5} onChange={setSpeed} disabled={loading} />
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>Taylor Tool-Life Constants</CardTitle>
        <SliderRow label="Exponent n" value={taylorN} display={taylorN.toFixed(2)} min={0.1} max={0.6} step={0.01} onChange={setTaylorN} disabled={loading} />
        <SliderRow label="Constant C (speed for T = 1 min)" value={taylorC} display={`${taylorC.toFixed(0)} m/min`} min={50} max={800} step={10} onChange={setTaylorC} disabled={loading} />
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Results</CardTitle>
        {loading && !data && <Loading />}
        {error && <div className="error-message">{error}</div>}
        {data && (
          <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
            <ResultRow label="Shear angle (φ)" value={`${data.shear_angle.toFixed(1)}°`} />
            <ResultRow label="Chip ratio (r = t₀/t_c)" value={data.chip_ratio.toFixed(3)} />
            <ResultRow label="Chip thickness (t_c)" value={`${data.chip_thickness.toFixed(3)} mm`} />
            <ResultRow label="Cutting force (Fc)" value={`${data.cutting_force.toFixed(0)} N`} />
            <ResultRow label="Thrust force (Ft)" value={`${data.thrust_force.toFixed(0)} N`} />
            <ResultRow label="Specific energy (u)" value={`${data.specific_energy.toFixed(0)} N/mm²`} />
            <ResultRow label="Cutting power (Pc)" value={`${(data.cutting_power / 1000).toFixed(2)} kW`} />
            <ResultRow label="Removal rate (MRR)" value={`${data.material_removal_rate.toFixed(1)} cm³/min`} />
            <ResultRow label="Tool life (T)" value={`${data.tool_life.toFixed(1)} min`} color={lifeColor} />
            <Banner color={lifeColor}>{lifeLabel}</Banner>
          </div>
        )}
      </div>

      <div className="card">
        <CardTitle>Key Equations</CardTitle>
        <EquationBox
          lines={['φ = 45° + α/2 − β/2', 'r = sin φ / cos(φ − α)', 'Fs = τₛ t₀ w / sin φ', 'R = Fs / cos(φ + β − α)', 'Fc = R cos(β − α),  Ft = R sin(β − α)', 'Pc = Fc · V', 'V Tⁿ = C']}
        />
      </div>
    </>
  )

  const right = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Merchant Force Circle</CardTitle>
        <svg width="100%" height="340" viewBox="0 0 300 340" style={svgFrame}>
          <defs>
            <marker id="mcArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.error} />
            </marker>
          </defs>
          {data && (
            <>
              <line x1={20} y1={cy} x2={285} y2={cy} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="3 3" />
              <line x1={cx} y1={30} x2={cx} y2={320} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={circleCx} cy={circleCy} r={Math.hypot(pR.x - cx, pR.y - cy) / 2 || circleR} fill="none" stroke={theme.colors.lightBlue[400]} strokeWidth="1.5" />
              {/* Components as chords on the circle */}
              <line x1={cx} y1={cy} x2={pFc.x} y2={pFc.y} stroke={theme.colors.accent[600]} strokeWidth="2.5" />
              <line x1={cx} y1={cy} x2={pFt.x} y2={pFt.y} stroke={theme.colors.accent[600]} strokeWidth="2.5" />
              <line x1={cx} y1={cy} x2={pFs.x} y2={pFs.y} stroke={theme.colors.success} strokeWidth="2.5" />
              <line x1={cx} y1={cy} x2={pF.x} y2={pF.y} stroke={theme.colors.warning} strokeWidth="2.5" />
              <line x1={cx} y1={cy} x2={pN.x} y2={pN.y} stroke={theme.colors.warning} strokeWidth="2.5" />
              {/* Resultant */}
              <line x1={cx} y1={cy} x2={pR.x} y2={pR.y} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#mcArrow)" />
              <text x={pR.x + 6} y={pR.y - 6} fontSize="13" fontWeight={700} fill={theme.colors.error}>R</text>
              <text x={pFc.x + 4} y={pFc.y + 14} fontSize="11" fill={theme.colors.accent[600]}>Fc</text>
              <text x={pFt.x + 6} y={pFt.y + 4} fontSize="11" fill={theme.colors.accent[600]}>Ft</text>
              <text x={pFs.x + 4} y={pFs.y + 12} fontSize="11" fill={theme.colors.success}>Fs</text>
              <text x={pF.x + 6} y={pF.y} fontSize="11" fill={theme.colors.warning}>F</text>
              <text x={pN.x - 4} y={pN.y + 14} fontSize="11" fill={theme.colors.warning}>N</text>
              <circle cx={cx} cy={cy} r="3" fill={theme.colors.text.primary} />
              <text x="12" y="328" fontSize="10" fill={theme.colors.text.light}>x: cutting direction · y: thrust direction</text>
            </>
          )}
        </svg>
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Tool Life vs. Cutting Speed</CardTitle>
        <svg width="100%" height="200" viewBox="0 0 320 200" style={svgFrame}>
          <line x1="30" y1="150" x2="300" y2="150" stroke={theme.colors.text.primary} strokeWidth="1.5" />
          <line x1="30" y1="10" x2="30" y2="150" stroke={theme.colors.text.primary} strokeWidth="1.5" />
          {[1, 10, 100].map((T) => (
            <g key={T}>
              <line x1="30" y1={yOf(T)} x2="300" y2={yOf(T)} stroke={theme.colors.gray[300]} strokeWidth="0.5" />
              <text x="26" y={yOf(T) + 3} fontSize="9" textAnchor="end" fill={theme.colors.text.light}>{T}</text>
            </g>
          ))}
          {[20, 50, 100, 200, 400].map((v) => (
            <text key={v} x={xOf(v)} y="164" fontSize="9" textAnchor="middle" fill={theme.colors.text.light}>{v}</text>
          ))}
          <polyline points={curvePoints} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
          {speed >= vMin && speed <= vMax && (
            <circle cx={xOf(speed)} cy={yOf(toolLife)} r="5" fill={lifeColor} stroke="white" strokeWidth="1.5" />
          )}
          <text x="165" y="182" fontSize="10" textAnchor="middle" fill={theme.colors.text.secondary}>Cutting speed V (m/min, log scale)</text>
          <text x="8" y="80" fontSize="10" fill={theme.colors.text.secondary} transform="rotate(-90 8 80)" textAnchor="middle">T (min, log)</text>
        </svg>
      </div>

      <div className="card">
        <CardTitle>Force Summary</CardTitle>
        {data && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[2], ...componentStyles.infoBox }}>
            {[
              ['Shear force (Fs)', `${data.shear_force.toFixed(0)} N`],
              ['Resultant (R)', `${data.resultant_force.toFixed(0)} N`],
              ['Friction on rake (F)', `${data.friction_force.toFixed(0)} N`],
              ['Normal on rake (N)', `${data.normal_force.toFixed(0)} N`],
              ['Friction coeff. (μ)', data.friction_coefficient.toFixed(3)],
              ['Rake angle (α)', `${rake}°`],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>{k}</div>
                <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  return <TwoColumn left={left} right={right} />
}

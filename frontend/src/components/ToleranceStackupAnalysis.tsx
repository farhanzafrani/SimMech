/**
 * Tolerance Stack-Up & ISO Fits - Interactive Topic
 *
 * Two linked tools: (1) an ISO 286 hole-basis fit calculator that shows
 * the hole/shaft tolerance zones and clearance, and (2) a 1-D tolerance
 * stack-up comparing worst-case and RSS (statistical) gap limits.
 */

import { useState, useEffect } from 'react'
import { useMatMfgSimulation } from '../hooks/useMatMfgSimulation'
import { theme } from '../styles/theme'
import { CardTitle, SliderRow, ResultRow, Banner, Loading, EquationBox, TwoColumn, svgFrame } from './matmfg/MatMfgUi'

interface FitData {
  designation: string
  hole_tolerance_um: number
  shaft_tolerance_um: number
  hole_min: number
  hole_max: number
  shaft_min: number
  shaft_max: number
  shaft_es_um: number
  shaft_ei_um: number
  min_clearance: number
  max_clearance: number
  fit_type: string
}

interface StackData {
  nominal_gap: number
  worst_case: number
  worst_case_min: number
  worst_case_max: number
  rss: number
  rss_min: number
  rss_max: number
  worst_case_ok: boolean
  rss_ok: boolean
  probability_below_min: number
  contributions: { name: string; tolerance: number; rss_share: number }[]
}

const SHAFT_LETTERS = ['f', 'g', 'h', 'k', 'm', 'n', 'p']
const COMMON_FITS = [
  { label: 'H7/g6 sliding', letter: 'g', grade: 6, hole: 7 },
  { label: 'H7/h6 locating', letter: 'h', grade: 6, hole: 7 },
  { label: 'H7/k6 transition', letter: 'k', grade: 6, hole: 7 },
  { label: 'H7/p6 press', letter: 'p', grade: 6, hole: 7 },
]

export default function ToleranceStackupAnalysis() {
  // --- ISO fit ---
  const [nominal, setNominal] = useState(25)
  const [holeGrade, setHoleGrade] = useState(7)
  const [shaftLetter, setShaftLetter] = useState('g')
  const [shaftGrade, setShaftGrade] = useState(6)

  useEffect(() => {
    if (shaftLetter === 'k' && shaftGrade > 7) setShaftGrade(7)
  }, [shaftLetter, shaftGrade])

  const fit = useMatMfgSimulation<FitData>('/api/tolerance-stackup/fit', {
    nominal,
    hole_grade: holeGrade,
    shaft_letter: shaftLetter,
    shaft_grade: shaftGrade,
  })

  // --- Stack-up ---
  const [dims, setDims] = useState([
    { name: 'Housing bore depth', nominal: 50, tolerance: 0.1, direction: 1 },
    { name: 'Spacer', nominal: 20, tolerance: 0.05, direction: -1 },
    { name: 'Bearing width', nominal: 25, tolerance: 0.05, direction: -1 },
    { name: 'Retaining ring', nominal: 4.5, tolerance: 0.03, direction: -1 },
  ])
  const [minGap, setMinGap] = useState(0.1)

  const stack = useMatMfgSimulation<StackData>('/api/tolerance-stackup/stack', { dimensions: dims, required_min_gap: minGap })

  const setDim = (i: number, patch: Partial<(typeof dims)[number]>) =>
    setDims((prev) => prev.map((d, k) => (k === i ? { ...d, ...patch } : d)))

  // --- Fit zones diagram ---
  const fd = fit.data
  const span = fd ? Math.max(Math.abs(fd.shaft_es_um), Math.abs(fd.shaft_ei_um), fd.hole_tolerance_um, 10) * 1.3 : 50
  const zeroY = 120
  const uy = (um: number) => zeroY - (um / span) * 95
  const fitColor = fd?.fit_type === 'Clearance' ? theme.colors.success : fd?.fit_type === 'Interference' ? theme.colors.error : theme.colors.warning

  // --- Stack range diagram ---
  const sd = stack.data
  const range = sd ? Math.max(sd.worst_case * 1.4, Math.abs(minGap - sd.nominal_gap) * 1.2, 0.05) : 1
  const gx = (v: number) => (sd ? 150 + ((v - sd.nominal_gap) / range) * 125 : 150)

  const left = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>ISO 286 Fit (hole basis)</CardTitle>
        <SliderRow label="Nominal size" value={nominal} display={`${nominal.toFixed(0)} mm`} min={3} max={500} step={1} onChange={setNominal} />
        <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
          {COMMON_FITS.map((f) => (
            <button
              key={f.label}
              onClick={() => { setHoleGrade(f.hole); setShaftLetter(f.letter); setShaftGrade(f.grade) }}
              className={holeGrade === f.hole && shaftLetter === f.letter && shaftGrade === f.grade ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ flex: '1 1 40%' }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: theme.spacing[3], flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 600 }}>
            Hole H
            <select value={holeGrade} onChange={(e) => setHoleGrade(parseInt(e.target.value))} className="input" style={{ marginLeft: theme.spacing[2] }}>
              {[6, 7, 8, 9].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
          <label style={{ fontWeight: 600 }}>
            Shaft
            <select value={shaftLetter} onChange={(e) => setShaftLetter(e.target.value)} className="input" style={{ marginLeft: theme.spacing[2] }}>
              {SHAFT_LETTERS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={shaftGrade} onChange={(e) => setShaftGrade(parseInt(e.target.value))} className="input" style={{ marginLeft: theme.spacing[1] }}>
              {[5, 6, 7, 8, 9].filter((g) => shaftLetter !== 'k' || g <= 7).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>
        </div>
        {fit.loading && !fit.data && <Loading />}
        {fit.error && <div className="error-message">{fit.error}</div>}
        {fd && (
          <div style={{ display: 'grid', gap: theme.spacing[2], opacity: fit.loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
            <ResultRow label={`Hole ${fd.designation.split('/')[0]}`} value={`${fd.hole_min.toFixed(3)} – ${fd.hole_max.toFixed(3)} mm`} />
            <ResultRow label={`Shaft ${fd.designation.split('/')[1]}`} value={`${fd.shaft_min.toFixed(3)} – ${fd.shaft_max.toFixed(3)} mm`} />
            <ResultRow label="Min clearance" value={`${(fd.min_clearance * 1000).toFixed(0)} µm`} />
            <ResultRow label="Max clearance" value={`${(fd.max_clearance * 1000).toFixed(0)} µm`} />
            <Banner color={fitColor}>{fd.designation}: {fd.fit_type} fit</Banner>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <CardTitle>Tolerance Stack-Up</CardTitle>
        {dims.map((d, i) => (
          <div key={d.name} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing[2] }}>
              <span style={{ fontWeight: 600 }}>{d.direction > 0 ? '＋' : '－'} {d.name}</span>
              <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>
                <input
                  type="number"
                  value={d.nominal}
                  step="0.5"
                  min="0.1"
                  onChange={(e) => setDim(i, { nominal: parseFloat(e.target.value) || 0.1 })}
                  className="input"
                  style={{ width: '80px' }}
                />{' '}mm
              </span>
            </div>
            <SliderRow label="± tolerance" value={d.tolerance} display={`±${d.tolerance.toFixed(2)} mm`} min={0} max={0.3} step={0.01} onChange={(v) => setDim(i, { tolerance: v })} />
          </div>
        ))}
        <SliderRow label="Required minimum gap" value={minGap} display={`${minGap.toFixed(2)} mm`} min={0} max={0.5} step={0.01} onChange={setMinGap} />
      </div>

      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Stack-Up Results</CardTitle>
        {stack.loading && !stack.data && <Loading />}
        {stack.error && <div className="error-message">{stack.error}</div>}
        {sd && (
          <div style={{ display: 'grid', gap: theme.spacing[2], opacity: stack.loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
            <ResultRow label="Nominal gap" value={`${sd.nominal_gap.toFixed(3)} mm`} />
            <ResultRow label="Worst case" value={`${sd.worst_case_min.toFixed(3)} – ${sd.worst_case_max.toFixed(3)} mm`} color={sd.worst_case_ok ? theme.colors.success : theme.colors.error} />
            <ResultRow label="RSS (statistical)" value={`${sd.rss_min.toFixed(3)} – ${sd.rss_max.toFixed(3)} mm`} color={sd.rss_ok ? theme.colors.success : theme.colors.error} />
            <ResultRow label="P(gap < required), ±3σ model" value={`${(sd.probability_below_min * 100).toFixed(3)} %`} />
            <Banner color={sd.worst_case_ok ? theme.colors.success : sd.rss_ok ? theme.colors.warning : theme.colors.error}>
              {sd.worst_case_ok ? 'Passes even in the worst case' : sd.rss_ok ? 'Passes statistically (RSS), fails worst case' : 'Fails both worst-case and RSS'}
            </Banner>
          </div>
        )}
      </div>

      <div className="card">
        <CardTitle>Key Equations</CardTitle>
        <EquationBox
          lines={['Gap = Σ (±) nominal_i', 'Worst case: T = Σ t_i', 'RSS: T = √(Σ t_i²)', 'IT7 ≈ 16 i,  i = 0.45 ∛D + 0.001 D (µm)', 'Max clr = ES − ei,  Min clr = EI − es']}
        />
      </div>
    </>
  )

  const right = (
    <>
      <div className="card" style={{ marginBottom: theme.spacing[4] }}>
        <CardTitle>Tolerance Zones (µm from basic size)</CardTitle>
        <svg width="100%" height="250" viewBox="0 0 300 250" style={svgFrame}>
          <line x1="20" y1={zeroY} x2="280" y2={zeroY} stroke={theme.colors.text.primary} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="22" y={zeroY - 4} fontSize="9" fill={theme.colors.text.light}>basic size (0)</text>
          {fd && (
            <>
              <rect x="60" y={uy(fd.hole_tolerance_um)} width="70" height={Math.max(uy(0) - uy(fd.hole_tolerance_um), 2)} fill={theme.colors.lightBlue[400]} stroke={theme.colors.lightBlue[700]} />
              <text x="95" y="24" fontSize="11" textAnchor="middle" fontWeight={600} fill={theme.colors.text.secondary}>Hole</text>
              <text x="95" y={uy(fd.hole_tolerance_um) - 4} fontSize="9" textAnchor="middle" fill={theme.colors.text.secondary}>+{fd.hole_tolerance_um}</text>
              <rect x="170" y={uy(fd.shaft_es_um)} width="70" height={Math.max(uy(fd.shaft_ei_um) - uy(fd.shaft_es_um), 2)} fill={theme.colors.warning} fillOpacity="0.7" stroke={theme.colors.text.primary} />
              <text x="205" y="24" fontSize="11" textAnchor="middle" fontWeight={600} fill={theme.colors.text.secondary}>Shaft</text>
              <text x="205" y={uy(fd.shaft_es_um) - 4} fontSize="9" textAnchor="middle" fill={theme.colors.text.secondary}>{fd.shaft_es_um > 0 ? '+' : ''}{fd.shaft_es_um}</text>
              <text x="205" y={uy(fd.shaft_ei_um) + 11} fontSize="9" textAnchor="middle" fill={theme.colors.text.secondary}>{fd.shaft_ei_um > 0 ? '+' : ''}{fd.shaft_ei_um}</text>
            </>
          )}
        </svg>
      </div>

      <div className="card">
        <CardTitle>Gap Distribution: Worst Case vs RSS</CardTitle>
        <svg width="100%" height="190" viewBox="0 0 300 190" style={svgFrame}>
          {sd && (
            <>
              {/* worst-case band */}
              <rect x={gx(sd.worst_case_min)} y="40" width={Math.max(gx(sd.worst_case_max) - gx(sd.worst_case_min), 1)} height="26" fill={theme.colors.lightBlue[300]} />
              <text x="12" y="34" fontSize="10" fill={theme.colors.text.secondary}>Worst case</text>
              {/* RSS band */}
              <rect x={gx(sd.rss_min)} y="95" width={Math.max(gx(sd.rss_max) - gx(sd.rss_min), 1)} height="26" fill={theme.colors.accent[500]} fillOpacity="0.8" />
              <text x="12" y="89" fontSize="10" fill={theme.colors.text.secondary}>RSS</text>
              {/* nominal & required */}
              <line x1={gx(sd.nominal_gap)} y1="30" x2={gx(sd.nominal_gap)} y2="135" stroke={theme.colors.text.primary} strokeWidth="1.5" />
              <text x={gx(sd.nominal_gap)} y="148" fontSize="9" textAnchor="middle" fill={theme.colors.text.secondary}>nominal {sd.nominal_gap.toFixed(2)}</text>
              <line x1={gx(minGap)} y1="30" x2={gx(minGap)} y2="135" stroke={theme.colors.error} strokeWidth="2" strokeDasharray="4 3" />
              <text x={gx(minGap)} y="164" fontSize="9" textAnchor="middle" fill={theme.colors.error}>required min {minGap.toFixed(2)}</text>
            </>
          )}
        </svg>
        {sd && (
          <div style={{ marginTop: theme.spacing[3] }}>
            <div style={{ fontWeight: 600, marginBottom: theme.spacing[1] }}>Share of RSS variance</div>
            {sd.contributions.map((c) => (
              <div key={c.name} style={{ marginBottom: theme.spacing[1] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>{c.name}</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.mono }}>{(c.rss_share * 100).toFixed(0)}%</span>
                </div>
                <div style={{ height: '6px', background: theme.colors.gray[200], borderRadius: '3px' }}>
                  <div style={{ height: '6px', width: `${c.rss_share * 100}%`, background: theme.colors.lightBlue[500], borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )

  return <TwoColumn left={left} right={right} />
}

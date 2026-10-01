/**
 * Second Law: Carnot Limit & Entropy Generation - Interactive Topic
 *
 * Students pick a heat engine, refrigerator, or heat pump, set the reservoir
 * temperatures and the heat/work actually exchanged, and see the device's
 * performance against the Carnot limit, the entropy it generates, and the
 * work it wastes.
 */

import { useState } from 'react'
import { useThermalPost } from '../hooks/useThermalPost'
import { theme } from '../styles/theme'
import { Banner, Card, ChoiceButtons, Controls, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './thermal/ThermalShared'

type Mode = 'engine' | 'refrigerator' | 'heat_pump'

interface SecondLawData {
  q_hot: number
  q_cold: number
  work: number
  performance: number
  carnot_performance: number
  second_law_efficiency: number
  entropy_generation: number
  reversible_work: number
  lost_work: number
  feasible: boolean
  carnot_curve: { t_cold: number[]; performance: number[] }
}

const MODE_INFO: Record<Mode, { perfLabel: string; refLabel: string; workLabel: string; isEff: boolean }> = {
  engine: { perfLabel: 'Thermal efficiency η', refLabel: 'Heat input Q_H', workLabel: 'Work output W', isEff: true },
  refrigerator: { perfLabel: 'COP (refrigerator)', refLabel: 'Heat removed Q_L', workLabel: 'Work input W', isEff: false },
  heat_pump: { perfLabel: 'COP (heat pump)', refLabel: 'Heat delivered Q_H', workLabel: 'Work input W', isEff: false },
}

export default function SecondLawAnalysis() {
  const [mode, setMode] = useState<Mode>('engine')
  const [tHot, setTHot] = useState(800)
  const [tCold, setTCold] = useState(300)
  const [qRef, setQRef] = useState(1000)
  const [work, setWork] = useState(400)

  const info = MODE_INFO[mode]
  const workMax = mode === 'refrigerator' ? 2 * qRef : qRef
  const effWork = Math.min(work, workMax)
  const effTCold = Math.min(tCold, tHot - 10)

  const { data, loading, error } = useThermalPost<SecondLawData>('/api/second-law/compute', {
    mode,
    t_hot: tHot,
    t_cold: effTCold,
    q_ref: qRef,
    work: Math.max(effWork, 1),
  })

  const fmtPerf = (v: number) => (info.isEff ? `${(v * 100).toFixed(1)} %` : v.toFixed(2))

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Device">
            <ChoiceButtons
              options={[
                { value: 'engine', label: 'Heat engine' },
                { value: 'refrigerator', label: 'Refrigerator' },
                { value: 'heat_pump', label: 'Heat pump' },
              ]}
              value={mode}
              onChange={setMode}
            />
          </Card>

          <Controls>
            <SliderRow label="Hot reservoir T_H" value={tHot} unit="K" min={320} max={1500} step={5} digits={0} onChange={setTHot} />
            <SliderRow label="Cold reservoir T_L" value={effTCold} unit="K" min={200} max={600} step={5} digits={0} onChange={setTCold} />
            <SliderRow label={info.refLabel} value={qRef} unit="kJ" min={100} max={2000} step={10} digits={0} onChange={setQRef} />
            <SliderRow label={info.workLabel} value={effWork} unit="kJ" min={10} max={workMax} step={5} digits={0} onChange={setWork} />
          </Controls>

          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Heat from / to hot (Q_H)" value={`${data.q_hot.toFixed(1)} kJ`} />
                <ResultRow label="Heat from / to cold (Q_L)" value={`${data.q_cold.toFixed(1)} kJ`} />
                <ResultRow label={info.perfLabel} value={fmtPerf(data.performance)} />
                <ResultRow label="Carnot limit" value={fmtPerf(data.carnot_performance)} />
                <ResultRow label="Second-law efficiency" value={`${(data.second_law_efficiency * 100).toFixed(1)} %`} />
                <ResultRow label="Entropy generated S_gen" value={`${data.entropy_generation.toFixed(3)} kJ/K`} color={data.feasible ? undefined : theme.colors.error} />
                <ResultRow label="Reversible work" value={`${data.reversible_work.toFixed(1)} kJ`} />
                <ResultRow label="Lost work" value={`${data.lost_work.toFixed(1)} kJ`} last />
                <Banner
                  color={data.feasible ? theme.colors.success : theme.colors.error}
                  text={data.feasible ? 'Allowed: entropy generation is non-negative' : 'IMPOSSIBLE: S_gen < 0 violates the second law'}
                />
              </>
            )}
          </ResultsCard>

          <EquationsCard
            lines={[
              'η_Carnot = 1 − T_L / T_H',
              'COP_R,Carnot = T_L / (T_H − T_L)',
              'COP_HP,Carnot = T_H / (T_H − T_L)',
              'S_gen = Q_L/T_L − Q_H/T_H  (engine)',
              'S_gen = Q_H/T_H − Q_L/T_L  (R, HP)',
              'W_lost = T₀ · S_gen',
            ]}
          />
        </div>

        <div>
          <Card title="Energy Flows">
            <svg width="100%" viewBox="0 0 300 260" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }}>
              <rect x="70" y="14" width="160" height="40" rx="4" fill={theme.colors.error} fillOpacity="0.15" stroke={theme.colors.error} strokeWidth="2" />
              <text x="150" y="38" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.error}>Hot: T_H = {tHot} K</text>
              <rect x="70" y="206" width="160" height="40" rx="4" fill={theme.colors.lightBlue[200]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
              <text x="150" y="230" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>Cold: T_L = {effTCold} K</text>
              <circle cx="150" cy="130" r="38" fill="white" stroke={theme.colors.text.primary} strokeWidth="2" />
              <text x="150" y="126" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>{mode === 'engine' ? 'Engine' : mode === 'refrigerator' ? 'Fridge' : 'Heat pump'}</text>
              <text x="150" y="142" textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>{data ? `S_gen ${data.entropy_generation.toFixed(2)}` : ''}</text>
              {/* heat arrows: direction depends on mode */}
              <line x1="120" y1={mode === 'engine' ? 56 : 90} x2="120" y2={mode === 'engine' ? 90 : 56} stroke={theme.colors.error} strokeWidth="3" />
              <path d={mode === 'engine' ? 'M114 84 L120 94 L126 84 Z' : 'M114 62 L120 52 L126 62 Z'} fill={theme.colors.error} />
              <text x="108" y="76" textAnchor="end" fontSize="12" fill={theme.colors.error}>{data ? `${data.q_hot.toFixed(0)} kJ` : 'Q_H'}</text>
              <line x1="120" y1={mode === 'engine' ? 170 : 204} x2="120" y2={mode === 'engine' ? 204 : 170} stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
              <path d={mode === 'engine' ? 'M114 198 L120 208 L126 198 Z' : 'M114 176 L120 166 L126 176 Z'} fill={theme.colors.lightBlue[600]} />
              <text x="108" y="192" textAnchor="end" fontSize="12" fill={theme.colors.lightBlue[600]}>{data ? `${data.q_cold.toFixed(0)} kJ` : 'Q_L'}</text>
              {/* work arrow */}
              <line x1={mode === 'engine' ? 190 : 270} y1="130" x2={mode === 'engine' ? 270 : 190} y2="130" stroke={theme.colors.accent[600]} strokeWidth="3" />
              <path d={mode === 'engine' ? 'M262 124 L274 130 L262 136 Z' : 'M198 124 L186 130 L198 136 Z'} fill={theme.colors.accent[600]} />
              <text x="232" y="120" textAnchor="middle" fontSize="12" fill={theme.colors.accent[600]}>W = {effWork.toFixed(0)} kJ</text>
            </svg>
          </Card>

          <Card title="Actual Device vs Carnot Limit" last>
            {data && (
              <LineChart
                xLabel="Cold reservoir temperature T_L (K)"
                yLabel={info.isEff ? 'Efficiency' : 'COP'}
                series={[
                  { label: 'Carnot limit (T_H fixed)', color: theme.colors.accent[600], points: data.carnot_curve.t_cold.map((x, i) => ({ x, y: data.carnot_curve.performance[i] })) },
                ]}
                markers={[{ x: effTCold, y: data.performance, color: data.feasible ? theme.colors.success : theme.colors.error, label: 'your device' }]}
                yMin={0}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

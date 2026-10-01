/**
 * First Law of Thermodynamics: Closed-System Energy Balance - Interactive Topic
 *
 * Students set the heat added to a closed system and the work it does on
 * its surroundings, and see the resulting change in internal energy and
 * temperature via dU = Q - W (with dU = m*cv*dT for an ideal gas).
 */

import { useState } from 'react'
import { useFirstLawThermodynamicsSimulation } from '../hooks/useFirstLawThermodynamicsSimulation'
import { theme, componentStyles } from '../styles/theme'

const PLOT_LEFT = 50
const PLOT_RIGHT = 380
const PLOT_TOP = 20
const PLOT_BOTTOM = 250
const Q_MIN = -200
const Q_MAX = 200

export default function FirstLawThermodynamicsAnalysis() {
  const [mass, setMass] = useState(2) // kg
  const [specificHeatCv, setSpecificHeatCv] = useState(0.718) // kJ/(kg*K), air
  const [initialTemp, setInitialTemp] = useState(300) // K
  const [heatAdded, setHeatAdded] = useState(50) // kJ
  const [workDoneBySystem, setWorkDoneBySystem] = useState(20) // kJ

  const { data, loading, error } = useFirstLawThermodynamicsSimulation({
    mass,
    specific_heat_cv: specificHeatCv,
    initial_temp: initialTemp,
    heat_added: heatAdded,
    work_done_by_system: workDoneBySystem,
  })

  const curve = data?.curve ?? []
  const maxAbsDeltaU = curve.length > 0 ? Math.max(...curve.map((p) => Math.abs(p.delta_u)), 1) : 200

  function xToPx(q: number): number {
    const t = (q - Q_MIN) / (Q_MAX - Q_MIN)
    return PLOT_LEFT + Math.min(Math.max(t, 0), 1) * (PLOT_RIGHT - PLOT_LEFT)
  }
  function yToPx(v: number): number {
    const t = (v + maxAbsDeltaU) / (2 * maxAbsDeltaU)
    return PLOT_BOTTOM - Math.min(Math.max(t, 0), 1) * (PLOT_BOTTOM - PLOT_TOP)
  }

  const xTicks = [-200, -100, 0, 100, 200]
  const yTicks = [-maxAbsDeltaU, -maxAbsDeltaU / 2, 0, maxAbsDeltaU / 2, maxAbsDeltaU]

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        {/* Left Panel: Controls */}
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[1] }}>
              System Parameters
            </h3>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Mass m</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{mass.toFixed(1)} kg</span>
              </label>
              <input type="range" min="0.5" max="10" step="0.1" value={mass} onChange={(e) => setMass(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Specific heat c_v</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{specificHeatCv.toFixed(3)} kJ/(kg·K)</span>
              </label>
              <input type="range" min="0.1" max="5" step="0.001" value={specificHeatCv} onChange={(e) => setSpecificHeatCv(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Initial temperature</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{initialTemp.toFixed(0)} K</span>
              </label>
              <input type="range" min="200" max="600" step="1" value={initialTemp} onChange={(e) => setInitialTemp(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Heat added Q</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{heatAdded.toFixed(0)} kJ</span>
              </label>
              <input type="range" min="-200" max="200" step="1" value={heatAdded} onChange={(e) => setHeatAdded(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>

            <div>
              <label style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>Work done by system W</span>
                <span style={{ color: theme.colors.accent[600], fontWeight: 700 }}>{workDoneBySystem.toFixed(0)} kJ</span>
              </label>
              <input type="range" min="-100" max="100" step="1" value={workDoneBySystem} onChange={(e) => setWorkDoneBySystem(parseFloat(e.target.value))} className="slider" disabled={loading} />
            </div>
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Results
            </h3>
            {loading && !data && (
              <div style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing[2] }}>
                <span className="spinner"></span>
                Computing...
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
            {data && (
              <div style={{ display: 'grid', gap: theme.spacing[2], opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease-in-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Change in internal energy ΔU</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.delta_u.toFixed(2)} kJ</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Temperature change ΔT</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.delta_t.toFixed(2)} K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: theme.spacing[2], borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span>Final temperature</span>
                  <span style={{ fontWeight: 600, fontFamily: theme.typography.fontFamily.mono }}>{data.final_temp.toFixed(1)} K</span>
                </div>

                <div
                  style={{
                    padding: theme.spacing[3],
                    backgroundColor: data.delta_u >= 0 ? theme.colors.success : theme.colors.lightBlue[500],
                    borderRadius: '6px',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    marginTop: theme.spacing[2],
                  }}
                >
                  {data.delta_u >= 0
                    ? 'Net energy stored — the system warms up'
                    : 'Net energy released — the system cools down'}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              Key Equations
            </h3>
            <div style={{ ...componentStyles.infoBox, padding: theme.spacing[3] }}>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>ΔU = Q − W</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>ΔT = ΔU / (m·c_v)</p>
              <p style={{ margin: `${theme.spacing[1]} 0`, fontFamily: theme.typography.fontFamily.mono, fontSize: '13px' }}>T_final = T_initial + ΔT</p>
            </div>
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700, marginBottom: theme.spacing[3] }}>
              ΔU vs. Heat Added (at this W)
            </h3>
            <svg width="100%" height="300" viewBox="0 0 400 300" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: '#fafbfc' }}>
              {yTicks.map((v) => (
                <g key={v}>
                  <line x1={PLOT_LEFT} y1={yToPx(v)} x2={PLOT_RIGHT} y2={yToPx(v)} stroke={theme.colors.gray[200]} strokeWidth="1" />
                  <text x={PLOT_LEFT - 6} y={yToPx(v) + 3} textAnchor="end" fontSize="9" fill={theme.colors.text.light}>
                    {v.toFixed(0)}
                  </text>
                </g>
              ))}
              {xTicks.map((v) => (
                <g key={v}>
                  <line x1={xToPx(v)} y1={PLOT_TOP} x2={xToPx(v)} y2={PLOT_BOTTOM} stroke={theme.colors.gray[100]} strokeWidth="1" />
                  <text x={xToPx(v)} y={PLOT_BOTTOM + 14} textAnchor="middle" fontSize="9" fill={theme.colors.text.light}>
                    {v}
                  </text>
                </g>
              ))}

              {/* Zero line for delta_u */}
              <line x1={PLOT_LEFT} y1={yToPx(0)} x2={PLOT_RIGHT} y2={yToPx(0)} stroke={theme.colors.gray[300]} strokeWidth="1" />

              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_RIGHT} y2={PLOT_BOTTOM} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <line x1={PLOT_LEFT} y1={PLOT_BOTTOM} x2={PLOT_LEFT} y2={PLOT_TOP} stroke={theme.colors.gray[400]} strokeWidth="2" />
              <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y="290" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>
                Heat added Q (kJ)
              </text>
              <text x="14" y="150" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary} transform="rotate(-90 14 150)">
                ΔU (kJ)
              </text>

              <polyline
                points={curve.map((pt) => `${xToPx(pt.heat_added)},${yToPx(pt.delta_u)}`).join(' ')}
                fill="none"
                stroke={theme.colors.lightBlue[500]}
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              />

              {data && (
                <circle cx={xToPx(data.heat_added)} cy={yToPx(data.delta_u)} r="5" fill={theme.colors.error} stroke="white" strokeWidth="2" />
              )}
            </svg>
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: theme.colors.text.secondary, marginTop: theme.spacing[2] }}>
              At a fixed work output W, ΔU rises 1:1 with the heat added — the line's slope is exactly 1, just shifted
              down by W. The red dot marks the current operating point.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

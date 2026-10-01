/**
 * Spur Gear Tooth Bending (Lewis) - Interactive Topic
 *
 * Students adjust tooth count, diametral pitch, face width, torque and speed
 * to see the tangential tooth load, Lewis form factor and root bending
 * stress update live.
 */

import { useState } from 'react'
import { useStaticsMachineSimulation } from '../hooks/useStaticsMachineSimulation'
import { theme } from '../styles/theme'
import { Banner, CardTitle, EquationsCard, ResultRow, ResultsShell, SliderRow } from './StaticsMachineUi'

interface GearData {
  pitch_diameter: number
  tangential_load: number
  lewis_factor: number
  lewis_stress: number
  pitch_line_velocity: number
  velocity_factor: number
  dynamic_stress: number
  safety_factor: number | null
}

const PSI_TO_MPA = 0.00689476

export default function GearToothBendingAnalysis() {
  const [teeth, setTeeth] = useState(20)
  const [pitch, setPitch] = useState(8)
  const [faceWidth, setFaceWidth] = useState(1.25)
  const [torque, setTorque] = useState(850)
  const [rpm, setRpm] = useState(0)
  const [checkSafety, setCheckSafety] = useState(true)
  const [allowable, setAllowable] = useState(25000)

  const { data, loading, error } = useStaticsMachineSimulation<GearData>('/api/gear-tooth-bending/compute', {
    teeth,
    diametral_pitch: pitch,
    face_width: faceWidth,
    torque,
    speed_rpm: rpm,
    allowable_stress: checkSafety ? allowable : undefined,
  })

  const sf = data?.safety_factor ?? null
  const passes = sf !== null && sf >= 1.5
  const toothColor = sf === null || passes ? theme.colors.lightBlue[600] : theme.colors.error

  // --- Tooth schematic: a tapered cantilever. Height ~ 2.25 / Pd (full-depth
  // tooth), root thickness grows with the form factor Y. Illustrative scale.
  const y = data?.lewis_factor ?? 0.32
  const toothH = Math.min(150, Math.max(50, (2.25 / pitch) * 400))
  const rootW = 40 + y * 260
  const tipW = rootW * 0.45
  const baseY = 250
  const cx = 150
  const loadArrowLen = 20 + Math.min(70, (data?.tangential_load ?? 0) / 20)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <div className="card" style={{ marginBottom: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <SliderRow label="Number of Teeth N" valueText={`${teeth}`} min={12} max={150} step={1} value={teeth} onChange={setTeeth} />
            <SliderRow label="Diametral Pitch Pd" valueText={`${pitch} teeth/in`} min={2} max={24} step={1} value={pitch} onChange={setPitch} />
            <SliderRow label="Face Width F" valueText={`${faceWidth.toFixed(2)} in`} min={0.25} max={4} step={0.05} value={faceWidth} onChange={setFaceWidth} />
            <SliderRow label="Transmitted Torque T" valueText={`${torque} lbf·in`} min={10} max={5000} step={10} value={torque} onChange={setTorque} />
            <SliderRow label="Speed (0 = static Lewis)" valueText={`${rpm} rpm`} min={0} max={5000} step={50} value={rpm} onChange={setRpm} />
          </div>

          <div className="card" style={{ marginBottom: theme.spacing[4] }}>
            <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[2] }}>
              <input type="checkbox" checked={checkSafety} onChange={(e) => setCheckSafety(e.target.checked)} />
              Check safety factor against allowable bending stress
            </label>
            {checkSafety && (
              <input type="number" value={allowable} onChange={(e) => setAllowable(parseFloat(e.target.value) || 0)} className="input" aria-label="Allowable bending stress in psi" />
            )}
          </div>

          <ResultsShell loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                <ResultRow label="Pitch diameter (d = N/Pd)" value={`${data.pitch_diameter.toFixed(3)} in`} />
                <ResultRow label="Tangential load (Wᵗ)" value={`${data.tangential_load.toFixed(0)} lbf`} />
                <ResultRow label="Lewis form factor (Y)" value={data.lewis_factor.toFixed(3)} />
                <ResultRow label="Lewis stress (σ)" value={`${Math.round(data.lewis_stress).toLocaleString()} psi (${(data.lewis_stress * PSI_TO_MPA).toFixed(1)} MPa)`} />
                {rpm > 0 && (
                  <>
                    <ResultRow label="Pitch-line velocity" value={`${data.pitch_line_velocity.toFixed(0)} ft/min`} />
                    <ResultRow label="Velocity factor (Kv)" value={data.velocity_factor.toFixed(3)} />
                    <ResultRow label="Dynamic stress (Kv·σ)" value={`${Math.round(data.dynamic_stress).toLocaleString()} psi`} last />
                  </>
                )}
                {sf !== null && (
                  <Banner color={passes ? theme.colors.success : theme.colors.error}>
                    Safety factor {sf.toFixed(2)} — {passes ? 'PASSES' : 'FAILS'} (need ≥ 1.5)
                  </Banner>
                )}
              </>
            )}
          </ResultsShell>

          <EquationsCard lines={['d = N / Pd', 'Wᵗ = 2T / d', 'σ = Wᵗ Pd / (F Y)', 'Kv = (1200 + V) / 1200']} />
        </div>

        <div>
          <div className="card">
            <CardTitle>Tooth as a Cantilever</CardTitle>
            <svg width="100%" height="320" viewBox="0 0 300 320" style={{ border: `1px solid ${theme.colors.border}`, borderRadius: '6px', backgroundColor: theme.colors.bg.secondary }} role="img" aria-label="Gear tooth modeled as a cantilever with a tooth-tip load">
              {/* Gear rim (fixed support) */}
              <rect x={cx - 130} y={baseY} width={260} height={30} fill={theme.colors.gray[300]} />
              {/* Tooth */}
              <polygon
                points={`${cx - rootW / 2},${baseY} ${cx + rootW / 2},${baseY} ${cx + tipW / 2},${baseY - toothH} ${cx - tipW / 2},${baseY - toothH}`}
                fill={toothColor}
                fillOpacity="0.8"
                stroke={theme.colors.text.primary}
                strokeWidth="2"
              />
              {/* Critical root section */}
              <line x1={cx - rootW / 2} y1={baseY} x2={cx + rootW / 2} y2={baseY} stroke={theme.colors.error} strokeWidth="4" />
              <text x={cx + rootW / 2 + 8} y={baseY - 4} fontSize="11" fill={theme.colors.error}>root: σ_max</text>
              {/* Tangential load at the tip */}
              <line x1={cx - tipW / 2 - loadArrowLen} y1={baseY - toothH + 8} x2={cx - tipW / 2 - 3} y2={baseY - toothH + 8} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#gearToothArrow)" />
              <text x={cx - tipW / 2 - loadArrowLen} y={baseY - toothH - 2} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>Wᵗ</text>
              {/* Width dimension */}
              <line x1={cx - rootW / 2} y1={baseY + 20} x2={cx + rootW / 2} y2={baseY + 20} stroke={theme.colors.text.secondary} strokeWidth="1" />
              <text x={cx} y={baseY + 16} fontSize="10" textAnchor="middle" fill={theme.colors.text.secondary}>root width ∝ Y</text>
              <defs>
                <marker id="gearToothArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
                </marker>
              </defs>
            </svg>
            <p style={{ color: theme.colors.text.secondary, fontSize: '13px', marginTop: theme.spacing[2] }}>
              Schematic only: tooth height scales with 1/Pd and root width with the Lewis factor Y.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

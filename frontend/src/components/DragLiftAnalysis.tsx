/**
 * Drag and Lift on Bodies - Interactive Topic
 *
 * Students compare bluff-body drag (cylinder, sphere, disk) across the
 * Reynolds-number drag crisis, and a finite wing's lift and drag polar as
 * angle of attack, aspect ratio and camber change.
 */

import { useState } from 'react'
import { useFluidsSimulation } from '../hooks/useFluidsSimulation'
import { theme } from '../styles/theme'
import { Banner, Card, EquationsCard, LineChart, ResultRow, ResultsCard, SliderRow } from './fluids/FluidsUI'

const AIR = { rho: 1.2, mu: 1.8e-5 }
const SHAPES = { cylinder: 'Cylinder', sphere: 'Sphere', disk: 'Disk' }

interface DLData {
  kind: string
  shape_label: string
  reynolds: number | null
  flow_state: string
  drag_coefficient: number
  lift_coefficient: number
  induced_drag_coefficient: number | null
  lift_curve_slope_per_deg: number | null
  reference_area: number
  dynamic_pressure: number
  drag_force: number
  lift_force: number
  lift_to_drag: number | null
  stalled: boolean
  curve: { x: number[]; cd: number[]; cl?: number[] }
}

export default function DragLiftAnalysis() {
  const [kind, setKind] = useState<'bluff' | 'wing'>('bluff')
  const [velocity, setVelocity] = useState(10)

  const [shape, setShape] = useState<keyof typeof SHAPES>('cylinder')
  const [diameterCm, setDiameterCm] = useState(10)

  const [alpha, setAlpha] = useState(5)
  const [aspectRatio, setAspectRatio] = useState(8)
  const [wingArea, setWingArea] = useState(10)
  const [cambered, setCambered] = useState(true)

  const params =
    kind === 'bluff'
      ? { kind, velocity, density: AIR.rho, viscosity: AIR.mu, shape, diameter: diameterCm / 100, length: 1 }
      : {
          kind,
          velocity,
          density: 1.225,
          angle_of_attack: alpha,
          aspect_ratio: aspectRatio,
          wing_area: wingArea,
          zero_lift_angle: cambered ? -2 : 0,
          oswald_efficiency: 0.9,
          profile_drag: 0.01,
          stall_angle: 15,
        }
  const { data, loading, error } = useFluidsSimulation<DLData>('/api/drag-lift/compute', params)

  const stateColor = !data ? theme.colors.gray[500] : data.stalled ? theme.colors.error : theme.colors.success

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="grid-container">
        <div>
          <Card title="Body">
            <div style={{ display: 'flex', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              <button onClick={() => { setKind('bluff'); setVelocity(10) }} className={kind === 'bluff' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>Bluff body</button>
              <button onClick={() => { setKind('wing'); setVelocity(50) }} className={kind === 'wing' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>Wing</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              {kind === 'bluff' ? (
                <>
                  <div style={{ display: 'flex', gap: theme.spacing[2] }}>
                    {(Object.keys(SHAPES) as Array<keyof typeof SHAPES>).map((k) => (
                      <button key={k} onClick={() => setShape(k)} className={shape === k ? 'btn btn-primary' : 'btn btn-secondary'} style={{ flex: 1 }}>{SHAPES[k]}</button>
                    ))}
                  </div>
                  <SliderRow label="Diameter D" value={diameterCm} display={`${diameterCm.toFixed(0)} cm`} min={1} max={100} step={1} onChange={setDiameterCm} disabled={loading} />
                  <SliderRow label="Air Speed V" value={velocity} display={`${velocity.toFixed(0)} m/s`} min={1} max={100} step={1} onChange={setVelocity} disabled={loading} />
                </>
              ) : (
                <>
                  <SliderRow label="Angle of Attack α" value={alpha} display={`${alpha.toFixed(1)}°`} min={-6} max={20} step={0.5} onChange={setAlpha} disabled={loading} />
                  <SliderRow label="Aspect Ratio AR" value={aspectRatio} display={aspectRatio.toFixed(1)} min={2} max={20} step={0.5} onChange={setAspectRatio} disabled={loading} />
                  <SliderRow label="Wing Area S" value={wingArea} display={`${wingArea.toFixed(0)} m²`} min={1} max={30} step={1} onChange={setWingArea} disabled={loading} />
                  <SliderRow label="Air Speed V" value={velocity} display={`${velocity.toFixed(0)} m/s`} min={10} max={100} step={1} onChange={setVelocity} disabled={loading} />
                  <label style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                    <input type="checkbox" checked={cambered} onChange={(e) => setCambered(e.target.checked)} />
                    Cambered section (α_L0 = −2°)
                  </label>
                </>
              )}
            </div>
          </Card>

          <ResultsCard loading={loading} error={error} hasData={!!data}>
            {data && (
              <>
                {data.reynolds !== null && <ResultRow label="Reynolds number" value={data.reynolds.toExponential(2)} />}
                <ResultRow label="Dynamic pressure q" value={`${data.dynamic_pressure.toFixed(1)} Pa`} />
                <ResultRow label="Drag coefficient C_D" value={data.drag_coefficient.toFixed(3)} />
                {data.kind === 'wing' && (
                  <>
                    <ResultRow label="Lift coefficient C_L" value={data.lift_coefficient.toFixed(3)} />
                    <ResultRow label="Induced drag C_Di" value={data.induced_drag_coefficient!.toFixed(4)} />
                    <ResultRow label="Lift-curve slope" value={`${data.lift_curve_slope_per_deg!.toFixed(4)} /deg`} />
                    <ResultRow label="Lift" value={`${data.lift_force.toFixed(0)} N`} />
                    <ResultRow label="L / D" value={data.lift_to_drag === null ? '—' : data.lift_to_drag.toFixed(1)} />
                  </>
                )}
                <ResultRow label="Drag force" value={`${data.drag_force.toFixed(2)} N`} />
                <Banner color={stateColor}>{data.flow_state}</Banner>
              </>
            )}
          </ResultsCard>

          <EquationsCard
            lines={[
              'D = ½ ρ V² A C_D',
              'L = ½ ρ V² S C_L',
              'a = a₀ / (1 + a₀/(π e AR)),  a₀ = 2π',
              'C_L = a (α − α_L0)',
              'C_D = C_D0 + C_L² / (π e AR)',
            ]}
          />
        </div>

        <div>
          <Card title={kind === 'bluff' ? 'Drag Coefficient vs Reynolds Number' : 'Lift and Drag Polar'} last>
            {data && kind === 'bluff' && (
              <LineChart
                xs={data.curve.x}
                logX
                yMin={0}
                series={[{ label: `C_D, ${data.shape_label}`, color: theme.colors.lightBlue[600], ys: data.curve.cd }]}
                xLabel="Reynolds number"
                yLabel="C_D"
                marker={data.reynolds ? { x: data.reynolds, y: data.drag_coefficient, label: `C_D = ${data.drag_coefficient.toFixed(2)}` } : undefined}
              />
            )}
            {data && kind === 'wing' && data.curve.cl && (
              <LineChart
                xs={data.curve.x}
                yMin={-0.5}
                series={[
                  { label: 'C_L', color: theme.colors.lightBlue[600], ys: data.curve.cl },
                  { label: 'C_D × 10', color: theme.colors.accent[600], ys: data.curve.cd.map((c) => c * 10), dashed: true },
                ]}
                xLabel="Angle of attack α (deg)"
                yLabel="Coefficient"
                marker={{ x: alpha, y: data.lift_coefficient, label: `C_L = ${data.lift_coefficient.toFixed(2)}` }}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

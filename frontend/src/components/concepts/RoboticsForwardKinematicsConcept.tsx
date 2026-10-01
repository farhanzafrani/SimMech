import { theme } from '../../styles/theme'

export default function RoboticsForwardKinematicsConcept() {
  // Base at (140, 200); link 1 at 55 deg, link 2 relative +40 deg
  const bx = 140
  const by = 200
  const l1 = 110
  const l2 = 80
  const t1 = (55 * Math.PI) / 180
  const t12 = (95 * Math.PI) / 180
  const ex = bx + l1 * Math.cos(t1)
  const ey = by - l1 * Math.sin(t1)
  const tx = ex + l2 * Math.cos(t12)
  const ty = ey - l2 * Math.sin(t12)
  const rMax = l1 + l2
  const rMin = l1 - l2

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Planar two-link arm with joint angles theta one and theta two, and the annular reachable workspace, diagram">
      {/* Workspace annulus outline (upper half shown) */}
      <path d={`M ${bx - rMax} ${by} A ${rMax} ${rMax} 0 0 1 ${bx + rMax} ${by}`} fill="none" stroke={theme.colors.lightBlue[500]} strokeWidth="1.5" strokeDasharray="5 4" />
      <path d={`M ${bx - rMin} ${by} A ${rMin} ${rMin} 0 0 1 ${bx + rMin} ${by}`} fill="none" stroke={theme.colors.lightBlue[500]} strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={bx + rMax - 4} y={by - 6} fontSize="11" fill={theme.colors.lightBlue[600]} textAnchor="end">L₁+L₂</text>
      <text x={bx + rMin + 4} y={by - 6} fontSize="11" fill={theme.colors.lightBlue[600]}>|L₁−L₂|</text>

      {/* Axes */}
      <line x1={bx - 30} y1={by} x2={bx + rMax + 20} y2={by} stroke={theme.colors.gray[400]} strokeWidth="1" />
      <line x1={bx} y1={by + 10} x2={bx} y2={by - rMax - 10} stroke={theme.colors.gray[400]} strokeWidth="1" />

      {/* Links */}
      <polyline points={`${bx},${by} ${ex},${ey} ${tx},${ty}`} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Link 1 extension line for the relative angle theta2 */}
      <line x1={ex} y1={ey} x2={ex + 40 * Math.cos(t1)} y2={ey - 40 * Math.sin(t1)} stroke={theme.colors.gray[500]} strokeWidth="1.5" strokeDasharray="3 3" />
      <path d={`M ${bx + 40} ${by} A 40 40 0 0 0 ${bx + 40 * Math.cos(t1)} ${by - 40 * Math.sin(t1)}`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
      <text x={bx + 48} y={by - 14} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>θ₁</text>
      <path d={`M ${ex + 30 * Math.cos(t1)} ${ey - 30 * Math.sin(t1)} A 30 30 0 0 0 ${ex + 30 * Math.cos(t12)} ${ey - 30 * Math.sin(t12)}`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
      <text x={ex + 6} y={ey - 34} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>θ₂</text>

      <circle cx={bx} cy={by} r="7" fill={theme.colors.text.primary} />
      <circle cx={ex} cy={ey} r="6" fill="white" stroke={theme.colors.text.primary} strokeWidth="2.5" />
      <circle cx={tx} cy={ty} r="6" fill={theme.colors.accent[600]} />
      <text x={tx + 10} y={ty + 4} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>(x, y)</text>

      {/* Equations */}
      <g transform="translate(400, 60)" fontFamily={theme.typography.fontFamily.mono} fontSize="14" fill={theme.colors.text.primary}>
        <text x="0" y="0" fontFamily={theme.typography.fontFamily.heading} fontWeight={700} fontSize="14">Forward kinematics</text>
        <text x="0" y="30">x = L₁cosθ₁ + L₂cos(θ₁+θ₂)</text>
        <text x="0" y="54">y = L₁sinθ₁ + L₂sin(θ₁+θ₂)</text>
        <text x="0" y="90" fontFamily={theme.typography.fontFamily.base} fontSize="12" fill={theme.colors.text.light}>Joint angles in, tip position out.</text>
        <text x="0" y="108" fontFamily={theme.typography.fontFamily.base} fontSize="12" fill={theme.colors.text.light}>Always one answer, never fails.</text>
      </g>
    </svg>
  )
}

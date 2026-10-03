import { theme } from '../../styles/theme'

export default function RoboticsInverseKinematicsConcept() {
  const bx = 120
  const by = 190
  const l1 = 110
  const l2 = 80
  // Target and its two elbow positions from the law of cosines
  const tx = bx + 130
  const ty = by - 100
  const d = Math.hypot(tx - bx, ty - by)
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d)
  const h = Math.sqrt(l1 * l1 - a * a)
  const ux = (tx - bx) / d
  const uy = (ty - by) / d
  const mx = bx + a * ux
  const my = by + a * uy
  const e1 = [mx - h * uy, my + h * ux]
  const e2 = [mx + h * uy, my - h * ux]

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Two elbow configurations reaching the same target point, elbow up and elbow down, diagram">
      <circle cx={bx} cy={by} r={l1 + l2} fill="none" stroke={theme.colors.lightBlue[500]} strokeWidth="1" strokeDasharray="5 4" />
      <polyline points={`${bx},${by} ${e1[0]},${e1[1]} ${tx},${ty}`} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`${bx},${by} ${e2[0]},${e2[1]} ${tx},${ty}`} fill="none" stroke={theme.colors.gray[400]} strokeWidth="5" strokeDasharray="7 5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1={bx} y1={by} x2={tx} y2={ty} stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="2 3" />
      <text x={(bx + tx) / 2 + 6} y={(by + ty) / 2 + 16} fontSize="12" fill={theme.colors.accent[600]}>r = √(x²+y²)</text>

      <circle cx={bx} cy={by} r="7" fill={theme.colors.text.primary} />
      <circle cx={e1[0]} cy={e1[1]} r="6" fill="white" stroke={theme.colors.text.primary} strokeWidth="2.5" />
      <circle cx={e2[0]} cy={e2[1]} r="5" fill="white" stroke={theme.colors.gray[500]} strokeWidth="2" />
      <g stroke={theme.colors.accent[600]} strokeWidth="2.5">
        <line x1={tx - 7} y1={ty} x2={tx + 7} y2={ty} />
        <line x1={tx} y1={ty - 7} x2={tx} y2={ty + 7} />
      </g>
      <text x={e1[0] - 8} y={e1[1] - 10} fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]} textAnchor="end">elbow up</text>
      <text x={e2[0] + 10} y={e2[1] + 16} fontSize="12" fill={theme.colors.gray[500]}>elbow down</text>

      <g transform="translate(400, 56)" fontFamily={theme.typography.fontFamily.mono} fontSize="13" fill={theme.colors.text.primary}>
        <text x="0" y="0" fontFamily={theme.typography.fontFamily.heading} fontWeight={700} fontSize="14">Inverse kinematics</text>
        <text x="0" y="28">cosθ₂ = (r²−L₁²−L₂²)/(2L₁L₂)</text>
        <text x="0" y="50">θ₂ = ±acos(cosθ₂)</text>
        <text x="0" y="72">θ₁ = atan2(y,x) − atan2(L₂sinθ₂,</text>
        <text x="0" y="90">          L₁+L₂cosθ₂)</text>
        <text x="0" y="122" fontFamily={theme.typography.fontFamily.base} fontSize="12" fill={theme.colors.text.light}>|cosθ₂| &gt; 1: target unreachable.</text>
        <text x="0" y="140" fontFamily={theme.typography.fontFamily.base} fontSize="12" fill={theme.colors.text.light}>|cosθ₂| = 1: singular, branches merge.</text>
      </g>
    </svg>
  )
}

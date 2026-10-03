import { theme } from '../../styles/theme'

export default function RoboticsTransformsConcept() {
  // Planar view of {A} (grey) and a rotated, translated {B}
  const ox = 90
  const oy = 190
  const len = 70
  const bx = 250
  const by = 110
  const a = (35 * Math.PI) / 180
  const bxAx = [bx + len * Math.cos(a), by - len * Math.sin(a)]
  const byAx = [bx - len * Math.sin(a), by - len * Math.cos(a)]

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Frame B rotated and translated relative to frame A, with the homogeneous transform, diagram">
      <defs>
        <marker id="roboTfConceptG" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={theme.colors.gray[500]} /></marker>
        <marker id="roboTfConceptR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={theme.colors.error} /></marker>
        <marker id="roboTfConceptS" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={theme.colors.success} /></marker>
        <marker id="roboTfConceptA" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={theme.colors.accent[600]} /></marker>
      </defs>

      <line x1={ox} y1={oy} x2={ox + len} y2={oy} stroke={theme.colors.gray[500]} strokeWidth="3" markerEnd="url(#roboTfConceptG)" />
      <line x1={ox} y1={oy} x2={ox} y2={oy - len} stroke={theme.colors.gray[500]} strokeWidth="3" markerEnd="url(#roboTfConceptG)" />
      <text x={ox + len + 6} y={oy + 4} fontSize="12" fill={theme.colors.gray[500]}>x_A</text>
      <text x={ox - 6} y={oy - len - 8} fontSize="12" fill={theme.colors.gray[500]} textAnchor="middle">y_A</text>
      <text x={ox - 12} y={oy + 16} fontSize="13" fontWeight={700} fill={theme.colors.gray[500]}>{'{A}'}</text>

      <line x1={ox} y1={oy} x2={bx} y2={by} stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#roboTfConceptA)" />
      <text x={(ox + bx) / 2 - 6} y={(oy + by) / 2 + 16} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>p</text>

      <line x1={bx} y1={by} x2={bxAx[0]} y2={bxAx[1]} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#roboTfConceptR)" />
      <line x1={bx} y1={by} x2={byAx[0]} y2={byAx[1]} stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#roboTfConceptS)" />
      <text x={bxAx[0] + 6} y={bxAx[1] + 4} fontSize="12" fill={theme.colors.error}>x_B</text>
      <text x={byAx[0] - 4} y={byAx[1] - 6} fontSize="12" fill={theme.colors.success} textAnchor="end">y_B</text>
      <text x={bx + 8} y={by + 18} fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>{'{B}'}</text>
      <path d={`M ${bx + 36} ${by} A 36 36 0 0 0 ${bx + 36 * Math.cos(a)} ${by - 36 * Math.sin(a)}`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
      <text x={bx + 42} y={by - 8} fontSize="12" fill={theme.colors.accent[600]}>θ</text>

      <g transform="translate(400, 56)" fontFamily={theme.typography.fontFamily.mono} fontSize="13" fill={theme.colors.text.primary}>
        <text x="0" y="0" fontFamily={theme.typography.fontFamily.heading} fontWeight={700} fontSize="14">Homogeneous transform</text>
        <text x="0" y="30">T = [ R  p ]   R ∈ SO(3)</text>
        <text x="0" y="48">    [ 0  1 ]</text>
        <text x="0" y="78">[ᴬp; 1] = T [ᴮp; 1]</text>
        <text x="0" y="100">T⁻¹ = [ Rᵀ  −Rᵀp ; 0  1 ]</text>
        <text x="0" y="128" fontFamily={theme.typography.fontFamily.base} fontSize="12" fill={theme.colors.text.light}>Columns of R are the axes of {'{B}'}</text>
        <text x="0" y="144" fontFamily={theme.typography.fontFamily.base} fontSize="12" fill={theme.colors.text.light}>written in {'{A}'}.</text>
      </g>
    </svg>
  )
}

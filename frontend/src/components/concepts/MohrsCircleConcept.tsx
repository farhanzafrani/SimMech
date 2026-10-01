import { theme } from '../../styles/theme'

export default function MohrsCircleConcept() {
  // Stress element: a small square cut from a loaded part, with normal
  // stresses on the x/y faces and a shear stress along each face.
  const cx = 200
  const cy = 120
  const half = 55

  const left = cx - half
  const right = cx + half
  const top = cy - half
  const bottom = cy + half

  return (
    <svg width="100%" height="240" viewBox="0 0 400 240" role="img" aria-label="2D stress element with normal and shear stresses">
      <defs>
        <marker id="mohrArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={theme.colors.text.primary} />
        </marker>
        <marker id="mohrArrowBlue" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={theme.colors.lightBlue[600]} />
        </marker>
      </defs>

      {/* Stress element */}
      <rect x={left} y={top} width={half * 2} height={half * 2} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />

      {/* Sigma_x: normal stress arrows on left/right faces */}
      <line x1={right} y1={cy} x2={right + 40} y2={cy} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#mohrArrow)" />
      <line x1={left} y1={cy} x2={left - 40} y2={cy} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#mohrArrow)" />
      <text x={right + 46} y={cy + 5} fontSize="16" fontWeight={700} fill={theme.colors.text.primary}>σx</text>

      {/* Sigma_y: normal stress arrows on top/bottom faces */}
      <line x1={cx} y1={top} x2={cx} y2={top - 40} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#mohrArrow)" />
      <line x1={cx} y1={bottom} x2={cx} y2={bottom + 40} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#mohrArrow)" />
      <text x={cx + 8} y={top - 46} fontSize="16" fontWeight={700} fill={theme.colors.text.primary}>σy</text>

      {/* Tau_xy: shear arrows tangent to each face, forming a couple */}
      <line x1={right} y1={cy + 18} x2={right} y2={cy - 22} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#mohrArrowBlue)" />
      <line x1={left} y1={cy - 18} x2={left} y2={cy + 22} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#mohrArrowBlue)" />
      <line x1={cx - 18} y1={top} x2={cx + 22} y2={top} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#mohrArrowBlue)" />
      <line x1={cx + 18} y1={bottom} x2={cx - 22} y2={bottom} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#mohrArrowBlue)" />
      <text x={right + 10} y={cy - 26} fontSize="14" fontWeight={700} fill={theme.colors.lightBlue[600]}>τxy</text>

      <text x={cx} y={bottom + 60} textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        A small stress element, cut from a loaded part
      </text>
    </svg>
  )
}

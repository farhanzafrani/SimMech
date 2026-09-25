import { theme } from '../../styles/theme'

export default function FailureTheoriesConcept() {
  // Left: a small stress element under combined normal + shear stress —
  // the same kind of multi-axis state Mohr's circle reduces to two
  // principal stresses, σ1 and σ2.
  const cx = 150
  const cy = 120
  const half = 46

  const left = cx - half
  const right = cx + half
  const top = cy - half
  const bottom = cy + half

  // Right: the classic failure-envelope picture in normalized
  // (σ1/σy, σ2/σy) space — the von Mises ellipse circumscribing the
  // Tresca hexagon, touching it at six points.
  const ex = 470
  const ey = 120
  const r = 62

  const ellipsePoints = Array.from({ length: 48 }, (_, i) => {
    const theta = (i / 48) * 2 * Math.PI
    const radius = r / Math.sqrt(1 - 0.5 * Math.sin(2 * theta))
    return `${ex + radius * Math.cos(theta)},${ey - radius * Math.sin(theta)}`
  }).join(' ')

  const hexVerts: [number, number][] = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
  ]
  const hexagonPoints = hexVerts.map(([x, y]) => `${ex + x * r},${ey - y * r}`).join(' ')

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="A stress element under combined loading next to the von Mises ellipse and Tresca hexagon failure envelope">
      <defs>
        <marker id="failureConceptArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={theme.colors.text.primary} />
        </marker>
        <marker id="failureConceptArrowBlue" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={theme.colors.lightBlue[600]} />
        </marker>
      </defs>

      {/* --- Left: stress element with combined normal + shear stress --- */}
      <rect x={left} y={top} width={half * 2} height={half * 2} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />

      {/* Normal stresses */}
      <line x1={right} y1={cy} x2={right + 34} y2={cy} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#failureConceptArrow)" />
      <line x1={left} y1={cy} x2={left - 34} y2={cy} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#failureConceptArrow)" />
      <text x={right + 40} y={cy + 5} fontSize="15" fontWeight={700} fill={theme.colors.text.primary}>σx</text>
      <line x1={cx} y1={top} x2={cx} y2={top - 34} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#failureConceptArrow)" />
      <line x1={cx} y1={bottom} x2={cx} y2={bottom + 34} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#failureConceptArrow)" />
      <text x={cx + 8} y={top - 40} fontSize="15" fontWeight={700} fill={theme.colors.text.primary}>σy</text>

      {/* Shear couple */}
      <line x1={right} y1={cy + 16} x2={right} y2={cy - 18} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#failureConceptArrowBlue)" />
      <line x1={left} y1={cy - 16} x2={left} y2={cy + 18} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#failureConceptArrowBlue)" />
      <line x1={cx - 16} y1={top} x2={cx + 18} y2={top} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#failureConceptArrowBlue)" />
      <line x1={cx + 16} y1={bottom} x2={cx - 18} y2={bottom} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#failureConceptArrowBlue)" />
      <text x={right + 6} y={cy - 24} fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>τxy</text>

      <text x={cx} y={bottom + 62} textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>Combined stress state</text>
      <text x={cx} y={bottom + 78} textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>→ σ1, σ2 → one number?</text>

      {/* Arrow connecting the two halves */}
      <line x1={220} y1={cy} x2={300} y2={cy} stroke={theme.colors.text.light} strokeWidth="2" markerEnd="url(#failureConceptArrow)" strokeDasharray="5 4" />

      {/* --- Right: von Mises ellipse circumscribing the Tresca hexagon --- */}
      <polygon points={ellipsePoints} fill={theme.colors.lightBlue[100]} fillOpacity={0.5} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      <polygon points={hexagonPoints} fill="none" stroke={theme.colors.accent[600]} strokeWidth="2" strokeDasharray="5 3" />
      <circle cx={ex} cy={ey} r="2" fill={theme.colors.text.primary} />
      <line x1={ex - r - 20} y1={ey} x2={ex + r + 20} y2={ey} stroke={theme.colors.text.light} strokeWidth="1" />
      <line x1={ex} y1={ey - r - 20} x2={ex} y2={ey + r + 20} stroke={theme.colors.text.light} strokeWidth="1" />
      <text x={ex + r + 4} y={ey - 6} fontSize="11" fill={theme.colors.text.secondary}>σ1/σy</text>
      <text x={ex + 6} y={ey - r - 24} fontSize="11" fill={theme.colors.text.secondary}>σ2/σy</text>

      <text x={ex - r - 10} y={ey - r + 30} fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>Von Mises</text>
      <text x={ex - r - 10} y={ey - r + 46} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>Tresca</text>

      <text x={ex} y="228" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>
        Two rules for the same yield point — the hexagon always sits inside the ellipse
      </text>
    </svg>
  )
}

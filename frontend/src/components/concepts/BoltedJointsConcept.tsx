import { theme } from '../../styles/theme'

/** Generate points for a vertical zigzag ("spring") line, centered on cx. */
function verticalSpringPoints(cx: number, yStart: number, yEnd: number, amplitude: number, coils: number): string {
  const points: string[] = [`${cx},${yStart}`]
  const steps = coils * 2
  for (let i = 1; i < steps; i++) {
    const y = yStart + ((yEnd - yStart) * i) / steps
    const x = i % 2 === 1 ? cx + amplitude : cx - amplitude
    points.push(`${x},${y}`)
  }
  points.push(`${cx},${yEnd}`)
  return points.join(' ')
}

/** Generate points for a horizontal zigzag ("spring") line, centered on cy. */
function horizontalSpringPoints(cy: number, xStart: number, xEnd: number, amplitude: number, coils: number): string {
  const points: string[] = [`${xStart},${cy}`]
  const steps = coils * 2
  for (let i = 1; i < steps; i++) {
    const x = xStart + ((xEnd - xStart) * i) / steps
    const y = i % 2 === 1 ? cy + amplitude : cy - amplitude
    points.push(`${x},${y}`)
  }
  points.push(`${xEnd},${cy}`)
  return points.join(' ')
}

export default function BoltedJointsConcept() {
  const boltX = 240
  const plateLeft = 150
  const plateRight = 330
  const plateTop = 75
  const plateBottom = 150
  const plateMid = (plateTop + plateBottom) / 2

  const headTopY = 35
  const headBottomY = 75
  const shankTopY = 75
  const nutTopY = 175
  const nutBottomY = 205

  const holeHalfWidth = 12

  return (
    <svg width="100%" height="260" viewBox="0 0 640 260" role="img" aria-label="Bolted joint diagram: a bolt shown stretched like a tension spring passing through two clamped plates shown compressed like a spring, alongside the equivalent two-spring stiffness model">
      {/* ---- Left: physical cutaway ---- */}

      {/* Preload arrow into bolt head */}
      <line x1={boltX} y1="8" x2={boltX} y2={headTopY - 4} stroke={theme.colors.accent[500]} strokeWidth="3" />
      <path d={`M ${boltX - 6} ${headTopY - 4} L ${boltX} ${headTopY + 6} L ${boltX + 6} ${headTopY - 4} Z`} fill={theme.colors.accent[500]} />
      <text x={boltX + 12} y="20" fontSize="15" fontWeight={700} fill={theme.colors.accent[600]}>F_i</text>

      {/* Bolt head (hex-ish trapezoid) */}
      <polygon
        points={`${boltX - 26},${headBottomY} ${boltX - 18},${headTopY} ${boltX + 18},${headTopY} ${boltX + 26},${headBottomY}`}
        fill={theme.colors.gray[400]}
        stroke={theme.colors.text.primary}
        strokeWidth="2"
      />

      {/* Top plate (member 1) with bolt hole cut out */}
      <rect x={plateLeft} y={plateTop} width={plateRight - plateLeft} height={(plateBottom - plateTop) / 2} fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      {/* Bottom plate (member 2) */}
      <rect x={plateLeft} y={plateMid} width={plateRight - plateLeft} height={(plateBottom - plateTop) / 2} fill={theme.colors.lightBlue[200]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      {/* Interface line between the two clamped members */}
      <line x1={plateLeft} y1={plateMid} x2={plateRight} y2={plateMid} stroke={theme.colors.lightBlue[700]} strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Bolt clearance hole (white slot through both plates) */}
      <rect x={boltX - holeHalfWidth} y={plateTop} width={holeHalfWidth * 2} height={plateBottom - plateTop} fill={theme.colors.bg.primary} />

      {/* Member compression springs — tight horizontal zigzags either side of the hole, in each plate */}
      <polyline points={horizontalSpringPoints(plateTop + (plateBottom - plateTop) / 4, plateLeft + 8, boltX - holeHalfWidth - 4, 6, 3)} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="1.5" />
      <polyline points={horizontalSpringPoints(plateTop + (plateBottom - plateTop) / 4, boltX + holeHalfWidth + 4, plateRight - 8, 6, 3)} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="1.5" />
      <polyline points={horizontalSpringPoints(plateMid + (plateBottom - plateTop) / 4, plateLeft + 8, boltX - holeHalfWidth - 4, 6, 3)} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="1.5" />
      <polyline points={horizontalSpringPoints(plateMid + (plateBottom - plateTop) / 4, boltX + holeHalfWidth + 4, plateRight - 8, 6, 3)} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="1.5" />

      {/* Compression arrows pinching the plates together */}
      <path d={`M ${plateLeft - 14} ${plateTop - 4} L ${plateLeft - 2} ${plateTop + 6}`} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#boltedArrow)" />
      <path d={`M ${plateLeft - 14} ${plateBottom + 4} L ${plateLeft - 2} ${plateBottom - 6}`} stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" markerEnd="url(#boltedArrow)" />

      {/* Bolt shank as a stretched tension spring, drawn through the clearance hole */}
      <polyline
        points={verticalSpringPoints(boltX, shankTopY, nutTopY, 9, 6)}
        fill="none"
        stroke={theme.colors.error}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Nut */}
      <polygon
        points={`${boltX - 22},${nutTopY} ${boltX - 22},${nutBottomY} ${boltX + 22},${nutBottomY} ${boltX + 22},${nutTopY}`}
        fill={theme.colors.gray[400]}
        stroke={theme.colors.text.primary}
        strokeWidth="2"
      />

      {/* Preload arrow out of nut */}
      <line x1={boltX} y1={nutBottomY + 4} x2={boltX} y2="248" stroke={theme.colors.accent[500]} strokeWidth="3" />
      <path d={`M ${boltX - 6} ${nutBottomY + 8} L ${boltX} ${nutBottomY - 2} L ${boltX + 6} ${nutBottomY + 8} Z`} fill={theme.colors.accent[500]} />
      <text x={boltX + 12} y="245" fontSize="15" fontWeight={700} fill={theme.colors.accent[600]}>F_i</text>

      <text x={boltX} y={26} textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>bolt (tension spring)</text>
      <text x={(plateLeft + plateRight) / 2} y={plateBottom + 22} textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>clamped members (compression spring)</text>

      {/* ---- Right: equivalent two-spring stiffness model ---- */}
      <g transform="translate(430, 20)">
        <text x="90" y="0" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>Equivalent spring model</text>

        {/* Rigid top bar */}
        <line x1="20" y1="20" x2="160" y2="20" stroke={theme.colors.text.primary} strokeWidth="5" />
        {/* Rigid bottom bar */}
        <line x1="20" y1="190" x2="160" y2="190" stroke={theme.colors.text.primary} strokeWidth="5" />

        {/* Bolt spring k_b (left) */}
        <polyline points={verticalSpringPoints(55, 20, 190, 10, 7)} fill="none" stroke={theme.colors.error} strokeWidth="2.5" />
        <text x="55" y="210" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.error}>k_b</text>

        {/* Member spring k_m (right) */}
        <polyline points={verticalSpringPoints(125, 20, 190, 10, 7)} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
        <text x="125" y="210" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>k_m</text>

        <text x="90" y="230" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>C = k_b / (k_b + k_m)</text>
      </g>

      <defs>
        <marker id="boltedArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={theme.colors.lightBlue[600]} />
        </marker>
      </defs>
    </svg>
  )
}

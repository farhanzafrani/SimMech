import { theme } from '../../styles/theme'

export default function SpringDesignConcept() {
  const axisX = 140
  const topY = 40
  const baseY = 200
  const coilRadiusPx = 55
  const turns = 5
  const stepPx = (baseY - topY) / turns

  // Zigzag path standing in for the coiled wire, side view.
  let coilPath = `M ${axisX} ${topY}`
  for (let i = 0; i < turns; i++) {
    const yMid = topY + stepPx * (i + 0.5)
    const yEnd = topY + stepPx * (i + 1)
    const sign = i % 2 === 0 ? 1 : -1
    coilPath += ` Q ${axisX + sign * coilRadiusPx} ${yMid} ${axisX} ${yEnd}`
  }

  // The coil crossing we call out to show the offset load / torque.
  const calloutY = topY + stepPx * 2.5
  const wireX = axisX + coilRadiusPx

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Helical compression spring showing the coiled wire is loaded in torsion, not bending, diagram">
      {/* Central load line through the spring axis */}
      <line x1={axisX} y1={topY - 20} x2={axisX} y2={baseY + 10} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="3 3" />

      {/* Applied axial force */}
      <line x1={axisX} y1={topY - 30} x2={axisX} y2={topY - 4} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#springConceptArrow)" />
      <text x={axisX + 10} y={topY - 14} fontSize="16" fontWeight={700} fill={theme.colors.error}>F</text>

      {/* Top platen */}
      <line x1={axisX - coilRadiusPx - 8} y1={topY} x2={axisX + coilRadiusPx + 8} y2={topY} stroke={theme.colors.text.primary} strokeWidth="4" />

      {/* Coil */}
      <path d={coilPath} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="5" strokeLinecap="round" />

      {/* Fixed base */}
      <line x1={axisX - coilRadiusPx - 8} y1={baseY} x2={axisX + coilRadiusPx + 8} y2={baseY} stroke={theme.colors.text.primary} strokeWidth="4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={axisX - coilRadiusPx + i * (2 * coilRadiusPx) / 4}
          y1={baseY}
          x2={axisX - coilRadiusPx + i * (2 * coilRadiusPx) / 4 - 8}
          y2={baseY + 14}
          stroke={theme.colors.gray[500]}
          strokeWidth="2"
        />
      ))}

      {/* Offset arm from the load line to the wire: this offset is what
          turns the axial force into a torque on the wire cross-section */}
      <line x1={axisX} y1={calloutY} x2={wireX} y2={calloutY} stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx={axisX} cy={calloutY} r="2.5" fill={theme.colors.accent[600]} />
      <circle cx={wireX} cy={calloutY} r="4" fill={theme.colors.accent[600]} />
      <text x={(axisX + wireX) / 2} y={calloutY - 8} fontSize="11" fill={theme.colors.accent[600]} textAnchor="middle">D/2</text>
      <text x={axisX - 4} y={calloutY - 20} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]} textAnchor="end">T = F·D/2</text>

      {/* Leader from the wire crossing to the inset cross-section */}
      <line x1={wireX} y1={calloutY} x2="460" y2="100" stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="3 3" />

      {/* Inset: wire cross-section under torsion (same τ(r) pattern as a
          torsion bar — this is the point of the diagram: the coiled wire
          is a torsion bar, not a beam in bending) */}
      <g transform="translate(460, 45)">
        <circle cx="60" cy="60" r="55" fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="1.5" />
        <circle cx="60" cy="60" r="2" fill={theme.colors.text.primary} />
        <line x1="60" y1="60" x2="115" y2="60" stroke={theme.colors.gray[500]} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M60 60 L115 50 L115 70 Z" fill={theme.colors.accent[500]} fillOpacity="0.3" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
        <text x="120" y="45" fontSize="11" fill={theme.colors.accent[600]}>τ_max</text>
        <text x="55" y="75" fontSize="10" fill={theme.colors.text.light}>0</text>
        <text x="60" y="132" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>Wire cross-section</text>
        <text x="60" y="148" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>(in torsion, not bending)</text>
      </g>

      <defs>
        <marker id="springConceptArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
      </defs>
    </svg>
  )
}

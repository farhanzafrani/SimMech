import { theme } from '../../styles/theme'

export default function ShearBendingConcept() {
  // A simply supported beam, cut at midspan, showing the internal shear
  // force V and bending moment M on the exposed face of each half.
  const beamY = 110
  const beamLeft = 60
  const beamRight = 580
  const cutX = 320
  const gap = 18

  const support = (x: number) => (
    <path d={`M ${x} ${beamY + 10} L ${x - 12} ${beamY + 32} L ${x + 12} ${beamY + 32} Z`} fill="none" stroke={theme.colors.text.primary} strokeWidth="2" />
  )

  return (
    <svg width="100%" height="220" viewBox="0 0 640 220" role="img" aria-label="Free body of a cut beam showing internal shear and moment">
      {/* Left half */}
      <rect x={beamLeft} y={beamY - 14} width={cutX - gap - beamLeft} height="28" fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      {support(beamLeft + 10)}

      {/* Right half */}
      <rect x={cutX + gap} y={beamY - 14} width={beamRight - (cutX + gap)} height="28" fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      {support(beamRight - 10)}

      {/* Internal shear force V, opposite on each cut face */}
      <line x1={cutX - gap} y1={beamY + 14} x2={cutX - gap} y2={beamY + 46} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#sbArrow)" />
      <text x={cutX - gap - 8} y={beamY + 60} textAnchor="end" fontSize="16" fontWeight={700} fill={theme.colors.accent[600]}>V</text>

      <line x1={cutX + gap} y1={beamY + 46} x2={cutX + gap} y2={beamY + 14} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#sbArrow)" />
      <text x={cutX + gap + 8} y={beamY + 60} fontSize="16" fontWeight={700} fill={theme.colors.accent[600]}>V</text>

      {/* Internal bending moment M, curved arrows on each cut face */}
      <path d={`M ${cutX - gap - 24} ${beamY - 24} A 20 20 0 0 1 ${cutX - gap} ${beamY - 44}`} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="2.5" markerEnd="url(#sbArrowBlue)" />
      <text x={cutX - gap - 40} y={beamY - 50} fontSize="16" fontWeight={700} fill={theme.colors.lightBlue[700]}>M</text>

      <path d={`M ${cutX + gap + 24} ${beamY - 24} A 20 20 0 0 0 ${cutX + gap} ${beamY - 44}`} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="2.5" markerEnd="url(#sbArrowBlue)" />
      <text x={cutX + gap + 30} y={beamY - 50} fontSize="16" fontWeight={700} fill={theme.colors.lightBlue[700]}>M</text>

      <text x={cutX} y={beamY + 90} textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>Imaginary cut — each half feels the other's V and M</text>

      <defs>
        <marker id="sbArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
        <marker id="sbArrowBlue" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.lightBlue[700]} />
        </marker>
      </defs>
    </svg>
  )
}

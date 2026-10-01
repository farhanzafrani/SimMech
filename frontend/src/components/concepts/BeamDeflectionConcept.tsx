import { theme } from '../../styles/theme'

export default function BeamDeflectionConcept() {
  // A simply supported beam with a point load, drawn twice: the straight
  // (dashed) unloaded position and the sagging (solid) elastic curve it
  // settles into once the load is applied — exaggerated for visibility.
  const beamLeft = 80
  const beamRight = 560
  const beamY = 100
  const loadX = 340 // load sits left of center to read as a general a/b case
  const sagPeak = 46 // exaggerated max deflection, in px

  const support = (x: number) => (
    <path
      d={`M ${x} ${beamY + 4} L ${x - 14} ${beamY + 30} L ${x + 14} ${beamY + 30} Z`}
      fill={theme.colors.bg.secondary}
      stroke={theme.colors.text.primary}
      strokeWidth="2"
    />
  )

  // Sagging elastic curve: zero at both supports, peak near the load.
  // Built from two quadratic segments so the peak can sit off-center.
  const sagPath = `M ${beamLeft} ${beamY} Q ${beamLeft + (loadX - beamLeft) * 0.6} ${beamY + sagPeak} ${loadX} ${beamY + sagPeak} Q ${loadX + (beamRight - loadX) * 0.4} ${beamY + sagPeak} ${beamRight} ${beamY}`

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Simply supported beam sagging under a point load, elastic curve diagram">
      {/* Ground hatching under each support */}
      <line x1={beamLeft - 20} y1={beamY + 30} x2={beamLeft + 20} y2={beamY + 30} stroke={theme.colors.gray[600]} strokeWidth="2" />
      <line x1={beamRight - 20} y1={beamY + 30} x2={beamRight + 20} y2={beamY + 30} stroke={theme.colors.gray[600]} strokeWidth="2" />
      {[0, 1, 2, 3].map((i) => (
        <line key={`gl${i}`} x1={beamLeft - 16 + i * 11} y1={beamY + 30} x2={beamLeft - 24 + i * 11} y2={beamY + 42} stroke={theme.colors.gray[500]} strokeWidth="1.5" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={`gr${i}`} x1={beamRight - 16 + i * 11} y1={beamY + 30} x2={beamRight - 24 + i * 11} y2={beamY + 42} stroke={theme.colors.gray[500]} strokeWidth="1.5" />
      ))}

      {support(beamLeft)}
      {support(beamRight)}

      {/* Unloaded straight beam (dashed reference) */}
      <line
        x1={beamLeft}
        y1={beamY}
        x2={beamRight}
        y2={beamY}
        stroke={theme.colors.gray[500]}
        strokeWidth="2"
        strokeDasharray="6 5"
      />
      <text x={(beamLeft + beamRight) / 2} y={beamY - 60} textAnchor="middle" fontSize="12" fill={theme.colors.text.light}>
        unloaded position
      </text>

      {/* Sagging elastic curve under load */}
      <path d={sagPath} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
      <text x={loadX + 18} y={beamY + sagPeak + 4} fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>
        elastic curve y(x)
      </text>

      {/* Point load arrow, applied at distance a from the left support */}
      <line x1={loadX} y1={beamY - 55} x2={loadX} y2={beamY + sagPeak - 8} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#bdArrow)" />
      <text x={loadX} y={beamY - 62} textAnchor="middle" fontSize="16" fontWeight={700} fill={theme.colors.accent[600]}>P</text>

      {/* Max deflection callout */}
      <line x1={loadX} y1={beamY} x2={loadX} y2={beamY + sagPeak} stroke={theme.colors.text.secondary} strokeWidth="1" strokeDasharray="2 3" />
      <text x={loadX + 8} y={beamY + sagPeak / 2 + 4} fontSize="11" fill={theme.colors.text.secondary}>δ</text>

      {/* Span dimension line */}
      <line x1={beamLeft} y1={beamY + 60} x2={beamRight} y2={beamY + 60} stroke={theme.colors.gray[500]} strokeWidth="1" markerStart="url(#bdTick)" markerEnd="url(#bdTick)" />
      <text x={(beamLeft + beamRight) / 2} y={beamY + 78} textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>L</text>

      {/* a / b span split markers under the load */}
      <line x1={loadX} y1={beamY + 30} x2={loadX} y2={beamY + 52} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="2 3" />
      <text x={(beamLeft + loadX) / 2} y={beamY + 48} textAnchor="middle" fontSize="10" fill={theme.colors.text.light}>a</text>
      <text x={(loadX + beamRight) / 2} y={beamY + 48} textAnchor="middle" fontSize="10" fill={theme.colors.text.light}>b</text>

      <text x={(beamLeft + beamRight) / 2} y={beamY + 100} textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        E I y″ = M(x) — the beam curves in proportion to its local bending moment
      </text>

      <defs>
        <marker id="bdArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
        <marker id="bdTick" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M4,0 L4,8" stroke={theme.colors.gray[500]} strokeWidth="1" />
        </marker>
      </defs>
    </svg>
  )
}

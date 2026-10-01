import { theme } from '../../styles/theme'

export default function StaticsTrussConcept() {
  // Triangular truss with a joint isolated at the apex
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Truss with a joint isolated into a free-body diagram showing member forces, diagram">
      <line x1="40" y1="190" x2="260" y2="190" stroke={theme.colors.lightBlue[600]} strokeWidth="5" />
      <line x1="40" y1="190" x2="150" y2="60" stroke={theme.colors.error} strokeWidth="5" />
      <line x1="260" y1="190" x2="150" y2="60" stroke={theme.colors.error} strokeWidth="5" />
      <line x1="150" y1="190" x2="150" y2="60" stroke={theme.colors.lightBlue[600]} strokeWidth="3" strokeDasharray="5 4" />
      <circle cx="150" cy="60" r="12" fill="none" stroke={theme.colors.accent[600]} strokeWidth="2" />
      <line x1="150" y1="10" x2="150" y2="46" stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#trussConceptArrow)" />
      <text x="160" y="30" fontSize="14" fontWeight={700} fill={theme.colors.accent[600]}>P</text>
      <text x="150" y="222" fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>red = compression, blue = tension</text>

      <line x1="270" y1="70" x2="370" y2="70" stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="3 3" />

      {/* Joint FBD */}
      <g transform="translate(470, 110)">
        <circle cx="0" cy="0" r="5" fill={theme.colors.text.primary} />
        <line x1="0" y1="0" x2="-70" y2="80" stroke={theme.colors.error} strokeWidth="3" />
        <line x1="0" y1="0" x2="70" y2="80" stroke={theme.colors.error} strokeWidth="3" />
        <line x1="0" y1="-60" x2="0" y2="-6" stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#trussConceptArrow)" />
        <text x="10" y="-40" fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>P</text>
        <text x="-82" y="60" fontSize="13" fill={theme.colors.error} textAnchor="end">F₁</text>
        <text x="82" y="60" fontSize="13" fill={theme.colors.error}>F₂</text>
        <text x="0" y="116" fontSize="13" textAnchor="middle" fill={theme.colors.text.primary}>ΣFₓ = 0, ΣF_y = 0 at every joint</text>
      </g>
      <text x="470" y="26" fontSize="13" fontWeight={700} textAnchor="middle" fill={theme.colors.text.secondary}>Method of joints: isolate one pin</text>
      <defs>
        <marker id="trussConceptArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
      </defs>
    </svg>
  )
}

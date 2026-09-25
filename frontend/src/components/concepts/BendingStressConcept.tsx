import { theme } from '../../styles/theme'

export default function BendingStressConcept() {
  return (
    <svg width="100%" height="240" viewBox="0 0 760 240" role="img" aria-label="Bent beam segment showing compression and tension fibers, with a cross-section view of the linear stress distribution">
      <defs>
        <linearGradient id="conceptBendingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={theme.colors.lightBlue[200]} />
          <stop offset="50%" stopColor={theme.colors.bg.primary} />
          <stop offset="100%" stopColor={theme.colors.accent.light} />
        </linearGradient>
      </defs>

      {/* Beam segment, bowed slightly by the applied moment */}
      <path
        d="M 60 70 Q 240 40 420 70 L 420 150 Q 240 180 60 150 Z"
        fill={theme.colors.lightBlue[100]}
        stroke={theme.colors.lightBlue[600]}
        strokeWidth="2"
      />

      {/* Neutral axis */}
      <path d="M 60 110 Q 240 110 420 110" fill="none" stroke={theme.colors.gray[600]} strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="435" y="114" fontSize="13" fill={theme.colors.text.secondary}>neutral axis</text>

      {/* Top fiber: compressed (shorter arc, arrows pointing inward) */}
      <path d="M 90 76 Q 240 48 390 76" fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="2" />
      <path d="M 190 62 L 210 60 M 210 60 L 203 55 M 210 60 L 205 66" stroke={theme.colors.lightBlue[700]} strokeWidth="2" fill="none" />
      <path d="M 290 62 L 270 60 M 270 60 L 277 55 M 270 60 L 275 66" stroke={theme.colors.lightBlue[700]} strokeWidth="2" fill="none" />
      <text x="240" y="30" textAnchor="middle" fontSize="15" fontWeight={700} fill={theme.colors.lightBlue[700]}>
        compression — fibers shorten
      </text>

      {/* Bottom fiber: stretched (longer arc, arrows pointing outward) */}
      <path d="M 90 144 Q 240 172 390 144" fill="none" stroke={theme.colors.accent[600]} strokeWidth="2" />
      <path d="M 190 158 L 170 160 M 170 160 L 177 155 M 170 160 L 175 165" stroke={theme.colors.accent[600]} strokeWidth="2" fill="none" />
      <path d="M 290 158 L 310 160 M 310 160 L 303 155 M 310 160 L 305 165" stroke={theme.colors.accent[600]} strokeWidth="2" fill="none" />
      <text x="240" y="200" textAnchor="middle" fontSize="15" fontWeight={700} fill={theme.colors.accent[600]}>
        tension — fibers stretch
      </text>

      {/* Inset: cross-section with the linear sigma(y) stress distribution, zero at the neutral axis */}
      <g transform="translate(560, 20)">
        <rect x="-50" y="20" width="50" height="160" fill="url(#conceptBendingGradient)" stroke={theme.colors.text.primary} strokeWidth="1.5" />
        <line x1="-65" y1="100" x2="140" y2="100" stroke={theme.colors.gray[600]} strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="70" y1="20" x2="70" y2="180" stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="2 3" />

        {/* sigma(y) = M y / I : a straight line, zero at y = 0, max at the outer fibers */}
        <line x1="130" y1="20" x2="10" y2="180" stroke={theme.colors.text.primary} strokeWidth="2" />
        <circle cx="70" cy="100" r="2.5" fill={theme.colors.text.primary} />

        <text x="-25" y="12" textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>Cross-section</text>
        <text x="140" y="17" fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[700]}>+σ_max</text>
        <text x="-15" y="196" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>−σ_max</text>
        <text x="78" y="97" fontSize="10" fill={theme.colors.text.light}>0</text>
      </g>
    </svg>
  )
}

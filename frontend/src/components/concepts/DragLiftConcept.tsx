import { theme } from '../../styles/theme'

export default function DragLiftConcept() {
  // Left: cylinder with a wide separated wake. Right: airfoil with lift and drag.
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="A cylinder with a wide separated wake beside an airfoil at angle of attack with lift and drag vectors, diagram">
      <text x="40" y="24" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Bluff body: pressure drag</text>
      {[80, 120, 160].map((yy) => (
        <g key={yy}>
          <line x1="20" y1={yy} x2="60" y2={yy} stroke={theme.colors.gray[400]} strokeWidth="1.5" />
          <path d={`M 60 ${yy} l -6 -4 m 6 4 l -6 4`} stroke={theme.colors.gray[400]} strokeWidth="1.5" fill="none" />
        </g>
      ))}
      <circle cx="140" cy="120" r="36" fill={theme.colors.lightBlue[200]} stroke={theme.colors.text.primary} strokeWidth="2" />
      <path d="M 170 90 Q 230 70 290 60 L 290 180 Q 230 170 170 150 Z" fill={theme.colors.lightBlue[200]} fillOpacity="0.4" stroke={theme.colors.lightBlue[600]} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="215" y="124" fontSize="12" fill={theme.colors.lightBlue[600]}>low-pressure wake</text>
      <text x="40" y="214" fontSize="12" fill={theme.colors.text.secondary}>C_D = D / (½ρV²A)</text>

      <text x="360" y="24" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Wing: lift and induced drag</text>
      <g transform="translate(470 125) rotate(-10)">
        <path d="M -90 0 Q -60 -22 0 -20 Q 60 -14 100 0 Q 60 6 0 6 Q -60 6 -90 0 Z" fill={theme.colors.lightBlue[200]} stroke={theme.colors.text.primary} strokeWidth="2" />
      </g>
      <line x1="360" y1="110" x2="395" y2="110" stroke={theme.colors.gray[400]} strokeWidth="1.5" />
      <text x="360" y="102" fontSize="12" fill={theme.colors.text.secondary}>V</text>
      <line x1="470" y1="120" x2="470" y2="55" stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#dlConceptArrowG)" />
      <text x="478" y="62" fontSize="13" fontWeight={700} fill={theme.colors.success}>L</text>
      <line x1="470" y1="120" x2="535" y2="120" stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#dlConceptArrowR)" />
      <text x="540" y="124" fontSize="13" fontWeight={700} fill={theme.colors.error}>D</text>
      <text x="400" y="190" fontSize="12" fill={theme.colors.accent[600]}>angle of attack α</text>
      <text x="360" y="214" fontSize="12" fill={theme.colors.text.secondary}>C_L = a(α − α_L0),  C_D = C_D0 + C_L²/(π e AR)</text>

      <defs>
        <marker id="dlConceptArrowG" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.success} />
        </marker>
        <marker id="dlConceptArrowR" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
      </defs>
    </svg>
  )
}

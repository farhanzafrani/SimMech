import { theme } from '../../styles/theme'

export default function RoboticsJacobianConcept() {
  // Left: unit circle of joint rates; right: its image, the velocity ellipse
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="The Jacobian maps a circle of joint velocities to an ellipse of tip velocities, diagram">
      <defs>
        <marker id="roboJacConceptArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 z" fill={theme.colors.accent[600]} />
        </marker>
      </defs>

      <g transform="translate(110, 120)">
        <line x1="-80" y1="0" x2="80" y2="0" stroke={theme.colors.gray[300]} strokeWidth="1" />
        <line x1="0" y1="-80" x2="0" y2="80" stroke={theme.colors.gray[300]} strokeWidth="1" />
        <circle r="60" fill={theme.colors.lightBlue[100]} fillOpacity="0.7" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
        <text x="0" y="104" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>joint rates ‖q̇‖ = 1</text>
        <text x="84" y="14" fontSize="11" fill={theme.colors.text.light}>q̇₁</text>
        <text x="6" y="-66" fontSize="11" fill={theme.colors.text.light}>q̇₂</text>
      </g>

      <line x1="200" y1="120" x2="300" y2="120" stroke={theme.colors.accent[600]} strokeWidth="2.5" markerEnd="url(#roboJacConceptArrow)" />
      <text x="250" y="108" textAnchor="middle" fontSize="15" fontWeight={700} fill={theme.colors.accent[600]}>J(θ)</text>

      <g transform="translate(390, 120)">
        <line x1="-80" y1="0" x2="80" y2="0" stroke={theme.colors.gray[300]} strokeWidth="1" />
        <line x1="0" y1="-80" x2="0" y2="80" stroke={theme.colors.gray[300]} strokeWidth="1" />
        <ellipse rx="72" ry="30" transform="rotate(-30)" fill={theme.colors.accent.light} fillOpacity="0.5" stroke={theme.colors.accent[600]} strokeWidth="2" />
        <line x1="0" y1="0" x2="62" y2="-36" stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="66" y="-40" fontSize="11" fill={theme.colors.error}>σ₁</text>
        <text x="0" y="104" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>tip velocities v (m/s)</text>
      </g>

      <g transform="translate(500, 60)" fontFamily={theme.typography.fontFamily.mono} fontSize="13" fill={theme.colors.text.primary}>
        <text x="0" y="0">v = J q̇</text>
        <text x="0" y="22">τ = Jᵀ F</text>
        <text x="0" y="44">w = σ₁σ₂</text>
        <text x="0" y="76" fontFamily={theme.typography.fontFamily.base} fontSize="11" fill={theme.colors.text.light}>Thin ellipse = near</text>
        <text x="0" y="92" fontFamily={theme.typography.fontFamily.base} fontSize="11" fill={theme.colors.text.light}>singularity.</text>
      </g>
    </svg>
  )
}

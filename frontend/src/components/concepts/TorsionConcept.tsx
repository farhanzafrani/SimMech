import { theme } from '../../styles/theme'

export default function TorsionConcept() {
  // Longitudinal grid lines: straight near the wall, progressively
  // slanted (twisted) toward the free end where the torque is applied.
  const lineYs = [95, 115, 135, 155]
  const shaftStartX = 60
  const shaftEndX = 380

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Circular shaft in torsion diagram">
      {/* Fixed wall */}
      <line x1="60" y1="60" x2="60" y2="190" stroke={theme.colors.gray[600]} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={i}
          x1={60 - 10}
          y1={70 + i * 18}
          x2={60}
          y2={80 + i * 18}
          stroke={theme.colors.gray[500]}
          strokeWidth="2"
        />
      ))}

      {/* Shaft body */}
      <rect x={shaftStartX} y="80" width={shaftEndX - shaftStartX} height="90" rx="6" fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />

      {/* Longitudinal lines: straight near the wall, twisted near the free end */}
      {lineYs.map((y) => {
        const twistOffset = 14
        return (
          <path
            key={y}
            d={`M ${shaftStartX} ${y} L ${shaftStartX + 160} ${y} Q ${shaftStartX + 260} ${y} ${shaftEndX - 20} ${y - twistOffset}`}
            fill="none"
            stroke={theme.colors.lightBlue[700]}
            strokeWidth="1.5"
          />
        )
      })}

      {/* Torque arrow (curved) at the free end */}
      <path
        d="M 430 90 A 30 30 0 1 1 430 160"
        fill="none"
        stroke={theme.colors.error}
        strokeWidth="3"
        markerEnd="url(#torsionArrow)"
      />
      <text x="470" y="130" fontSize="18" fontWeight={700} fill={theme.colors.error}>T</text>

      {/* Inset cross-section showing linear τ(r) distribution */}
      <g transform="translate(500, 60)">
        <circle cx="60" cy="60" r="55" fill="none" stroke={theme.colors.text.primary} strokeWidth="1.5" />
        <circle cx="60" cy="60" r="2" fill={theme.colors.text.primary} />
        <line x1="60" y1="60" x2="115" y2="60" stroke={theme.colors.gray[500]} strokeWidth="1" strokeDasharray="3 3" />
        <path d="M60 60 L115 50 L115 70 Z" fill={theme.colors.accent[500]} fillOpacity="0.3" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
        <text x="60" y="130" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>Cross-section</text>
        <text x="120" y="45" fontSize="11" fill={theme.colors.accent[600]}>τ_max</text>
        <text x="55" y="75" fontSize="10" fill={theme.colors.text.light}>0</text>
      </g>

      <defs>
        <marker id="torsionArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
      </defs>
    </svg>
  )
}

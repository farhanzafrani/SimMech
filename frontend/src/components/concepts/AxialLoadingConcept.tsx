import { theme } from '../../styles/theme'

export default function AxialLoadingConcept() {
  return (
    <svg width="100%" height="220" viewBox="0 0 640 220" role="img" aria-label="Bar fixed at both ends, heated, with an axial force diagram">
      {/* Left wall */}
      <line x1="80" y1="60" x2="80" y2="160" stroke={theme.colors.gray[600]} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={`l${i}`} x1={70} y1={70 + i * 18} x2={80} y2={80 + i * 18} stroke={theme.colors.gray[500]} strokeWidth="2" />
      ))}

      {/* Right wall */}
      <line x1="480" y1="60" x2="480" y2="160" stroke={theme.colors.gray[600]} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={`r${i}`} x1={480} y1={70 + i * 18} x2={490} y2={80 + i * 18} stroke={theme.colors.gray[500]} strokeWidth="2" />
      ))}

      {/* Bar, both ends fixed */}
      <rect x="80" y="95" width="400" height="30" fill={theme.colors.accent[500]} fillOpacity="0.18" stroke={theme.colors.accent[600]} strokeWidth="2" />

      {/* Heat wavy lines above the bar */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${150 + i * 100} 75 q 8 -10 16 0 q 8 10 16 0`}
          fill="none"
          stroke={theme.colors.error}
          strokeWidth="2"
        />
      ))}
      <text x="280" y="55" textAnchor="middle" fontSize="16" fontWeight={700} fill={theme.colors.error}>ΔT</text>

      {/* Force arrow into the bar (mechanical load, independent of the thermal effect) */}
      <line x1="560" y1="110" x2="490" y2="110" stroke={theme.colors.lightBlue[600]} strokeWidth="3" markerEnd="url(#axialArrow)" />
      <text x="565" y="95" fontSize="16" fontWeight={700} fill={theme.colors.lightBlue[600]}>F</text>

      <text x="280" y="150" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        Both ends fixed — the bar cannot get any longer
      </text>
      <text x="280" y="170" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        Blocked expansion becomes stress instead of strain
      </text>

      <defs>
        <marker id="axialArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.lightBlue[600]} />
        </marker>
      </defs>
    </svg>
  )
}

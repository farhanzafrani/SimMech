import { theme } from '../../styles/theme'

export default function ToleranceStackupConcept() {
  // Left: a 1-D chain of parts closing a gap. Right: ISO hole/shaft zones.
  const y = 90
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="One-dimensional tolerance chain closing a gap, and ISO hole and shaft tolerance zones diagram">
      {/* Housing pocket A (+), parts B C D (-), residual gap */}
      <rect x="40" y={y - 40} width="10" height="120" fill={theme.colors.text.primary} />
      <rect x="290" y={y - 40} width="10" height="120" fill={theme.colors.text.primary} />
      <line x1="50" y1={y + 90} x2="290" y2={y + 90} stroke={theme.colors.accent[600]} strokeWidth="2" />
      <text x="170" y={y + 108} fontSize="12" textAnchor="middle" fill={theme.colors.accent[600]}>A (+): housing, nominal ± tol</text>
      <rect x="50" y={y} width="70" height="40" fill={theme.colors.lightBlue[300]} stroke={theme.colors.lightBlue[700]} />
      <text x="85" y={y + 25} fontSize="12" textAnchor="middle" fill={theme.colors.text.primary}>B (−)</text>
      <rect x="120" y={y} width="90" height="40" fill={theme.colors.lightBlue[200]} stroke={theme.colors.lightBlue[700]} />
      <text x="165" y={y + 25} fontSize="12" textAnchor="middle" fill={theme.colors.text.primary}>C (−)</text>
      <rect x="210" y={y} width="48" height="40" fill={theme.colors.lightBlue[300]} stroke={theme.colors.lightBlue[700]} />
      <text x="234" y={y + 25} fontSize="12" textAnchor="middle" fill={theme.colors.text.primary}>D (−)</text>
      <rect x="258" y={y} width="32" height="40" fill="none" stroke={theme.colors.error} strokeWidth="2" strokeDasharray="4 3" />
      <text x="274" y={y - 8} fontSize="12" textAnchor="middle" fontWeight={700} fill={theme.colors.error}>gap</text>
      <text x="40" y="26" fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>Gap = A − B − C − D</text>
      <text x="40" y="44" fontSize="11" fill={theme.colors.text.secondary}>Worst case: Σ t_i  ·  RSS: √(Σ t_i²)</text>

      {/* ISO zones */}
      <g transform="translate(380, 30)">
        <text x="0" y="0" fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>ISO fit (hole basis)</text>
        <line x1="0" y1="100" x2="230" y2="100" stroke={theme.colors.text.primary} strokeDasharray="4 3" />
        <text x="2" y="95" fontSize="10" fill={theme.colors.text.light}>basic size</text>
        <rect x="40" y="70" width="55" height="30" fill={theme.colors.lightBlue[400]} stroke={theme.colors.lightBlue[700]} />
        <text x="67" y="62" fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>hole H7</text>
        <rect x="140" y="104" width="55" height="26" fill={theme.colors.warning} fillOpacity="0.7" stroke={theme.colors.text.primary} />
        <text x="167" y="148" fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>shaft g6</text>
        <text x="0" y="176" fontSize="11" fill={theme.colors.text.secondary}>Zones fully below the hole: clearance fit</text>
        <text x="0" y="192" fontSize="11" fill={theme.colors.text.secondary}>Overlapping: transition · above: interference</text>
      </g>
    </svg>
  )
}

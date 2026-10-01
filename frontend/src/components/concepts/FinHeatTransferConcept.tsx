import { theme } from '../../styles/theme'

export default function FinHeatTransferConcept() {
  // exponential decay of fin temperature along its length
  const pts = Array.from({ length: 21 }, (_, i) => {
    const x = 120 + (i / 20) * 380
    const y = 150 - 90 * Math.exp(-2.2 * (i / 20)) 
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width="100%" height="230" viewBox="0 0 640 230" role="img" aria-label="Fin attached to a hot wall with temperature decaying from base to tip, diagram">
      <rect x="60" y="30" width="60" height="150" fill={theme.colors.error} fillOpacity="0.3" stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x="90" y="110" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.error}>T_b</text>
      <rect x="120" y="80" width="380" height="24" fill={theme.colors.gray[300]} stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x="310" y="97" textAnchor="middle" fontSize="12" fill={theme.colors.text.primary}>fin: k, P, A_c</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <path d={`M ${170 + i * 75} 74 q 8 -16 0 -30`} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
          <path d={`M ${170 + i * 75} 110 q 8 16 0 30`} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
        </g>
      ))}
      <text x="520" y="60" fontSize="12" fill={theme.colors.lightBlue[600]}>convection h, T∞</text>
      <polyline points={pts} fill="none" stroke={theme.colors.accent[600]} strokeWidth="3" transform="translate(0,50)" />
      <text x="310" y="215" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>θ(x) = θ_b e^(−mx),  m = √(hP / kA_c): hot at the base, nearly ambient at the tip</text>
    </svg>
  )
}

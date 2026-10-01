import { theme } from '../../styles/theme'

export default function ConductionNetworksConcept() {
  const labels = ['R_conv,1', 'R_1', 'R_2', 'R_conv,2']
  return (
    <svg width="100%" height="250" viewBox="0 0 640 250" role="img" aria-label="Composite wall with two layers and two convective films, shown above its equivalent series thermal-resistance circuit, diagram">
      {/* wall */}
      <rect x="230" y="20" width="60" height="100" fill={theme.colors.warning} fillOpacity="0.35" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <rect x="290" y="20" width="90" height="100" fill={theme.colors.lightBlue[200]} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x="260" y="76" textAnchor="middle" fontSize="12">k₁</text>
      <text x="335" y="76" textAnchor="middle" fontSize="12">k₂</text>
      <text x="150" y="30" textAnchor="middle" fontSize="12" fill={theme.colors.error}>T∞,1 , h₁</text>
      <text x="470" y="30" textAnchor="middle" fontSize="12" fill={theme.colors.lightBlue[600]}>T∞,2 , h₂</text>
      <polyline points="150,80 230,50 290,70 380,100 470,110" fill="none" stroke={theme.colors.accent[600]} strokeWidth="3" />
      <line x1="150" y1="40" x2="150" y2="120" stroke={theme.colors.gray[400]} strokeDasharray="3 3" />
      <line x1="470" y1="40" x2="470" y2="120" stroke={theme.colors.gray[400]} strokeDasharray="3 3" />

      {/* circuit */}
      <line x1="40" y1="190" x2="600" y2="190" stroke={theme.colors.gray[500]} strokeWidth="2" />
      {labels.map((l, i) => (
        <g key={l}>
          <rect x={120 + i * 120} y="174" width="80" height="32" fill="white" stroke={theme.colors.accent[600]} strokeWidth="2" />
          <text x={160 + i * 120} y="195" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>{l}</text>
        </g>
      ))}
      <circle cx="40" cy="190" r="5" fill={theme.colors.error} />
      <circle cx="600" cy="190" r="5" fill={theme.colors.lightBlue[600]} />
      <text x="40" y="214" textAnchor="middle" fontSize="12" fill={theme.colors.error}>T∞,1</text>
      <text x="600" y="214" textAnchor="middle" fontSize="12" fill={theme.colors.lightBlue[600]}>T∞,2</text>
      <text x="320" y="240" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>q = ΔT / ΣR   (same q through every resistor, bigger R takes bigger ΔT)</text>
    </svg>
  )
}

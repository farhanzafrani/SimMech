import { theme } from '../../styles/theme'

export default function StaticsEquilibriumConcept() {
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="A loaded beam on a pin and roller (left) and its free-body diagram with reactions Ax, Ay and By (right)">
      {/* Real system */}
      <text x="140" y="24" fontSize="13" fontWeight={700} textAnchor="middle" fill={theme.colors.text.secondary}>Real system</text>
      <line x1="40" y1="110" x2="240" y2="110" stroke={theme.colors.text.primary} strokeWidth="6" strokeLinecap="round" />
      <polygon points="40,114 28,136 52,136" fill="none" stroke={theme.colors.text.primary} strokeWidth="2" />
      <circle cx="240" cy="132" r="8" fill="none" stroke={theme.colors.text.primary} strokeWidth="2" />
      <line x1="20" y1="142" x2="60" y2="142" stroke={theme.colors.gray[500]} strokeWidth="2" />
      <line x1="215" y1="144" x2="265" y2="144" stroke={theme.colors.gray[500]} strokeWidth="2" />
      <line x1="110" y1="60" x2="110" y2="106" stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#eqConceptArrowE)" />
      <text x="120" y="70" fontSize="14" fontWeight={700} fill={theme.colors.error}>P</text>

      <text x="320" y="124" fontSize="22" textAnchor="middle" fill={theme.colors.text.light}>⇒</text>

      {/* FBD */}
      <text x="480" y="24" fontSize="13" fontWeight={700} textAnchor="middle" fill={theme.colors.text.secondary}>Free-body diagram</text>
      <line x1="380" y1="110" x2="580" y2="110" stroke={theme.colors.text.primary} strokeWidth="6" strokeLinecap="round" />
      <line x1="450" y1="60" x2="450" y2="106" stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#eqConceptArrowE)" />
      <text x="460" y="70" fontSize="14" fontWeight={700} fill={theme.colors.error}>P</text>
      <line x1="380" y1="170" x2="380" y2="116" stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#eqConceptArrowG)" />
      <text x="388" y="162" fontSize="13" fontWeight={700} fill={theme.colors.success}>A_y</text>
      <line x1="340" y1="110" x2="372" y2="110" stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#eqConceptArrowG)" />
      <text x="338" y="102" fontSize="13" fontWeight={700} fill={theme.colors.success}>Aₓ</text>
      <line x1="580" y1="170" x2="580" y2="116" stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#eqConceptArrowG)" />
      <text x="588" y="162" fontSize="13" fontWeight={700} fill={theme.colors.success}>B_y</text>

      <text x="320" y="214" fontSize="14" textAnchor="middle" fill={theme.colors.text.primary}>ΣFₓ = 0   ΣF_y = 0   ΣM = 0   →   solve for the reactions</text>
      <defs>
        <marker id="eqConceptArrowE" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
        <marker id="eqConceptArrowG" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.success} />
        </marker>
      </defs>
    </svg>
  )
}

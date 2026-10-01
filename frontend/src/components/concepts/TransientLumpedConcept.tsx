import { theme } from '../../styles/theme'

export default function TransientLumpedConcept() {
  const curve = Array.from({ length: 31 }, (_, i) => `${60 + i * 8},${30 + 130 * (1 - Math.exp(-i / 8))}`).join(' ')
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Hot body cooling exponentially toward the fluid temperature, with the Biot number comparing internal conduction and surface convection, diagram">
      <line x1="60" y1="20" x2="60" y2="180" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1="60" y1="180" x2="320" y2="180" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <polyline points={curve} fill="none" stroke={theme.colors.accent[600]} strokeWidth="3" />
      <line x1="60" y1="160" x2="320" y2="160" stroke={theme.colors.lightBlue[600]} strokeDasharray="4 4" />
      <text x="324" y="164" fontSize="11" fill={theme.colors.lightBlue[600]}>T∞</text>
      <text x="66" y="28" fontSize="11" fill={theme.colors.error}>T_i</text>
      <text x="190" y="198" textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>time  (63 % of the drop at t = τ)</text>

      {/* body: uniform vs gradient */}
      <circle cx="450" cy="70" r="40" fill={theme.colors.error} fillOpacity="0.45" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x="450" y="74" textAnchor="middle" fontSize="12">uniform T</text>
      <text x="450" y="128" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.success}>Bi &lt; 0.1</text>
      <circle cx="560" cy="70" r="40" fill={theme.colors.error} fillOpacity="0.15" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <circle cx="560" cy="70" r="16" fill={theme.colors.error} fillOpacity="0.6" />
      <text x="560" y="128" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.error}>Bi ≥ 0.1</text>
      <text x="505" y="160" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>Bi = (L_c/k) / (1/h)</text>
      <text x="505" y="178" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>internal conduction resistance</text>
      <text x="505" y="192" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>over surface convection resistance</text>
      <text x="320" y="228" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>T − T∞ = (T_i − T∞) e^(−t/τ),  τ = ρ c L_c / h</text>
    </svg>
  )
}

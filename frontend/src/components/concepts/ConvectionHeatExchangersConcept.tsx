import { theme } from '../../styles/theme'

export default function ConvectionHeatExchangersConcept() {
  return (
    <svg width="100%" height="250" viewBox="0 0 640 250" role="img" aria-label="Counterflow heat exchanger with hot and cold streams and the temperature profiles of each along its length, diagram">
      <rect x="40" y="40" width="260" height="30" fill={theme.colors.error} fillOpacity="0.2" stroke={theme.colors.error} strokeWidth="2" />
      <rect x="40" y="90" width="260" height="30" fill={theme.colors.lightBlue[200]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      <line x1="40" y1="80" x2="300" y2="80" stroke={theme.colors.gray[500]} strokeWidth="2" strokeDasharray="5 3" />
      <text x="170" y="60" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.error}>hot  →</text>
      <text x="170" y="110" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>←  cold</text>
      <text x="170" y="144" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>wall: U = 1/(1/h_i + 1/h_o)</text>

      {/* counterflow profiles */}
      <line x1="360" y1="20" x2="360" y2="150" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1="360" y1="150" x2="600" y2="150" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <path d="M360 35 Q 480 50 600 85" fill="none" stroke={theme.colors.error} strokeWidth="3" />
      <path d="M360 75 Q 480 105 600 125" fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
      <text x="606" y="88" fontSize="11" fill={theme.colors.error}>T_h,out</text>
      <text x="606" y="128" fontSize="11" fill={theme.colors.lightBlue[600]}>T_c,in</text>
      <text x="364" y="30" fontSize="11" fill={theme.colors.error}>T_h,in</text>
      <text x="364" y="70" fontSize="11" fill={theme.colors.lightBlue[600]}>T_c,out</text>
      <text x="480" y="168" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>position along exchanger</text>

      <text x="320" y="200" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>LMTD: Q = U A ΔT_lm,  ΔT_lm = (ΔT₁ − ΔT₂) / ln(ΔT₁/ΔT₂)</text>
      <text x="320" y="224" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>ε-NTU: Q = ε C_min (T_h,in − T_c,in),  NTU = UA / C_min</text>
    </svg>
  )
}

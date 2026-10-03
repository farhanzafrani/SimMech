import { theme } from '../../styles/theme'

export default function SecondLawConcept() {
  return (
    <svg width="100%" height="260" viewBox="0 0 640 260" role="img" aria-label="Heat engine between a hot and a cold reservoir: heat Q_H in, work W out, waste heat Q_L rejected, with entropy generated inside, diagram">
      <rect x="200" y="12" width="200" height="40" rx="4" fill={theme.colors.error} fillOpacity="0.15" stroke={theme.colors.error} strokeWidth="2" />
      <text x="300" y="37" textAnchor="middle" fontSize="14" fontWeight={700} fill={theme.colors.error}>Hot reservoir T_H</text>
      <rect x="200" y="208" width="200" height="40" rx="4" fill={theme.colors.lightBlue[200]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      <text x="300" y="233" textAnchor="middle" fontSize="14" fontWeight={700} fill={theme.colors.lightBlue[600]}>Cold reservoir T_L</text>

      <circle cx="300" cy="130" r="48" fill="white" stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x="300" y="126" textAnchor="middle" fontSize="14" fontWeight={700} fill={theme.colors.text.primary}>Engine</text>
      <text x="300" y="144" textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>cycle: ΔS = 0</text>

      <line x1="300" y1="54" x2="300" y2="80" stroke={theme.colors.error} strokeWidth="4" />
      <path d="M292 76 L300 88 L308 76 Z" fill={theme.colors.error} />
      <text x="312" y="70" fontSize="13" fill={theme.colors.error}>Q_H  (brings entropy Q_H/T_H)</text>

      <line x1="300" y1="180" x2="300" y2="206" stroke={theme.colors.lightBlue[600]} strokeWidth="4" />
      <path d="M292 200 L300 210 L308 200 Z" fill={theme.colors.lightBlue[600]} />
      <text x="312" y="196" fontSize="13" fill={theme.colors.lightBlue[600]}>Q_L  (must carry away ≥ Q_H·T_L/T_H)</text>

      <line x1="350" y1="130" x2="440" y2="130" stroke={theme.colors.accent[600]} strokeWidth="4" />
      <path d="M432 122 L446 130 L432 138 Z" fill={theme.colors.accent[600]} />
      <text x="448" y="126" fontSize="13" fill={theme.colors.accent[600]}>W = Q_H − Q_L</text>

      <text x="20" y="100" fontSize="13" fill={theme.colors.text.secondary}>Entropy cannot be destroyed:</text>
      <text x="20" y="120" fontSize="13" fill={theme.colors.text.secondary}>Q_L/T_L ≥ Q_H/T_H</text>
      <text x="20" y="150" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>η ≤ 1 − T_L / T_H</text>
      <text x="20" y="170" fontSize="12" fill={theme.colors.text.light}>(equality only if reversible)</text>
    </svg>
  )
}

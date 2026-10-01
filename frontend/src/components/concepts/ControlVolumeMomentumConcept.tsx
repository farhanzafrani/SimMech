import { theme } from '../../styles/theme'

export default function ControlVolumeMomentumConcept() {
  const hitX = 330
  const hitY = 110
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Control volume around a vane turning a jet, showing momentum flux in and out and the resulting force on the vane, diagram">
      {/* Control volume (dashed) */}
      <rect x="230" y="30" width="250" height="170" rx="10" fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="240" y="48" fontSize="12" fill={theme.colors.accent[600]}>control volume</text>

      {/* Incoming jet */}
      <rect x="40" y={hitY - 7} width={hitX - 40} height="14" fill={theme.colors.lightBlue[300]} />
      <text x="60" y={hitY - 16} fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>ṁ V in (momentum flux ρAV²)</text>

      {/* Turned jet, 150 degrees upward to the right-back for drama */}
      <line x1={hitX} y1={hitY} x2={hitX + 115} y2={hitY - 75} stroke={theme.colors.lightBlue[300]} strokeWidth="14" />
      <text x={hitX + 40} y={hitY - 92} fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>ṁ V out</text>

      {/* Vane */}
      <line x1={hitX - 2} y1={hitY + 2} x2={hitX + 60} y2={hitY - 38} stroke={theme.colors.text.primary} strokeWidth="5" strokeLinecap="round" />
      <circle cx={hitX} cy={hitY} r="5" fill={theme.colors.text.primary} />

      {/* Force on fluid and on vane */}
      <line x1={hitX} y1={hitY + 55} x2={hitX + 90} y2={hitY + 55} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#cvConceptArrow)" />
      <text x={hitX} y={hitY + 75} fontSize="13" fontWeight={700} fill={theme.colors.error}>F on vane = ṁ(V_in − V_out)</text>

      {/* Atmospheric pressure note */}
      <text x="40" y="190" fontSize="12" fill={theme.colors.text.secondary}>Free jet: p = p_atm on every face, so only</text>
      <text x="40" y="206" fontSize="12" fill={theme.colors.text.secondary}>momentum flux crossing the surface matters.</text>

      <defs>
        <marker id="cvConceptArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
      </defs>
    </svg>
  )
}

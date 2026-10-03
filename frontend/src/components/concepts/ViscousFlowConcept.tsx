import { theme } from '../../styles/theme'

export default function ViscousFlowConcept() {
  // Couette: linear profile. Poiseuille: parabolic profile.
  const cTop = 50
  const cBot = 190
  const cL = 40
  const cW = 120
  const cPts = [0, 0.25, 0.5, 0.75, 1].map((f) => `${cL + f * cW},${cBot - f * (cBot - cTop)}`)

  const pTop = 50
  const pBot = 190
  const pL = 380
  const pW = 130
  const pPts = Array.from({ length: 11 }, (_, i) => {
    const f = i / 10
    return `${pL + pW * 4 * f * (1 - f)},${pBot - f * (pBot - pTop)}`
  })

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Linear Couette and parabolic Poiseuille velocity profiles side by side, diagram">
      {/* Couette */}
      <text x="40" y="24" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Couette: moving plate</text>
      <line x1={cL - 10} y1={cTop} x2={cL + cW + 30} y2={cTop} stroke={theme.colors.text.primary} strokeWidth="5" />
      <line x1={cL - 10} y1={cBot} x2={cL + cW + 30} y2={cBot} stroke={theme.colors.text.primary} strokeWidth="5" />
      <path d={`M ${cL} ${cBot} L ${cPts.join(' L ')} Z`} fill={theme.colors.lightBlue[200]} fillOpacity="0.7" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      <line x1={cL + cW - 20} y1={cTop - 14} x2={cL + cW + 25} y2={cTop - 14} stroke={theme.colors.error} strokeWidth="2.5" markerEnd="url(#visConceptArrow)" />
      <text x={cL + cW + 30} y={cTop - 10} fontSize="12" fill={theme.colors.error}>U</text>
      <text x={cL} y={cBot + 24} fontSize="12" fill={theme.colors.text.secondary}>τ = μ U / h  (uniform)</text>

      {/* Poiseuille */}
      <text x="360" y="24" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Poiseuille: pressure-driven</text>
      <line x1={pL - 10} y1={pTop} x2={pL + pW + 30} y2={pTop} stroke={theme.colors.text.primary} strokeWidth="5" />
      <line x1={pL - 10} y1={pBot} x2={pL + pW + 30} y2={pBot} stroke={theme.colors.text.primary} strokeWidth="5" />
      <path d={`M ${pL} ${pBot} L ${pPts.join(' L ')} L ${pL} ${pTop} Z`} fill={theme.colors.lightBlue[200]} fillOpacity="0.7" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      <text x={pL + pW + 8} y={(pTop + pBot) / 2 + 4} fontSize="12" fill={theme.colors.accent[600]}>u_max = 2V</text>
      <text x={pL - 10} y={pBot + 24} fontSize="12" fill={theme.colors.text.secondary}>no slip at both walls, τ_w = ΔpD/4L (pipe)</text>

      <defs>
        <marker id="visConceptArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
      </defs>
    </svg>
  )
}

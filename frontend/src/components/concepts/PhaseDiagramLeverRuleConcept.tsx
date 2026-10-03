import { theme } from '../../styles/theme'

export default function PhaseDiagramLeverRuleConcept() {
  // Isomorphous (lens-shaped) binary diagram with a horizontal tie line.
  const left = 70
  const right = 330
  const top = 30
  const bottom = 200
  const tieY = 115
  const cL = 150 // liquid composition on the tie line
  const c0 = 205 // overall alloy
  const cA = 250 // solid-solution composition on the tie line
  return (
    <svg width="100%" height="270" viewBox="0 0 640 270" role="img" aria-label="Binary phase diagram with a tie line and the lever rule balance diagram">
      {/* Axes */}
      <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={left} y1={top} x2={left} y2={bottom} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x={(left + right) / 2} y={bottom + 28} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>Composition (wt% B)</text>
      <text x="18" y={(top + bottom) / 2} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary} transform={`rotate(-90 18 ${(top + bottom) / 2})`}>Temperature</text>

      {/* Liquidus and solidus */}
      <path d={`M ${left} ${top + 20} C 160 ${top + 30}, 260 ${top + 45}, ${right} ${top + 40}`} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="2.5" />
      <path d={`M ${left} ${top + 20} C 200 ${top + 90}, 280 ${top + 120}, ${right} ${top + 40}`} fill="none" stroke={theme.colors.lightBlue[700]} strokeWidth="2.5" />
      <text x={left + 40} y={top + 28} fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>L</text>
      <text x={right - 40} y={bottom - 60} fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>α</text>
      <text x="170" y={tieY + 38} fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>L + α</text>

      {/* Tie line, three composition drop lines */}
      <line x1={cL} y1={tieY} x2={cA} y2={tieY} stroke={theme.colors.error} strokeWidth="3" />
      {[cL, c0, cA].map((x) => (
        <line key={x} x1={x} y1={tieY} x2={x} y2={bottom} stroke={theme.colors.gray[500]} strokeDasharray="3 3" />
      ))}
      <circle cx={c0} cy={tieY} r="5" fill={theme.colors.error} />
      <text x={cL} y={bottom + 14} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>C_L</text>
      <text x={c0} y={bottom + 14} fontSize="12" textAnchor="middle" fontWeight={700} fill={theme.colors.error}>C₀</text>
      <text x={cA} y={bottom + 14} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>C_α</text>

      {/* Lever balance on the right */}
      <g transform="translate(380, 70)">
        <text x="0" y="-20" fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>Lever rule: the fulcrum is C₀</text>
        <line x1="0" y1="40" x2="230" y2="40" stroke={theme.colors.text.primary} strokeWidth="4" />
        <path d="M 90 40 L 80 62 L 100 62 Z" fill={theme.colors.error} />
        <circle cx="0" cy="30" r="12" fill={theme.colors.lightBlue[400]} />
        <text x="0" y="34" fontSize="10" textAnchor="middle" fill="white">L</text>
        <circle cx="230" cy="30" r="12" fill={theme.colors.accent[500]} />
        <text x="230" y="34" fontSize="10" textAnchor="middle" fill="white">α</text>
        <text x="45" y="84" fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>C₀ − C_L</text>
        <text x="160" y="84" fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>C_α − C₀</text>
        <text x="0" y="118" fontSize="12" fill={theme.colors.text.primary}>W_L = (C_α − C₀)/(C_α − C_L)</text>
        <text x="0" y="138" fontSize="12" fill={theme.colors.text.primary}>W_α = (C₀ − C_L)/(C_α − C_L)</text>
        <text x="0" y="160" fontSize="11" fill={theme.colors.text.secondary}>Opposite arm over the whole tie line.</text>
      </g>
    </svg>
  )
}

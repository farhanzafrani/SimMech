import { theme } from '../../styles/theme'

export default function BeltChainDrivesConcept() {
  const cx = 170
  const cy = 120
  const r = 60
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Belt wrapped around a pulley with tight-side tension T1, slack-side tension T2 and wrap angle theta, diagram">
      <circle cx={cx} cy={cy} r={r} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="3" fill={theme.colors.text.primary} />
      {/* Belt leaves vertically on both sides: wrap = pi on the lower half */}
      <line x1={cx - r} y1={cy} x2={cx - r} y2={20} stroke={theme.colors.gray[600]} strokeWidth="4" />
      <line x1={cx + r} y1={cy} x2={cx + r} y2={60} stroke={theme.colors.gray[600]} strokeWidth="4" />
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`} fill="none" stroke={theme.colors.gray[600]} strokeWidth="4" />
      <line x1={cx - r} y1={40} x2={cx - r} y2={14} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#beltConceptArrowE)" />
      <text x={cx - r - 10} y={30} fontSize="15" fontWeight={700} fill={theme.colors.error} textAnchor="end">T₁ (tight)</text>
      <line x1={cx + r} y1={80} x2={cx + r} y2={54} stroke={theme.colors.accent[600]} strokeWidth="2" markerEnd="url(#beltConceptArrowA)" />
      <text x={cx + r + 10} y={72} fontSize="15" fontWeight={700} fill={theme.colors.accent[600]}>T₂ (slack)</text>
      {/* Wrap angle arc */}
      <path d={`M ${cx - 28} ${cy + 18} A 32 32 0 0 0 ${cx + 28} ${cy + 18}`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" strokeDasharray="3 2" />
      <text x={cx} y={cy + 6} fontSize="14" textAnchor="middle" fill={theme.colors.accent[600]}>θ</text>

      {/* Tension build-up along the wrap */}
      <g transform="translate(360, 40)">
        <text x="0" y="14" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Capstan (Euler) equation</text>
        <text x="0" y="44" fontSize="18" fill={theme.colors.text.primary}>T₁ / T₂ = e^(μθ)</text>
        <text x="0" y="72" fontSize="12" fill={theme.colors.text.secondary}>Friction builds tension exponentially around the wrap.</text>
        <text x="0" y="92" fontSize="12" fill={theme.colors.text.secondary}>Power = (T₁ − T₂) v — only the difference works.</text>
        <text x="0" y="112" fontSize="12" fill={theme.colors.text.secondary}>Chains engage teeth: no slip, so no capstan limit.</text>
      </g>
      <defs>
        <marker id="beltConceptArrowE" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
        <marker id="beltConceptArrowA" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
      </defs>
    </svg>
  )
}

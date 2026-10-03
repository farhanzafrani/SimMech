import { theme } from '../../styles/theme'

export default function StaticsFrictionConcept() {
  // Friction cone: resultant contact force lies within angle phi of the normal
  const ox = 160
  const oy = 190
  const len = 130
  const phi = (30 * Math.PI) / 180
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Friction cone: at impending slip the contact resultant leans from the surface normal by the friction angle phi, diagram">
      <line x1="40" y1={oy} x2="300" y2={oy} stroke={theme.colors.text.primary} strokeWidth="4" />
      {/* Cone */}
      <polygon points={`${ox},${oy} ${ox - len * Math.sin(phi)},${oy - len * Math.cos(phi)} ${ox + len * Math.sin(phi)},${oy - len * Math.cos(phi)}`} fill={theme.colors.lightBlue[100]} fillOpacity="0.8" stroke={theme.colors.lightBlue[600]} strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Normal */}
      <line x1={ox} y1={oy} x2={ox} y2={oy - len} stroke={theme.colors.gray[500]} strokeWidth="2" markerEnd="url(#fricConceptArrowN)" />
      <text x={ox + 6} y={oy - len + 10} fontSize="13" fill={theme.colors.gray[600]}>N</text>
      {/* Resultant at impending slip */}
      <line x1={ox} y1={oy} x2={ox + len * Math.sin(phi)} y2={oy - len * Math.cos(phi)} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#fricConceptArrowE)" />
      <text x={ox + len * Math.sin(phi) + 6} y={oy - len * Math.cos(phi) + 4} fontSize="13" fontWeight={700} fill={theme.colors.error}>R</text>
      {/* Friction component */}
      <line x1={ox} y1={oy + 12} x2={ox + len * Math.sin(phi)} y2={oy + 12} stroke={theme.colors.accent[600]} strokeWidth="2" markerEnd="url(#fricConceptArrowA)" />
      <text x={ox + len * Math.sin(phi) / 2} y={oy + 28} fontSize="12" textAnchor="middle" fill={theme.colors.accent[600]}>F = μN</text>
      <text x={ox + 14} y={oy - 40} fontSize="13" fill={theme.colors.error}>φ</text>

      <g transform="translate(360, 40)">
        <text x="0" y="14" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Impending slip</text>
        <text x="0" y="44" fontSize="18" fill={theme.colors.text.primary}>F = μₛ N,   tan φ = μₛ</text>
        <text x="0" y="72" fontSize="12" fill={theme.colors.text.secondary}>Below the limit friction only supplies what equilibrium needs.</text>
        <text x="0" y="92" fontSize="12" fill={theme.colors.text.secondary}>Wedge self-locks if θ ≤ 2φ; incline holds if α ≤ φ.</text>
        <text x="0" y="112" fontSize="12" fill={theme.colors.text.secondary}>Rope on a post: T₁/T₂ = e^(μβ).</text>
      </g>
      <defs>
        <marker id="fricConceptArrowN" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={theme.colors.gray[500]} /></marker>
        <marker id="fricConceptArrowE" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} /></marker>
        <marker id="fricConceptArrowA" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} /></marker>
      </defs>
    </svg>
  )
}

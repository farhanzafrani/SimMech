import { theme } from '../../styles/theme'

export default function StaticsCentroidsConcept() {
  // T-section: flange on web, with part centroids and the composite centroid
  const x0 = 60
  const flange = { x: x0, y: 40, w: 150, h: 30 }
  const web = { x: x0 + 60, y: 70, w: 30, h: 120 }
  const cx = x0 + 75
  const yBar = 120
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="T-section split into a flange and a web with part centroids and the composite centroid, parallel-axis diagram">
      <rect x={flange.x} y={flange.y} width={flange.w} height={flange.h} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <rect x={web.x} y={web.y} width={web.w} height={web.h} fill={theme.colors.lightBlue[200]} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <circle cx={cx} cy={flange.y + flange.h / 2} r="3.5" fill={theme.colors.accent[600]} />
      <circle cx={cx} cy={web.y + web.h / 2} r="3.5" fill={theme.colors.accent[600]} />
      <text x={cx + 90} y={flange.y + flange.h / 2 + 4} fontSize="11" fill={theme.colors.accent[600]}>A₁, y₁</text>
      <text x={cx + 30} y={web.y + web.h / 2 + 4} fontSize="11" fill={theme.colors.accent[600]}>A₂, y₂</text>
      <line x1={x0 - 10} y1={yBar} x2={x0 + 170} y2={yBar} stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="5 3" />
      <circle cx={cx} cy={yBar} r="5" fill={theme.colors.error} />
      <text x={x0 + 176} y={yBar + 4} fontSize="12" fontWeight={700} fill={theme.colors.error}>ȳ (neutral axis)</text>
      <line x1={x0 + 175} y1={yBar} x2={x0 + 175} y2={flange.y + flange.h / 2} stroke={theme.colors.gray[500]} strokeWidth="1" />
      <text x={x0 + 180} y={(yBar + flange.y + flange.h / 2) / 2} fontSize="11" fill={theme.colors.gray[600]}>d₁</text>

      <g transform="translate(360, 40)">
        <text x="0" y="14" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Composite section recipe</text>
        <text x="0" y="44" fontSize="16" fill={theme.colors.text.primary}>ȳ = ΣAᵢyᵢ / ΣAᵢ</text>
        <text x="0" y="74" fontSize="16" fill={theme.colors.text.primary}>I = Σ ( Iᵢ + Aᵢ dᵢ² )</text>
        <text x="0" y="102" fontSize="12" fill={theme.colors.text.secondary}>Parallel-axis: far-from-axis material counts as d².</text>
        <text x="0" y="122" fontSize="12" fill={theme.colors.text.secondary}>Holes enter with negative area and negative I.</text>
        <text x="0" y="142" fontSize="12" fill={theme.colors.text.secondary}>This I feeds directly into σ = M c / I in beam bending.</text>
      </g>
    </svg>
  )
}

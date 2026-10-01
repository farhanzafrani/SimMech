import { theme } from '../../styles/theme'

export default function BoundaryLayerConcept() {
  const x0 = 60
  const x1 = 560
  const y = 190
  // delta ~ sqrt(x): thickness profile
  const pts = Array.from({ length: 21 }, (_, i) => {
    const f = i / 20
    return `${x0 + f * (x1 - x0)},${y - 70 * Math.sqrt(f)}`
  })
  // Velocity profile at x = 0.8 L
  const fx = 0.8
  const px = x0 + fx * (x1 - x0)
  const dpx = 70 * Math.sqrt(fx)
  const prof = Array.from({ length: 11 }, (_, i) => {
    const e = i / 10
    const u = 1 - (1 - e) ** 2
    return `${px + 55 * u},${y - e * dpx}`
  })

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Boundary layer thickness growing along a flat plate with a velocity profile that rises from zero at the wall to the free-stream speed, diagram">
      {[60, 95, 130].map((yy) => (
        <g key={yy}>
          <line x1="14" y1={yy} x2="50" y2={yy} stroke={theme.colors.gray[400]} strokeWidth="1.5" />
          <path d={`M 50 ${yy} l -6 -4 m 6 4 l -6 4`} stroke={theme.colors.gray[400]} strokeWidth="1.5" fill="none" />
        </g>
      ))}
      <text x="14" y="46" fontSize="12" fill={theme.colors.text.secondary}>free stream U</text>

      <path d={`M ${x0} ${y} L ${pts.join(' L ')} L ${x1} ${y} Z`} fill={theme.colors.lightBlue[200]} fillOpacity="0.5" stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      <line x1={x0} y1={y + 2} x2={x1} y2={y + 2} stroke={theme.colors.text.primary} strokeWidth="5" />

      {/* Velocity profile arrows */}
      <polyline points={prof.join(' ')} fill="none" stroke={theme.colors.accent[600]} strokeWidth="2.5" />
      <line x1={px} y1={y} x2={px} y2={y - dpx} stroke={theme.colors.gray[500]} strokeWidth="1" strokeDasharray="3 3" />
      <text x={px + 62} y={y - dpx + 4} fontSize="12" fill={theme.colors.accent[600]}>u = 0.99 U at y = δ</text>
      <text x={px - 8} y={y + 22} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>u = 0 at the wall</text>

      <text x={x0 + 10} y={y - 6 - 70 * Math.sqrt(0.1)} fontSize="12" fill={theme.colors.lightBlue[600]}>δ ∝ √x (laminar)</text>
      <text x={(x0 + x1) / 2} y={y + 28} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>Re_x = U x / ν grows with distance; thickness drawn exaggerated</text>
    </svg>
  )
}

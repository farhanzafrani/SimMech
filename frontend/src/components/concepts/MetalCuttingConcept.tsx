import { theme } from '../../styles/theme'

export default function MetalCuttingConcept() {
  // Orthogonal cutting, tool moving left: the uncut layer (thickness t0) is
  // sheared along a plane at angle phi and the chip rides up the rake face.
  const deg = (d: number) => (d * Math.PI) / 180
  const alpha = deg(12)
  const phi = deg(35)
  const A = { x: 320, y: 160 } // tool tip
  const t0 = 44
  const surfaceY = A.y - t0
  const B = { x: A.x - t0 / Math.tan(phi), y: surfaceY } // shear plane meets the uncut surface
  const L = 95
  const u = { x: Math.sin(alpha), y: -Math.cos(alpha) } // up the rake face
  const A2 = { x: A.x + L * u.x, y: A.y + L * u.y }
  const B2 = { x: B.x + L * u.x, y: B.y + L * u.y }
  const toolTop = { x: A.x + 125 * u.x, y: A.y + 125 * u.y }

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Orthogonal metal cutting: tool, shear plane at angle phi, chip and rake angle alpha diagram">
      {/* Workpiece: uncut surface left, machined surface right of the tip */}
      <polygon points={`40,${surfaceY} ${B.x},${B.y} ${A.x},${A.y} 580,${A.y} 580,225 40,225`} fill={theme.colors.gray[200]} stroke={theme.colors.text.primary} strokeWidth="1.5" />

      {/* Chip */}
      <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${B2.x},${B2.y} ${A2.x},${A2.y}`} fill={theme.colors.lightBlue[300]} fillOpacity="0.85" stroke={theme.colors.lightBlue[700]} strokeWidth="1.5" />
      <text x={B2.x - 8} y={B2.y + 22} fontSize="12" fill={theme.colors.lightBlue[700]} textAnchor="end">chip (t_c)</text>

      {/* Tool wedge */}
      <polygon points={`${A.x},${A.y} ${toolTop.x},${toolTop.y} ${toolTop.x + 130},${toolTop.y} ${A.x + 150},${A.y - 12}`} fill={theme.colors.text.primary} fillOpacity="0.85" />
      <text x={A.x + 70} y={A.y - 55} fontSize="12" fill="white">tool</text>

      {/* Shear plane */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={theme.colors.success} strokeWidth="3" strokeDasharray="6 3" />
      <text x={B.x - 6} y={B.y - 8} fontSize="12" fontWeight={700} fill={theme.colors.success} textAnchor="end">shear plane</text>
      {/* phi: angle between machined-surface direction (left) and shear plane */}
      <path d={`M ${A.x - 38} ${A.y} A 38 38 0 0 1 ${A.x - 38 * Math.cos(phi)} ${A.y - 38 * Math.sin(phi)}`} fill="none" stroke={theme.colors.success} strokeWidth="1.5" />
      <text x={A.x - 58} y={A.y - 10} fontSize="13" fontWeight={700} fill={theme.colors.success}>φ</text>

      {/* alpha: between the vertical and the rake face */}
      <line x1={A.x} y1={A.y} x2={A.x} y2={A.y - 100} stroke={theme.colors.gray[500]} strokeDasharray="3 3" />
      <path d={`M ${A.x} ${A.y - 50} A 50 50 0 0 1 ${A.x + 50 * Math.sin(alpha)} ${A.y - 50 * Math.cos(alpha)}`} fill="none" stroke={theme.colors.accent[600]} strokeWidth="1.5" />
      <text x={A.x + 12} y={A.y - 56} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>α</text>

      {/* Uncut thickness dimension */}
      <line x1="90" y1={surfaceY} x2="90" y2={A.y} stroke={theme.colors.accent[600]} strokeWidth="1.5" />
      <line x1="80" y1={surfaceY} x2="100" y2={surfaceY} stroke={theme.colors.accent[600]} strokeWidth="1.5" />
      <line x1="80" y1={A.y} x2="100" y2={A.y} stroke={theme.colors.accent[600]} strokeWidth="1.5" />
      <text x="106" y={(surfaceY + A.y) / 2 + 4} fontSize="12" fill={theme.colors.accent[600]}>t₀</text>

      {/* Cutting velocity (tool moves left) */}
      <line x1="500" y1="48" x2="440" y2="48" stroke={theme.colors.error} strokeWidth="3" />
      <path d="M 440 41 L 426 48 L 440 55 Z" fill={theme.colors.error} />
      <text x="506" y="53" fontSize="13" fontWeight={700} fill={theme.colors.error}>V</text>

      <text x="40" y="22" fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>Merchant: φ = 45° + α/2 − β/2</text>
      <text x="40" y="38" fontSize="11" fill={theme.colors.text.secondary}>chip ratio r = t₀/t_c = sin φ / cos(φ − α)</text>
    </svg>
  )
}

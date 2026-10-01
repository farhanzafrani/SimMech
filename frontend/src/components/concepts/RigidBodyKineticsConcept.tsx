import { theme } from '../../styles/theme'

export default function RigidBodyKineticsConcept() {
  // Free-body diagram of a rolling cylinder on a 25 degree incline
  const th = (25 * Math.PI) / 180
  const cx = 250
  const cy = 120
  const r = 42
  const n = { x: Math.sin(th), y: -Math.cos(th) } // outward normal
  const d = { x: Math.cos(th), y: Math.sin(th) } // down-slope
  const contact = { x: cx - n.x * r, y: cy - n.y * r }

  const arrow = (x1: number, y1: number, x2: number, y2: number, color: string, label: string, lx: number, ly: number) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" markerEnd="url(#rbkArrow)" />
      <text x={lx} y={ly} fontSize="14" fontWeight={700} fill={color}>{label}</text>
    </g>
  )

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Free-body diagram of a cylinder rolling down an incline showing weight, normal force, friction, and angular acceleration, diagram">
      <defs>
        <marker id="rbkArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.text.primary} />
        </marker>
      </defs>
      {/* incline */}
      <line x1={cx - d.x * 230} y1={contact.y - d.y * 230} x2={cx + d.x * 200} y2={contact.y + d.y * 200} stroke={theme.colors.text.primary} strokeWidth="3" />

      {/* body */}
      <circle cx={cx} cy={cy} r={r} fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="3" fill={theme.colors.text.primary} />
      <text x={cx - 18} y={cy + 20} fontSize="11" fill={theme.colors.text.secondary}>G</text>

      {/* forces */}
      {arrow(cx, cy, cx, cy + 75, theme.colors.error, 'mg', cx + 8, cy + 82)}
      {arrow(contact.x, contact.y, contact.x + n.x * 70, contact.y + n.y * 70, theme.colors.success, 'N', contact.x + n.x * 70 + 6, contact.y + n.y * 70)}
      {arrow(contact.x, contact.y, contact.x - d.x * 70, contact.y - d.y * 70, theme.colors.warning, 'f', contact.x - d.x * 70 - 14, contact.y - d.y * 70 - 6)}

      {/* acceleration + alpha */}
      {arrow(cx, cy, cx + d.x * 60, cy + d.y * 60, theme.colors.accent[600], 'a_G', cx + d.x * 60 + 6, cy + d.y * 60 + 12)}
      <path d={`M ${cx - 22} ${cy - 8} A 24 24 0 1 1 ${cx - 8} ${cy - 22}`} fill="none" stroke={theme.colors.spectrum.violet} strokeWidth="2.5" markerEnd="url(#rbkArrow)" />
      <text x={cx - 6} y={cy - 4} fontSize="12" fontWeight={700} fill={theme.colors.spectrum.violet}>α</text>

      {/* equations panel */}
      <g transform="translate(400, 30)">
        <rect width="225" height="170" rx="10" fill={theme.colors.lightBlue[50]} stroke={theme.colors.lightBlue[200]} />
        <text x="14" y="26" fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>Two equations about G</text>
        <text x="14" y="52" fontSize="13" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.text.primary}>ΣF∥ : mg sinθ − f = m a_G</text>
        <text x="14" y="76" fontSize="13" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.text.primary}>ΣM_G: f r = I_G α</text>
        <text x="14" y="104" fontSize="12" fill={theme.colors.text.secondary}>Rolling constraint</text>
        <text x="14" y="124" fontSize="13" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.text.primary}>a_G = α r</text>
        <text x="14" y="152" fontSize="12" fill={theme.colors.text.light}>⇒ a_G = g sinθ / (1 + I_G/mr²)</text>
      </g>
    </svg>
  )
}

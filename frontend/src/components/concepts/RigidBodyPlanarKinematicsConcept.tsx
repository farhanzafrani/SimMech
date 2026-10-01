import { theme } from '../../styles/theme'

// A wheel rolling without slipping. The ground contact point is the
// instantaneous center of rotation (IC) — momentarily at rest. Every other
// point's speed is omega times its distance from the IC, so the top of the
// wheel moves at 2x the center's speed while the contact point itself has
// zero velocity.
export default function RigidBodyPlanarKinematicsConcept() {
  const center = { x: 230, y: 150 }
  const radius = 90
  const groundY = center.y + radius

  const top = { x: center.x, y: center.y - radius }
  const side = { x: center.x + radius, y: center.y }
  const ic = { x: center.x, y: groundY }

  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 460 300"
      role="img"
      aria-label="A wheel rolling without slipping, showing the instantaneous center at the ground contact point, with velocity vectors at the top, side, and center of the wheel scaled by distance from that center"
    >
      {/* Ground */}
      <line x1="20" y1={groundY} x2="440" y2={groundY} stroke={theme.colors.gray[400]} strokeWidth="2" />
      <text x="20" y={groundY + 20} fontSize="11" fill={theme.colors.text.light}>
        ground (no slipping)
      </text>

      {/* Wheel */}
      <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke={theme.colors.gray[500]} strokeWidth="2.5" />
      <circle cx={center.x} cy={center.y} r="3" fill={theme.colors.text.primary} />

      {/* Spokes to top / side / IC to show distances */}
      <line x1={center.x} y1={center.y} x2={top.x} y2={top.y} stroke={theme.colors.gray[300]} strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1={center.x} y1={center.y} x2={side.x} y2={side.y} stroke={theme.colors.gray[300]} strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1={center.x} y1={center.y} x2={ic.x} y2={ic.y} stroke={theme.colors.gray[300]} strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Instantaneous center marker */}
      <circle cx={ic.x} cy={ic.y} r="5" fill={theme.colors.lightBlue[500]} />
      <text x={ic.x + 10} y={ic.y + 4} fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>
        IC (v = 0)
      </text>

      {/* Velocity at top — 2x center velocity, longest arrow */}
      <line x1={top.x} y1={top.y} x2={top.x + 90} y2={top.y} stroke={theme.colors.accent[500]} strokeWidth="3.5" markerEnd="url(#rbTopArrow)" />
      <text x={top.x + 96} y={top.y + 4} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>
        2v_c (top)
      </text>

      {/* Velocity at side — center speed * sqrt(2), at 45 degrees */}
      <line x1={side.x} y1={side.y} x2={side.x + 55} y2={side.y - 55} stroke={theme.colors.success} strokeWidth="3" markerEnd="url(#rbSideArrow)" />
      <text x={side.x + 60} y={side.y - 55} fontSize="12" fontWeight={700} fill={theme.colors.success}>
        v_c√2 (side)
      </text>

      {/* Velocity at center */}
      <line x1={center.x} y1={center.y} x2={center.x + 55} y2={center.y} stroke={theme.colors.text.primary} strokeWidth="2.5" markerEnd="url(#rbCenterArrow)" />
      <text x={center.x + 20} y={center.y - 8} fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>
        v_c
      </text>

      <text x={14} y="24" fontSize="12.5" fill={theme.colors.text.secondary}>
        v = ω × (distance from IC) — every point's speed scales with how far it is from the contact point
      </text>

      <defs>
        <marker id="rbTopArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.accent[500]} />
        </marker>
        <marker id="rbSideArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.success} />
        </marker>
        <marker id="rbCenterArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.text.primary} />
        </marker>
      </defs>
    </svg>
  )
}

import { theme } from '../../styles/theme'

// A particle moving along a curved path, at the instant it passes through
// point P. Its acceleration splits into two perpendicular pieces: the
// tangential component a_t (along the path — speeding up or slowing down)
// and the normal component a_n (perpendicular to the path, always pointing
// toward the path's center of curvature — the "turning" piece). The two
// add as vectors to give the true total acceleration a.
export default function ParticleKinematicsConcept() {
  const center = { x: 340, y: 230 }
  const radius = 140
  const particle = { x: 219, y: 160 }

  const tangentEnd = { x: 254, y: 99 }
  const normalEnd = { x: 279, y: 195 } // partway toward center — continuing this direction reaches `center` exactly
  const resultantEnd = { x: 303, y: 172 }

  const arcStart = { x: 202, y: 254 }
  const arcEnd = { x: 292, y: 98 }

  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 460 300"
      role="img"
      aria-label="A particle on a curved path with its acceleration split into a tangential component along the path and a normal component pointing toward the center of curvature"
    >
      {/* Center of curvature */}
      <circle cx={center.x} cy={center.y} r="3" fill={theme.colors.text.light} />
      <text x={center.x + 8} y={center.y + 4} fontSize="11" fill={theme.colors.text.light}>
        center of curvature
      </text>

      {/* Radius line from the particle to the center — shows what a_n points toward */}
      <line
        x1={particle.x}
        y1={particle.y}
        x2={center.x}
        y2={center.y}
        stroke={theme.colors.gray[400]}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text x={(particle.x + center.x) / 2 + 10} y={(particle.y + center.y) / 2 + 4} fontSize="11" fill={theme.colors.text.light}>
        ρ
      </text>

      {/* The curved path itself */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${radius} ${radius} 0 0 1 ${arcEnd.x} ${arcEnd.y}`}
        fill="none"
        stroke={theme.colors.gray[500]}
        strokeWidth="2.5"
      />

      {/* The particle */}
      <circle cx={particle.x} cy={particle.y} r="6" fill={theme.colors.text.primary} />
      <text x={particle.x - 14} y={particle.y + 20} fontSize="12" fill={theme.colors.text.primary} fontWeight={700}>
        P
      </text>

      {/* Tangential acceleration — along the direction of travel */}
      <line
        x1={particle.x}
        y1={particle.y}
        x2={tangentEnd.x}
        y2={tangentEnd.y}
        stroke={theme.colors.accent[500]}
        strokeWidth="3.5"
        markerEnd="url(#pkTangentArrow)"
      />
      <text x={tangentEnd.x + 6} y={tangentEnd.y - 4} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>
        a_t
      </text>

      {/* Normal acceleration — toward the center of curvature */}
      <line
        x1={particle.x}
        y1={particle.y}
        x2={normalEnd.x}
        y2={normalEnd.y}
        stroke={theme.colors.lightBlue[500]}
        strokeWidth="3.5"
        markerEnd="url(#pkNormalArrow)"
      />
      <text x={normalEnd.x + 8} y={normalEnd.y + 14} fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>
        a_n
      </text>

      {/* Resultant total acceleration */}
      <line
        x1={particle.x}
        y1={particle.y}
        x2={resultantEnd.x}
        y2={resultantEnd.y}
        stroke={theme.colors.text.primary}
        strokeWidth="2.5"
        strokeDasharray="1 0"
        markerEnd="url(#pkResultantArrow)"
      />
      <text x={resultantEnd.x + 8} y={resultantEnd.y + 4} fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>
        a
      </text>

      <text x={14} y={20} fontSize="12.5" fill={theme.colors.text.secondary}>
        v (tangent direction) — the path itself shows where the particle has been
      </text>

      <defs>
        <marker id="pkTangentArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.accent[500]} />
        </marker>
        <marker id="pkNormalArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.lightBlue[500]} />
        </marker>
        <marker id="pkResultantArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.text.primary} />
        </marker>
      </defs>
    </svg>
  )
}

import { theme } from '../../styles/theme'

export default function BucklingConcept() {
  // Two identical slender columns under the same axial load P, buckling
  // sideways at their critical load. Same length and stiffness, different
  // end conditions — so a different effective length factor K and a very
  // different critical load, even though the columns look the same.
  const topY = 34
  const botY = 170
  const groundY = 176

  const col1X = 170 // pinned-pinned
  const col2X = 470 // fixed-free

  const hatchTicks = (cx: number, y: number, count = 6, spread = 34) =>
    Array.from({ length: count }).map((_, i) => {
      const x = cx - spread + (i * (spread * 2)) / (count - 1)
      return (
        <line
          key={i}
          x1={x}
          y1={y}
          x2={x - 7}
          y2={y + 10}
          stroke={theme.colors.gray[500]}
          strokeWidth="2"
        />
      )
    })

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Slender column buckling sideways under axial load, shown for pinned-pinned and fixed-free end conditions">
      {/* ---------- Column 1: pinned-pinned ---------- */}
      <text x={col1X} y="14" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>
        Pinned–Pinned
      </text>

      {/* Load arrow into the top pin */}
      <line x1={col1X} y1="17" x2={col1X} y2={topY - 3} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#bucklingArrow1)" />
      <text x={col1X + 10} y="26" fontSize="14" fontWeight={700} fill={theme.colors.accent[600]}>P</text>

      {/* Undeformed centerline (straight, before buckling) */}
      <line x1={col1X} y1={topY} x2={col1X} y2={botY} stroke={theme.colors.gray[400]} strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Buckled shape: classic half-sine mode shape */}
      <path
        d={`M ${col1X} ${topY} C ${col1X + 32} ${topY + 45}, ${col1X + 32} ${botY - 45}, ${col1X} ${botY}`}
        fill="none"
        stroke={theme.colors.lightBlue[600]}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Pin joints top and bottom: free to rotate, can't translate */}
      <circle cx={col1X} cy={topY} r="5" fill={theme.colors.bg.primary} stroke={theme.colors.text.primary} strokeWidth="2" />
      <circle cx={col1X} cy={botY} r="5" fill={theme.colors.bg.primary} stroke={theme.colors.text.primary} strokeWidth="2" />

      {/* Ground */}
      <line x1={col1X - 34} y1={groundY} x2={col1X + 34} y2={groundY} stroke={theme.colors.gray[600]} strokeWidth="3" />
      {hatchTicks(col1X, groundY)}

      <text x={col1X} y="204" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[700]}>
        K = 1
      </text>

      {/* ---------- Column 2: fixed-free ---------- */}
      <text x={col2X} y="14" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>
        Fixed–Free
      </text>

      {/* Load arrow onto the free top end */}
      <line x1={col2X} y1="17" x2={col2X} y2={topY - 3} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#bucklingArrow2)" />
      <text x={col2X + 10} y="26" fontSize="14" fontWeight={700} fill={theme.colors.accent[600]}>P</text>

      {/* Undeformed centerline */}
      <line x1={col2X} y1={topY} x2={col2X} y2={botY} stroke={theme.colors.gray[400]} strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Buckled shape: zero slope at the fixed base, maximum sway at the free tip */}
      <path
        d={`M ${col2X} ${botY} C ${col2X} ${botY - 70}, ${col2X + 12} ${topY + 16}, ${col2X + 16} ${topY}`}
        fill="none"
        stroke={theme.colors.accent[500]}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Free top end: no support marks, just the sheared-over tip */}
      <circle cx={col2X + 16} cy={topY} r="3.5" fill={theme.colors.accent[600]} />

      {/* Fixed base: full wall, no rotation and no translation */}
      <line x1={col2X - 34} y1={groundY} x2={col2X + 34} y2={groundY} stroke={theme.colors.gray[600]} strokeWidth="4" />
      {hatchTicks(col2X, groundY)}

      <text x={col2X} y="204" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>
        K = 2
      </text>

      {/* Caption */}
      <text x="320" y="224" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        Same column, same load P — a stiffer end condition (smaller K) raises the critical load
      </text>
      <text x="320" y="238" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        Failure is a sudden sideways bow, set by geometry — not a strength limit
      </text>

      <defs>
        <marker id="bucklingArrow1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
        <marker id="bucklingArrow2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
      </defs>
    </svg>
  )
}

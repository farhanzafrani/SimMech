import { theme } from '../../styles/theme'

// A closed system (a piston-cylinder of gas) exchanging heat and work with
// its surroundings. Whatever energy enters as heat Q, minus whatever
// leaves as work W done BY the system, has to show up as a change in the
// system's internal energy U — the first law's energy bookkeeping.
export default function FirstLawThermodynamicsConcept() {
  const box = { x: 150, y: 90, w: 160, h: 130 }
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2

  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 460 300"
      role="img"
      aria-label="A closed system boundary with heat Q entering from the left and work W leaving to the right, causing a change in internal energy U inside the boundary"
    >
      {/* System boundary */}
      <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="10" fill={theme.colors.bg.tertiary} stroke={theme.colors.text.primary} strokeWidth="2" strokeDasharray="6 4" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontWeight={700} fill={theme.colors.text.primary}>
        System
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        ΔU = Q − W
      </text>

      {/* Heat Q entering from left */}
      <line x1="40" y1={cy} x2={box.x - 6} y2={cy} stroke={theme.colors.accent[500]} strokeWidth="4" markerEnd="url(#flHeatArrow)" />
      <text x="30" y={cy - 14} fontSize="14" fontWeight={700} fill={theme.colors.accent[600]}>
        Q (heat in)
      </text>

      {/* Work W leaving to the right */}
      <line x1={box.x + box.w + 6} y1={cy} x2="420" y2={cy} stroke={theme.colors.lightBlue[500]} strokeWidth="4" markerEnd="url(#flWorkArrow)" />
      <text x={box.x + box.w + 14} y={cy - 14} fontSize="14" fontWeight={700} fill={theme.colors.lightBlue[600]}>
        W (work out)
      </text>

      {/* Temperature indicator */}
      <text x={cx} y={box.y + box.h + 30} textAnchor="middle" fontSize="12.5" fill={theme.colors.text.secondary}>
        Internal energy rises with temperature: ΔU = m·c_v·ΔT
      </text>

      <defs>
        <marker id="flHeatArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.accent[500]} />
        </marker>
        <marker id="flWorkArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.lightBlue[500]} />
        </marker>
      </defs>
    </svg>
  )
}

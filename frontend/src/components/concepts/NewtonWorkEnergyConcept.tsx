import { theme } from '../../styles/theme'

// A braking vehicle: shown at its starting position (moving at v1, with
// friction opposing that motion) and again — dashed — at the position
// where it comes to rest. The bracket between the two spans the stopping
// distance d, the one number both F=ma and the work-energy theorem are
// used to find.
export default function NewtonWorkEnergyConcept() {
  const groundY = 190
  const startX = 70
  const stopX = 330
  const carWidth = 70
  const carHeight = 32
  const wheelR = 9

  function car(x: number, opacity: number, dashed: boolean) {
    const bodyY = groundY - wheelR * 2 - carHeight
    return (
      <g opacity={opacity}>
        <rect
          x={x}
          y={bodyY}
          width={carWidth}
          height={carHeight}
          rx={6}
          fill={dashed ? 'none' : theme.colors.lightBlue[100]}
          stroke={theme.colors.text.primary}
          strokeWidth={dashed ? 1.5 : 2}
          strokeDasharray={dashed ? '5 4' : undefined}
        />
        <circle cx={x + 16} cy={groundY - wheelR} r={wheelR} fill={dashed ? 'none' : theme.colors.gray[600]} stroke={theme.colors.text.primary} strokeWidth={dashed ? 1.5 : 1.5} strokeDasharray={dashed ? '3 3' : undefined} />
        <circle cx={x + carWidth - 16} cy={groundY - wheelR} r={wheelR} fill={dashed ? 'none' : theme.colors.gray[600]} stroke={theme.colors.text.primary} strokeWidth={dashed ? 1.5 : 1.5} strokeDasharray={dashed ? '3 3' : undefined} />
      </g>
    )
  }

  const carTopY = groundY - wheelR * 2 - carHeight

  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 460 300"
      role="img"
      aria-label="A braking vehicle shown at its starting position moving at v1 with friction opposing motion, and again, dashed, at the position where it comes to rest, with the stopping distance bracketed between them"
    >
      {/* Ground */}
      <line x1={20} y1={groundY} x2={440} y2={groundY} stroke={theme.colors.text.primary} strokeWidth="2" />

      {/* Starting car, moving */}
      {car(startX, 1, false)}

      {/* Velocity arrow */}
      <line x1={startX + carWidth + 10} y1={carTopY + carHeight / 2} x2={startX + carWidth + 45} y2={carTopY + carHeight / 2} stroke={theme.colors.lightBlue[500]} strokeWidth="3" markerEnd="url(#nweVelocityArrow)" />
      <text x={startX + carWidth + 15} y={carTopY + carHeight / 2 - 8} fontSize="16" fontWeight={700} fill={theme.colors.lightBlue[600]}>v₁</text>

      {/* Friction arrow, opposing motion, at the contact patch */}
      <line x1={startX + carWidth / 2 + 25} y1={groundY + 22} x2={startX + carWidth / 2 - 15} y2={groundY + 22} stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#nweFrictionArrow)" />
      <text x={startX + carWidth / 2 + 5} y={groundY + 40} fontSize="13" fontWeight={600} fill={theme.colors.error} textAnchor="middle">f = μmg</text>

      {/* Stopped car (dashed, at rest) */}
      {car(stopX, 0.85, true)}
      <text x={stopX + carWidth / 2} y={carTopY - 10} fontSize="12" fill={theme.colors.text.light} textAnchor="middle">at rest</text>

      {/* Stopping distance bracket */}
      <line x1={startX + carWidth / 2} y1={groundY + 55} x2={stopX + carWidth / 2} y2={groundY + 55} stroke={theme.colors.text.secondary} strokeWidth="1.5" markerStart="url(#nweDistTick)" markerEnd="url(#nweDistTick)" />
      <text x={(startX + stopX) / 2 + carWidth / 2} y={groundY + 74} fontSize="14" fontWeight={600} fill={theme.colors.text.primary} textAnchor="middle">stopping distance d</text>

      <defs>
        <marker id="nweVelocityArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 z" fill={theme.colors.lightBlue[500]} />
        </marker>
        <marker id="nweFrictionArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 z" fill={theme.colors.error} />
        </marker>
        <marker id="nweDistTick" markerWidth="6" markerHeight="12" refX="3" refY="6" orient="auto">
          <path d="M3,0 L3,12" stroke={theme.colors.text.secondary} strokeWidth="1.5" />
        </marker>
      </defs>
    </svg>
  )
}

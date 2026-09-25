import { theme } from '../../styles/theme'

// A simple radial cutaway of a ball bearing: outer race, inner race, and a
// ring of balls between them. A radial load P pushes down on the inner
// race (as from a shaft), which squeezes the balls passing through the
// bottom of the ring — the "loaded zone." As the shaft turns, every ball
// cycles through that zone over and over, which is the repeated
// rolling-contact stress that eventually causes fatigue.
export default function BearingSelectionConcept() {
  const cx = 190
  const cy = 155

  const outerRadius = 110
  const outerBore = 82 // inner edge of the outer race ring
  const ballPitchRadius = 66 // center of the ball ring
  const ballRadius = 13
  const innerRaceOuter = 50 // outer edge of the inner race ring
  const shaftBore = 24

  const numBalls = 12
  const balls = Array.from({ length: numBalls }, (_, i) => {
    const angleDeg = (360 / numBalls) * i
    const angleRad = (angleDeg * Math.PI) / 180
    const x = cx + ballPitchRadius * Math.cos(angleRad)
    const y = cy + ballPitchRadius * Math.sin(angleRad)
    // Loaded zone: the arc of balls near the bottom of the ring, where the
    // downward-loaded inner race presses them against the outer race.
    const inLoadedZone = angleDeg >= 55 && angleDeg <= 125
    return { x, y, inLoadedZone }
  })

  return (
    <svg width="100%" height="300" viewBox="0 0 460 300" role="img" aria-label="Cutaway of a ball bearing with a radial load pushing down on the inner race, showing balls passing through the loaded zone at the bottom">
      {/* Outer race (fixed, e.g. pressed into a housing) */}
      <circle cx={cx} cy={cy} r={outerRadius} fill={theme.colors.gray[200]} stroke={theme.colors.text.primary} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={outerBore} fill={theme.colors.bg.primary} stroke={theme.colors.gray[500]} strokeWidth="1.5" />

      {/* Ball ring, sitting in the gap between outer bore and inner race */}
      {balls.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r={ballRadius}
          fill={b.inLoadedZone ? theme.colors.accent[500] : theme.colors.lightBlue[400]}
          stroke={theme.colors.text.primary}
          strokeWidth="1"
        />
      ))}

      {/* Inner race (rotates with the shaft) */}
      <circle cx={cx} cy={cy} r={innerRaceOuter} fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[700]} strokeWidth="2" />
      {/* Shaft bore */}
      <circle cx={cx} cy={cy} r={shaftBore} fill={theme.colors.gray[300]} stroke={theme.colors.gray[600]} strokeWidth="1.5" />
      {/* Shaft hatching to suggest a keyway/shaft cross-section */}
      <line x1={cx - shaftBore + 4} y1={cy} x2={cx + shaftBore - 4} y2={cy} stroke={theme.colors.gray[600]} strokeWidth="1" />
      <line x1={cx} y1={cy - shaftBore + 4} x2={cx} y2={cy + shaftBore - 4} stroke={theme.colors.gray[600]} strokeWidth="1" />

      {/* Radial load arrow pushing down on the inner race from above */}
      <line x1={cx} y1={cy - outerRadius - 55} x2={cx} y2={cy - innerRaceOuter - 4} stroke={theme.colors.error} strokeWidth="3.5" markerEnd="url(#bearingLoadArrow)" />
      <text x={cx + 12} y={cy - outerRadius - 25} fontSize="20" fontWeight={700} fill={theme.colors.error}>P</text>

      {/* Curved arrow showing the balls circulating through the loaded zone */}
      <path
        d={`M ${cx - ballPitchRadius - 4} ${cy - 8} A ${ballPitchRadius + 4} ${ballPitchRadius + 4} 0 0 1 ${cx + ballPitchRadius + 4} ${cy - 8}`}
        fill="none"
        stroke={theme.colors.gray[600]}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#bearingRotationArrow)"
      />

      {/* Callout to the loaded zone */}
      <line x1={cx + 20} y1={cy + ballPitchRadius + 4} x2={cx + 130} y2={cy + 92} stroke={theme.colors.text.light} strokeWidth="1" strokeDasharray="2 2" />
      <text x={352} y={92} fontSize="12.5" fill={theme.colors.accent[600]} fontWeight={600} textAnchor="middle">Loaded zone</text>
      <text x={352} y={109} fontSize="11" fill={theme.colors.text.secondary} textAnchor="middle">every ball rolls through</text>
      <text x={352} y={124} fontSize="11" fill={theme.colors.text.secondary} textAnchor="middle">here once per revolution</text>

      <text x={cx} y={cy - outerRadius - 66} textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>Radial load (shaft)</text>
      <text x={cx - outerRadius - 4} y={cy + 4} fontSize="11" fill={theme.colors.text.light} textAnchor="end">Outer race</text>
      <text x={cx} y={cy + shaftBore + 20} textAnchor="middle" fontSize="10.5" fill={theme.colors.text.light}>Inner race / shaft</text>

      <defs>
        <marker id="bearingLoadArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="6" orient="auto">
          <path d="M0,0 L9,0 L4.5,9 z" fill={theme.colors.error} />
        </marker>
        <marker id="bearingRotationArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.gray[600]} />
        </marker>
      </defs>
    </svg>
  )
}

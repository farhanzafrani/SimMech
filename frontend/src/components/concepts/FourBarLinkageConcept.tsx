import { theme } from '../../styles/theme'

export default function FourBarLinkageConcept() {
  // Fixed pivot points and a representative pose of the mechanism
  const ground = { x1: 100, y1: 180, x2: 420, y2: 180 }
  const A = { x: 140, y: 180 } // fixed pivot of crank
  const D = { x: 380, y: 180 } // fixed pivot of rocker
  const B = { x: 160, y: 80 } // crank end
  const C = { x: 340, y: 60 } // rocker end (coupler connects B-C)

  const link = (p1: { x: number; y: number }, p2: { x: number; y: number }, color: string, label: string) => (
    <>
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="5" strokeLinecap="round" />
      <text
        x={(p1.x + p2.x) / 2}
        y={(p1.y + p2.y) / 2 - 10}
        textAnchor="middle"
        fontSize="12"
        fontWeight={600}
        fill={color}
      >
        {label}
      </text>
    </>
  )

  return (
    <svg width="100%" height="240" viewBox="0 0 480 240" role="img" aria-label="Four-bar linkage schematic">
      {/* Ground link (fixed frame), hatched */}
      <line x1={ground.x1} y1={ground.y1} x2={ground.x2} y2={ground.y2} stroke={theme.colors.gray[500]} strokeWidth="4" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line
          key={i}
          x1={ground.x1 + i * 32}
          y1={ground.y1 + 10}
          x2={ground.x1 + i * 32 - 10}
          y2={ground.y1 + 20}
          stroke={theme.colors.gray[400]}
          strokeWidth="2"
        />
      ))}

      {link(A, B, theme.colors.error, 'Crank')}
      {link(B, C, theme.colors.lightBlue[600], 'Coupler')}
      {link(C, D, theme.colors.success, 'Rocker')}

      <text x={(A.x + D.x) / 2} y={ground.y1 + 32} textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>
        Ground link (fixed)
      </text>

      {/* Pivots */}
      {[A, D].map((p, i) => (
        <circle key={`fixed-${i}`} cx={p.x} cy={p.y} r="6" fill="white" stroke={theme.colors.gray[700]} strokeWidth="2" />
      ))}
      {[B, C].map((p, i) => (
        <circle key={`joint-${i}`} cx={p.x} cy={p.y} r="5" fill={theme.colors.gray[800]} />
      ))}
    </svg>
  )
}

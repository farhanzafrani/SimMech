import { theme } from '../../styles/theme'

// Fluid moving through a straight pipe loses pressure to wall friction
// along its length (head loss), and if the wall is hotter than the fluid,
// heat flows from the wall into the fluid by convection.
export default function PipeFlowHeatTransferConcept() {
  const pipeTop = 130
  const pipeBot = 180
  const pipeLeft = 60
  const pipeRight = 400
  const midY = (pipeTop + pipeBot) / 2

  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 460 300"
      role="img"
      aria-label="Fluid flowing through a straight pipe, losing pressure to friction along its length while heat flows inward from a hot pipe wall by convection"
    >
      {/* Pipe walls */}
      <line x1={pipeLeft} y1={pipeTop} x2={pipeRight} y2={pipeTop} stroke={theme.colors.text.primary} strokeWidth="3" />
      <line x1={pipeLeft} y1={pipeBot} x2={pipeRight} y2={pipeBot} stroke={theme.colors.text.primary} strokeWidth="3" />

      {/* Flow arrow through the pipe */}
      <line x1={pipeLeft + 20} y1={midY} x2={pipeRight - 30} y2={midY} stroke={theme.colors.lightBlue[500]} strokeWidth="3" markerEnd="url(#pfFlowArrow)" />
      <text x={(pipeLeft + pipeRight) / 2} y={midY - 12} textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>
        V, flow direction
      </text>

      {/* Heat arrows from the hot wall into the fluid */}
      {[130, 220, 310].map((x) => (
        <g key={`top-${x}`}>
          <line x1={x} y1={pipeTop - 24} x2={x} y2={pipeTop + 6} stroke={theme.colors.accent[500]} strokeWidth="2.5" markerEnd="url(#pfHeatArrow)" />
        </g>
      ))}
      <text x={pipeLeft} y={pipeTop - 34} fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>
        q&apos;&apos; = h (Ts − T∞) — heat into the fluid
      </text>
      <text x={pipeLeft} y={pipeTop - 18} fontSize="11" fill={theme.colors.text.light}>
        hot wall, Ts
      </text>

      {/* Head loss annotation along the bottom */}
      <line x1={pipeLeft} y1={pipeBot + 30} x2={pipeRight} y2={pipeBot + 30} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="4 3" />
      <text x={(pipeLeft + pipeRight) / 2} y={pipeBot + 50} textAnchor="middle" fontSize="12.5" fill={theme.colors.text.secondary}>
        Friction along length L drains pressure: head loss = f (L/D)(V²/2g)
      </text>

      <defs>
        <marker id="pfFlowArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.lightBlue[500]} />
        </marker>
        <marker id="pfHeatArrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.accent[500]} />
        </marker>
      </defs>
    </svg>
  )
}

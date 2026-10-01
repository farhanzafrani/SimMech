import { theme } from '../../styles/theme'

// A pipe narrowing from a wide section (A1) to a constriction (A2). Mass
// conservation forces the fluid to speed up where the pipe is narrower;
// Bernoulli's equation says that speeding up trades away pressure — the
// classic Venturi effect.
export default function FluidStaticsBernoulliConcept() {
  const y1Top = 80
  const y1Bot = 200
  const y2Top = 125
  const y2Bot = 155

  return (
    <svg
      width="100%"
      height="300"
      viewBox="0 0 460 300"
      role="img"
      aria-label="A pipe narrowing from a wide section to a constriction, with flow speeding up and pressure dropping at the narrow section per Bernoulli's equation"
    >
      {/* Pipe outline: wide -> narrow -> wide (symmetric venturi) */}
      <path
        d={`M 40 ${y1Top} L 170 ${y1Top} L 230 ${y2Top} L 320 ${y2Top} L 380 ${y1Top} L 380 ${y1Bot} L 320 ${y2Bot} L 230 ${y2Bot} L 170 ${y1Bot} L 40 ${y1Bot} Z`}
        fill={theme.colors.bg.tertiary}
        stroke={theme.colors.text.primary}
        strokeWidth="2.5"
      />

      {/* Section 1 label */}
      <line x1="90" y1={y1Top} x2="90" y2={y1Bot} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="3 3" />
      <text x="90" y={y1Top - 10} textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>
        A1, v1, p1
      </text>

      {/* Section 2 label */}
      <line x1="275" y1={y2Top} x2="275" y2={y2Bot} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="3 3" />
      <text x="275" y={y2Top - 10} textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.accent[600]}>
        A2, v2, p2
      </text>

      {/* Flow arrows — wide (slow, thick) */}
      <line x1="55" y1={(y1Top + y1Bot) / 2} x2="150" y2={(y1Top + y1Bot) / 2} stroke={theme.colors.lightBlue[500]} strokeWidth="3" markerEnd="url(#fbArrowWide)" />

      {/* Flow arrows — narrow (fast, thin but longer to suggest speed) */}
      <line x1="245" y1={(y2Top + y2Bot) / 2} x2="305" y2={(y2Top + y2Bot) / 2} stroke={theme.colors.accent[500]} strokeWidth="3" markerEnd="url(#fbArrowNarrow)" />

      <text x="230" y="255" textAnchor="middle" fontSize="12.5" fill={theme.colors.text.secondary}>
        Narrower area → faster flow (continuity) → lower pressure (Bernoulli)
      </text>

      <defs>
        <marker id="fbArrowWide" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.lightBlue[500]} />
        </marker>
        <marker id="fbArrowNarrow" markerWidth="10" markerHeight="10" refX="4.5" refY="5" orient="auto">
          <path d="M0,0 L9,5 L0,10 z" fill={theme.colors.accent[500]} />
        </marker>
      </defs>
    </svg>
  )
}

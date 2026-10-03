import { theme } from '../../styles/theme'

export default function FatigueAnalysisConcept() {
  // Schematic log-log S-N curve: stress amplitude drops steeply at low
  // cycle counts, then flattens out at the endurance limit S_e. A point
  // above the plateau eventually fails at some finite N_f; a point on
  // or below the plateau survives (illustrated as) forever.
  const originX = 90
  const originY = 210
  const axisTopY = 30
  const axisRightX = 590
  const plateauY = 165 // y-coordinate of the S_e plateau

  const curvePath = `M ${originX} 55 C 220 95, 320 150, 430 ${plateauY} L ${axisRightX} ${plateauY}`

  // Finite-life point sits on the steep part of the curve, above S_e.
  const finiteX = 230
  const finiteY = 118
  // Infinite-life point sits on the flat plateau, at or below S_e.
  const infiniteX = 500
  const infiniteY = plateauY

  return (
    <svg width="100%" height="260" viewBox="0 0 640 260" role="img" aria-label="S-N curve diagram showing stress amplitude versus cycles to failure, flattening at the endurance limit">
      {/* Axes */}
      <line x1={originX} y1={axisTopY} x2={originX} y2={originY} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={originX} y1={originY} x2={axisRightX} y2={originY} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x={(originX + axisRightX) / 2} y="248" textAnchor="middle" fontSize="13" fill={theme.colors.text.secondary}>
        log N (cycles to failure)
      </text>
      <text
        x="18"
        y={(axisTopY + originY) / 2}
        textAnchor="middle"
        fontSize="13"
        fill={theme.colors.text.secondary}
        transform={`rotate(-90, 18, ${(axisTopY + originY) / 2})`}
      >
        log σ_a (stress amplitude)
      </text>

      {/* Cycle-count tick labels */}
      {[
        { x: 150, label: '10³' },
        { x: 300, label: '10⁵' },
        { x: 430, label: '10⁶' },
        { x: 560, label: '10⁸' },
      ].map((t) => (
        <g key={t.x}>
          <line x1={t.x} y1={originY} x2={t.x} y2={originY + 5} stroke={theme.colors.text.primary} strokeWidth="1.5" />
          <text x={t.x} y={originY + 20} textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>{t.label}</text>
        </g>
      ))}

      {/* S-N curve */}
      <path d={curvePath} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="3" />

      {/* Endurance-limit plateau (dashed) */}
      <line x1={originX} y1={plateauY} x2={axisRightX} y2={plateauY} stroke={theme.colors.gray[500]} strokeWidth="1.5" strokeDasharray="6 4" />
      <text x={axisRightX} y={plateauY - 8} textAnchor="end" fontSize="12" fill={theme.colors.text.secondary}>S_e — endurance limit</text>

      {/* Finite-life point: above S_e, fails eventually */}
      <line x1={finiteX} y1={finiteY} x2={finiteX} y2={originY} stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1={originX} y1={finiteY} x2={finiteX} y2={finiteY} stroke={theme.colors.error} strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx={finiteX} cy={finiteY} r="6" fill={theme.colors.error} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x={finiteX + 10} y={finiteY - 10} fontSize="12" fontWeight={700} fill={theme.colors.error}>above S_e — fails at N_f</text>

      {/* Infinite-life point: on/below S_e, survives forever */}
      <circle cx={infiniteX} cy={infiniteY} r="6" fill={theme.colors.success} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x={infiniteX - 10} y={infiniteY - 12} textAnchor="end" fontSize="12" fontWeight={700} fill={theme.colors.success}>at/below S_e — survives forever</text>
      <path
        d={`M ${infiniteX + 12} ${infiniteY} L ${axisRightX - 6} ${infiniteY}`}
        fill="none"
        stroke={theme.colors.success}
        strokeWidth="2"
        markerEnd="url(#fatigueArrow)"
      />

      <defs>
        <marker id="fatigueArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.success} />
        </marker>
      </defs>
    </svg>
  )
}

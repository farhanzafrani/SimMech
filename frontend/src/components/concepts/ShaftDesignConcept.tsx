import { theme } from '../../styles/theme'

export default function ShaftDesignConcept() {
  // A stepped shaft: a larger-diameter section (left) supporting a
  // gear/pulley, necking down through a shoulder fillet to a smaller
  // section (right). The fillet is where stress concentrates.
  const leftX = 60
  const stepX = 300
  const filletEndX = 340
  const rightEndX = 520

  const leftTop = 70
  const leftBottom = 170
  const rightTop = 95
  const rightBottom = 145

  const centerY = 120
  const filletX = (stepX + filletEndX) / 2

  return (
    <svg width="100%" height="260" viewBox="0 0 640 260" role="img" aria-label="Stepped shaft under combined bending and torsion, with stress concentration at the shoulder fillet">
      {/* Support / bearing on the left */}
      <line x1={leftX} y1="50" x2={leftX} y2="190" stroke={theme.colors.gray[600]} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={i}
          x1={leftX - 10}
          y1={60 + i * 18}
          x2={leftX}
          y2={70 + i * 18}
          stroke={theme.colors.gray[500]}
          strokeWidth="2"
        />
      ))}

      {/* Large-diameter shaft section */}
      <rect x={leftX} y={leftTop} width={stepX - leftX} height={leftBottom - leftTop} rx="4" fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />

      {/* Shoulder fillet transition (the step down in diameter) */}
      <path
        d={`M ${stepX} ${leftTop} Q ${filletX} ${leftTop} ${filletEndX} ${rightTop}
            L ${filletEndX} ${rightBottom}
            Q ${filletX} ${leftBottom} ${stepX} ${leftBottom} Z`}
        fill={theme.colors.lightBlue[100]}
        stroke={theme.colors.lightBlue[600]}
        strokeWidth="2"
      />

      {/* Small-diameter shaft section */}
      <rect x={filletEndX} y={rightTop} width={rightEndX - filletEndX} height={rightBottom - rightTop} rx="4" fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />

      {/* Centerline */}
      <line x1={leftX - 20} y1={centerY} x2={rightEndX + 20} y2={centerY} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="6 4" />

      {/* Gear/pulley hung near the step, producing the bending moment M_a */}
      <rect x={stepX - 55} y={leftTop - 34} width="22" height="34" fill={theme.colors.gray[200]} stroke={theme.colors.gray[600]} strokeWidth="1.5" />
      <line x1={stepX - 44} y1={leftTop} x2={stepX - 44} y2={leftTop - 34} stroke={theme.colors.gray[600]} strokeWidth="2" />
      <path
        d={`M ${stepX - 44} 10 L ${stepX - 44} ${leftTop - 40}`}
        stroke={theme.colors.error}
        strokeWidth="3"
        markerEnd="url(#shaftBendArrow)"
      />
      <text x={stepX - 30} y="26" fontSize="16" fontWeight={700} fill={theme.colors.error}>M_a</text>
      <text x={stepX - 66} y="26" fontSize="10" fill={theme.colors.text.secondary}>(alternating, reverses each rev)</text>

      {/* Torque arrow (curved) applied at the small-diameter end */}
      <path
        d="M 570 100 A 26 26 0 1 1 570 160"
        fill="none"
        stroke={theme.colors.accent[500]}
        strokeWidth="3"
        markerEnd="url(#shaftTorqueArrow)"
      />
      <text x="600" y="134" fontSize="16" fontWeight={700} fill={theme.colors.accent[600]}>T_m</text>
      <text x="565" y="185" fontSize="10" fill={theme.colors.text.secondary}>(steady)</text>

      {/* Callout pointing at the fillet */}
      <line x1={filletX} y1={rightTop - 2} x2={filletX} y2="215" stroke={theme.colors.warning} strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx={filletX} cy={leftTop + 6} r="4" fill={theme.colors.warning} />
      <rect x={filletX - 95} y="216" width="190" height="34" rx="6" fill={theme.colors.bg.secondary} stroke={theme.colors.warning} strokeWidth="1.5" />
      <text x={filletX} y="230" textAnchor="middle" fontSize="11" fontWeight={700} fill={theme.colors.warning}>Stress concentrates here</text>
      <text x={filletX} y="244" textAnchor="middle" fontSize="10" fill={theme.colors.text.secondary}>shoulder fillet — K_t, K_f</text>

      <defs>
        <marker id="shaftBendArrow" markerWidth="10" markerHeight="10" refX="4" refY="8" orient="auto">
          <path d="M0,0 L8,0 L4,9 z" fill={theme.colors.error} />
        </marker>
        <marker id="shaftTorqueArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[500]} />
        </marker>
      </defs>
    </svg>
  )
}

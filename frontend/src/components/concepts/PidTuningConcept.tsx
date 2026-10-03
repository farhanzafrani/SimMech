import { theme } from '../../styles/theme'

export default function PidTuningConcept() {
  const box = (x: number, y: number, w: number, h: number, label: string, sub: string, color: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={theme.colors.lightBlue[50]} stroke={color} strokeWidth="2" />
      <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" fontSize="14" fontWeight={700} fill={color}>{label}</text>
      <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>{sub}</text>
    </g>
  )
  const line = (x1: number, y1: number, x2: number, y2: number, arrow = false) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.colors.text.primary} strokeWidth="2" markerEnd={arrow ? 'url(#pidcArrow)' : undefined} />
  )

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Block diagram of a PID feedback loop with parallel proportional, integral and derivative paths feeding a plant, diagram">
      <defs>
        <marker id="pidcArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.text.primary} />
        </marker>
      </defs>
      {/* reference and summing junction */}
      <text x="10" y="106" fontSize="14" fontWeight={700}>r</text>
      {line(24, 102, 62, 102, true)}
      <circle cx="75" cy="102" r="13" fill="white" stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x="69" y="98" fontSize="12">+</text>
      <text x="72" y="118" fontSize="14">−</text>
      <text x="100" y="94" fontSize="13" fontWeight={700}>e</text>
      {line(88, 102, 150, 102)}
      {/* fan out to P I D */}
      {line(150, 102, 150, 40)}
      {line(150, 102, 150, 164)}
      {line(150, 40, 175, 40, true)}
      {line(150, 102, 175, 102, true)}
      {line(150, 164, 175, 164, true)}
      {box(175, 22, 110, 36, 'Kp', 'proportional: present', theme.colors.lightBlue[600])}
      {box(175, 84, 110, 36, 'Kp / (Ti s)', 'integral: past', theme.colors.success)}
      {box(175, 146, 110, 36, 'Kp Td s', 'derivative: future', theme.colors.spectrum.coral)}
      {line(285, 40, 320, 40)}
      {line(285, 102, 320, 102)}
      {line(285, 164, 320, 164)}
      {line(320, 40, 320, 164)}
      <circle cx="335" cy="102" r="13" fill="white" stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x="329" y="107" fontSize="14" fontWeight={700}>Σ</text>
      {line(320, 102, 322, 102)}
      {line(348, 102, 385, 102, true)}
      <text x="360" y="94" fontSize="13" fontWeight={700}>u</text>
      {box(385, 80, 120, 44, 'Plant', 'K e^(−θs)/(τs+1)', theme.colors.gray[700])}
      {line(505, 102, 570, 102)}
      <text x="575" y="106" fontSize="14" fontWeight={700}>y</text>
      {/* feedback */}
      {line(540, 102, 540, 210)}
      {line(540, 210, 75, 210)}
      {line(75, 210, 75, 117, true)}
      <text x="300" y="228" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>measured output fed back (derivative acts on y to avoid setpoint kick)</text>
    </svg>
  )
}

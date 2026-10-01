import { theme } from '../../styles/theme'

export default function PowerCyclesConcept() {
  // Rankine: pump -> boiler -> turbine -> condenser
  const box = (x: number, y: number, w: number, h: number, label: string, color: string) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="white" stroke={color} strokeWidth="2.5" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="13" fontWeight={700} fill={color}>{label}</text>
    </g>
  )
  const arrow = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.colors.gray[500]} strokeWidth="2" markerEnd="url(#cycleArrow)" />
  )
  return (
    <svg width="100%" height="270" viewBox="0 0 640 270" role="img" aria-label="Rankine steam loop and Brayton gas-turbine loop, each with a pump or compressor, heat addition, a turbine, and heat rejection, diagram">
      <defs>
        <marker id="cycleArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.gray[500]} />
        </marker>
      </defs>

      <text x="150" y="20" textAnchor="middle" fontSize="14" fontWeight={700} fill={theme.colors.text.primary}>Rankine (steam)</text>
      {box(100, 36, 100, 40, 'Boiler', theme.colors.error)}
      {box(210, 100, 80, 50, 'Turbine', theme.colors.accent[600])}
      {box(100, 200, 100, 40, 'Condenser', theme.colors.lightBlue[600])}
      {box(10, 100, 70, 50, 'Pump', theme.colors.success)}
      {arrow(200, 56, 250, 56)}{arrow(250, 56, 250, 98)}
      {arrow(250, 152, 250, 220)}{arrow(250, 220, 202, 220)}
      {arrow(100, 220, 45, 220)}{arrow(45, 220, 45, 152)}
      {arrow(45, 98, 45, 56)}{arrow(45, 56, 98, 56)}
      <text x="150" y="258" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>pumping liquid costs ~1 % of turbine work</text>

      <text x="490" y="20" textAnchor="middle" fontSize="14" fontWeight={700} fill={theme.colors.text.primary}>Brayton (gas turbine)</text>
      {box(440, 36, 100, 40, 'Combustor', theme.colors.error)}
      {box(550, 100, 80, 50, 'Turbine', theme.colors.accent[600])}
      {box(440, 200, 100, 40, 'Exhaust', theme.colors.lightBlue[600])}
      {box(350, 100, 80, 50, 'Compressor', theme.colors.success)}
      {arrow(540, 56, 590, 56)}{arrow(590, 56, 590, 98)}
      {arrow(590, 152, 590, 220)}{arrow(590, 220, 542, 220)}
      {arrow(440, 220, 390, 220)}{arrow(390, 220, 390, 152)}
      {arrow(390, 98, 390, 56)}{arrow(390, 56, 438, 56)}
      <text x="490" y="258" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>compressing gas takes 40–60 % of turbine work</text>
    </svg>
  )
}

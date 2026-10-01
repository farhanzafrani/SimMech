import { theme } from '../../styles/theme'

export default function MaterialSelectionConcept() {
  // Schematic Ashby chart (log E vs log rho) with a slope-2 guideline for
  // the light stiff beam index M = E^(1/2)/rho. Bubbles are illustrative.
  const bubbles = [
    { label: 'Steels', x: 400, y: 70, rx: 38, ry: 18, c: theme.colors.gray[500] },
    { label: 'Ti alloys', x: 330, y: 105, rx: 26, ry: 14, c: theme.colors.lightBlue[500] },
    { label: 'Al alloys', x: 240, y: 135, rx: 30, ry: 15, c: theme.colors.accent[500] },
    { label: 'CFRP', x: 190, y: 95, rx: 28, ry: 17, c: theme.colors.success },
    { label: 'Polymers', x: 190, y: 200, rx: 36, ry: 15, c: theme.colors.warning },
    { label: 'Woods', x: 100, y: 160, rx: 30, ry: 15, c: theme.colors.lightBlue[300] },
  ]
  return (
    <svg width="100%" height="260" viewBox="0 0 640 260" role="img" aria-label="Schematic Ashby chart of modulus versus density with a performance-index guideline diagram">
      <line x1="60" y1="230" x2="480" y2="230" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1="60" y1="20" x2="60" y2="230" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x="270" y="252" fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>Density ρ (log)</text>
      <text x="18" y="130" fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary} transform="rotate(-90 18 130)">Modulus E (log)</text>

      {/* Guidelines: M = E^(1/2)/rho => slope 2 on log-log axes; better materials lie further up-left */}
      {[0, 70, 140].map((off) => (
        <line key={off} x1={90 + off} y1="230" x2={250 + off * 0.9} y2={230 - 160 - 0} stroke={theme.colors.success} strokeWidth="1.2" strokeDasharray="5 4" opacity={0.35 + off / 400} />
      ))}
      <text x="238" y="62" fontSize="11" fill={theme.colors.success}>M = E^½/ρ = const</text>
      <path d="M 120 190 L 70 150" stroke={theme.colors.success} strokeWidth="2" markerEnd="url(#matArrow)" fill="none" />
      <text x="72" y="140" fontSize="11" fontWeight={700} fill={theme.colors.success}>better</text>

      {bubbles.map((b) => (
        <g key={b.label}>
          <ellipse cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={b.c} fillOpacity="0.35" stroke={b.c} strokeWidth="1.5" />
          <text x={b.x} y={b.y + 4} fontSize="11" textAnchor="middle" fill={theme.colors.text.primary}>{b.label}</text>
        </g>
      ))}

      {/* Derivation panel */}
      <g transform="translate(500, 40)">
        <text x="0" y="0" fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>Beam derivation</text>
        <text x="0" y="20" fontSize="11" fill={theme.colors.text.secondary}>Stiffness S ∝ E·A²/L³</text>
        <text x="0" y="38" fontSize="11" fill={theme.colors.text.secondary}>→ A ∝ (S L³/E)^½</text>
        <text x="0" y="56" fontSize="11" fill={theme.colors.text.secondary}>Mass m = ρ A L</text>
        <text x="0" y="74" fontSize="11" fill={theme.colors.text.secondary}>→ m ∝ ρ / E^½</text>
        <text x="0" y="96" fontSize="12" fontWeight={700} fill={theme.colors.success}>maximise E^½/ρ</text>
      </g>

      <defs>
        <marker id="matArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill={theme.colors.success} />
        </marker>
      </defs>
    </svg>
  )
}

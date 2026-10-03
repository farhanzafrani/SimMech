import { theme } from '../../styles/theme'

export default function GearToothBendingConcept() {
  const baseY = 190
  const toothH = 110
  const rootW = 90
  const tipW = 40
  const cx = 170

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Gear tooth as a cantilever beam loaded at its tip, with tension on the loaded side of the root and compression on the other, diagram">
      <rect x={cx - 110} y={baseY} width={220} height={26} fill={theme.colors.gray[300]} />
      <polygon
        points={`${cx - rootW / 2},${baseY} ${cx + rootW / 2},${baseY} ${cx + tipW / 2},${baseY - toothH} ${cx - tipW / 2},${baseY - toothH}`}
        fill={theme.colors.lightBlue[100]}
        stroke={theme.colors.text.primary}
        strokeWidth="2"
      />
      {/* Tip load from the mating tooth */}
      <line x1={cx - tipW / 2 - 70} y1={baseY - toothH + 14} x2={cx - tipW / 2 - 3} y2={baseY - toothH + 14} stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#gearConceptArrow)" />
      <text x={cx - tipW / 2 - 72} y={baseY - toothH + 6} fontSize="15" fontWeight={700} fill={theme.colors.accent[600]} textAnchor="end">Wᵗ</text>
      {/* Root stresses: load pushes the tooth to the right, so the left root fibre is in tension */}
      <line x1={cx - rootW / 2} y1={baseY} x2={cx + rootW / 2} y2={baseY} stroke={theme.colors.error} strokeWidth="4" />
      <text x={cx - rootW / 2 - 8} y={baseY - 10} fontSize="12" fill={theme.colors.error} textAnchor="end">tension</text>
      <text x={cx + rootW / 2 + 8} y={baseY - 10} fontSize="12" fill={theme.colors.gray[600]}>compression</text>

      {/* Inset: beam analogy */}
      <g transform="translate(360, 40)">
        <rect x="0" y="40" width="20" height="100" fill={theme.colors.gray[400]} />
        <rect x="20" y="75" width="190" height="30" fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="1.5" />
        <line x1="210" y1="35" x2="210" y2="72" stroke={theme.colors.accent[600]} strokeWidth="3" markerEnd="url(#gearConceptArrow)" />
        <text x="218" y="48" fontSize="14" fontWeight={700} fill={theme.colors.accent[600]}>P</text>
        <text x="105" y="125" fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>σ = M c / I = 6 P L / (b t²)</text>
        <text x="105" y="145" fontSize="11" textAnchor="middle" fill={theme.colors.text.light}>Lewis packages this as σ = Wᵗ Pd / (F Y)</text>
      </g>
      <defs>
        <marker id="gearConceptArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
      </defs>
    </svg>
  )
}

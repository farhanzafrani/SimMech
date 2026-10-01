import { theme } from '../../styles/theme'

export default function SheetMetalBendingConcept() {
  // Bend cross-section: outer fibres stretch, inner fibres shorten, and the
  // neutral axis (at K*t from the inside) keeps its length -- so the flat
  // blank is shorter than the sum of the outside flanges. The dashed shape
  // is the overbent tool geometry; the part springs back to the solid one.
  const cx = 230
  const cy = 190
  const rIn = 50
  const t = 24
  const rOut = rIn + t
  const k = 0.4
  const rNeutral = rIn + k * t
  return (
    <svg width="100%" height="260" viewBox="0 0 640 260" role="img" aria-label="Sheet-metal bend showing neutral axis, tension on the outside, compression on the inside, and springback diagram">
      {/* Flange left and arc to vertical flange (90 degree bend) */}
      <path d={`M 60 ${cy + rIn} L ${cx} ${cy + rIn} A ${rIn} ${rIn} 0 0 0 ${cx + rIn} ${cy} L ${cx + rIn} 40 L ${cx + rOut} 40 L ${cx + rOut} ${cy} A ${rOut} ${rOut} 0 0 1 ${cx} ${cy + rOut} L 60 ${cy + rOut} Z`} fill={theme.colors.lightBlue[300]} fillOpacity="0.8" stroke={theme.colors.lightBlue[700]} strokeWidth="2" />
      {/* Neutral axis */}
      <path d={`M 60 ${cy + rNeutral} L ${cx} ${cy + rNeutral} A ${rNeutral} ${rNeutral} 0 0 0 ${cx + rNeutral} ${cy} L ${cx + rNeutral} 40`} fill="none" stroke={theme.colors.success} strokeWidth="2" strokeDasharray="6 3" />
      <text x="70" y={cy + rNeutral + 4} fontSize="11" fill={theme.colors.success}>neutral axis (K·t from inside)</text>

      {/* Bend centre and radius */}
      <circle cx={cx} cy={cy} r="3" fill={theme.colors.text.primary} />
      <line x1={cx} y1={cy} x2={cx + rIn * Math.cos(Math.PI / 4)} y2={cy + rIn * Math.sin(Math.PI / 4)} stroke={theme.colors.text.primary} strokeWidth="1" />
      <text x={cx + 8} y={cy + 24} fontSize="12" fill={theme.colors.text.primary}>r</text>

      {/* Fibre labels */}
      <text x={cx - 70} y={cy + rOut + 22} fontSize="12" fill={theme.colors.error}>outer fibres: tension</text>
      <text x={cx + rIn + 40} y={cy - 40} fontSize="12" fill={theme.colors.accent[600]}>inner fibres: compression</text>

      {/* Springback: overbent tool shape (dashed) vs final angle */}
      <g transform="translate(430, 60)">
        <text x="0" y="0" fontSize="12" fontWeight={700} fill={theme.colors.text.primary}>Springback</text>
        <line x1="20" y1="150" x2="140" y2="150" stroke={theme.colors.text.primary} strokeWidth="3" />
        <line x1="140" y1="150" x2="140" y2="50" stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
        <line x1="140" y1="150" x2="112" y2="55" stroke={theme.colors.warning} strokeWidth="3" strokeDasharray="5 3" />
        <text x="146" y="60" fontSize="11" fill={theme.colors.lightBlue[600]}>target θ</text>
        <text x="40" y="42" fontSize="11" fill={theme.colors.warning}>tool (overbend)</text>
        <text x="0" y="182" fontSize="11" fill={theme.colors.text.secondary}>R_i/R_f = 4x³ − 3x + 1</text>
        <text x="0" y="198" fontSize="11" fill={theme.colors.text.secondary}>x = R_i·Y/(E·t)</text>
      </g>
    </svg>
  )
}

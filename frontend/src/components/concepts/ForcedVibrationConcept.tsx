import { theme } from '../../styles/theme'

export default function ForcedVibrationConcept() {
  // Schematic magnification curve M(r) for zeta = 0.15 and transmissibility
  const zeta = 0.15
  const X0 = 60
  const X1 = 600
  const Y0 = 200
  const Y1 = 30
  const rMax = 3
  const mMax = 4
  const px = (r: number) => X0 + (r / rMax) * (X1 - X0)
  const py = (m: number) => Y0 - (Math.min(m, mMax) / mMax) * (Y0 - Y1)
  const M = (r: number) => 1 / Math.sqrt((1 - r * r) ** 2 + (2 * zeta * r) ** 2)
  const TR = (r: number) => Math.sqrt(1 + (2 * zeta * r) ** 2) / Math.sqrt((1 - r * r) ** 2 + (2 * zeta * r) ** 2)

  const curve = (f: (r: number) => number) => {
    let p = ''
    for (let i = 0; i <= 300; i++) {
      const r = (i / 300) * rMax
      p += `${i === 0 ? 'M' : 'L'} ${px(r).toFixed(1)} ${py(f(r)).toFixed(1)} `
    }
    return p
  }

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Magnification and transmissibility versus frequency ratio showing resonance at r equals one and isolation above root two, diagram">
      <rect x={px(Math.SQRT2)} y={Y1} width={X1 - px(Math.SQRT2)} height={Y0 - Y1} fill={theme.colors.success} fillOpacity="0.09" />
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={X0} y1={Y1} x2={X0} y2={Y0} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={X0} y1={py(1)} x2={X1} y2={py(1)} stroke={theme.colors.gray[400]} strokeWidth="1" strokeDasharray="4 4" />
      <line x1={px(1)} y1={Y1} x2={px(1)} y2={Y0} stroke={theme.colors.error} strokeWidth="1" strokeDasharray="4 4" />
      <line x1={px(Math.SQRT2)} y1={Y1} x2={px(Math.SQRT2)} y2={Y0} stroke={theme.colors.success} strokeWidth="1" strokeDasharray="4 4" />

      <path d={curve(M)} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
      <path d={curve(TR)} fill="none" stroke={theme.colors.spectrum.violet} strokeWidth="2.5" strokeDasharray="7 4" />

      <text x={px(1) + 6} y={Y1 + 12} fontSize="12" fontWeight={700} fill={theme.colors.error}>resonance r ≈ 1</text>
      <text x={px(Math.SQRT2) + 6} y={Y0 - 8} fontSize="12" fontWeight={700} fill={theme.colors.success}>isolation: r &gt; √2 (TR &lt; 1)</text>
      <text x={X0 + 6} y={py(1) - 5} fontSize="11" fill={theme.colors.text.light}>1</text>
      <text x={X0 + 90} y={Y1 + 40} fontSize="12" fill={theme.colors.lightBlue[600]}>M(r) — displacement</text>
      <text x={X0 + 90} y={Y1 + 58} fontSize="12" fill={theme.colors.spectrum.violet}>TR(r) — force through the mount</text>
      <text x={(X0 + X1) / 2} y="228" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>frequency ratio r = ω / ωₙ</text>
      <text x={X0 - 8} y={Y1 + 4} textAnchor="end" fontSize="11" fill={theme.colors.text.light}>peak ≈ 1/2ζ</text>
      {[0, 1, 2, 3].map((r) => (
        <text key={r} x={px(r)} y={Y0 + 14} textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>{r}</text>
      ))}
    </svg>
  )
}

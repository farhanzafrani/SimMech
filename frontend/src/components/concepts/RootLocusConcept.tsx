import { theme } from '../../styles/theme'

export default function RootLocusConcept() {
  // Sketch of the locus of K / (s (s+1)(s+2)): poles at 0, -1, -2
  const ox = 330
  const oy = 120
  const u = 70 // px per unit
  const sx = (re: number) => ox + re * u
  const sy = (im: number) => oy - im * u

  // Branch 1: 0 -> breakaway (-0.423) -> departs at 60 deg, crosses jw at +-1.414
  const upper: string[] = []
  const lower: string[] = []
  // Continuation: each K starts Newton from the previous complex root so we
  // stay on the same branch (roots of s^3 + 3 s^2 + 2 s + K = 0).
  let re = -0.45
  let im = 0.05
  for (let i = 0; i <= 120; i++) {
    const K = 0.4 + (i / 120) * 11.6
    for (let it = 0; it < 80; it++) {
      // f(s) and f'(s) for complex s = re + i im
      const s2r = re * re - im * im
      const s2i = 2 * re * im
      const s3r = s2r * re - s2i * im
      const s3i = s2r * im + s2i * re
      const fr = s3r + 3 * s2r + 2 * re + K
      const fi = s3i + 3 * s2i + 2 * im
      const dr = 3 * s2r + 6 * re + 2
      const di = 3 * s2i + 6 * im
      const den = dr * dr + di * di
      if (den < 1e-12) break
      re -= (fr * dr + fi * di) / den
      im -= (fi * dr - fr * di) / den
    }
    if (Math.abs(im) > 1e-3) {
      upper.push(`${upper.length === 0 ? 'M' : 'L'} ${sx(re).toFixed(1)} ${sy(im).toFixed(1)}`)
      lower.push(`${lower.length === 0 ? 'M' : 'L'} ${sx(re).toFixed(1)} ${sy(-im).toFixed(1)}`)
    }
  }

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Root locus of K over s times s plus one times s plus two with breakaway point, asymptotes and imaginary-axis crossing, diagram">
      <rect x={ox} y="0" width={640 - ox} height="240" fill={theme.colors.error} fillOpacity="0.07" />
      <line x1="0" y1={oy} x2="640" y2={oy} stroke={theme.colors.gray[400]} />
      <line x1={ox} y1="0" x2={ox} y2="240" stroke={theme.colors.gray[600]} strokeWidth="1.5" />
      <text x={ox + 6} y="14" fontSize="11" fill={theme.colors.text.light}>jω</text>
      <text x={ox + 160} y="224" fontSize="12" fill={theme.colors.error}>right half-plane: unstable</text>

      {/* asymptotes from centroid -1 at +-60 deg */}
      {[1, -1].map((sg) => (
        <line key={sg} x1={sx(-1)} y1={oy} x2={sx(-1 + 2.6 * Math.cos(Math.PI / 3))} y2={sy(sg * 2.6 * Math.sin(Math.PI / 3))} stroke={theme.colors.gray[400]} strokeDasharray="5 4" />
      ))}
      <text x={sx(-1) - 4} y={oy + 28} fontSize="11" textAnchor="middle" fill={theme.colors.text.light}>centroid σ = −1</text>

      {/* real-axis segments: [-1,0] and (-inf,-2] */}
      <line x1={sx(-1)} y1={oy} x2={sx(0)} y2={oy} stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
      <line x1={0} y1={oy} x2={sx(-2)} y2={oy} stroke={theme.colors.spectrum.violet} strokeWidth="3" />
      <path d={upper.join(' ')} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
      <path d={lower.join(' ')} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />

      {[0, -1, -2].map((p) => (
        <g key={p} stroke={theme.colors.text.primary} strokeWidth="2.5">
          <line x1={sx(p) - 5} y1={oy - 5} x2={sx(p) + 5} y2={oy + 5} />
          <line x1={sx(p) - 5} y1={oy + 5} x2={sx(p) + 5} y2={oy - 5} />
        </g>
      ))}
      <circle cx={sx(-0.423)} cy={oy} r="4.5" fill="white" stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x={sx(-0.423) + 4} y={oy - 10} fontSize="11" fill={theme.colors.text.secondary}>breakaway −0.42</text>
      <circle cx={ox} cy={sy(Math.SQRT2)} r="5" fill="white" stroke={theme.colors.error} strokeWidth="2.5" />
      <circle cx={ox} cy={sy(-Math.SQRT2)} r="5" fill="white" stroke={theme.colors.error} strokeWidth="2.5" />
      <text x={ox + 10} y={sy(Math.SQRT2) + 4} fontSize="12" fontWeight={700} fill={theme.colors.error}>jω = ±j1.414 at K = 6</text>

      {/* Routh note */}
      <g transform="translate(14, 18)">
        <rect width="190" height="74" rx="8" fill={theme.colors.lightBlue[50]} stroke={theme.colors.lightBlue[200]} />
        <text x="10" y="20" fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>s³ + 3s² + 2s + K = 0</text>
        <text x="10" y="40" fontSize="11" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.text.primary}>s¹ row: (6 − K)/3 &gt; 0</text>
        <text x="10" y="58" fontSize="11" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.text.primary}>⇒ stable for 0 &lt; K &lt; 6</text>
      </g>
    </svg>
  )
}

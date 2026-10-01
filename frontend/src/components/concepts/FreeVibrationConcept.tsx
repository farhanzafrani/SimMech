import { theme } from '../../styles/theme'

export default function FreeVibrationConcept() {
  // Decaying cosine sampled for the sketch: x = A e^{-zeta wn t} cos(wd t)
  const x0 = 330
  const mid = 110
  const amp = 70
  const pts: string[] = []
  const up: string[] = []
  const dn: string[] = []
  for (let i = 0; i <= 200; i++) {
    const t = i / 200
    const env = amp * Math.exp(-2.2 * t)
    const px = x0 + t * 290
    pts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${(mid - env * Math.cos(2 * Math.PI * 3 * t)).toFixed(1)}`)
    up.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${(mid - env).toFixed(1)}`)
    dn.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${(mid + env).toFixed(1)}`)
  }

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Mass-spring-damper next to its decaying free response with exponential envelope, diagram">
      {/* wall */}
      <line x1="30" y1="40" x2="30" y2="180" stroke={theme.colors.text.primary} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1="30" y1={50 + i * 25} x2="20" y2={62 + i * 25} stroke={theme.colors.gray[500]} strokeWidth="2" />
      ))}
      {/* spring */}
      <path d={`M 30 90 L 45 90 ${Array.from({ length: 8 }, (_, i) => `L ${45 + 13 * (i + 0.5)} ${i % 2 === 0 ? 74 : 106}`).join(' ')} L 160 90 L 175 90`} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
      <text x="105" y="62" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>k</text>
      {/* damper */}
      <line x1="30" y1="150" x2="95" y2="150" stroke={theme.colors.gray[500]} strokeWidth="2" />
      <rect x="95" y="138" width="40" height="24" fill="none" stroke={theme.colors.gray[600]} strokeWidth="2" />
      <line x1="110" y1="150" x2="175" y2="150" stroke={theme.colors.gray[600]} strokeWidth="2" />
      <text x="115" y="182" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.gray[600]}>c</text>
      {/* mass */}
      <line x1="175" y1="90" x2="175" y2="150" stroke={theme.colors.gray[500]} strokeWidth="2" />
      <rect x="175" y="70" width="70" height="100" rx="5" fill={theme.colors.lightBlue[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x="210" y="127" textAnchor="middle" fontSize="16" fontWeight={700}>m</text>
      <line x1="210" y1="195" x2="260" y2="195" stroke={theme.colors.accent[600]} strokeWidth="2" markerEnd="url(#fvcArrow)" />
      <text x="262" y="199" fontSize="12" fill={theme.colors.accent[600]}>x</text>

      {/* response */}
      <line x1={x0} y1="20" x2={x0} y2="200" stroke={theme.colors.gray[400]} strokeWidth="1" />
      <line x1={x0} y1={mid} x2={x0 + 300} y2={mid} stroke={theme.colors.gray[400]} strokeWidth="1" />
      <path d={up.join(' ')} fill="none" stroke={theme.colors.gray[400]} strokeWidth="1.5" strokeDasharray="5 4" />
      <path d={dn.join(' ')} fill="none" stroke={theme.colors.gray[400]} strokeWidth="1.5" strokeDasharray="5 4" />
      <path d={pts.join(' ')} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
      <text x={x0 + 150} y="30" fontSize="12" fill={theme.colors.text.secondary}>envelope A e^(−ζωₙt)</text>
      <text x={x0 + 300} y={mid + 16} textAnchor="end" fontSize="11" fill={theme.colors.text.light}>t</text>
      <text x={x0 + 8} y="215" fontSize="12" fill={theme.colors.text.secondary}>period T_d = 2π / (ωₙ√(1−ζ²))</text>
      <text x={x0 + 8} y="232" fontSize="12" fill={theme.colors.text.light}>x₀ and v₀ set A and B</text>
      <defs>
        <marker id="fvcArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.accent[600]} />
        </marker>
      </defs>
    </svg>
  )
}

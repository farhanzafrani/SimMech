import { theme } from '../../styles/theme'

export default function StepResponseConcept() {
  // Left: first order (63.2% at t = tau). Right: second order with overshoot.
  const L0 = 50
  const LW = 230
  const B = 190
  const T = 30
  const H = B - T

  const first = Array.from({ length: 101 }, (_, i) => {
    const t = (i / 100) * 5
    return `${i === 0 ? 'M' : 'L'} ${(L0 + (t / 5) * LW).toFixed(1)} ${(B - (1 - Math.exp(-t)) * H).toFixed(1)}`
  }).join(' ')

  const R0 = 370
  const z = 0.3
  const wn = 6
  const wd = wn * Math.sqrt(1 - z * z)
  const second = Array.from({ length: 201 }, (_, i) => {
    const t = (i / 200) * 3
    const y = 1 - (Math.exp(-z * wn * t) / Math.sqrt(1 - z * z)) * Math.sin(wd * t + Math.acos(z))
    return `${i === 0 ? 'M' : 'L'} ${(R0 + (t / 3) * LW).toFixed(1)} ${(B - (y / 1.5) * H).toFixed(1)}`
  }).join(' ')
  const yFinal = B - (1 / 1.5) * H
  const tp = Math.PI / wd
  const yPeak = B - ((1 + Math.exp((-Math.PI * z) / Math.sqrt(1 - z * z))) / 1.5) * H

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="First-order step response reaching 63 percent at one time constant and second-order response showing overshoot, peak time and settling band, diagram">
      {/* first order */}
      <line x1={L0} y1={B} x2={L0 + LW} y2={B} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={L0} y1={T} x2={L0} y2={B} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={L0} y1={B - H * 0.632} x2={L0 + LW / 5} y2={B - H * 0.632} stroke={theme.colors.accent[600]} strokeDasharray="4 3" />
      <line x1={L0 + LW / 5} y1={B - H * 0.632} x2={L0 + LW / 5} y2={B} stroke={theme.colors.accent[600]} strokeDasharray="4 3" />
      <line x1={L0} y1={T} x2={L0 + LW} y2={T} stroke={theme.colors.gray[400]} strokeDasharray="4 4" />
      <path d={first} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
      <circle cx={L0 + LW / 5} cy={B - H * 0.632} r="4" fill={theme.colors.accent[600]} />
      <text x={L0 + LW / 5 + 8} y={B - H * 0.632 + 16} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>63.2% at t = τ</text>
      <text x={L0 + LW / 5} y={B + 14} textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>τ</text>
      <text x={L0} y={T - 8} fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>First order  K/(τs+1)</text>
      <text x={L0 + LW} y={B + 14} textAnchor="end" fontSize="11" fill={theme.colors.text.light}>5τ ≈ done</text>
      <text x={L0 + 4} y={T + 14} fontSize="11" fill={theme.colors.text.light}>K</text>

      {/* second order */}
      <line x1={R0} y1={B} x2={R0 + LW} y2={B} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={R0} y1={T} x2={R0} y2={B} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <rect x={R0} y={yFinal - 0.02 * (H / 1.5)} width={LW} height={0.04 * (H / 1.5)} fill={theme.colors.success} fillOpacity="0.25" />
      <line x1={R0} y1={yFinal} x2={R0 + LW} y2={yFinal} stroke={theme.colors.gray[500]} strokeDasharray="4 4" />
      <path d={second} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
      <circle cx={R0 + (tp / 3) * LW} cy={yPeak} r="4" fill={theme.colors.error} />
      <line x1={R0 + (tp / 3) * LW} y1={yPeak} x2={R0 + (tp / 3) * LW} y2={B} stroke={theme.colors.error} strokeDasharray="3 3" />
      <text x={R0 + (tp / 3) * LW + 8} y={yPeak - 2} fontSize="12" fontWeight={700} fill={theme.colors.error}>%OS</text>
      <text x={R0 + (tp / 3) * LW} y={B + 14} textAnchor="middle" fontSize="11" fill={theme.colors.error}>t_p</text>
      <text x={R0 + LW} y={yFinal - 6} textAnchor="end" fontSize="11" fill={theme.colors.success}>±2% band → t_s</text>
      <text x={R0} y={T - 8} fontSize="12" fontWeight={700} fill={theme.colors.text.secondary}>Second order  ωₙ², ζ</text>
      <text x={R0} y={B + 30} fontSize="11" fill={theme.colors.text.light}>t_p = π/ω_d,  t_s ≈ 4/(ζωₙ)</text>
    </svg>
  )
}

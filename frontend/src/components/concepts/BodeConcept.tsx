import { theme } from '../../styles/theme'

export default function BodeConcept() {
  // Sketch of Bode plots for K/(s(s+1)(0.1 s + 1)) style loop (not to scale)
  const X0 = 60
  const X1 = 600
  const wx = (lw: number) => X0 + ((lw + 1) / 3.5) * (X1 - X0) // log10 w in [-1, 2.5]

  const mag = (w: number) => 20 * Math.log10(2 / (w * Math.sqrt(1 + w * w) * Math.sqrt(1 + 0.01 * w * w)))
  const ph = (w: number) => (-90 - (Math.atan(w) * 180) / Math.PI - (Math.atan(0.1 * w) * 180) / Math.PI)

  const magY = (db: number) => 80 - (db / 60) * 55

  const magPath = Array.from({ length: 141 }, (_, i) => {
    const lw = -1 + (i / 140) * 3.5
    return `${i === 0 ? 'M' : 'L'} ${wx(lw).toFixed(1)} ${Math.max(10, Math.min(120, magY(mag(10 ** lw)))).toFixed(1)}`
  }).join(' ')

  const phTop = 135
  const phBot = 235
  const phPy = (deg: number) => phTop + (-deg / 270) * (phBot - phTop)
  const phPath = Array.from({ length: 141 }, (_, i) => {
    const lw = -1 + (i / 140) * 3.5
    return `${i === 0 ? 'M' : 'L'} ${wx(lw).toFixed(1)} ${phPy(ph(10 ** lw)).toFixed(1)}`
  }).join(' ')

  // Crossovers for this sketch (K = 2, tau1 = 1, tau2 = 0.1)
  const wgc = 1.2437
  const wpc = Math.sqrt(10)

  return (
    <svg width="100%" height="260" viewBox="0 0 640 260" role="img" aria-label="Sketch of Bode magnitude and phase with gain crossover, phase crossover, gain margin and phase margin marked, diagram">
      {/* magnitude */}
      <line x1={X0} y1={magY(0)} x2={X1} y2={magY(0)} stroke={theme.colors.gray[500]} strokeDasharray="5 4" />
      <text x={X1} y={magY(0) - 4} textAnchor="end" fontSize="11" fill={theme.colors.text.light}>0 dB</text>
      <line x1={X0} y1="10" x2={X0} y2="120" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <path d={magPath} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="2.5" />
      <text x={X0 + 8} y="22" fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>|L(jω)| (dB)</text>

      {/* phase */}
      <line x1={X0} y1={phTop} x2={X1} y2={phTop} stroke={theme.colors.gray[400]} />
      <line x1={X0} y1={phPy(-180)} x2={X1} y2={phPy(-180)} stroke={theme.colors.error} strokeDasharray="5 4" />
      <text x={X1} y={phPy(-180) - 4} textAnchor="end" fontSize="11" fill={theme.colors.error}>−180°</text>
      <line x1={X0} y1={phTop} x2={X0} y2={phBot} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <line x1={X0} y1={phBot} x2={X1} y2={phBot} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <path d={phPath} fill="none" stroke={theme.colors.spectrum.violet} strokeWidth="2.5" />
      <text x={X0 + 8} y={phTop + 14} fontSize="12" fontWeight={700} fill={theme.colors.spectrum.violet}>∠L(jω)</text>

      {/* crossover markers */}
      <line x1={wx(Math.log10(wgc))} y1="10" x2={wx(Math.log10(wgc))} y2={phBot} stroke={theme.colors.accent[600]} strokeDasharray="3 3" />
      <line x1={wx(Math.log10(wpc))} y1="10" x2={wx(Math.log10(wpc))} y2={phBot} stroke={theme.colors.spectrum.coral} strokeDasharray="3 3" />
      <text x={wx(Math.log10(wgc))} y={phBot + 14} textAnchor="middle" fontSize="11" fontWeight={700} fill={theme.colors.accent[600]}>ω_gc</text>
      <text x={wx(Math.log10(wpc))} y={phBot + 14} textAnchor="middle" fontSize="11" fontWeight={700} fill={theme.colors.spectrum.coral}>ω_pc</text>

      {/* GM: gap below 0 dB at w_pc */}
      <line x1={wx(Math.log10(wpc))} y1={magY(0)} x2={wx(Math.log10(wpc))} y2={magY(mag(wpc))} stroke={theme.colors.spectrum.coral} strokeWidth="4" />
      <text x={wx(Math.log10(wpc)) + 8} y={(magY(0) + magY(mag(wpc))) / 2 + 4} fontSize="12" fontWeight={700} fill={theme.colors.spectrum.coral}>GM</text>
      {/* PM: gap above -180 at w_gc */}
      <line x1={wx(Math.log10(wgc))} y1={phPy(ph(wgc))} x2={wx(Math.log10(wgc))} y2={phPy(-180)} stroke={theme.colors.accent[600]} strokeWidth="4" />
      <text x={wx(Math.log10(wgc)) + 8} y={(phPy(ph(wgc)) + phPy(-180)) / 2 + 4} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>PM</text>
      <text x={(X0 + X1) / 2} y="256" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>log frequency ω</text>
    </svg>
  )
}

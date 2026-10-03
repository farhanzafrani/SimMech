import { theme } from '../../styles/theme'

export default function PumpSystemConcept() {
  const ox = 70
  const oy = 190
  const w = 330
  const h = 150
  const pump = (f: number) => oy - h * (0.95 - 0.55 * f * f)
  const sys = (f: number) => oy - h * (0.28 + 0.55 * f * f)
  const xs = Array.from({ length: 21 }, (_, i) => i / 20)
  const opF = Math.sqrt((0.95 - 0.28) / 1.1)
  const opX = ox + opF * w
  const opY = pump(opF)

  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="Falling pump head curve crossing a rising system curve at the operating point, with an NPSH available versus required comparison, diagram">
      <line x1={ox} y1={oy} x2={ox + w + 10} y2={oy} stroke={theme.colors.text.primary} strokeWidth="2" />
      <line x1={ox} y1={oy} x2={ox} y2={oy - h - 10} stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x={ox + w / 2} y={oy + 24} fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>flow Q</text>
      <text x={ox - 10} y={oy - h - 14} fontSize="12" fill={theme.colors.text.secondary}>head H</text>
      <polyline points={xs.map((f) => `${ox + f * w},${pump(f)}`).join(' ')} fill="none" stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
      <polyline points={xs.map((f) => `${ox + f * w},${sys(f)}`).join(' ')} fill="none" stroke={theme.colors.error} strokeWidth="3" />
      <line x1={ox} y1={sys(0)} x2={ox + 30} y2={sys(0)} stroke={theme.colors.gray[500]} strokeWidth="1" strokeDasharray="3 3" />
      <text x={ox + 34} y={sys(0) + 14} fontSize="11" fill={theme.colors.text.secondary}>static head</text>
      <text x={ox + 10} y={pump(0) - 8} fontSize="12" fontWeight={700} fill={theme.colors.lightBlue[600]}>pump curve</text>
      <text x={ox + w - 80} y={sys(1) - 10} fontSize="12" fontWeight={700} fill={theme.colors.error}>system curve</text>
      <circle cx={opX} cy={opY} r="6" fill={theme.colors.accent[600]} stroke="white" strokeWidth="1.5" />
      <text x={opX + 10} y={opY - 10} fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>operating point</text>
      <line x1={opX} y1={opY} x2={opX} y2={oy} stroke={theme.colors.accent[600]} strokeWidth="1" strokeDasharray="3 3" />

      {/* NPSH comparison */}
      <text x="470" y="40" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>Suction side</text>
      <rect x="480" y="60" width="40" height="110" fill={theme.colors.lightBlue[200]} stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x="500" y="186" fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>NPSHa</text>
      <rect x="550" y="115" width="40" height="55" fill={theme.colors.warning} fillOpacity="0.7" stroke={theme.colors.text.primary} strokeWidth="1.5" />
      <text x="570" y="186" fontSize="11" textAnchor="middle" fill={theme.colors.text.secondary}>NPSHr</text>
      <text x="535" y="208" fontSize="11" textAnchor="middle" fill={theme.colors.success}>NPSHa &gt; NPSHr: no cavitation</text>
    </svg>
  )
}

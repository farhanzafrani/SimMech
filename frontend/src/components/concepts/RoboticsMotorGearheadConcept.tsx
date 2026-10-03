import { theme } from '../../styles/theme'

export default function RoboticsMotorGearheadConcept() {
  return (
    <svg width="100%" height="240" viewBox="0 0 640 240" role="img" aria-label="DC motor driving a load through a gearhead, with its torque-speed line, diagram">
      {/* Motor, gearhead, load blocks */}
      <rect x="30" y="85" width="90" height="60" rx="6" fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />
      <text x="75" y="112" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.lightBlue[600]}>Motor</text>
      <text x="75" y="130" textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>τₘ, ωₘ, Jₘ</text>
      <line x1="120" y1="115" x2="150" y2="115" stroke={theme.colors.text.primary} strokeWidth="4" />
      <rect x="150" y="95" width="60" height="40" rx="4" fill={theme.colors.gray[100]} stroke={theme.colors.text.primary} strokeWidth="2" />
      <text x="180" y="119" textAnchor="middle" fontSize="13" fontWeight={700} fill={theme.colors.text.primary}>N : 1</text>
      <line x1="210" y1="115" x2="240" y2="115" stroke={theme.colors.text.primary} strokeWidth="4" />
      <circle cx="275" cy="115" r="35" fill={theme.colors.accent.light} fillOpacity="0.5" stroke={theme.colors.accent[600]} strokeWidth="2" />
      <text x="275" y="112" textAnchor="middle" fontSize="12" fontWeight={700} fill={theme.colors.accent[600]}>Load</text>
      <text x="275" y="128" textAnchor="middle" fontSize="11" fill={theme.colors.text.secondary}>τ_L, J_L</text>
      <text x="180" y="170" textAnchor="middle" fontSize="11" fill={theme.colors.text.light}>output: N·τ, ω/N</text>
      <text x="165" y="205" textAnchor="middle" fontSize="12" fontFamily={theme.typography.fontFamily.mono} fill={theme.colors.text.primary}>J_ref = Jₘ + J_L/N²</text>

      {/* Torque-speed line */}
      <g transform="translate(380, 40)">
        <line x1="0" y1="0" x2="0" y2="150" stroke={theme.colors.text.primary} strokeWidth="1.5" />
        <line x1="0" y1="150" x2="220" y2="150" stroke={theme.colors.text.primary} strokeWidth="1.5" />
        <polygon points="0,150 0,10 200,150" fill={theme.colors.lightBlue[100]} fillOpacity="0.7" />
        <line x1="0" y1="10" x2="200" y2="150" stroke={theme.colors.lightBlue[600]} strokeWidth="3" />
        <circle cx="0" cy="10" r="4" fill={theme.colors.lightBlue[600]} />
        <circle cx="200" cy="150" r="4" fill={theme.colors.lightBlue[600]} />
        <text x="6" y="8" fontSize="11" fill={theme.colors.lightBlue[600]}>τ_stall</text>
        <text x="200" y="168" fontSize="11" textAnchor="middle" fill={theme.colors.lightBlue[600]}>ω₀</text>
        <circle cx="70" cy="60" r="6" fill={theme.colors.success} stroke="white" strokeWidth="2" />
        <text x="80" y="56" fontSize="11" fontWeight={700} fill={theme.colors.success}>load point</text>
        <text x="110" y="188" fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary}>speed</text>
        <text x="-10" y="80" fontSize="12" textAnchor="middle" fill={theme.colors.text.secondary} transform="rotate(-90 -10 80)">torque</text>
      </g>
    </svg>
  )
}

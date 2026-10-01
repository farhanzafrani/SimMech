import { theme } from '../../styles/theme'

export default function StressStrainConcept() {
  return (
    <svg width="100%" height="220" viewBox="0 0 640 220" role="img" aria-label="Rod under axial tension diagram">
      {/* Fixed wall */}
      <line x1="60" y1="60" x2="60" y2="160" stroke={theme.colors.gray[600]} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={60 - 10}
          y1={70 + i * 18}
          x2={60}
          y2={80 + i * 18}
          stroke={theme.colors.gray[500]}
          strokeWidth="2"
        />
      ))}

      {/* Rod (undeformed, dashed) */}
      <rect x="60" y="95" width="360" height="30" fill="none" stroke={theme.colors.gray[400]} strokeWidth="1.5" strokeDasharray="5 4" />

      {/* Rod (deformed) */}
      <rect x="60" y="95" width="420" height="30" fill={theme.colors.lightBlue[100]} stroke={theme.colors.lightBlue[600]} strokeWidth="2" />

      {/* Force arrow */}
      <line x1="480" y1="110" x2="560" y2="110" stroke={theme.colors.error} strokeWidth="3" markerEnd="url(#arrowhead)" />
      <text x="520" y="95" textAnchor="middle" fontSize="16" fontWeight={700} fill={theme.colors.error}>F</text>

      {/* Length labels */}
      <line x1="60" y1="150" x2="420" y2="150" stroke={theme.colors.gray[500]} strokeWidth="1" />
      <text x="240" y="145" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>L₀</text>

      <line x1="60" y1="185" x2="480" y2="185" stroke={theme.colors.lightBlue[600]} strokeWidth="1" />
      <text x="270" y="180" textAnchor="middle" fontSize="12" fill={theme.colors.lightBlue[700]}>L = L₀ + ΔL</text>

      {/* Cross-section area callout */}
      <text x="60" y="45" textAnchor="middle" fontSize="12" fill={theme.colors.text.secondary}>Area A</text>

      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill={theme.colors.error} />
        </marker>
      </defs>
    </svg>
  )
}

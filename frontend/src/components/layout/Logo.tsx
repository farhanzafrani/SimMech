import { theme } from '../../styles/theme'

/** Free Body mark: a supported beam with a downward load arrow, on a cobalt tile. */
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        borderRadius: `${Math.round(size * 0.3)}px`,
        background: theme.colors.lightBlue[500],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round">
        <path d="M3 15 H21" />
        <path d="M5 15 L3 20 H8 Z" />
        <path d="M19 15 L16 20 H21 Z" />
        <path d="M12 3 V11" stroke={theme.colors.accent.light} />
        <path d="M9 8 L12 11 L15 8" stroke={theme.colors.accent.light} />
      </svg>
    </span>
  )
}

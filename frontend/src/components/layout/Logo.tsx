import { theme } from '../../styles/theme'

export default function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" stroke={theme.colors.text.primary} strokeWidth="2">
      <line x1="3" y1="18" x2="27" y2="18" />
      <path d="M6 18 L3 24 L9 24 Z" />
      <path d="M24 18 L21 24 L27 24 Z" />
      <line x1="15" y1="3" x2="15" y2="14" stroke={theme.colors.accent[500]} />
      <path d="M11 10 L15 15 L19 10" stroke={theme.colors.accent[500]} />
    </svg>
  )
}

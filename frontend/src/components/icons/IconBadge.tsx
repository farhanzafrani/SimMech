import type { ReactNode } from 'react'

interface IconBadgeProps {
  color: string
  size?: number
  children: ReactNode
}

/** A colored rounded-square carrying an icon glyph — the app icon motif. */
export default function IconBadge({ color, size = 40, children }: IconBadgeProps) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.26)}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: color,
        color: '#FFFFFF',
      }}
    >
      <div style={{ width: `${Math.round(size * 0.56)}px`, height: `${Math.round(size * 0.56)}px` }}>{children}</div>
    </div>
  )
}

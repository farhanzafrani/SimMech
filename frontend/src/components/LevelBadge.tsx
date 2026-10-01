import type { TopicLevel } from '../config/curriculum'
import { theme } from '../styles/theme'

const LEVEL_COLOR: Record<TopicLevel, string> = {
  Beginner: theme.colors.success,
  Intermediate: theme.colors.lightBlue[500],
  Advanced: theme.colors.accent[600],
}

interface LevelBadgeProps {
  level: TopicLevel
  size?: 'sm' | 'md'
}

/** Small tagged label marking a topic's difficulty — same visual family as the FORMULA/VIZ/PLAY tags. */
export default function LevelBadge({ level, size = 'md' }: LevelBadgeProps) {
  const color = LEVEL_COLOR[level]
  const fontSize = size === 'sm' ? '11px' : '12px'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: theme.typography.fontFamily.mono,
        fontSize,
        color,
        border: `1px solid ${color}`,
        borderRadius: theme.radius.full,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        lineHeight: 1.4,
      }}
    >
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      {level}
    </span>
  )
}

import { theme } from '../styles/theme'

interface LearningObjectivesProps {
  objectives: string[]
}

/** "By the end of this lesson" checklist shown before the formulas — sets expectations up front. */
export default function LearningObjectives({ objectives }: LearningObjectivesProps) {
  if (objectives.length === 0) return null

  return (
    <div
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.bg.secondary,
      }}
    >
      <div style={{ fontWeight: 700, color: theme.colors.text.primary }}>By the end of this lesson you will be able to</div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {objectives.map((objective, i) => (
          <li key={objective} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: 24,
                height: 24,
                borderRadius: 12,
                background: theme.colors.lightBlue[500],
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: 15, lineHeight: 1.5, color: theme.colors.text.primary }}>{objective}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

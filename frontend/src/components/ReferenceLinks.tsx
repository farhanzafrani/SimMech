import type { ExternalReference } from '../config/curriculum'
import { theme } from '../styles/theme'

interface ReferenceLinksProps {
  title: string
  references: ExternalReference[]
}

/** Standardized "further reading" panel — used for both course-level and topic-level references. */
export default function ReferenceLinks({ title, references }: ReferenceLinksProps) {
  if (references.length === 0) return null

  return (
    <div
      style={{
        padding: theme.spacing[5],
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3],
        borderRadius: theme.radius.xl,
        backgroundColor: theme.colors.bg.secondary,
      }}
    >
      <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', color: theme.colors.text.light }}>
        {title.toUpperCase()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
        {references.map((ref) => (
          <a
            key={ref.url}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: theme.spacing[3],
              padding: '10px 14px',
              borderRadius: theme.radius.md,
              backgroundColor: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.colors.text.primary,
            }}
          >
            <span>{ref.label}</span>
            <span style={{ color: theme.colors.accent[500] }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  )
}

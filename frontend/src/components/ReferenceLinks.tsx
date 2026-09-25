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
      className="card"
      style={{ padding: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}
    >
      <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', letterSpacing: '0.06em', color: theme.colors.text.light }}>
        {title.toUpperCase()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
        {references.map((ref) => (
          <a
            key={ref.url}
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '14px', fontWeight: 600, color: theme.colors.accent[600] }}
          >
            {ref.label} ↗
          </a>
        ))}
      </div>
    </div>
  )
}

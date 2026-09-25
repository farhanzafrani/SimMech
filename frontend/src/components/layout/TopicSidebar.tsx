import { Link } from 'react-router-dom'
import type { CourseMeta, TopicMeta } from '../../config/curriculum'
import { theme } from '../../styles/theme'

interface TopicSidebarProps {
  course: CourseMeta
  activeTopicId: string
}

function anchorsFor(topic: TopicMeta) {
  const anchors: Array<{ href: string; label: string }> = []
  if (topic.formulas.length > 0) anchors.push({ href: '#formulas', label: 'Formulas' })
  anchors.push({ href: '#visualize', label: 'Visualization' })
  anchors.push({ href: '#playground', label: 'Playground' })
  if (topic.challenges.length > 0) anchors.push({ href: '#practice', label: 'Practice' })
  return anchors
}

export default function TopicSidebar({ course, activeTopicId }: TopicSidebarProps) {
  return (
    <nav
      style={{
        width: '272px',
        flexShrink: 0,
        borderRight: `1px solid ${theme.colors.border}`,
        padding: `${theme.spacing[8]} ${theme.spacing[6]} ${theme.spacing[8]} 0`,
      }}
    >
      <Link
        to={`/courses/${course.id}`}
        style={{ display: 'flex', flexDirection: 'column', gap: '4px', textDecoration: 'none', marginBottom: theme.spacing[4] }}
      >
        <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', color: theme.colors.text.light }}>
          ← COURSE
        </span>
        <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '18px', fontWeight: 600, color: theme.colors.text.primary }}>
          {course.title}
        </span>
      </Link>

      <div style={{ display: 'grid', gap: '2px', fontSize: '14px' }}>
        {course.topics.map((topic, index) => {
          const isActive = topic.id === activeTopicId
          const isDisabled = topic.status === 'coming-soon'
          const no = String(index + 1).padStart(2, '0')

          const row = (
            <div
              style={{
                display: 'flex',
                gap: theme.spacing[2],
                padding: '9px 10px',
                fontWeight: isActive ? 600 : 400,
                color: isDisabled ? theme.colors.text.light : isActive ? theme.colors.accent[600] : theme.colors.text.secondary,
              }}
            >
              <span style={{ fontFamily: theme.typography.fontFamily.mono }}>{no}</span>
              <span>{topic.title}</span>
            </div>
          )

          if (isActive) {
            return (
              <div
                key={topic.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: theme.colors.bg.primary,
                  border: `1px solid ${theme.colors.text.primary}`,
                  borderRadius: theme.radius.md,
                }}
              >
                {row}
                <div style={{ display: 'flex', flexDirection: 'column', padding: `0 10px 10px 38px`, gap: '2px', fontSize: '13px' }}>
                  {anchorsFor(topic).map((a) => (
                    <a key={a.href} href={a.href} style={{ padding: '6px 0', color: theme.colors.text.secondary }}>
                      {a.label}
                    </a>
                  ))}
                </div>
              </div>
            )
          }

          return isDisabled ? (
            <div key={topic.id} style={{ cursor: 'default' }}>
              {row}
            </div>
          ) : (
            <Link key={topic.id} to={`/courses/${course.id}/topics/${topic.id}`} style={{ textDecoration: 'none' }}>
              {row}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

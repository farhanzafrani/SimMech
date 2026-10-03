import { Link } from 'react-router-dom'
import type { CourseMeta } from '../../config/curriculum'
import type { LessonUnit } from '../../config/lessonUnits'
import { theme } from '../../styles/theme'

interface TopicSidebarProps {
  course: CourseMeta
  activeTopicId: string
  units: LessonUnit[]
  activeUnitId: string
}

const BLUE = theme.colors.lightBlue[500]

export default function TopicSidebar({ course, activeTopicId, units, activeUnitId }: TopicSidebarProps) {
  return (
    <aside
      className="topic-sidebar"
      style={{ position: 'sticky', top: 16, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <nav aria-label="Course outline" style={{ borderRadius: 24, background: theme.colors.bg.secondary, padding: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 10px' }}>
          <span style={{ fontWeight: 700 }}>Course outline</span>
          <span style={{ fontSize: 12, color: theme.colors.text.light }}>{course.topics.length} topics</span>
        </div>

        {course.topics.map((topic, index) => {
          const isActive = topic.id === activeTopicId
          const isDisabled = topic.status === 'coming-soon'
          const no = String(index + 1).padStart(2, '0')
          const bullet = (
            <span
              aria-hidden
              style={{
                width: 24,
                height: 24,
                flexShrink: 0,
                borderRadius: 12,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                background: isActive ? BLUE : isDisabled ? 'transparent' : theme.colors.accent.light,
                color: isActive ? '#FFFFFF' : theme.colors.text.primary,
                border: isDisabled ? `2px solid ${theme.colors.gray[300]}` : 'none',
              }}
            >
              {no}
            </span>
          )
          const rowStyle = {
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            padding: '10px 8px',
            fontSize: 14,
            fontWeight: isActive ? 700 : 400,
            color: isDisabled ? theme.colors.text.light : isActive ? BLUE : theme.colors.text.primary,
          } as const

          if (isActive) {
            return (
              <div key={topic.id} style={{ display: 'flex', flexDirection: 'column', borderRadius: 16, background: '#FFFFFF', padding: 6, boxShadow: '0 6px 20px rgba(17,17,19,0.06)' }}>
                <div style={rowStyle} aria-current="page">
                  {bullet}
                  {topic.title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px 6px 42px', fontSize: 13 }}>
                  {units.map((u) => (
                    <a
                      key={u.id}
                      href={`#${u.id}`}
                      style={{ padding: '5px 0', color: u.id === activeUnitId ? BLUE : theme.colors.text.secondary, fontWeight: u.id === activeUnitId ? 700 : 400 }}
                    >
                      {u.label}
                    </a>
                  ))}
                </div>
              </div>
            )
          }

          return isDisabled ? (
            <div key={topic.id} style={rowStyle}>
              {bullet}
              {topic.title}
            </div>
          ) : (
            <Link key={topic.id} to={`/courses/${course.id}/topics/${topic.id}`} style={rowStyle}>
              {bullet}
              {topic.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

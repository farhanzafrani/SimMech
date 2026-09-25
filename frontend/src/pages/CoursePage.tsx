import { Link, Navigate, useParams } from 'react-router-dom'
import { findCourse, firstActiveTopicId } from '../config/curriculum'
import ReferenceLinks from '../components/ReferenceLinks'
import { theme } from '../styles/theme'

export default function CoursePage() {
  const { courseId = '' } = useParams()
  const course = findCourse(courseId)

  if (!course) {
    return <Navigate to="/courses" replace />
  }

  const activeTopics = course.topics.filter((t) => t.status === 'active')
  const firstTopicId = firstActiveTopicId(course)

  return (
    <div>
      <section
        style={{
          padding: `${theme.spacing[10]} ${theme.spacing[8]} ${theme.spacing[10]}`,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: theme.spacing[12],
          backgroundImage: `linear-gradient(${theme.colors.gray[200]} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.gray[200]} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
          <nav
            aria-label="Breadcrumb"
            style={{ display: 'flex', gap: theme.spacing[2], fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', color: theme.colors.text.light }}
          >
            <Link to="/courses" style={{ color: theme.colors.text.light }}>Courses</Link>
            <span>/</span>
            <span>{course.category}</span>
          </nav>
          <h1 style={{ margin: 0, fontSize: '52px', lineHeight: 1 }}>{course.title}</h1>
          <p style={{ margin: 0, maxWidth: '640px', fontSize: '17px', lineHeight: 1.55, color: theme.colors.text.secondary }}>
            {course.description}
          </p>
          {course.prerequisites.length > 0 && (
            <div style={{ display: 'flex', gap: theme.spacing[2], alignItems: 'center', fontSize: '14px', flexWrap: 'wrap' }}>
              <span style={{ color: theme.colors.text.light }}>Before this course:</span>
              {course.prerequisites.map((p) => (
                <span
                  key={p}
                  style={{
                    padding: '6px 12px',
                    border: `1px solid ${theme.colors.gray[400]}`,
                    borderRadius: theme.radius.full,
                    backgroundColor: theme.colors.bg.primary,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: `${theme.spacing[10]} ${theme.spacing[8]}`, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: theme.spacing[10] }}>
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '56px minmax(0, 1fr) 220px 200px',
              gap: theme.spacing[4],
              padding: `0 ${theme.spacing[4]} ${theme.spacing[2]}`,
              fontFamily: theme.typography.fontFamily.mono,
              fontSize: '12px',
              letterSpacing: '0.06em',
              color: theme.colors.text.light,
              borderBottom: `2px solid ${theme.colors.text.primary}`,
            }}
          >
            <span>NO.</span>
            <span>TOPIC</span>
            <span>KEY FORMULA</span>
            <span>INSIDE</span>
          </div>

          {course.topics.map((topic, index) => {
            const no = String(index + 1).padStart(2, '0')
            const keyFormula = topic.formulas.find((f) => f.emphasis)?.formula ?? topic.formulas[0]?.formula ?? '—'
            const hasFormula = topic.formulas.length > 0
            const hasViz = Boolean(topic.manimSrc)
            const hasPlay = topic.status === 'active'
            const isActive = topic.status === 'active'

            const row = (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px minmax(0, 1fr) 220px 200px',
                  gap: theme.spacing[4],
                  alignItems: 'center',
                  padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              >
                <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '24px', fontWeight: 600, color: isActive ? theme.colors.text.primary : theme.colors.text.light }}>
                  {no}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '18px', fontWeight: 600, color: isActive ? theme.colors.text.primary : theme.colors.text.light }}>
                    {topic.title}
                  </span>
                  <span style={{ fontSize: '13px', color: theme.colors.text.light, lineHeight: 1.4 }}>{topic.summary}</span>
                </div>
                <span style={{ fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic', fontSize: '17px', color: theme.colors.text.secondary }}>
                  {keyFormula}
                </span>
                <div style={{ display: 'flex', gap: theme.spacing[1], alignItems: 'center', flexWrap: 'wrap', fontFamily: theme.typography.fontFamily.mono, fontSize: '10px' }}>
                  {hasFormula && (
                    <span style={{ padding: '3px 6px', border: `1px solid ${theme.colors.text.primary}`, borderRadius: '3px' }}>FORMULA</span>
                  )}
                  {hasViz && (
                    <span style={{ padding: '3px 6px', border: `1px solid ${theme.colors.lightBlue[500]}`, color: theme.colors.lightBlue[500], borderRadius: '3px' }}>VIZ</span>
                  )}
                  {hasPlay && (
                    <span style={{ padding: '3px 6px', border: `1px solid ${theme.colors.accent[600]}`, color: theme.colors.accent[600], borderRadius: '3px' }}>PLAY</span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: isActive ? theme.colors.text.primary : theme.colors.text.light }}>
                    {isActive ? 'Active' : 'Coming soon'}
                  </span>
                </div>
              </div>
            )

            return isActive ? (
              <Link key={topic.id} to={`/courses/${course.id}/topics/${topic.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                {row}
              </Link>
            ) : (
              <div key={topic.id}>{row}</div>
            )
          })}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
          <div className="card" style={{ padding: theme.spacing[4], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '18px', fontWeight: 600 }}>
              Course formula sheet
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
              {activeTopics.map((topic, i) => {
                const f = topic.formulas.find((x) => x.emphasis) ?? topic.formulas[0]
                if (!f) return null
                return (
                  <div
                    key={topic.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderBottom: i < activeTopics.length - 1 ? `1px dashed ${theme.colors.border}` : 'none',
                      paddingBottom: theme.spacing[2],
                      fontFamily: theme.typography.fontFamily.serif,
                      fontStyle: 'italic',
                      fontSize: '16px',
                    }}
                  >
                    <span>{f.formula}</span>
                    <span style={{ fontFamily: theme.typography.fontFamily.mono, fontStyle: 'normal', fontSize: '12px', color: theme.colors.text.light }}>
                      {String(course.topics.indexOf(topic) + 1).padStart(2, '0')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {activeTopics.length > 0 && firstTopicId && (
            <div style={{ padding: theme.spacing[4], backgroundColor: theme.colors.gray[900], color: theme.colors.bg.primary, borderRadius: theme.radius.lg, display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
              <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', color: theme.colors.accent.light }}>
                PLAYGROUNDS IN THIS COURSE
              </div>
              <div style={{ fontSize: '15px', lineHeight: 1.6 }}>
                {activeTopics.map((t) => t.title).join(' · ')}
              </div>
              <Link to={`/courses/${course.id}/topics/${firstTopicId}`} style={{ fontSize: '14px', fontWeight: 600, color: theme.colors.accent.light }}>
                Open {activeTopics[0].title} →
              </Link>
            </div>
          )}

          <ReferenceLinks title="Free course material" references={course.references} />
        </aside>
      </section>
    </div>
  )
}

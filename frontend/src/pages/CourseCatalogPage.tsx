import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CURRICULUM, firstActiveTopicId } from '../config/curriculum'
import { theme } from '../styles/theme'

const STEPS = [
  {
    no: '01',
    label: 'FORMULA',
    color: theme.colors.text.primary,
    title: 'σ = M y / I',
    body: 'The governing equations for the topic, each symbol defined with its units — the rule before the picture.',
  },
  {
    no: '02',
    label: 'VISUALIZATION',
    color: theme.colors.lightBlue[500],
    title: 'Annotated diagrams',
    body: 'A diagram of what the formula actually describes, plus a short animation walking through it step by step.',
  },
  {
    no: '03',
    label: 'PLAYGROUND',
    color: theme.colors.accent[500],
    title: 'Live controls',
    body: 'Change real inputs — loads, materials, dimensions — and watch the diagram and numbers update immediately.',
  },
  {
    no: '04',
    label: 'PRACTICE',
    color: theme.colors.text.light,
    title: 'Predict, then check',
    body: 'Short challenges that ask you to predict what the playground will show before you go verify it.',
  },
]

export default function CourseCatalogPage() {
  const categories = Array.from(new Set(CURRICULUM.map((c) => c.category)))
  const [filter, setFilter] = useState<string>('All')

  const firstCourse = CURRICULUM[0]
  const firstTopicId = firstCourse ? firstActiveTopicId(firstCourse) : undefined
  const liveTopics = CURRICULUM.flatMap((c) => c.topics.filter((t) => t.status === 'active').map((t) => ({ course: c, topic: t })))

  const visibleCourses = CURRICULUM.filter((c) => filter === 'All' || c.category === filter)
  const groups = categories
    .map((category) => ({ category, courses: visibleCourses.filter((c) => c.category === category) }))
    .filter((g) => g.courses.length > 0)

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          padding: `${theme.spacing[16]} ${theme.spacing[8]}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: theme.spacing[16],
          alignItems: 'center',
          backgroundColor: theme.colors.bg.secondary,
          backgroundImage: `linear-gradient(${theme.colors.gray[200]} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.gray[200]} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
          <div
            style={{
              fontFamily: theme.typography.fontFamily.mono,
              fontSize: '13px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: theme.colors.accent[600],
            }}
          >
            Mechanical engineering · one topic at a time
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: theme.typography.fontFamily.heading,
              fontSize: '58px',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              fontWeight: 700,
            }}
          >
            See the equation.
            <br />
            Then break it.
          </h1>
          <p style={{ margin: 0, maxWidth: '520px', fontSize: '18px', lineHeight: 1.55, color: theme.colors.text.secondary }}>
            Every topic pairs the governing formulas with a visualization of what they mean, and a playground where you
            set the loads, materials and dimensions — then watch the real part respond.
          </p>
          <div style={{ display: 'flex', gap: theme.spacing[3] }}>
            <a href="#courses" className="btn btn-primary" style={{ height: '48px', display: 'flex', alignItems: 'center' }}>
              Browse courses
            </a>
            {firstCourse && firstTopicId && (
              <Link
                to={`/courses/${firstCourse.id}/topics/${firstTopicId}`}
                className="btn btn-secondary"
                style={{ height: '48px', display: 'flex', alignItems: 'center' }}
              >
                Try a playground
              </Link>
            )}
          </div>
        </div>

        <div
          className="card"
          style={{ boxShadow: theme.shadows.lg, padding: theme.spacing[6], display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}
        >
          <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', color: theme.colors.text.light }}>
            LIVE RIGHT NOW
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            {liveTopics.map(({ course, topic }) => (
              <Link
                key={topic.id}
                to={`/courses/${course.id}/topics/${topic.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: theme.spacing[3],
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.md,
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontFamily: theme.typography.fontFamily.heading, fontWeight: 600, fontSize: '16px', color: theme.colors.text.primary }}>
                  {topic.title}
                </span>
                <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', color: theme.colors.text.light }}>
                  {course.code}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it's built */}
      <section
        style={{
          padding: `${theme.spacing[12]} ${theme.spacing[8]}`,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing[8],
          backgroundColor: theme.colors.bg.primary,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '32px' }}>How every topic is built</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: theme.spacing[6] }}>
          {STEPS.map((step) => (
            <div
              key={step.no}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing[3],
                paddingTop: theme.spacing[4],
                borderTop: `3px solid ${step.color}`,
              }}
            >
              <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', color: step.color }}>
                {step.no} — {step.label}
              </div>
              <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '20px', fontWeight: 700 }}>{step.title}</div>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.55, color: theme.colors.text.secondary }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="courses" style={{ padding: `${theme.spacing[12]} ${theme.spacing[8]}`, display: 'flex', flexDirection: 'column', gap: theme.spacing[10] }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: theme.spacing[4] }}>
          <h2 style={{ margin: 0, fontSize: '40px' }}>Courses</h2>
          <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
            {['All', ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={filter === c ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ borderRadius: theme.radius.full, height: '40px' }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {groups.map((group) => (
          <div
            key={group.category}
            style={{
              display: 'grid',
              gridTemplateColumns: '220px minmax(0, 1fr)',
              gap: theme.spacing[8],
              paddingTop: theme.spacing[6],
              borderTop: `1px solid ${theme.colors.gray[400]}`,
            }}
          >
            <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '18px', fontWeight: 600 }}>
              {group.category}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: theme.spacing[4] }}>
              {group.courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3], textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '19px', fontWeight: 600 }}>
                      {course.title}
                    </span>
                    <span style={{ fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic', fontSize: '16px', color: theme.colors.text.light }}>
                      {course.symbol}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.secondary, lineHeight: 1.5 }}>{course.description}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[1] }}>
                    {course.topics.map((t) => (
                      <div key={t.id} style={{ display: 'flex', gap: theme.spacing[2], alignItems: 'center', fontSize: '13px', color: theme.colors.text.secondary }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: theme.colors.gray[500] }} />
                        {t.title}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 'auto', fontSize: '13px', fontWeight: 600, color: theme.colors.accent[600] }}>
                    View topics →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

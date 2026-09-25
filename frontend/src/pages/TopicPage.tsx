import { Navigate, Link, useParams } from 'react-router-dom'
import { findTopic, adjacentTopics } from '../config/curriculum'
import { TOPIC_REGISTRY } from '../config/topicRegistry'
import TopicSidebar from '../components/layout/TopicSidebar'
import ManimVisualization from '../components/ManimVisualization'
import FormulaCard from '../components/FormulaCard'
import ReferenceLinks from '../components/ReferenceLinks'
import { theme } from '../styles/theme'

function SectionHeading({ no, color, title }: { no: string; color: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing[4] }}>
      <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', color }}>{no}</span>
      <h2
        style={{
          margin: 0,
          fontFamily: theme.typography.fontFamily.heading,
          fontSize: '30px',
          letterSpacing: '-0.02em',
          color: theme.colors.text.primary,
        }}
      >
        {title}
      </h2>
    </div>
  )
}

export default function TopicPage() {
  const { courseId = '', topicId = '' } = useParams()
  const { course, topic } = findTopic(courseId, topicId)

  if (!course || !topic) {
    return <Navigate to="/courses" replace />
  }

  const implementation = TOPIC_REGISTRY[topic.id]
  const hasFormulas = topic.formulas.length > 0
  const hasVisualization = Boolean(implementation)
  const hasChallenges = topic.challenges.length > 0
  const { previous, next } = adjacentTopics(course, topic.id)

  const pills: Array<{ href: string; label: string; variant: 'outline' | 'blue' | 'solid' }> = []
  if (hasFormulas) pills.push({ href: '#formulas', label: '1 · Formulas', variant: 'outline' })
  if (hasVisualization) pills.push({ href: '#visualize', label: `${hasFormulas ? 2 : 1} · Visualization`, variant: 'blue' })
  pills.push({ href: '#playground', label: `${pills.length + 1} · Playground`, variant: 'solid' })

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: `0 ${theme.spacing[8]}`, maxWidth: '1440px', margin: '0 auto' }}>
      <TopicSidebar course={course} activeTopicId={topic.id} />

      <main style={{ flex: 1, minWidth: 0, padding: `${theme.spacing[8]} 0 ${theme.spacing[16]}`, display: 'flex', flexDirection: 'column', gap: theme.spacing[16] }}>
        {/* Concept */}
        <section id="concept" style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
          <nav
            aria-label="Breadcrumb"
            style={{ display: 'flex', gap: theme.spacing[2], fontFamily: theme.typography.fontFamily.mono, fontSize: '13px', color: theme.colors.text.light }}
          >
            <Link to="/courses" style={{ color: theme.colors.text.light, textDecoration: 'none' }}>
              Courses
            </Link>
            <span>/</span>
            <Link to={`/courses/${course.id}`} style={{ color: theme.colors.text.light, textDecoration: 'none' }}>
              {course.title}
            </Link>
            <span>/</span>
            <span>{topic.title}</span>
          </nav>

          <h1
            style={{
              margin: 0,
              fontFamily: theme.typography.fontFamily.heading,
              fontSize: '48px',
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: theme.colors.text.primary,
            }}
          >
            {topic.title}
          </h1>
          <div style={{ fontSize: '18px', color: theme.colors.text.secondary }}>{topic.summary}</div>
          <p style={{ margin: 0, maxWidth: '820px', fontSize: '17px', lineHeight: 1.65, color: theme.colors.gray[800] }}>
            {topic.description}
          </p>

          <div style={{ display: 'flex', gap: theme.spacing[2], flexWrap: 'wrap' }}>
            {pills.map((pill) => {
              const base = {
                height: '44px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: theme.radius.lg,
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              } as const
              const variantStyle =
                pill.variant === 'solid'
                  ? { background: theme.colors.accent[500], color: '#FFFFFF' }
                  : pill.variant === 'blue'
                    ? { border: `1px solid ${theme.colors.lightBlue[500]}`, color: theme.colors.lightBlue[500] }
                    : { border: `1px solid ${theme.colors.text.primary}`, color: theme.colors.text.primary }
              return (
                <a key={pill.href} href={pill.href} style={{ ...base, ...variantStyle }}>
                  {pill.label}
                </a>
              )
            })}
          </div>
        </section>

        {/* Formulas */}
        {hasFormulas && (
          <section id="formulas" style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
            <SectionHeading no="01" color={theme.colors.accent[600]} title="Formulas" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: theme.spacing[4] }}>
              {topic.formulas.map((f) => (
                <FormulaCard key={f.label} {...f} />
              ))}
            </div>
          </section>
        )}

        {/* Visualization */}
        {hasVisualization && (
          <section id="visualize" style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
            <SectionHeading no={hasFormulas ? '02' : '01'} color={theme.colors.lightBlue[500]} title="Visualization" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: theme.spacing[4] }}>
              <figure className="card" style={{ margin: 0, padding: theme.spacing[6], display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
                <implementation.Concept />
                <figcaption style={{ fontSize: '14px', lineHeight: 1.55, color: theme.colors.text.secondary }}>
                  Annotated diagram of the setup this topic models.
                </figcaption>
              </figure>
              <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
                <ManimVisualization src={topic.manimSrc} title={topic.title} />
                <figcaption style={{ fontSize: '14px', lineHeight: 1.55, color: theme.colors.text.secondary }}>
                  A worked-through animation of the same concept in motion.
                </figcaption>
              </figure>
            </div>
          </section>
        )}

        {/* Playground */}
        <section id="playground" style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing[4], flexWrap: 'wrap' }}>
            <SectionHeading no={String(pills.length).padStart(2, '0')} color={theme.colors.accent[600]} title="Playground" />
            <span style={{ fontSize: '15px', color: theme.colors.text.light }}>
              {implementation ? 'Move the sliders — every diagram and number updates live.' : undefined}
            </span>
          </div>
          {implementation ? (
            <div style={{ border: `1px solid ${theme.colors.text.primary}`, borderRadius: theme.radius.lg, backgroundColor: theme.colors.bg.primary, padding: theme.spacing[6] }}>
              <implementation.Playground />
            </div>
          ) : (
            <div className="card" style={{ padding: theme.spacing[6], color: theme.colors.text.secondary }}>
              Playground coming soon.
            </div>
          )}
        </section>

        {/* Practice */}
        {hasChallenges && (
          <section id="practice" style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[6] }}>
            <SectionHeading no={String(pills.length + 1).padStart(2, '0')} color={theme.colors.text.primary} title="Practice with the playground" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: theme.spacing[4] }}>
              {topic.challenges.map((challenge, i) => (
                <div key={i} className="card" style={{ padding: theme.spacing[5], display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
                  <div style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', color: theme.colors.accent[600] }}>
                    CHALLENGE {i + 1}
                  </div>
                  <div style={{ fontSize: '16px', lineHeight: 1.5, color: theme.colors.text.primary }}>{challenge}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <ReferenceLinks title="Go deeper" references={topic.references} />

        {/* Prev / Next */}
        {(previous || next) && (
          <nav aria-label="Topic navigation" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[4] }}>
            {previous ? (
              <Link
                to={`/courses/${course.id}/topics/${previous.id}`}
                style={{ padding: theme.spacing[5], border: `1px solid ${theme.colors.text.primary}`, borderRadius: theme.radius.lg, display: 'flex', flexDirection: 'column', gap: '4px', textDecoration: 'none' }}
              >
                <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', color: theme.colors.text.light }}>
                  ← PREVIOUS
                </span>
                <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '18px', fontWeight: 600, color: theme.colors.text.primary }}>
                  {previous.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to={`/courses/${course.id}/topics/${next.id}`}
                style={{
                  padding: theme.spacing[5],
                  borderRadius: theme.radius.lg,
                  backgroundColor: theme.colors.gray[900],
                  color: theme.colors.bg.primary,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '4px',
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: '12px', color: theme.colors.accent.light }}>
                  NEXT →
                </span>
                <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '18px', fontWeight: 600 }}>{next.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
      </main>
    </div>
  )
}

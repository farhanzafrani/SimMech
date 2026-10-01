import { Navigate, Link, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { findTopic, adjacentTopics, courseLevelSpan } from '../config/curriculum'
import { TOPIC_REGISTRY } from '../config/topicRegistry'
import { lessonUnits } from '../config/lessonUnits'
import { useActiveSection } from '../hooks/useActiveSection'
import TopicSidebar from '../components/layout/TopicSidebar'
import Logo from '../components/layout/Logo'
import ManimVisualization from '../components/ManimVisualization'
import RealPhoto from '../components/RealPhoto'
import FormulaCard from '../components/FormulaCard'
import Formula from '../components/Formula'
import ReferenceLinks from '../components/ReferenceLinks'
import LevelBadge from '../components/LevelBadge'
import ApplicationsPanel from '../components/ApplicationsPanel'
import LearningObjectives from '../components/LearningObjectives'
import WorkedExamplePanel from '../components/WorkedExamplePanel'
import { theme } from '../styles/theme'

const NAVY = theme.colors.gray[900]
const BLUE = theme.colors.lightBlue[500]
const LIME = theme.colors.accent.light
const MUTED = theme.colors.text.light

function UnitHeading({ no, kicker, title, dark = false, aside }: { no: number; kicker: string; title: string; dark?: boolean; aside?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span
        className="pill"
        style={dark ? { background: LIME, color: theme.colors.text.primary } : undefined}
      >
        Unit {no} · {kicker}
      </span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(32px, 4vw, 44px)',
            letterSpacing: '-0.02em',
            color: dark ? '#FFFFFF' : theme.colors.text.primary,
          }}
        >
          {title}
        </h2>
        {aside}
      </div>
    </div>
  )
}

/** Splits "Beam deflection" into a plain lead and an accented last word. */
function splitTitle(title: string): [string, string] {
  const i = title.lastIndexOf(' ')
  return i === -1 ? ['', title] : [title.slice(0, i + 1), title.slice(i + 1)]
}

export default function TopicPage() {
  const { courseId = '', topicId = '' } = useParams()
  const { course, topic } = findTopic(courseId, topicId)
  const implementation = topic ? TOPIC_REGISTRY[topic.id] : undefined
  const units = topic ? lessonUnits(topic, Boolean(implementation)) : []
  const activeUnit = useActiveSection(units.map((u) => u.id))

  if (!course || !topic) {
    return <Navigate to="/courses" replace />
  }

  const hasFormulas = topic.formulas.length > 0
  const hasVisualization = Boolean(implementation)
  const { previous, next } = adjacentTopics(course, topic.id)
  const topicNo = String(course.topics.findIndex((t) => t.id === topic.id) + 1).padStart(2, '0')
  const keyFormula = topic.formulas.find((f) => f.emphasis) ?? topic.formulas[0]
  const [lead, last] = splitTitle(topic.title)
  const nextHref = next && next.status === 'active' ? `/courses/${course.id}/topics/${next.id}` : undefined

  // Unit numbers run over whichever sections are actually present, in render order (the overview is unit 1).
  const unitNo = (id: string) => units.findIndex((u) => u.id === id) + 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Lesson header */}
      <header
        style={{
          minHeight: 84,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 4px 12px',
          borderBottom: `1px solid ${theme.colors.border}`,
          flexWrap: 'wrap',
        }}
      >
        <Link to="/courses" aria-label="Free Body home">
          <Logo />
        </Link>
        <Link
          to={`/courses/${course.id}`}
          style={{ height: 40, padding: '0 14px', flexShrink: 0, display: 'flex', alignItems: 'center', borderRadius: 20, background: theme.colors.bg.secondary, fontSize: 14, fontWeight: 600 }}
        >
          ← {course.title}
        </Link>

        <div className="topic-header-title" style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            {topicNo} · {topic.title}
          </div>
          <nav className="topic-header-units" aria-label="Lesson units" style={{ display: 'flex', gap: 4 }}>
            {units.map((u) => {
              const on = u.id === activeUnit
              return (
                <a key={u.id} href={`#${u.id}`} aria-label={u.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 62 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 10, background: on ? BLUE : theme.colors.bg.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? '#FFFFFF' : theme.colors.text.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={u.icon} />
                    </svg>
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: on ? BLUE : MUTED, whiteSpace: 'nowrap', maxWidth: 62, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.label}
                  </span>
                </a>
              )
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          {previous && previous.status === 'active' && (
            <Link
              to={`/courses/${course.id}/topics/${previous.id}`}
              style={{ height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', borderRadius: 22, border: `1.5px solid ${theme.colors.text.primary}`, fontSize: 14, fontWeight: 600 }}
            >
              ← Previous
            </Link>
          )}
          {nextHref && (
            <Link to={nextHref} style={{ height: 44, padding: '0 18px', display: 'flex', alignItems: 'center', borderRadius: 22, background: NAVY, color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>
              Next lesson →
            </Link>
          )}
        </div>
      </header>

      <div className="topic-page-layout" style={{ display: 'grid', gridTemplateColumns: '272px minmax(0, 1fr) 248px', columnGap: 36, alignItems: 'start' }}>
        <TopicSidebar course={course} activeTopicId={topic.id} units={units} activeUnitId={activeUnit} />

        <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 72, paddingBottom: 32 }}>
          {/* Overview */}
          <section id="concept" style={{ display: 'flex', flexDirection: 'column', gap: 22, scrollMarginTop: 16 }}>
            <span className="pill">Unit 1 · Overview</span>
            <h1 style={{ margin: 0, fontSize: 'clamp(44px, 6vw, 76px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
              {lead}
              <span style={{ color: BLUE }}>{last}</span>
            </h1>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.75, color: theme.colors.text.secondary, textWrap: 'pretty' }}>
              {topic.summary}
            </p>
            <p style={{ margin: 0, maxWidth: 820, fontSize: 16, lineHeight: 1.7, color: theme.colors.text.secondary }}>{topic.description}</p>

            <div style={{ display: 'flex', gap: theme.spacing[3], alignItems: 'center', flexWrap: 'wrap' }}>
              <LevelBadge level={topic.level} />
              <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: 13, color: MUTED }}>{topic.duration} read</span>
              <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: 13, color: MUTED }}>{courseLevelSpan(course)} course</span>
            </div>

            {topic.learningObjectives && <LearningObjectives objectives={topic.learningObjectives} />}
          </section>

          {/* Formulas */}
          {hasFormulas && (
            <section id="formulas" style={{ display: 'flex', flexDirection: 'column', gap: 24, scrollMarginTop: 16 }}>
              <UnitHeading no={unitNo('formulas')} kicker="Formulas" title="The equations to know" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: theme.spacing[3] }}>
                {topic.formulas.map((f) => (
                  <FormulaCard key={f.label} {...f} />
                ))}
              </div>
            </section>
          )}

          {/* Worked example */}
          {topic.workedExample && (
            <section id="worked-example" style={{ display: 'flex', flexDirection: 'column', gap: 24, scrollMarginTop: 16 }}>
              <UnitHeading no={unitNo('worked-example')} kicker="Worked example" title="One problem, step by step" />
              <WorkedExamplePanel example={topic.workedExample} />
            </section>
          )}

          {/* Visualization */}
          {hasVisualization && implementation && (
            <section id="visualize" style={{ display: 'flex', flexDirection: 'column', gap: 24, scrollMarginTop: 16 }}>
              <UnitHeading no={unitNo('visualize')} kicker="Visualization" title="See what the equation means" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: theme.spacing[3] }}>
                <figure style={{ margin: 0, padding: theme.spacing[6], borderRadius: 26, backgroundColor: theme.colors.bg.secondary, display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
                  <implementation.Concept />
                  <figcaption style={{ fontSize: 13, lineHeight: 1.55, color: theme.colors.gray[700] }}>
                    Annotated diagram of the setup this topic models.
                  </figcaption>
                </figure>
                <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
                  <ManimVisualization src={topic.manimSrc} title={topic.title} />
                  <figcaption style={{ fontSize: 13, lineHeight: 1.55, color: MUTED }}>
                    A worked-through animation of the same concept in motion.
                  </figcaption>
                </figure>
                {topic.realImage && <RealPhoto image={topic.realImage} />}
              </div>
            </section>
          )}

          {/* Playground */}
          <section
            id="playground"
            style={{ borderRadius: 32, background: NAVY, color: '#FFFFFF', padding: 28, display: 'flex', flexDirection: 'column', gap: 22, scrollMarginTop: 16 }}
          >
            <UnitHeading
              no={unitNo('playground')}
              kicker="Playground"
              title="Push it until it fails"
              dark
              aside={
                implementation ? (
                  <span style={{ fontSize: 14, color: theme.colors.lightBlue[300] }}>Move the sliders — every diagram and number updates live.</span>
                ) : undefined
              }
            />
            {implementation ? (
              <div style={{ borderRadius: 24, backgroundColor: '#FFFFFF', color: theme.colors.text.secondary, padding: theme.spacing[6] }}>
                <implementation.Playground />
              </div>
            ) : (
              <div style={{ padding: theme.spacing[6], borderRadius: 24, background: '#16255A', color: theme.colors.lightBlue[200] }}>
                Playground coming soon.
              </div>
            )}
          </section>

          {/* Practice */}
          {topic.challenges.length > 0 && (
            <section id="practice" style={{ display: 'flex', flexDirection: 'column', gap: 24, scrollMarginTop: 16 }}>
              <UnitHeading no={unitNo('practice')} kicker="Practice" title="Predict, then check" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: theme.spacing[3] }}>
                {topic.challenges.map((challenge, i) => (
                  <div key={i} style={{ padding: 22, borderRadius: 24, border: `2px solid ${theme.colors.text.primary}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: BLUE }}>CHALLENGE {i + 1}</div>
                    <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 21, lineHeight: 1.3, color: theme.colors.text.primary }}>{challenge}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Applications */}
          {topic.applications.length > 0 && (
            <section id="applications" style={{ display: 'flex', flexDirection: 'column', gap: 24, scrollMarginTop: 16 }}>
              <UnitHeading no={unitNo('applications')} kicker="In practice" title="Where this shows up" />
              <ApplicationsPanel applications={topic.applications} />
            </section>
          )}

          <ReferenceLinks title="Go deeper" references={topic.references} />

          {/* Prev / Next */}
          {(previous || next) && (
            <nav aria-label="Topic navigation" className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing[3] }}>
              {previous && previous.status === 'active' ? (
                <Link
                  to={`/courses/${course.id}/topics/${previous.id}`}
                  style={{ padding: 22, border: `2px solid ${theme.colors.text.primary}`, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: MUTED }}>← PREVIOUS</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 22, color: theme.colors.text.primary }}>{previous.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextHref && next ? (
                <Link to={nextHref} style={{ padding: 22, borderRadius: 24, backgroundColor: NAVY, color: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: LIME }}>NEXT →</span>
                  <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 22 }}>{next.title}</span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}
        </main>

        {/* Right rail */}
        <aside className="topic-rail" style={{ position: 'sticky', top: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <nav aria-label="On this page" style={{ borderRadius: 24, border: `1px solid ${theme.colors.border}`, padding: 20, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: MUTED, paddingBottom: 8 }}>On this page</div>
            {units.map((u) => {
              const on = u.id === activeUnit
              return (
                <a key={u.id} href={`#${u.id}`} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '5px 0', fontSize: 14, fontWeight: on ? 700 : 400, color: on ? BLUE : theme.colors.text.primary }}>
                  <span aria-hidden style={{ width: 8, height: 8, borderRadius: 4, background: on ? BLUE : theme.colors.gray[300] }} />
                  {u.label}
                </a>
              )
            })}
          </nav>

          {keyFormula && (
            <div style={{ borderRadius: 24, background: NAVY, color: '#FFFFFF', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: LIME }}>Key equation</div>
              <div style={{ fontSize: 22, overflowX: 'auto' }}>
                {keyFormula.latex ? (
                  <Formula latex={keyFormula.latex} />
                ) : (
                  <span style={{ fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic' }}>{keyFormula.formula}</span>
                )}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: theme.colors.lightBlue[300] }}>{keyFormula.label}</div>
              <a href="#formulas" style={{ fontSize: 13, fontWeight: 600, color: LIME }}>
                All formulas ↓
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

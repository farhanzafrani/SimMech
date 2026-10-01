import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { findCourse, firstActiveTopicId, courseDurationMinutes, courseLevelSpan } from '../config/curriculum'
import ReferenceLinks from '../components/ReferenceLinks'
import { theme } from '../styles/theme'

const NAVY = theme.colors.gray[900]
const BLUE = theme.colors.lightBlue[500]
const LIME = theme.colors.accent.light
const INK = theme.colors.text.primary
const MUTED = theme.colors.text.light

const heroChip = {
  height: 34,
  padding: '0 14px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 17,
  background: 'rgba(255,255,255,0.14)',
  border: '1px solid rgba(255,255,255,0.25)',
} as const

const sectionTitle = { margin: 0, fontSize: 28, letterSpacing: '-0.02em' } as const

const NODE_GAP = 112
const NODE_PAD = 56

export default function CoursePage() {
  const { courseId = '' } = useParams()
  const course = findCourse(courseId)
  const firstTopicId = course ? firstActiveTopicId(course) : undefined
  const [open, setOpen] = useState<string | null>(firstTopicId ?? null)

  if (!course) {
    return <Navigate to="/courses" replace />
  }

  const activeTopics = course.topics.filter((t) => t.status === 'active')
  const totalMinutes = courseDurationMinutes(course)
  const firstTopic = course.topics.find((t) => t.id === firstTopicId)
  const objectives = activeTopics.flatMap((t) => t.learningObjectives?.slice(0, 1) ?? []).slice(0, 6)
  const vizCount = course.topics.filter((t) => t.manimSrc).length
  const formulaCount = course.topics.reduce((n, t) => n + t.formulas.length, 0)

  // Learning-path strip: a zig-zag line through every topic, solid while topics are open, dotted after.
  const pathWidth = NODE_PAD * 2 + NODE_GAP * Math.max(course.topics.length - 1, 0)
  const pts = course.topics.map((_, i) => ({ x: NODE_PAD + i * NODE_GAP, y: i % 2 ? 150 : 56 }))
  const lastActive = course.topics.reduce((last, t, i) => (t.status === 'active' ? i : last), -1)
  const toPoints = (from: number, to: number) => pts.slice(from, to + 1).map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section
        className="hero-clip course-hero-grid"
        style={{
          position: 'relative',
          borderRadius: 32,
          background: 'radial-gradient(120% 100% at 85% 30%, #3D63FF 0%, #2B4FE3 45%, #1A35B8 100%)',
          color: '#FFFFFF',
          padding: '56px 56px 48px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 400px',
          gap: 56,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.8)', flexWrap: 'wrap' }}>
            <Link to="/courses">Courses</Link>
            <span>/</span>
            <span>{course.category}</span>
          </nav>
          <h1 style={{ margin: 0, color: '#FFFFFF', fontSize: 'clamp(44px, 6vw, 84px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
            {course.title}
          </h1>
          <div style={{ fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic', fontSize: 24, color: LIME }}>{course.symbol}</div>
          <p style={{ margin: 0, maxWidth: 600, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.88)' }}>{course.description}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 13, fontWeight: 600 }}>
            <span style={heroChip}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: LIME }} />
              {courseLevelSpan(course)}
            </span>
            <span style={heroChip}>{course.topics.length} topics</span>
            <span style={heroChip}>{activeTopics.length} playgrounds</span>
            {totalMinutes > 0 && <span style={heroChip}>{totalMinutes} min of reading</span>}
          </div>
          {firstTopicId && (
            <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
              <Link to={`/courses/${course.id}/topics/${firstTopicId}`} style={{ height: 54, padding: '0 26px', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 27, background: '#FFFFFF', color: INK, fontWeight: 700, fontSize: 15 }}>
                Start learning <span style={{ fontSize: 18 }}>→</span>
              </Link>
              <a href="#syllabus" style={{ height: 54, padding: '0 24px', display: 'flex', alignItems: 'center', borderRadius: 27, border: '1.5px solid rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 15 }}>
                View syllabus
              </a>
            </div>
          )}
        </div>

        {firstTopic && (
          <div style={{ alignSelf: 'end', background: '#FFFFFF', color: INK, borderRadius: 28, padding: 26, display: 'flex', flexDirection: 'column', gap: 18, boxShadow: theme.shadows.xl }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {[
                { v: String(course.topics.length), l: 'Topics' },
                { v: String(activeTopics.length), l: 'Live playgrounds' },
                { v: totalMinutes > 0 ? `${totalMinutes}m` : '—', l: 'Read time' },
                { v: String(formulaCount), l: 'Formulas' },
              ].map((s) => (
                <div key={s.l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 32, lineHeight: 1 }}>{s.v}</span>
                  <span style={{ fontSize: 13, color: MUTED }}>{s.l}</span>
                </div>
              ))}
            </div>
            <Link
              to={`/courses/${course.id}/topics/${firstTopic.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 20, background: theme.colors.bg.secondary }}
            >
              <span style={{ width: 48, height: 48, borderRadius: 16, background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.typography.fontFamily.heading }}>
                {String(course.topics.indexOf(firstTopic) + 1).padStart(2, '0')}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12, color: MUTED }}>Start here · Playground</span>
                <span style={{ fontWeight: 700 }}>{firstTopic.title}</span>
              </span>
              <span aria-hidden style={{ width: 36, height: 36, borderRadius: 18, background: NAVY, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</span>
            </Link>
          </div>
        )}
      </section>

      <div className="course-body-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0 }}>
          {/* Learning path */}
          <section style={{ borderRadius: 28, background: theme.colors.bg.secondary, padding: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
              <h2 style={sectionTitle}>Your learning path</h2>
              <span style={{ fontSize: 13, color: MUTED }}>Each topic: formulas → visualization → playground → practice</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ position: 'relative', width: pathWidth, height: 230 }}>
                <svg width={pathWidth} height="230" fill="none" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
                  {lastActive > 0 && <polyline points={toPoints(0, lastActive)} stroke={BLUE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
                  {lastActive >= 0 && lastActive < pts.length - 1 && (
                    <polyline points={toPoints(lastActive, pts.length - 1)} stroke={theme.colors.gray[300]} strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                  {lastActive < 0 && pts.length > 1 && (
                    <polyline points={toPoints(0, pts.length - 1)} stroke={theme.colors.gray[300]} strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </svg>
                {course.topics.map((t, i) => {
                  const isActive = t.status === 'active'
                  const isStart = t.id === firstTopicId
                  const size = isStart ? 76 : 58
                  const node = (
                    <>
                      <span
                        style={{
                          width: size,
                          height: size,
                          borderRadius: '50%',
                          background: isStart ? BLUE : isActive ? LIME : '#FFFFFF',
                          color: isStart ? '#FFFFFF' : INK,
                          border: isStart ? `6px solid ${theme.colors.lightBlue[200]}` : isActive ? '0' : `2px solid ${theme.colors.gray[300]}`,
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: theme.typography.fontFamily.heading,
                          fontSize: 18,
                          boxShadow: isStart ? '0 14px 30px rgba(43,79,227,0.4)' : 'none',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.25, color: isActive ? INK : MUTED, background: theme.colors.bg.secondary, padding: '2px 6px', borderRadius: 8 }}>{t.title}</span>
                    </>
                  )
                  const pos = {
                    position: 'absolute',
                    left: pts[i].x,
                    top: pts[i].y - size / 2,
                    width: NODE_GAP - 8,
                    marginLeft: -(NODE_GAP - 8) / 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  } as const
                  return isActive ? (
                    <Link key={t.id} to={`/courses/${course.id}/topics/${t.id}`} style={pos}>
                      {node}
                    </Link>
                  ) : (
                    <div key={t.id} style={pos}>
                      {node}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {objectives.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 style={sectionTitle}>What you’ll learn</h2>
              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                {objectives.map((o) => (
                  <div key={o} style={{ display: 'flex', gap: 12, padding: 18, borderRadius: 20, border: `1px solid ${theme.colors.border}`, fontSize: 15, lineHeight: 1.5 }}>
                    <span aria-hidden style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 13, background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                      ✓
                    </span>
                    {o}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Syllabus */}
          <section id="syllabus" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={sectionTitle}>Syllabus</h2>
              <span style={{ fontSize: 13, color: MUTED }}>
                {course.topics.length} topics · {activeTopics.length} open
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {course.topics.map((topic, index) => {
                const isActive = topic.status === 'active'
                const isOpen = open === topic.id
                const isStart = topic.id === firstTopicId
                const keyFormula = topic.formulas.find((f) => f.emphasis)?.formula ?? topic.formulas[0]?.formula
                return (
                  <div
                    key={topic.id}
                    style={{
                      borderRadius: 22,
                      background: isOpen ? theme.colors.bg.secondary : '#FFFFFF',
                      border: `1px solid ${isStart ? BLUE : theme.colors.border}`,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : topic.id)}
                      aria-expanded={isOpen}
                      style={{ width: '100%', minHeight: 76, padding: '14px 20px', border: 0, background: 'transparent', display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'inherit', color: INK, textAlign: 'left', cursor: 'pointer' }}
                    >
                      <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 14, background: isStart ? BLUE : isActive ? LIME : '#FFFFFF', border: isActive ? 0 : `1px solid ${theme.colors.border}`, color: isStart ? '#FFFFFF' : INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.typography.fontFamily.heading, fontSize: 16 }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: 17, fontWeight: 700 }}>{topic.title}</span>
                        {keyFormula && (
                          <span style={{ fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic', fontSize: 15, color: MUTED }}>{keyFormula}</span>
                        )}
                      </span>
                      <span style={{ padding: '5px 11px', borderRadius: 12, background: isStart ? BLUE : isActive ? '#E9F8C0' : '#FFFFFF', border: isActive ? 0 : `1px solid ${theme.colors.border}`, color: isStart ? '#FFFFFF' : INK, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {isActive ? 'Playground open' : 'Coming soon'}
                      </span>
                      <span aria-hidden style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 17, background: '#FFFFFF', border: `1px solid ${theme.colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 20px 20px 80px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: theme.colors.text.secondary }}>{topic.summary}</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', fontSize: 12, fontWeight: 600 }}>
                          <span style={{ padding: '5px 11px', borderRadius: 12, background: '#FFFFFF' }}>{topic.level}</span>
                          <span style={{ padding: '5px 11px', borderRadius: 12, background: '#FFFFFF' }}>{topic.duration}</span>
                          {topic.formulas.length > 0 && <span style={{ padding: '5px 11px', borderRadius: 12, background: '#FFFFFF' }}>{topic.formulas.length} formulas</span>}
                          {topic.manimSrc && <span style={{ padding: '5px 11px', borderRadius: 12, background: '#FFFFFF' }}>Animation</span>}
                          {isActive && <span style={{ padding: '5px 11px', borderRadius: 12, background: LIME }}>Playground</span>}
                        </div>
                        {isActive && (
                          <Link to={`/courses/${course.id}/topics/${topic.id}`} style={{ alignSelf: 'flex-start', height: 44, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 22, background: NAVY, color: '#FFFFFF', fontSize: 14, fontWeight: 700 }}>
                            Open lesson <span aria-hidden>→</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ borderRadius: 28, background: NAVY, color: '#FFFFFF', padding: 26, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 22 }}>This course includes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15 }}>
              {[
                { mark: 'ƒ', text: `${formulaCount} formula cards`, accent: false, serif: true },
                ...(vizCount > 0 ? [{ mark: '∿', text: `${vizCount} animated visualizations`, accent: false, serif: false }] : []),
                { mark: '⇄', text: `${activeTopics.length} interactive playgrounds`, accent: true, serif: false },
                { mark: '?', text: 'Practice challenges in each topic', accent: false, serif: false },
              ].map((row) => (
                <div key={row.text} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span aria-hidden style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 10, background: row.accent ? LIME : BLUE, color: row.accent ? INK : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: row.serif ? theme.typography.fontFamily.serif : 'inherit', fontStyle: row.serif ? 'italic' : 'normal', fontWeight: 700 }}>
                    {row.mark}
                  </span>
                  {row.text}
                </div>
              ))}
            </div>
            {firstTopic && (
              <Link to={`/courses/${course.id}/topics/${firstTopic.id}`} style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 25, background: LIME, color: INK, fontWeight: 700, textAlign: 'center', padding: '0 16px' }}>
                Start: {firstTopic.title}
              </Link>
            )}
          </div>

          {course.prerequisites.length > 0 && (
            <div style={{ borderRadius: 28, background: theme.colors.bg.secondary, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 700 }}>Before you start</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 13, fontWeight: 600 }}>
                {course.prerequisites.map((p) => (
                  <span key={p} style={{ padding: '7px 12px', borderRadius: 15, background: '#FFFFFF' }}>{p}</span>
                ))}
              </div>
            </div>
          )}

          {activeTopics.length > 0 && (
            <div style={{ borderRadius: 28, border: `1px solid ${theme.colors.border}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 700 }}>Course formula sheet</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {activeTopics.map((topic) => {
                  const f = topic.formulas.find((x) => x.emphasis) ?? topic.formulas[0]
                  if (!f) return null
                  return (
                    <div key={topic.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: `1px dashed ${theme.colors.border}`, fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic', fontSize: 16 }}>
                      <span>{f.formula}</span>
                      <span style={{ fontFamily: theme.typography.fontFamily.mono, fontStyle: 'normal', fontSize: 12, color: MUTED }}>
                        {String(course.topics.indexOf(topic) + 1).padStart(2, '0')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <ReferenceLinks title="Free course material" references={course.references} />
        </aside>
      </div>
    </div>
  )
}

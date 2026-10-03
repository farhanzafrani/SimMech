import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CURRICULUM, firstActiveTopicId, type CourseMeta } from '../config/curriculum'
import { HeroGears, gearPath } from '../components/GearArt'
import { theme } from '../styles/theme'

const NAVY = theme.colors.gray[900]
const BLUE = theme.colors.lightBlue[500]
const LIME = theme.colors.accent.light
const INK = theme.colors.text.primary

interface CardStyle {
  bg: string
  fg: string
  sub: string
  iconBg: string
  iconFg: string
  pillBg: string
  pillFg: string
  dot: string
  chipBg: string
  arrowBg: string
  arrowFg: string
}

const VARIANTS: Record<'blue' | 'navy' | 'lime' | 'light', CardStyle> = {
  blue: { bg: BLUE, fg: '#FFFFFF', sub: LIME, iconBg: '#FFFFFF', iconFg: BLUE, pillBg: 'rgba(255,255,255,0.16)', pillFg: '#FFFFFF', dot: LIME, chipBg: 'rgba(255,255,255,0.16)', arrowBg: '#FFFFFF', arrowFg: INK },
  navy: { bg: NAVY, fg: '#FFFFFF', sub: LIME, iconBg: BLUE, iconFg: '#FFFFFF', pillBg: 'rgba(255,255,255,0.12)', pillFg: '#FFFFFF', dot: LIME, chipBg: 'rgba(255,255,255,0.12)', arrowBg: LIME, arrowFg: INK },
  lime: { bg: LIME, fg: INK, sub: '#1F3BB3', iconBg: NAVY, iconFg: LIME, pillBg: 'rgba(17,17,19,0.08)', pillFg: INK, dot: BLUE, chipBg: 'rgba(255,255,255,0.6)', arrowBg: BLUE, arrowFg: '#FFFFFF' },
  light: { bg: theme.colors.bg.secondary, fg: INK, sub: BLUE, iconBg: '#FFFFFF', iconFg: BLUE, pillBg: '#FFFFFF', pillFg: INK, dot: BLUE, chipBg: '#FFFFFF', arrowBg: BLUE, arrowFg: '#FFFFFF' },
}

/** One icon + colour treatment per course category (the five MIT groupings). */
const CATEGORY_STYLE: Record<string, { variant: keyof typeof VARIANTS; icon: string }> = {
  'Mechanics of solids': { variant: 'blue', icon: 'M4 22 H44 V30 H4 Z M8 30 L5 37 H11 Z M40 30 L37 37 H43 Z M24 4 V17 M20 13 L24 18 L28 13' },
  'Machine elements & design': { variant: 'navy', icon: 'M24 14 A10 10 0 1 0 24.01 14 M24 4 V9 M24 39 V44 M4 24 H9 M39 24 H44 M10 10 L13.5 13.5 M34.5 34.5 L38 38 M38 10 L34.5 13.5 M10 38 L13.5 34.5' },
  'Dynamics & control': { variant: 'light', icon: 'M4 40 Q 22 -2 44 36 M4 40 H44 M33 17 L38 22' },
  'Thermal & fluids': { variant: 'lime', icon: 'M12 10 V42 H36 V10 M12 26 H36 M24 26 V4 M18 4 H30' },
  'Design & manufacturing': { variant: 'light', icon: 'M8 38 L16 14 L36 20 L40 38 M6 38 H42 M16 14 L40 38' },
}
const FALLBACK_STYLE = CATEGORY_STYLE['Mechanics of solids']

/** Column spans on the 4-up bento grid, by position in the full catalog, so the layout stays put under a filter. */
const SPANS = [2, 1, 1, 2, 2]

function CourseCard({ course, span }: { course: CourseMeta; span: number }) {
  const { variant, icon } = CATEGORY_STYLE[course.category] ?? FALLBACK_STYLE
  const c = VARIANTS[variant]
  const big = span === 2
  const shown = course.topics.slice(0, big ? 4 : 3)
  const extra = course.topics.length - shown.length

  return (
    <Link
      to={`/courses/${course.id}`}
      className="hover-lift"
      style={{
        gridColumn: `span ${span}`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '28px',
        background: c.bg,
        color: c.fg,
        padding: '26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: theme.spacing[2] }}>
        <span style={{ width: 56, height: 56, borderRadius: 18, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="34" height="34" viewBox="0 0 48 48" fill="none" stroke={c.iconFg} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={icon} />
          </svg>
        </span>
        <span style={{ height: 30, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 7, borderRadius: 15, background: c.pillBg, color: c.pillFg, fontSize: 12, fontWeight: 600, textAlign: 'right' }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: c.dot, flexShrink: 0 }} />
          {course.category}
        </span>
      </div>

      {big && (
        <svg aria-hidden width="300" height="300" viewBox="0 0 48 48" fill="none" stroke={c.fg} strokeWidth="0.8" strokeOpacity="0.16" style={{ position: 'absolute', right: -40, bottom: -60 }}>
          <path d={icon} />
        </svg>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: theme.typography.fontFamily.serif, fontStyle: 'italic', fontSize: 18, color: c.sub }}>{course.symbol}</div>
        <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: big ? 44 : 28, lineHeight: 1.02, letterSpacing: '-0.025em' }}>{course.title}</div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        {shown.map((t) => (
          <span key={t.id} style={{ padding: '5px 10px', borderRadius: 12, background: c.chipBg, fontSize: 12, fontWeight: 500 }}>
            {t.title}
          </span>
        ))}
        {extra > 0 && <span style={{ padding: '5px 10px', fontSize: 12, fontWeight: 600 }}>+{extra} more</span>}
        <span aria-hidden style={{ marginLeft: 'auto', width: 40, height: 40, borderRadius: 20, background: c.arrowBg, color: c.arrowFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
          ↗
        </span>
      </div>
    </Link>
  )
}

/** A tiny live beam: drag the sliders, the numbers follow (simply supported, centre load, 100×200 steel). */
function MiniPlayground() {
  const [P, setP] = useState(20) // kN
  const [L, setL] = useState(6) // m
  const b = 0.1
  const h = 0.2
  const E = 200e9
  const I = (b * h ** 3) / 12
  const sigma = ((P * 1e3 * L) / 4) * (h / 2) / I / 1e6 // MPa
  const delta = ((P * 1e3 * L ** 3) / (48 * E * I)) * 1e3 // mm

  const slider = (label: string, value: number, unit: string, min: number, max: number, set: (n: number) => void) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
        <span>{label}</span>
        <b>
          {value} {unit}
        </b>
      </span>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => set(Number(e.target.value))} />
    </label>
  )

  return (
    <div style={{ borderRadius: 28, background: theme.colors.bg.secondary, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Inside a playground</span>
        <span style={{ fontFamily: theme.typography.fontFamily.mono, fontSize: 12, color: theme.colors.text.light }}>Beam builder</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {slider('Load P', P, 'kN', 5, 50, setP)}
        {slider('Span L', L, 'm', 2, 10, setL)}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
        <div style={{ flexGrow: 1, padding: '10px 14px', borderRadius: 16, background: '#FFFFFF' }}>
          <div style={{ fontSize: 11, color: theme.colors.text.light }}>σ max</div>
          <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 20 }}>{sigma.toFixed(1)} MPa</div>
        </div>
        <div style={{ flexGrow: 1, padding: '10px 14px', borderRadius: 16, background: NAVY, color: '#FFFFFF' }}>
          <div style={{ fontSize: 11, color: LIME }}>δ max</div>
          <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 20 }}>{delta.toFixed(2)} mm</div>
        </div>
      </div>
    </div>
  )
}

const floatChip = {
  position: 'absolute',
  height: 38,
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 19,
  background: 'rgba(255,255,255,0.92)',
  color: INK,
  fontSize: 13,
  fontWeight: 600,
  boxShadow: '0 10px 30px rgba(10,26,107,0.35)',
} as const

export default function CourseCatalogPage() {
  const categories = Array.from(new Set(CURRICULUM.map((c) => c.category)))
  const [filter, setFilter] = useState<string>('All')

  const firstCourse = CURRICULUM[0]
  const firstTopicId = firstCourse ? firstActiveTopicId(firstCourse) : undefined
  const liveTopicCount = CURRICULUM.flatMap((c) => c.topics).filter((t) => t.status === 'active').length

  const visible = CURRICULUM.map((course, i) => ({ course, span: SPANS[i % SPANS.length] })).filter(
    ({ course }) => filter === 'All' || course.category === filter,
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero */}
      <section
        className="hero-clip hero-grid"
        style={{
          position: 'relative',
          minHeight: 620,
          borderRadius: 32,
          background: 'radial-gradient(120% 90% at 78% 40%, #3D63FF 0%, #2B4FE3 45%, #1A35B8 100%)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          color: '#FFFFFF',
        }}
      >
        <div style={{ padding: '72px 24px 56px 64px', display: 'flex', flexDirection: 'column', gap: 28, zIndex: 1 }} className="hero-copy">
          <div style={{ alignSelf: 'flex-start', height: 34, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 17, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.28)', fontSize: 13, fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: LIME }} />
            Mechanical engineering, interactive
          </div>
          <h1
            className="hero-title"
            style={{ margin: 0, color: '#FFFFFF', fontSize: 92, lineHeight: 0.95, letterSpacing: '-0.025em', display: 'flex', flexDirection: 'column', gap: 4 }}
          >
            <span>Formula.</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <span aria-hidden style={{ display: 'flex' }}>
                {[
                  { ch: 'σ', bg: '#FFFFFF', fg: BLUE, ml: 0, italic: true },
                  { ch: 'δ', bg: NAVY, fg: '#FFFFFF', ml: -16, italic: true },
                  { ch: '+', bg: LIME, fg: INK, ml: -16, italic: false },
                ].map((b) => (
                  <span
                    key={b.ch}
                    style={{
                      width: 62,
                      height: 62,
                      marginLeft: b.ml,
                      borderRadius: 31,
                      background: b.bg,
                      color: b.fg,
                      border: `3px solid ${BLUE}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: b.italic ? theme.typography.fontFamily.serif : theme.typography.fontFamily.base,
                      fontStyle: b.italic ? 'italic' : 'normal',
                      fontSize: 30,
                      letterSpacing: 0,
                    }}
                  >
                    {b.ch}
                  </span>
                ))}
              </span>
              Visualize.
            </span>
            <span style={{ color: LIME }}>Play.</span>
          </h1>
          <p style={{ margin: 0, maxWidth: 470, fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.86)' }}>
            Every mechanical engineering topic: the governing equations, a picture of what they mean, and a live model you can push until it fails.{' '}
            {liveTopicCount} playgrounds are open now.
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="#courses" style={{ height: 54, padding: '0 26px', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 27, background: '#FFFFFF', color: INK, fontWeight: 700, fontSize: 15 }}>
              Explore courses <span style={{ fontSize: 18 }}>→</span>
            </a>
            {firstCourse && firstTopicId && (
              <Link
                to={`/courses/${firstCourse.id}/topics/${firstTopicId}`}
                aria-label="Open a playground"
                style={{ width: 54, height: 54, borderRadius: 27, background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                  <path d="M5 3 L15 9 L5 15 Z" fill={INK} />
                </svg>
              </Link>
            )}
          </div>
        </div>

        <div className="hero-art" style={{ position: 'relative' }} aria-hidden>
          <HeroGears />
          <div style={{ ...floatChip, left: 30, top: 150 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, border: `3px solid ${BLUE}` }} />
            Live formulas
          </div>
          <div style={{ ...floatChip, right: 60, top: 560 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, border: `3px solid ${BLUE}` }} />
            Real-time playground
          </div>
          <div style={{ ...floatChip, left: 80, top: 470, background: NAVY, color: '#FFFFFF', boxShadow: 'none' }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: LIME }} />
            Checked against real limits
          </div>
        </div>
      </section>

      {/* Bento strip */}
      <section className="strip-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1.35fr', gap: 20, minHeight: 260 }}>
        <div style={{ borderRadius: 28, background: NAVY, color: '#FFFFFF', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontSize: 13, color: theme.colors.lightBlue[300] }}>How every topic works</div>
          <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 26, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Read the equation, see what it means, then change the inputs and watch the result.
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 12, fontWeight: 600, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 12px', borderRadius: 14, background: '#FFFFFF', color: INK }}>01 Formula</span>
            <span style={{ padding: '6px 12px', borderRadius: 14, background: BLUE }}>02 Visualize</span>
            <span style={{ padding: '6px 12px', borderRadius: 14, background: LIME, color: INK }}>03 Play</span>
          </div>
        </div>

        <MiniPlayground />

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, background: 'radial-gradient(90% 120% at 85% 70%, #F4FFD0 0%, #DDF77F 45%, #C8F04B 100%)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: 30, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 330, position: 'relative' }}>
            Checked against the limits real engineers design to.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 380, fontSize: 13, fontWeight: 600, position: 'relative' }}>
            <span style={{ padding: '7px 12px', borderRadius: 15, background: NAVY, color: '#FFFFFF' }}>Yield strength</span>
            <span style={{ padding: '7px 12px', borderRadius: 15, background: '#FFFFFF' }}>Deflection L/360</span>
            <span style={{ padding: '7px 12px', borderRadius: 15, background: '#FFFFFF' }}>Laminar Re &lt; 2300</span>
            <span style={{ padding: '7px 12px', borderRadius: 15, background: '#FFFFFF' }}>Euler buckling</span>
          </div>
          <svg aria-hidden width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'absolute', right: -30, top: 10 }}>
            <path d={gearPath(110, 110, 100, 84, 14)} stroke={INK} strokeWidth="2" strokeOpacity="0.85" />
            <circle cx="110" cy="110" r="26" stroke={INK} strokeWidth="2" />
            <circle cx="110" cy="110" r="6" fill={BLUE} />
          </svg>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ alignSelf: 'flex-start', height: 30, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 15, background: theme.colors.bg.secondary, fontSize: 13, fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: BLUE }} />
              {CURRICULUM.length} courses
            </div>
            <h2 style={{ margin: 0, fontSize: 'clamp(40px, 6vw, 68px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
              Pick a course.
              <br />
              <span style={{ color: BLUE }}>Then pull it apart.</span>
            </h2>
          </div>
          <div role="group" aria-label="Filter courses" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                style={{
                  height: 44,
                  padding: '0 20px',
                  borderRadius: 22,
                  border: 0,
                  background: filter === c ? NAVY : theme.colors.bg.secondary,
                  color: filter === c ? '#FFFFFF' : INK,
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridAutoRows: 'minmax(290px, auto)', gridAutoFlow: 'dense', gap: 20 }}>
          {visible.map(({ course, span }) => (
            <CourseCard key={course.id} course={course} span={span} />
          ))}
        </div>
      </section>
    </div>
  )
}

import { Link, NavLink, Outlet, useLocation, useMatch } from 'react-router-dom'
import { useEffect } from 'react'
import Logo from './Logo'
import { theme } from '../../styles/theme'

export default function AppShell() {
  const { pathname, hash } = useLocation()
  // Lesson pages carry their own header (back link, unit nav, next lesson).
  const isLesson = Boolean(useMatch('/courses/:courseId/topics/:topicId'))

  // Land at the top of each new page; honour in-page anchors (#playground …) when present.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return (
    <div className="app-frame">
      <div className="app-panel">
        {!isLesson && (
        <header style={{ minHeight: '64px', display: 'flex', alignItems: 'center', gap: theme.spacing[6], padding: '0 8px' }}>
          <Link to="/courses" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo />
            <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '22px', letterSpacing: '-0.02em', color: theme.colors.text.primary }}>
              Free Body
            </span>
          </Link>

          <nav className="app-nav" aria-label="Main" style={{ display: 'flex', justifyContent: 'flex-start', gap: '36px' }}>
            <NavLink to="/courses" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Courses
            </NavLink>
          </nav>
          <input
            type="search"
            aria-label="Search topics and formulas"
            placeholder="Search a topic or formula"
            className="app-search"
            style={{
              width: '100%',
              maxWidth: '300px',
              marginLeft: 'auto',
              height: '44px',
              padding: '0 20px',
              border: 'none',
              borderRadius: '22px',
              backgroundColor: theme.colors.bg.secondary,
              fontFamily: 'inherit',
              fontSize: '14px',
              color: theme.colors.text.primary,
            }}
          />
        </header>
        )}

        <main className="app-main">
          <Outlet />
        </main>

        <footer
          style={{
            minHeight: '72px',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: theme.spacing[3],
            borderRadius: '24px',
            background: theme.colors.gray[900],
            color: '#FFFFFF',
            fontSize: '14px',
          }}
        >
          <span style={{ fontFamily: theme.typography.fontFamily.heading, fontSize: '18px' }}>Free Body</span>
          <span style={{ color: theme.colors.lightBlue[300] }}>Mechanical engineering, interactive.</span>
        </footer>
      </div>
    </div>
  )
}

import { Link, Outlet } from 'react-router-dom'
import Logo from './Logo'
import { theme } from '../../styles/theme'

export default function AppShell() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: theme.colors.bg.secondary }}>
      <header
        style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing[10],
          padding: `0 ${theme.spacing[8]}`,
          backgroundColor: theme.colors.bg.primary,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <Link to="/courses" style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], textDecoration: 'none' }}>
          <Logo />
          <span
            style={{
              fontFamily: theme.typography.fontFamily.heading,
              fontWeight: 700,
              fontSize: '20px',
              color: theme.colors.text.primary,
            }}
          >
            SimMec
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: theme.spacing[6], fontSize: '14px', fontWeight: 500 }}>
          <Link to="/courses" style={{ textDecoration: 'none', color: theme.colors.accent[600] }}>
            Courses
          </Link>
        </nav>

        <div style={{ flexGrow: 1 }} />

        <input
          type="search"
          aria-label="Search topics and formulas"
          placeholder="Search a topic or formula"
          style={{
            width: '320px',
            height: '40px',
            padding: `0 ${theme.spacing[3]}`,
            border: `1px solid ${theme.colors.gray[400]}`,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.bg.secondary,
            fontFamily: 'inherit',
            fontSize: '14px',
            color: theme.colors.text.primary,
          }}
        />
      </header>
      <Outlet />
    </div>
  )
}

/**
 * Free Body design system
 * Cobalt blue + signal lime on a navy ink, set in big rounded "bento" surfaces.
 * Type: DM Serif Display (headings), DM Sans (body), STIX Two Text (equations),
 * JetBrains Mono (data).
 */

export const theme = {
  // Primary Colors
  colors: {
    // Cobalt — primary accent (CTAs, identity, links)
    lightBlue: {
      50: '#EEF1FF',
      100: '#DCE3FF',
      200: '#C9D4FF',
      300: '#A9BBFF',
      400: '#7D97FF',
      500: '#2B4FE3', // Primary accent
      600: '#1F3BB3',
      700: '#1A35B8',
      800: '#16255A',
      900: '#0E1A3D',
    },

    // Neutrals — cool greys with a navy ink
    gray: {
      50: '#FFFFFF', // Card surface
      100: '#F1F1F4', // Soft panel surface
      200: '#E4E4EA', // Hairline border
      300: '#C9C9D2',
      400: '#9A9AA5',
      500: '#7A7A85',
      600: '#55555E',
      700: '#2C3D7A',
      800: '#22336E', // Body ink
      900: '#0E1A3D', // Navy — dark panels
    },

    // Accent Colors
    success: '#2E9B54',
    warning: '#E0A100',
    error: '#E2483D',
    info: '#2B4FE3',

    // Signal lime — highlights, active marks, "on" state
    accent: {
      500: '#2B4FE3',
      600: '#1F3BB3',
      light: '#C8F04B',
    },

    // Extra signal colors — category tags, step markers.
    spectrum: {
      cyan: '#2B4FE3',
      coral: '#E2483D',
      sun: '#E0A100',
      leaf: '#8FD400',
      violet: '#7B5CFA',
      lime: '#C8F04B',
    },

    // Semantic
    text: {
      primary: '#111113',
      secondary: '#22336E',
      light: '#55555E',
    },
    bg: {
      primary: '#FFFFFF',
      secondary: '#F1F1F4',
      tertiary: '#EEF1FF',
    },
    border: '#E4E4EA',
  },

  // Typography
  typography: {
    fontFamily: {
      heading: '"DM Serif Display", "Georgia", serif',
      base: '"DM Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, monospace',
      serif: '"STIX Two Text", "Georgia", serif',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
  },

  // Shadows — soft, low-contrast; surfaces are separated by tone more than blur
  shadows: {
    xs: '0 1px 2px 0 rgba(14, 26, 61, 0.05)',
    sm: '0 2px 6px 0 rgba(14, 26, 61, 0.07)',
    base: '0 6px 16px 0 rgba(14, 26, 61, 0.08)',
    md: '0 10px 28px 0 rgba(14, 26, 61, 0.10)',
    lg: '0 20px 44px 0 rgba(14, 26, 61, 0.14)',
    xl: '0 30px 60px 0 rgba(10, 26, 107, 0.30)',
  },

  // Border Radius — large, friendly "bento" corners
  radius: {
    none: '0',
    sm: '0.5rem',     // 8px
    base: '0.625rem', // 10px
    md: '0.875rem',   // 14px
    lg: '1.25rem',    // 20px
    xl: '1.75rem',    // 28px
    '2xl': '2.25rem', // 36px
    full: '9999px',
  },

  // Z-index
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    backdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
} as const;

// Component-specific styles (for inline React styles only - no hover/media queries)
export const componentStyles = {
  // Visualization Areas
  visualization: {
    background: theme.colors.bg.secondary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[6],
    minHeight: '400px',
  },

  // Info Boxes
  infoBox: {
    background: theme.colors.lightBlue[50],
    border: `1px solid ${theme.colors.lightBlue[200]}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing[4],
    color: theme.colors.text.primary,
  },

  // Code Blocks
  codeBlock: {
    background: theme.colors.gray[900],
    color: '#e5e7eb',
    borderRadius: theme.radius.md,
    padding: theme.spacing[4],
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.sm,
    overflowX: 'auto' as const,
  },
};

// Dark mode theme (optional)
export const darkTheme = {
  colors: {
    ...theme.colors,
    text: {
      primary: '#f3f4f6',
      secondary: '#d1d5db',
      light: '#9ca3af',
    },
    bg: {
      primary: '#111827',
      secondary: '#1f2937',
      tertiary: '#1a3a42',
    },
    border: '#374151',
  },
};

export type Theme = typeof theme;
export type ComponentStyles = typeof componentStyles;

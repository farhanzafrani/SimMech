/**
 * SimMec Design System — "Free Body"
 * Warm paper background, editorial technical-drafting aesthetic.
 */

export const theme = {
  // Primary Colors
  colors: {
    // Blue accent (visualization / secondary actions) — was "lightBlue"
    lightBlue: {
      50: '#E9F0F8',
      100: '#D3E1F1',
      200: '#A7C3E3',
      300: '#7BA5D5',
      400: '#4676AE',
      500: '#1E4E8C', // Primary accent blue
      600: '#1A4478',
      700: '#153864',
      800: '#102A4A',
      900: '#0A1D33',
    },

    // Warm paper / ink neutrals — was "gray"
    gray: {
      50: '#FBFAF6', // Card surface
      100: '#F3F0E8', // Page background
      200: '#E4DFD2',
      300: '#D6D1C4', // Border
      400: '#C9C3B4', // Input border
      500: '#9AA0A8',
      600: '#6B7079',
      700: '#4F5560',
      800: '#2A2F36', // Body ink
      900: '#16191D', // Primary ink
    },

    // Accent Colors
    success: '#2F6F4E',
    warning: '#B8400C',
    error: '#9A3412',
    info: '#1E4E8C',

    // Orange accent (primary CTAs / highlights)
    accent: {
      500: '#C2410C',
      600: '#B8400C',
      light: '#F3A57E',
    },

    // Semantic
    text: {
      primary: '#16191D',
      secondary: '#3F454E',
      light: '#6B7079',
    },
    bg: {
      primary: '#FBFAF6',
      secondary: '#F3F0E8',
      tertiary: '#E9F0F8',
    },
    border: '#D6D1C4',
  },

  // Typography
  typography: {
    fontFamily: {
      // Headings: distinctive geometric sans
      heading: '"Space Grotesk", "Inter", "Segoe UI", sans-serif',
      // Body: clean, highly readable
      base: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
      // Code / labels: monospace
      mono: '"IBM Plex Mono", "Fira Code", "SF Mono", Monaco, monospace',
      // Formulas: italic serif
      serif: '"STIX Two Text", "Times New Roman", serif',
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

  // Shadows — hard, offset (drafting-table feel), no blur
  shadows: {
    xs: '0 1px 2px 0 rgba(22, 25, 29, 0.06)',
    sm: '0 1px 3px 0 rgba(22, 25, 29, 0.08)',
    base: '4px 4px 0 #16191D',
    md: '6px 6px 0 #16191D',
    lg: '10px 10px 0 #16191D',
    xl: '14px 14px 0 #16191D',
  },

  // Border Radius — small, drafted corners rather than soft/rounded
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.5rem',
    '2xl': '0.5rem',
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
    background: theme.colors.bg.primary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing[6],
    minHeight: '400px',
  },

  // Info Boxes
  infoBox: {
    background: theme.colors.bg.primary,
    border: `1px solid ${theme.colors.border}`,
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

export type Theme = typeof theme;
export type ComponentStyles = typeof componentStyles;

/**
 * SimMec Color Theme System
 * Light Gray + Light Blue Design
 */

export const theme = {
  // Primary Colors
  colors: {
    // Light Blue Palette
    lightBlue: {
      50: '#f0f9fc',
      100: '#e0f2f9',
      200: '#c1e6f4',
      300: '#a1d9f0',
      400: '#70c8eb',
      500: '#4a9bb5',  // Primary Blue
      600: '#3a8fa5',
      700: '#2a7f95',
      800: '#1a6f85',
      900: '#0a5f75',
    },

    // Light Gray Palette
    gray: {
      50: '#f9fafb',
      100: '#f5f7fa',   // Light Gray (Secondary BG)
      200: '#eef2f7',
      300: '#e5eaf2',
      400: '#d1dce9',
      500: '#9ca3af',
      600: '#6b7280',
      700: '#4b5563',
      800: '#2c3e50',   // Dark Gray (Text)
      900: '#1a202c',
    },

    // Accent Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#4a9bb5',

    // Semantic
    text: {
      primary: '#2c3e50',      // Dark Gray
      secondary: '#6b7280',
      light: '#9ca3af',
    },
    bg: {
      primary: '#ffffff',
      secondary: '#f5f7fa',    // Light Gray
      tertiary: '#e0f2f9',     // Light Blue
    },
    border: '#e5eaf2',
  },

  // Typography - Eye-catching fonts
  typography: {
    fontFamily: {
      // Headings: Bold, modern, eye-catching
      heading: '"Poppins", "Inter", "Segoe UI", sans-serif',
      // Body: Clean, highly readable
      base: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
      // Code: Monospace, professional
      mono: '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, monospace',
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
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
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
    background: theme.colors.bg.secondary,  // Light Gray
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

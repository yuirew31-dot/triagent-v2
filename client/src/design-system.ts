/**
 * AI Workspace Design System v1.0
 * Minimal, white interface with clean hierarchy
 */

// ============================================
// COLOR SYSTEM
// ============================================

export const colors = {
  // Base Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FB',
  border: '#E6EAF0',
  textPrimary: '#111111',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // Accent Themes
  accentChatGPT: '#111111',
  accentGemini: {
    primary: '#4285F4',
    gradient: ['#4285F4', '#7B61FF', '#FF6EC7'],
  },
  accentClaude: '#D97706',
  accentGreen: '#22C55E',
  accentLime: '#84CC16',
  accentPinkLavender: {
    gradient: ['#F472B6', '#E879F9', '#A855F7'],
  },

  // System Colors
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',

  // Semantic
  loading: '#3B82F6',
  disabled: '#D1D5DB',
  divider: '#F3F4F6',
};

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// ============================================
// SPACING & DIMENSIONS
// ============================================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
};

export const dimensions = {
  sidebarWidth: '280px',
  sidebarWidthMin: '280px',
  sidebarWidthMax: '340px',
  topBarHeight: '56px',
  inputAreaMinHeight: '56px',
  inputAreaMaxHeight: '280px', // 10 lines
  chatMaxWidth: '960px',
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    xl: '24px',
  },
};

// ============================================
// ANIMATIONS
// ============================================

export const animations = {
  hover: {
    scale: '1.02',
    duration: '150ms',
    timing: 'ease-in-out',
  },
  click: {
    duration: '100ms',
    timing: 'ease-out',
  },
  messageAppear: {
    duration: '200ms',
    timing: 'ease-out',
  },
  loading: {
    duration: '800ms',
    timing: 'ease-in-out',
  },
};

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================
// THEME PRESETS
// ============================================

export const themePresets = {
  chatgpt: {
    accent: colors.accentChatGPT,
    name: 'ChatGPT',
  },
  gemini: {
    accent: colors.accentGemini.primary,
    gradient: colors.accentGemini.gradient,
    name: 'Gemini',
  },
  claude: {
    accent: colors.accentClaude,
    name: 'Claude',
  },
  green: {
    accent: colors.accentGreen,
    name: 'Green',
  },
  lime: {
    accent: colors.accentLime,
    name: 'Lime',
  },
  pinkLavender: {
    gradient: colors.accentPinkLavender.gradient,
    name: 'Pink Lavender',
  },
};

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
};

// ============================================
// Z-INDEX SYSTEM
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  tooltip: 50,
  notification: 60,
};

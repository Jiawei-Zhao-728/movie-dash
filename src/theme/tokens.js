/**
 * Design Tokens - Foundation of the Design System
 * These tokens define all design decisions (colors, spacing, typography, etc.)
 * Inspired by industry standards (Netflix, Disney+, HBO Max)
 */

// ============================================
// COLOR PALETTE
// ============================================

export const colors = {
  // Brand Colors - Minimal Tech Aesthetic
  brand: {
    primary: '#6366F1',      // Modern Indigo
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    secondary: '#10B981',    // Tech Green
    secondaryLight: '#34D399',
    accent: '#F59E0B',       // Warm Amber
    accentLight: '#FBBF24',
  },

  // Neutral Colors (Dark Theme Base)
  dark: {
    50: '#f5f5f5',
    100: '#e0e0e0',
    200: '#b0b0b0',
    300: '#808080',
    400: '#606060',
    500: '#404040',
    600: '#2a2a2a',
    700: '#1f1f1f',
    800: '#141414',  // Main background (Netflix-like)
    900: '#0a0a0a',
  },

  // Light Theme Colors
  light: {
    50: '#ffffff',
    100: '#fafafa',
    200: '#f5f5f5',
    300: '#eeeeee',
    400: '#e0e0e0',
    500: '#bdbdbd',
    600: '#9e9e9e',
    700: '#757575',
    800: '#424242',
    900: '#212121',
  },

  // Semantic Colors
  semantic: {
    success: '#4caf50',
    successLight: '#81c784',
    successDark: '#388e3c',

    error: '#f44336',
    errorLight: '#e57373',
    errorDark: '#d32f2f',

    warning: '#ff9800',
    warningLight: '#ffb74d',
    warningDark: '#f57c00',

    info: '#2196f3',
    infoLight: '#64b5f6',
    infoDark: '#1976d2',
  },

  // Rating Colors
  rating: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  },

  // Glassmorphism Colors
  glass: {
    dark: 'rgba(20, 20, 20, 0.7)',
    darkHover: 'rgba(30, 30, 30, 0.8)',
    light: 'rgba(255, 255, 255, 0.1)',
    lightHover: 'rgba(255, 255, 255, 0.15)',
  },

  // Overlay Colors
  overlay: {
    dark: 'rgba(0, 0, 0, 0.6)',
    darkHeavy: 'rgba(0, 0, 0, 0.8)',
    light: 'rgba(255, 255, 255, 0.6)',
    lightHeavy: 'rgba(255, 255, 255, 0.8)',
  },
};

// ============================================
// GRADIENTS
// ============================================

export const gradients = {
  // Primary Gradients - Modern Tech
  primary: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
  primaryReverse: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
  techGradient: 'linear-gradient(135deg, #6366F1 0%, #10B981 100%)',
  subtleGradient: 'linear-gradient(135deg, #818CF8 0%, #34D399 100%)',

  // Dark Overlays (for hero sections, backdrops)
  darkOverlay: 'linear-gradient(to top, rgba(20, 20, 20, 1) 0%, rgba(20, 20, 20, 0.8) 50%, rgba(20, 20, 20, 0.3) 100%)',
  darkOverlayBottom: 'linear-gradient(to bottom, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 1) 100%)',
  darkOverlayRight: 'linear-gradient(to right, rgba(20, 20, 20, 1) 0%, rgba(20, 20, 20, 0) 100%)',

  // Shimmer (for loading states)
  shimmer: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)',

  // Glass effects
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',

  // Accent Gradients
  gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  sunset: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
  ocean: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  neon: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
};

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    secondary: '"Poppins", "Roboto", sans-serif',
    mono: '"Roboto Mono", "Courier New", monospace',
  },

  // Font Weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Font Sizes (responsive scale)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    md: '1.125rem',     // 18px
    lg: '1.25rem',      // 20px
    xl: '1.5rem',       // 24px
    '2xl': '1.875rem',  // 30px
    '3xl': '2.25rem',   // 36px
    '4xl': '3rem',      // 48px
    '5xl': '3.75rem',   // 60px
    '6xl': '4.5rem',    // 72px
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ============================================
// SPACING
// ============================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
};

// ============================================
// SHADOWS & ELEVATION
// ============================================

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',

  // Colored Shadows (for brand elements)
  primary: '0 10px 30px -5px rgba(229, 9, 20, 0.3)',
  primaryLarge: '0 20px 40px -10px rgba(229, 9, 20, 0.4)',

  // Glass/frosted effect
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  xs: '0.125rem',    // 2px
  sm: '0.25rem',     // 4px
  base: '0.375rem',  // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  full: '9999px',    // Full rounded
};

// ============================================
// TRANSITIONS & ANIMATIONS
// ============================================

export const transitions = {
  // Duration
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    medium: '300ms',
    slow: '400ms',
    slower: '600ms',
    slowest: '1000ms',
  },

  // Easing Functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Custom easings
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    snappy: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  // Common Transition Strings
  all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
};

// ============================================
// BREAKPOINTS (Mobile-first)
// ============================================

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  max: 9999,
};

// ============================================
// BLUR EFFECTS
// ============================================

export const blur = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
};

// ============================================
// COMPONENT-SPECIFIC TOKENS
// ============================================

export const components = {
  // Movie Card
  card: {
    aspectRatio: '2/3',      // Poster aspect ratio
    hoverScale: 1.05,
    hoverShadow: shadows.xl,
    borderRadius: borderRadius.lg,
    backdropBlur: blur.md,
  },

  // Buttons
  button: {
    borderRadius: borderRadius.md,
    paddingX: spacing[6],
    paddingY: spacing[3],
    fontWeight: typography.fontWeight.semibold,
    transition: transitions.all,
  },

  // Input Fields
  input: {
    borderRadius: borderRadius.md,
    padding: spacing[3],
    focusBorderColor: colors.brand.primary,
    transition: transitions.all,
  },

  // Header/AppBar
  header: {
    height: '70px',
    blur: blur.md,
    background: colors.glass.dark,
  },

  // Hero Section
  hero: {
    minHeight: '80vh',
    backdropBlur: blur.lg,
  },
};

// ============================================
// EXPORT ALL TOKENS
// ============================================

const tokens = {
  colors,
  gradients,
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
  breakpoints,
  zIndex,
  blur,
  components,
};

export default tokens;

/**
 * Theme Utility Functions
 * Reusable styling patterns and helper functions
 */

import tokens from './tokens';

const { colors, gradients, shadows, borderRadius, transitions, blur } = tokens;

// ============================================
// GLASSMORPHISM EFFECTS
// ============================================

/**
 * Creates a glassmorphism effect
 * @param {Object} options - Configuration options
 * @returns {Object} sx prop object
 */
export const glassmorphism = (options = {}) => {
  const {
    backgroundColor = colors.glass.dark,
    blur: blurAmount = blur.md,
    border = true,
    shadow = true,
  } = options;

  return {
    background: backgroundColor,
    backdropFilter: `blur(${blurAmount})`,
    WebkitBackdropFilter: `blur(${blurAmount})`,
    ...(border && {
      border: `1px solid ${colors.glass.light}`,
    }),
    ...(shadow && {
      boxShadow: shadows.glass,
    }),
  };
};

// ============================================
// HOVER EFFECTS
// ============================================

/**
 * Creates a scale hover effect
 * @param {number} scale - Scale amount (default 1.05)
 * @returns {Object} sx prop object
 */
export const hoverScale = (scale = 1.05) => ({
  transition: transitions.transform,
  '&:hover': {
    transform: `scale(${scale})`,
    cursor: 'pointer',
  },
});

/**
 * Creates an elevation hover effect (shadow)
 * @param {string} shadowLevel - Shadow level from tokens
 * @returns {Object} sx prop object
 */
export const hoverElevation = (shadowLevel = 'xl') => ({
  transition: transitions.shadow,
  '&:hover': {
    boxShadow: shadows[shadowLevel],
  },
});

/**
 * Creates a combined hover effect (scale + shadow)
 * @param {Object} options - Configuration options
 * @returns {Object} sx prop object
 */
export const hoverLift = (options = {}) => {
  const { scale = 1.05, shadowLevel = 'xl' } = options;

  return {
    transition: `${transitions.transform}, ${transitions.shadow}`,
    '&:hover': {
      transform: `scale(${scale}) translateY(-4px)`,
      boxShadow: shadows[shadowLevel],
      cursor: 'pointer',
    },
  };
};

/**
 * Creates a brightness hover effect
 * @param {number} brightness - Brightness level (default 1.1)
 * @returns {Object} sx prop object
 */
export const hoverBrightness = (brightness = 1.1) => ({
  transition: transitions.all,
  '&:hover': {
    filter: `brightness(${brightness})`,
  },
});

// ============================================
// GRADIENT BACKGROUNDS
// ============================================

/**
 * Creates a gradient background
 * @param {string} gradientName - Gradient name from tokens
 * @returns {Object} sx prop object
 */
export const gradientBackground = (gradientName = 'primary') => ({
  background: gradients[gradientName] || gradientName,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

/**
 * Creates an animated gradient background
 * @param {string} gradientName - Gradient name from tokens
 * @returns {Object} sx prop object
 */
export const animatedGradient = (gradientName = 'primary') => ({
  background: gradients[gradientName] || gradientName,
  backgroundSize: '200% 200%',
  animation: 'gradientShift 3s ease infinite',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
});

// ============================================
// OVERLAY EFFECTS
// ============================================

/**
 * Creates a dark overlay for images/backdrops
 * @param {string} direction - Gradient direction ('top', 'bottom', 'right', 'left')
 * @returns {Object} sx prop object
 */
export const darkOverlay = (direction = 'top') => {
  const gradientMap = {
    top: gradients.darkOverlay,
    bottom: gradients.darkOverlayBottom,
    right: gradients.darkOverlayRight,
  };

  return {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: gradientMap[direction] || gradients.darkOverlay,
      pointerEvents: 'none',
      zIndex: 1,
    },
  };
};

// ============================================
// TRUNCATE TEXT
// ============================================

/**
 * Truncates text with ellipsis
 * @param {number} lines - Number of lines before truncation
 * @returns {Object} sx prop object
 */
export const truncate = (lines = 1) => {
  if (lines === 1) {
    return {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
  }

  return {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
};

// ============================================
// FLEX UTILITIES
// ============================================

/**
 * Creates a centered flex container
 * @param {string} direction - Flex direction (default 'row')
 * @returns {Object} sx prop object
 */
export const flexCenter = (direction = 'row') => ({
  display: 'flex',
  flexDirection: direction,
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * Creates a space-between flex container
 * @param {string} direction - Flex direction (default 'row')
 * @returns {Object} sx prop object
 */
export const flexBetween = (direction = 'row') => ({
  display: 'flex',
  flexDirection: direction,
  alignItems: 'center',
  justifyContent: 'space-between',
});

// ============================================
// LOADING SHIMMER EFFECT
// ============================================

/**
 * Creates a shimmer loading animation
 * @returns {Object} sx prop object
 */
export const shimmer = () => ({
  background: colors.dark[700],
  backgroundImage: gradients.shimmer,
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
});

// ============================================
// SCROLL EFFECTS
// ============================================

/**
 * Creates a custom scrollbar
 * @param {Object} options - Configuration options
 * @returns {Object} sx prop object
 */
export const customScrollbar = (options = {}) => {
  const {
    width = '8px',
    trackColor = colors.dark[800],
    thumbColor = colors.dark[600],
    thumbHoverColor = colors.dark[500],
  } = options;

  return {
    scrollbarWidth: 'thin',
    scrollbarColor: `${thumbColor} ${trackColor}`,
    '&::-webkit-scrollbar': {
      width,
      height: width,
    },
    '&::-webkit-scrollbar-track': {
      background: trackColor,
    },
    '&::-webkit-scrollbar-thumb': {
      background: thumbColor,
      borderRadius: borderRadius.full,
      '&:hover': {
        background: thumbHoverColor,
      },
    },
  };
};

/**
 * Hides scrollbar but keeps scrolling functionality
 * @returns {Object} sx prop object
 */
export const hideScrollbar = () => ({
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

// ============================================
// IMAGE UTILITIES
// ============================================

/**
 * Creates an aspect ratio container for images
 * @param {string} ratio - Aspect ratio (e.g., '16/9', '2/3')
 * @returns {Object} sx prop object
 */
export const aspectRatio = (ratio = '16/9') => ({
  position: 'relative',
  width: '100%',
  paddingBottom: `calc(100% / (${ratio}))`,
  overflow: 'hidden',
  '& img': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

/**
 * Creates a cover image style
 * @returns {Object} sx prop object
 */
export const coverImage = () => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
});

// ============================================
// TRANSITION UTILITIES
// ============================================

/**
 * Creates a fade-in animation
 * @param {string} duration - Animation duration
 * @returns {Object} sx prop object
 */
export const fadeIn = (duration = transitions.duration.normal) => ({
  animation: `fadeIn ${duration} ${transitions.easing.easeOut}`,
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

/**
 * Creates a slide-up animation
 * @param {string} duration - Animation duration
 * @returns {Object} sx prop object
 */
export const slideUp = (duration = transitions.duration.normal) => ({
  animation: `slideUp ${duration} ${transitions.easing.easeOut}`,
  '@keyframes slideUp': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

// ============================================
// CARD UTILITIES
// ============================================

/**
 * Creates a movie card style
 * @returns {Object} sx prop object
 */
export const movieCard = () => ({
  position: 'relative',
  borderRadius: borderRadius.lg,
  overflow: 'hidden',
  aspectRatio: '2/3',
  transition: transitions.all,
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: shadows.xl,
  },
});

/**
 * Creates a glass card style
 * @returns {Object} sx prop object
 */
export const glassCard = () => ({
  ...glassmorphism(),
  borderRadius: borderRadius.lg,
  padding: tokens.spacing[4],
  transition: transitions.all,
  '&:hover': {
    background: colors.glass.darkHover,
    boxShadow: shadows.xl,
  },
});

// ============================================
// RESPONSIVE UTILITIES
// ============================================

/**
 * Creates responsive spacing
 * @param {Object} values - Breakpoint values { xs, sm, md, lg, xl }
 * @returns {Object} sx prop object
 */
export const responsiveSpacing = (values) => ({
  xs: tokens.spacing[values.xs || 2],
  sm: tokens.spacing[values.sm || 3],
  md: tokens.spacing[values.md || 4],
  lg: tokens.spacing[values.lg || 6],
  xl: tokens.spacing[values.xl || 8],
});

// ============================================
// EXPORT ALL UTILITIES
// ============================================

export const themeUtils = {
  glassmorphism,
  hoverScale,
  hoverElevation,
  hoverLift,
  hoverBrightness,
  gradientBackground,
  animatedGradient,
  darkOverlay,
  truncate,
  flexCenter,
  flexBetween,
  shimmer,
  customScrollbar,
  hideScrollbar,
  aspectRatio,
  coverImage,
  fadeIn,
  slideUp,
  movieCard,
  glassCard,
  responsiveSpacing,
};

export default themeUtils;

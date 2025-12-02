/**
 * Material-UI Theme Configuration
 * Enhanced with design tokens for a professional, industry-standard look
 */

import { createTheme } from '@mui/material/styles';
import tokens from './tokens';

const { colors, typography, spacing, shadows, borderRadius, transitions } = tokens;

/**
 * Creates a custom theme based on the mode (light/dark)
 * @param {string} mode - 'light' or 'dark'
 * @returns {Object} MUI Theme object
 */
export const createCustomTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.brand.primary,
        light: colors.brand.primaryLight,
        dark: colors.brand.primaryDark,
        contrastText: '#ffffff',
      },
      secondary: {
        main: colors.brand.secondary,
        light: colors.brand.secondaryLight,
        dark: '#3d3535',
        contrastText: '#ffffff',
      },
      error: {
        main: colors.semantic.error,
        light: colors.semantic.errorLight,
        dark: colors.semantic.errorDark,
      },
      warning: {
        main: colors.semantic.warning,
        light: colors.semantic.warningLight,
        dark: colors.semantic.warningDark,
      },
      info: {
        main: colors.semantic.info,
        light: colors.semantic.infoLight,
        dark: colors.semantic.infoDark,
      },
      success: {
        main: colors.semantic.success,
        light: colors.semantic.successLight,
        dark: colors.semantic.successDark,
      },
      background: {
        default: isDark ? colors.dark[800] : colors.light[50],
        paper: isDark ? colors.dark[700] : colors.light[50],
      },
      text: {
        primary: isDark ? colors.light[50] : colors.dark[900],
        secondary: isDark ? colors.light[300] : colors.dark[600],
        disabled: isDark ? colors.dark[400] : colors.light[500],
      },
      divider: isDark ? colors.dark[600] : colors.light[300],

      // Custom palette additions
      accent: {
        main: colors.brand.accent,
        light: colors.brand.accentLight,
        dark: '#DAA520',
        contrastText: colors.dark[900],
      },
      glass: {
        dark: colors.glass.dark,
        light: colors.glass.light,
      },
    },

    typography: {
      fontFamily: typography.fontFamily.primary,
      fontSize: 16,

      // Headings
      h1: {
        fontFamily: typography.fontFamily.secondary,
        fontSize: typography.fontSize['5xl'],
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        letterSpacing: typography.letterSpacing.tight,
      },
      h2: {
        fontFamily: typography.fontFamily.secondary,
        fontSize: typography.fontSize['4xl'],
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        letterSpacing: typography.letterSpacing.tight,
      },
      h3: {
        fontFamily: typography.fontFamily.secondary,
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.tight,
      },
      h4: {
        fontFamily: typography.fontFamily.secondary,
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.normal,
      },
      h5: {
        fontFamily: typography.fontFamily.secondary,
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.normal,
      },
      h6: {
        fontFamily: typography.fontFamily.secondary,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.normal,
      },

      // Body text
      body1: {
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.relaxed,
        fontWeight: typography.fontWeight.regular,
      },
      body2: {
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.normal,
        fontWeight: typography.fontWeight.regular,
      },

      // Subtitles
      subtitle1: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.normal,
      },
      subtitle2: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.normal,
      },

      // Other variants
      button: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        textTransform: 'none',
        letterSpacing: typography.letterSpacing.wide,
      },
      caption: {
        fontSize: typography.fontSize.xs,
        lineHeight: typography.lineHeight.normal,
        fontWeight: typography.fontWeight.regular,
      },
      overline: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
        textTransform: 'uppercase',
        letterSpacing: typography.letterSpacing.wider,
      },
    },

    spacing: 8, // Base spacing unit (8px)

    shape: {
      borderRadius: parseInt(borderRadius.md),
    },

    shadows: [
      shadows.none,
      shadows.xs,
      shadows.sm,
      shadows.base,
      shadows.md,
      shadows.lg,
      shadows.xl,
      shadows['2xl'],
      shadows.lg,
      shadows.xl,
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
      shadows['2xl'],
    ],

    // Component overrides
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: isDark
              ? `${colors.dark[600]} ${colors.dark[800]}`
              : `${colors.light[400]} ${colors.light[100]}`,
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: isDark ? colors.dark[800] : colors.light[100],
            },
            '&::-webkit-scrollbar-thumb': {
              background: isDark ? colors.dark[600] : colors.light[400],
              borderRadius: borderRadius.full,
              '&:hover': {
                background: isDark ? colors.dark[500] : colors.light[500],
              },
            },
          },
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.md,
            padding: `${spacing[3]} ${spacing[6]}`,
            fontWeight: typography.fontWeight.semibold,
            transition: transitions.all,
            textTransform: 'none',
            boxShadow: shadows.none,
            '&:hover': {
              boxShadow: shadows.md,
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: shadows.lg,
            },
          },
          containedPrimary: {
            background: colors.brand.primary,
            '&:hover': {
              background: colors.brand.primaryDark,
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
            },
          },
          sizeSmall: {
            padding: `${spacing[2]} ${spacing[4]}`,
            fontSize: typography.fontSize.sm,
          },
          sizeLarge: {
            padding: `${spacing[4]} ${spacing[8]}`,
            fontSize: typography.fontSize.md,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
            transition: transitions.all,
            overflow: 'hidden',
            '&:hover': {
              boxShadow: shadows.xl,
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          rounded: {
            borderRadius: borderRadius.lg,
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: borderRadius.md,
              transition: transitions.all,
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDark ? colors.light[400] : colors.dark[400],
                },
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '2px',
                },
              },
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.md,
            fontWeight: typography.fontWeight.medium,
          },
          filled: {
            backgroundColor: isDark ? colors.dark[600] : colors.light[300],
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: shadows.none,
            backdropFilter: `blur(${tokens.blur.md})`,
            backgroundColor: isDark
              ? 'rgba(20, 20, 20, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: borderRadius.xl,
            boxShadow: shadows['2xl'],
          },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? colors.dark[600] : colors.dark[800],
            fontSize: typography.fontSize.sm,
            borderRadius: borderRadius.md,
            padding: `${spacing[2]} ${spacing[3]}`,
          },
          arrow: {
            color: isDark ? colors.dark[600] : colors.dark[800],
          },
        },
      },

      MuiRating: {
        styleOverrides: {
          root: {
            color: colors.rating.gold,
          },
          iconFilled: {
            color: colors.rating.gold,
          },
          iconHover: {
            color: colors.brand.accentLight,
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.full,
            height: '6px',
          },
          bar: {
            borderRadius: borderRadius.full,
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.md,
            fontWeight: typography.fontWeight.medium,
          },
          standardSuccess: {
            backgroundColor: isDark
              ? 'rgba(76, 175, 80, 0.1)'
              : 'rgba(76, 175, 80, 0.1)',
            color: colors.semantic.success,
          },
          standardError: {
            backgroundColor: isDark
              ? 'rgba(244, 67, 54, 0.1)'
              : 'rgba(244, 67, 54, 0.1)',
            color: colors.semantic.error,
          },
          standardWarning: {
            backgroundColor: isDark
              ? 'rgba(255, 152, 0, 0.1)'
              : 'rgba(255, 152, 0, 0.1)',
            color: colors.semantic.warning,
          },
          standardInfo: {
            backgroundColor: isDark
              ? 'rgba(33, 150, 243, 0.1)'
              : 'rgba(33, 150, 243, 0.1)',
            color: colors.semantic.info,
          },
        },
      },

      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: `blur(${tokens.blur.sm})`,
          },
        },
      },
    },

    // Custom breakpoints
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },

    // Transitions
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: transitions.easing.easeInOut,
        easeOut: transitions.easing.easeOut,
        easeIn: transitions.easing.easeIn,
        sharp: transitions.easing.snappy,
      },
    },

    // Z-index
    zIndex: {
      mobileStepper: 1000,
      fab: 1050,
      speedDial: 1050,
      appBar: 1100,
      drawer: 1200,
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
  });
};

export default createCustomTheme;

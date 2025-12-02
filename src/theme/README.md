# MovieDash Design System

A professional, industry-standard design system inspired by leading streaming platforms (Netflix, Disney+, HBO Max).

## 📁 Structure

```
src/theme/
├── tokens.js       # Design tokens (colors, spacing, typography, etc.)
├── theme.js        # MUI theme configuration
├── utils.js        # Reusable styling utilities
├── index.js        # Main export file
└── README.md       # This file
```

## 🎨 Design Tokens (`tokens.js`)

Design tokens are the single source of truth for all design decisions. They ensure consistency across the entire application.

### Colors

```javascript
import { tokens } from './theme';

// Brand colors
tokens.colors.brand.primary        // #E50914 (Netflix Red)
tokens.colors.brand.accent         // #FFD700 (Gold)

// Dark theme
tokens.colors.dark[800]            // #141414 (Main background)
tokens.colors.dark[700]            // #1f1f1f (Card background)

// Glassmorphism
tokens.colors.glass.dark           // rgba(20, 20, 20, 0.7)
```

### Gradients

```javascript
// Primary gradient
tokens.gradients.primary           // Red gradient
tokens.gradients.darkOverlay       // For hero sections
tokens.gradients.shimmer          // For loading states
```

### Typography

```javascript
// Font families
tokens.typography.fontFamily.primary    // Inter
tokens.typography.fontFamily.secondary  // Poppins

// Font sizes
tokens.typography.fontSize.xl          // 1.5rem (24px)
tokens.typography.fontSize['4xl']      // 3rem (48px)

// Font weights
tokens.typography.fontWeight.bold      // 700
```

### Spacing

```javascript
tokens.spacing[4]    // 1rem (16px)
tokens.spacing[8]    // 2rem (32px)
tokens.spacing[12]   // 3rem (48px)
```

### Shadows & Elevation

```javascript
tokens.shadows.base       // Standard shadow
tokens.shadows.xl         // Large shadow for elevated cards
tokens.shadows.primary    // Colored shadow for brand elements
```

### Border Radius

```javascript
tokens.borderRadius.md    // 0.5rem (8px)
tokens.borderRadius.lg    // 0.75rem (12px)
tokens.borderRadius.xl    // 1rem (16px)
```

### Transitions

```javascript
tokens.transitions.duration.normal    // 200ms
tokens.transitions.easing.easeInOut   // Smooth easing
tokens.transitions.all               // Pre-configured transition string
```

## 🎭 Theme Configuration (`theme.js`)

The MUI theme is configured with all design tokens and provides a dark/light mode.

### Usage

```javascript
import { createCustomTheme } from './theme';

// Create dark theme
const darkTheme = createCustomTheme('dark');

// Create light theme
const lightTheme = createCustomTheme('light');
```

### Features

- ✅ Complete color palette (primary, secondary, semantic colors)
- ✅ Custom typography scale
- ✅ Component overrides (buttons, cards, inputs, etc.)
- ✅ Custom scrollbars
- ✅ Glassmorphism effects
- ✅ Responsive breakpoints
- ✅ Z-index scale

## 🛠️ Utility Functions (`utils.js`)

Reusable styling patterns and helper functions.

### Glassmorphism

```javascript
import { glassmorphism } from './theme';

<Box sx={glassmorphism()}>
  Frosted glass effect
</Box>
```

### Hover Effects

```javascript
import { hoverScale, hoverLift, hoverBrightness } from './theme';

// Scale on hover
<Card sx={hoverScale(1.05)} />

// Lift effect (scale + shadow)
<Card sx={hoverLift()} />

// Brightness effect
<Image sx={hoverBrightness(1.1)} />
```

### Gradients

```javascript
import { gradientBackground, animatedGradient } from './theme';

// Static gradient
<Box sx={gradientBackground('primary')} />

// Animated gradient
<Box sx={animatedGradient('primary')} />
```

### Overlays

```javascript
import { darkOverlay } from './theme';

// Add dark gradient overlay to images
<Box sx={darkOverlay('top')}>
  <img src="backdrop.jpg" />
</Box>
```

### Text Truncation

```javascript
import { truncate } from './theme';

// Single line truncation
<Typography sx={truncate(1)}>
  Long text that will be truncated...
</Typography>

// Multi-line truncation
<Typography sx={truncate(3)}>
  Long text that will be truncated after 3 lines...
</Typography>
```

### Flex Utilities

```javascript
import { flexCenter, flexBetween } from './theme';

// Center content
<Box sx={flexCenter()}>Centered</Box>

// Space between
<Box sx={flexBetween()}>
  <div>Left</div>
  <div>Right</div>
</Box>
```

### Loading States

```javascript
import { shimmer } from './theme';

// Shimmer loading effect
<Box sx={shimmer()} />
```

### Scrollbar

```javascript
import { customScrollbar, hideScrollbar } from './theme';

// Custom scrollbar
<Box sx={customScrollbar()}>
  Scrollable content
</Box>

// Hidden scrollbar
<Box sx={hideScrollbar()}>
  Scrollable content (hidden scrollbar)
</Box>
```

### Images

```javascript
import { aspectRatio, coverImage } from './theme';

// Maintain aspect ratio
<Box sx={aspectRatio('16/9')}>
  <img src="image.jpg" />
</Box>

// Cover image
<img sx={coverImage()} src="image.jpg" />
```

### Animations

```javascript
import { fadeIn, slideUp } from './theme';

// Fade in animation
<Box sx={fadeIn()}>Content</Box>

// Slide up animation
<Box sx={slideUp()}>Content</Box>
```

### Cards

```javascript
import { movieCard, glassCard } from './theme';

// Movie card with hover effect
<Card sx={movieCard()}>
  Movie content
</Card>

// Glass card
<Card sx={glassCard()}>
  Glass effect content
</Card>
```

## 🚀 Quick Start Examples

### Creating a Component with the Design System

```javascript
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { tokens, glassmorphism, hoverLift } from '../theme';

const MyComponent = () => {
  return (
    <Box
      sx={{
        ...glassmorphism(),
        ...hoverLift(),
        padding: tokens.spacing[6],
        borderRadius: tokens.borderRadius.lg,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: tokens.colors.brand.primary,
          fontWeight: tokens.typography.fontWeight.bold,
        }}
      >
        Hello World
      </Typography>
      <Button
        sx={{
          background: tokens.gradients.primary,
          color: 'white',
          '&:hover': {
            boxShadow: tokens.shadows.primary,
          },
        }}
      >
        Click Me
      </Button>
    </Box>
  );
};

export default MyComponent;
```

### Using Multiple Utilities Together

```javascript
import { Box } from '@mui/material';
import {
  glassmorphism,
  hoverScale,
  fadeIn,
  truncate
} from '../theme';

<Box
  sx={{
    ...glassmorphism(),
    ...hoverScale(1.05),
    ...fadeIn(),
  }}
>
  <Typography sx={truncate(2)}>
    Long text content...
  </Typography>
</Box>
```

## 🎨 Color Palette Reference

### Brand Colors
- **Primary Red**: `#E50914` - Main brand color
- **Gold Accent**: `#FFD700` - Highlights and ratings

### Dark Theme
- **Background**: `#141414` - Main background
- **Paper**: `#1f1f1f` - Cards and elevated surfaces
- **Dark 600**: `#2a2a2a` - Borders and dividers

### Semantic Colors
- **Success**: `#4caf50` - Green
- **Error**: `#f44336` - Red
- **Warning**: `#ff9800` - Orange
- **Info**: `#2196f3` - Blue

## 📐 Spacing Scale

| Token | Size | Pixels |
|-------|------|--------|
| spacing[2] | 0.5rem | 8px |
| spacing[4] | 1rem | 16px |
| spacing[6] | 1.5rem | 24px |
| spacing[8] | 2rem | 32px |
| spacing[12] | 3rem | 48px |

## 🔤 Typography Scale

| Size | rem | pixels |
|------|-----|--------|
| xs | 0.75rem | 12px |
| sm | 0.875rem | 14px |
| base | 1rem | 16px |
| lg | 1.25rem | 20px |
| xl | 1.5rem | 24px |
| 2xl | 1.875rem | 30px |
| 4xl | 3rem | 48px |

## 💡 Best Practices

1. **Always use design tokens** instead of hardcoded values
   ```javascript
   // ❌ Bad
   sx={{ padding: '16px', color: '#E50914' }}

   // ✅ Good
   sx={{
     padding: tokens.spacing[4],
     color: tokens.colors.brand.primary
   }}
   ```

2. **Use utility functions** for common patterns
   ```javascript
   // ❌ Bad
   sx={{
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
   }}

   // ✅ Good
   sx={flexCenter()}
   ```

3. **Combine utilities** using spread operator
   ```javascript
   sx={{
     ...glassmorphism(),
     ...hoverLift(),
     padding: tokens.spacing[6],
   }}
   ```

4. **Use semantic color names** when appropriate
   ```javascript
   // Use theme palette for semantic colors
   sx={{ color: 'primary.main' }}  // Works with theme

   // Use tokens for brand-specific colors
   sx={{ color: tokens.colors.brand.primary }}
   ```

## 🎯 Design Principles

1. **Consistency**: Use the same tokens across all components
2. **Flexibility**: Utilities can be customized with parameters
3. **Performance**: Memoized theme creation for optimal rendering
4. **Accessibility**: Proper contrast ratios and semantic colors
5. **Responsiveness**: Built-in responsive utilities
6. **Modern**: Glassmorphism, smooth transitions, and micro-interactions

## 📚 Resources

- [Material-UI Documentation](https://mui.com/)
- [Design Tokens Specification](https://design-tokens.github.io/community-group/)
- [Glassmorphism Guide](https://hype4.academy/tools/glassmorphism-generator)

---

Built with ❤️ for MovieDash

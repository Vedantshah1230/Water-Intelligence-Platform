---
name: Hydrologic Modernism
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#404753'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#707785'
  outline-variant: '#c0c7d5'
  surface-tint: '#0060ab'
  primary: '#005da7'
  on-primary: '#ffffff'
  primary-container: '#0076d1'
  on-primary-container: '#fdfcff'
  inverse-primary: '#a3c9ff'
  secondary: '#50616b'
  on-secondary: '#ffffff'
  secondary-container: '#d3e5f1'
  on-secondary-container: '#566771'
  tertiary: '#2c6085'
  on-tertiary: '#ffffff'
  tertiary-container: '#4779a0'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e3ff'
  primary-fixed-dim: '#a3c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#d3e5f1'
  secondary-fixed-dim: '#b7c9d5'
  on-secondary-fixed: '#0c1e26'
  on-secondary-fixed-variant: '#384953'
  tertiary-fixed: '#cbe6ff'
  tertiary-fixed-dim: '#9bccf6'
  on-tertiary-fixed: '#001e30'
  on-tertiary-fixed-variant: '#0e4b6f'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style
The brand personality is refreshing, transparent, and technologically advanced. It is designed for users who value precision in water management, environmental monitoring, or wellness tracking. The UI evokes a sense of clarity and fluidity, mirroring the properties of water itself.

The design system employs a **Modern Glassmorphism** style mixed with **Minimalism**. It uses semi-transparent surfaces, subtle backdrop blurs, and high-quality typography to create a sense of depth without visual clutter. In this light-mode execution, the interface should feel airy and breathable, using significant whitespace to emphasize data and critical actions.

## Colors
The palette is centered around a vibrant Azure Blue primary color that serves as the core "water" identifier, now optimized for a crisp light mode environment.

- **Primary (#0091FF):** Used for primary actions, active states, and brand-critical elements.
- **Secondary (#E0F2FE):** A soft Sky Blue used for subtle backgrounds, highlights, and icons.
- **Tertiary (#0C4A6E):** A Deep Navy used for high-contrast text or dark-themed components within the light UI.
- **Neutral (#64748B):** A cool-toned slate for secondary text, borders, and UI scaffolding.

The background shifts to bright, clean surfaces to maintain a sense of pristine clarity while ensuring high readability for data visualization.

## Typography
The typography system balances the approachable warmth of **Plus Jakarta Sans** for headings with the functional clarity of **Inter** for body copy. To emphasize the technical and data-driven nature of water monitoring, **JetBrains Mono** is used for labels and data points.

Headlines should use tighter letter-spacing and heavier weights to anchor the page. Body text maintains a generous line height to ensure readability against light backgrounds.

## Layout & Spacing
The design system utilizes a **Fluid Grid** system based on an 8px square rhythm. 

- **Desktop:** 12-column grid with 24px gutters and wide 64px outer margins to create a centered, focused experience.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px margins.

Spacing between functional groups should be generous (typically 48px or 64px) to reinforce the "Minimalist" brand pillar.

## Elevation & Depth
Depth is expressed through **Glassmorphism** and **Tonal Layering**. In light mode, depth is established through soft shadows and subtle translucent overlays.

1. **Surface Level:** The base page background (Light Grey/White).
2. **Container Level:** White or semi-transparent layers with a 12px backdrop blur to create a "suspended" look.
3. **Elevated Level:** Surfaces with soft, diffused Azure-tinted shadows to indicate interactivity.
4. **Overlay Level:** Vibrant Azure accents or semi-transparent overlays for high-priority focus.

## Shapes
Shapes are defined by "Rounded" corners (8px base), mimicking the soft, eroded edges of pebbles or water droplets. 

- **Small Components (Inputs, Buttons):** 8px radius.
- **Medium Components (Cards, Modals):** 16px radius.
- **Large Components (Sections, Hero areas):** 24px radius.

Avoid sharp 90-degree angles to maintain the organic, fluid aesthetic.

## Components

### Buttons
Primary buttons use Azure Blue (#0091FF) with white text. Hover states should transition to a slightly deeper blue. Secondary buttons use the Sky Blue (#E0F2FE) background with Azure text for a soft, integrated look.

### Chips & Tags
Used for status indicators (e.g., "Optimal", "High Pressure"). In light mode, these should use very light tinted backgrounds with bold text in the same hue to ensure clear categorization without heavy visual weight.

### Input Fields
Fields feature a subtle slate stroke (#64748B) that expands and turns Azure Blue on focus. The field background is pure white to contrast against the light grey surface level.

### Cards
Cards are the primary container. They must utilize the 16px corner radius and a very subtle border or soft shadow to maintain definition against the bright light-mode background.

### Data Visualization
Charts and graphs should strictly follow the blue monochromatic scale, using Primary Azure for the most important data point and varying tints of Sky Blue for secondary data sets, ensuring high luminosity against light backgrounds.
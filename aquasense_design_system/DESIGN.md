---
name: AquaSense Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#d1dbec'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dfe9fa'
  surface-container-highest: '#d9e3f4'
  on-surface: '#121c28'
  on-surface-variant: '#424750'
  inverse-surface: '#27313e'
  inverse-on-surface: '#eaf1ff'
  outline: '#727781'
  outline-variant: '#c2c6d1'
  surface-tint: '#27609d'
  primary: '#003461'
  on-primary: '#ffffff'
  primary-container: '#004b87'
  on-primary-container: '#8abcff'
  inverse-primary: '#a3c9ff'
  secondary: '#006a6a'
  on-secondary: '#ffffff'
  secondary-container: '#90efef'
  on-secondary-container: '#006e6e'
  tertiary: '#2c3439'
  on-tertiary: '#ffffff'
  tertiary-container: '#424b50'
  on-tertiary-container: '#b2bbc0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e4ff'
  primary-fixed-dim: '#a3c9ff'
  on-primary-fixed: '#001c38'
  on-primary-fixed-variant: '#004882'
  secondary-fixed: '#93f2f2'
  secondary-fixed-dim: '#76d6d5'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f4f'
  tertiary-fixed: '#dbe4ea'
  tertiary-fixed-dim: '#bfc8ce'
  on-tertiary-fixed: '#141d21'
  on-tertiary-fixed-variant: '#3f484d'
  background: '#f8f9ff'
  on-background: '#121c28'
  surface-variant: '#d9e3f4'
typography:
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
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
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is rooted in the philosophy of Human-Centered Design (HCD) for essential utility management. It prioritizes clarity over complexity, ensuring that critical water data is accessible to users regardless of their technical literacy. The brand personality is that of a "Trusted Steward"—professional and systematic, yet empathetic and approachable.

The visual style is **Corporate Modern with a Soft Touch**. It leverages the reliability of enterprise-grade software but removes the coldness through increased whitespace, rounded corners, and a human-centric approach to data visualization. The interface feels light and breathable, reducing cognitive load for users who may be managing stressful water scarcity or quality issues.

## Colors
The palette is engineered for WCAG 2.1 AAA compliance. The **Deep Water Blue** serves as the primary anchor, used for headers, primary actions, and critical navigation to ensure high-contrast legibility. **Teal** acts as a secondary accent to provide a calming, water-associative atmosphere.

Status indicators use "Natural" variants of semantic colors—avoiding neon or overly aggressive tones—to maintain the helpful personality. Backgrounds should primarily use the tertiary soft blue or pure white to keep the interface feeling open and clean.

## Typography
This design system utilizes a dual-font approach. **Lexend** is used for headlines; its expanded character design and specific engineering for reading proficiency make it exceptionally accessible for diverse user groups. **Inter** is used for all body text and UI labels, providing a systematic and neutral grit that ensures legibility at small sizes and high information densities.

Text contrast is strictly enforced. Body text should never fall below 16px for primary content to ensure readability for elderly users or those in outdoor, high-glare environments (like farmers in the field).

## Layout & Spacing
The layout follows a **fluid grid** model with a soft 8px rhythmic scale. On mobile devices, the system uses a 4-column grid with 16px outer margins. On desktop, it expands to a 12-column grid with a max-width of 1280px to prevent line lengths from becoming unreadable.

Spacing is "generous." By increasing margins and gutters beyond standard enterprise density, we reduce "UI anxiety," making the application feel more like a helpful assistant and less like a complex data terminal.

## Elevation & Depth
The design system uses **Tonal Layers** combined with **Ambient Shadows**. Instead of harsh black shadows, elevations are defined by subtle, tinted shadows (using the Primary Blue mixed with neutral grey) to maintain a soft, integrated look.

- **Level 0 (Surface):** Default background (#F8FAFC).
- **Level 1 (Cards):** Pure white background with a 1px soft border (#E2E8F0) and no shadow. Used for secondary info.
- **Level 2 (Interactive):** Pure white with a soft, diffused shadow (Y: 4px, Blur: 12px, 5% Opacity). Used for primary status cards.
- **Level 3 (Modals):** Pure white with a deep shadow (Y: 12px, Blur: 24px, 10% Opacity).

## Shapes
The shape language is consistently **Rounded**. A base radius of 8px (0.5rem) is used for standard components like buttons and input fields. Larger containers, such as status cards and dashboard modules, use 16px (1rem) to emphasize the "soft touch" of the brand. This removal of sharp corners conveys safety and approachability.

## Components

### Status Cards
The centerpiece of the system. Each card must include:
- **Icon:** A large, simplified glyph in a tinted circular housing.
- **Value:** The primary metric (e.g., "98% Full") in `headline-lg`.
- **Status Label:** A high-contrast badge (e.g., "Optimal").
- **Plain-Language Explanation:** A short sentence in `body-md` explaining what the data means (e.g., "Your water supply is healthy for the next 30 days.")
- **Suggested Action:** A secondary button styled as a "Next Step."

### Buttons
Buttons use the `rounded-md` (8px) setting. Primary buttons are Deep Water Blue with white text. Secondary buttons use the Teal accent or a ghost style with a 2px border. Touch targets are a minimum of 48px to ensure accessibility for all users.

### Data Visualization
Avoid complex line or scatter charts. Use:
- **Circular Gauges:** For percentage-based data (e.g., tank levels).
- **Segmented Progress Bars:** For capacity or usage, using the semantic color palette.
- **Illustrative Indicators:** Simple water drop or leaf icons that fill or change color based on status.

### Inputs & Selection
Fields use large 16px text with a 2px focus ring in Primary Blue. Radio buttons and checkboxes are oversized to ensure ease of interaction on mobile devices in outdoor environments.
# Brand Contract

## Version
- **Version**: 1.0.0
- **Date**: 2026-06-11
- **Status**: Active

## Purpose

This contract defines the mandatory brand guidelines for the Balloo platform, including logo usage, color palette, and typography.

## Source of Truth

- **Brand Assets**: `packages/core-brand/src/`
- **Logo Component**: `packages/core-brand/src/Logo.tsx`
- **Brand Constants**: `packages/core-brand/src/brand.ts`

## Brand Colors

### Primary Palette

| Color | Name | Hex | Usage |
|-------|------|-----|-------|
| Primary | Russia Blue | `#0039A6` | Main brand color, headers, primary actions |
| Secondary | Russia Red | `#D52B1E` | Accent color, highlights, secondary actions |
| Accent | Modern Blue | `#007bff` | Interactive elements, links, buttons |

### Heritage Colors (Russia Flag)

| Color | Name | Hex | Usage |
|-------|------|-----|-------|
| White | White | `#ffffff` | Backgrounds, light text |
| Blue | Russia Blue | `#0039A6` | Brand heritage, logo fallback |
| Red | Russia Red | `#D52B1E` | Brand heritage, logo fallback |

### Neutral Palette

| Color | Name | Hex | Usage |
|-------|------|-----|-------|
| Background | Background | `#ffffff` | Page backgrounds |
| Surface | Surface | `#f8f9fa` | Cards, panels |
| Text | Text | `#212529` | Primary text |
| Text Secondary | Muted | `#6c757d` | Secondary text |
| Border | Border | `#dee2e6` | Borders, dividers |

## Logo Usage

### Logo Component

**Source**: `packages/core-brand/src/Logo.tsx`

**Props**:
| Prop | Type | Default | Required |
|------|------|---------|----------|
| `src` | `string` | - | No |
| `alt` | `string` | `'Balloo'` | No |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | No |
| `showText` | `boolean` | `true` | No |
| `className` | `string` | `''` | No |

### Minimum Size

- **Absolute Minimum**: 32px (sm)
- **Recommended Minimum**: 40px (md)
- **Large Displays**: 48px (lg)

### Clear Space

Minimum clear space around logo: **8px** on all sides.

### Fallback Behavior

When no `src` is provided:
- Display Russia flag gradient (red-white-blue horizontal stripes)
- Maintain aspect ratio 1:1
- Show "Balloo" text if `showText={true}`

### Logo Gradient (Fallback)

```css
linear-gradient(180deg, #FF0000 33%, #FFFFFF 33%, #FFFFFF 66%, #0000FF 66%)
```

**Order**: Red (top) → White (middle) → Blue (bottom)

## Typography

### Font Families

**Primary Font**:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Monospace Font**:
```css
font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
```

### Font Sizes

| Size | Name | Value | Usage |
|------|------|-------|-------|
| `xs` | Extra Small | 12px (0.75rem) | Captions, footnotes |
| `sm` | Small | 14px (0.875rem) | Secondary text |
| `base` | Base | 16px (1rem) | Body text |
| `lg` | Large | 18px (1.125rem) | Subheadings |
| `xl` | Extra Large | 20px (1.25rem) | Section titles |
| `2xl` | 2X Large | 24px (1.5rem) | Page titles |
| `3xl` | 3X Large | 30px (1.875rem) | Hero text |

### Font Weights

| Weight | Name | Value | Usage |
|--------|------|-------|-------|
| 400 | Normal | 400 | Body text |
| 500 | Medium | 500 | Emphasis, buttons |
| 700 | Bold | 700 | Headings, strong emphasis |

## Must Rules

1. **Logo Integrity**: Logo MUST NOT be modified, stretched, or distorted
2. **Clear Space**: Minimum 8px clear space MUST be maintained around logo
3. **Minimum Size**: Logo MUST NOT be displayed smaller than 32px
4. **Color Consistency**: Brand colors MUST match exact hex values
5. **Fallback**: Logo MUST use Russia flag gradient when image unavailable

## Should Rules

1. Logo SHOULD be placed in top-left corner of applications
2. Brand colors SHOULD be used consistently across all nodes
3. Typography SHOULD follow the defined scale

## Must Not Rules

1. **Must NOT** modify logo proportions
2. **Must NOT** use brand colors for non-brand purposes
3. **Must NOT** remove clear space around logo
4. **Must NOT** display logo smaller than 32px
5. **Must NOT** alter Russia flag gradient order (red-white-blue)

## Implementation

### Package Usage

```typescript
import { Logo, BRAND_COLORS, BRAND_TYPOGRAPHY } from '@balloo/core-brand';

// Logo component
<Logo src="/logo.jpg" size="md" showText={true} />

// Brand colors
const primaryColor = BRAND_COLORS.primary; // '#0039A6'

// Typography
const fontSize = BRAND_TYPOGRAPHY.fontSize.xl; // '1.25rem'
```

### Contract Enforcement

- Build-time validation: Future implementation
- Linting rules: Future implementation
- Visual regression tests: Future implementation

## Applications

All Balloo platform nodes MUST comply with this contract:

| Node | Status | Notes |
|------|--------|-------|
| messenger (web-main) | ✅ Compliant | Uses @balloo/core-brand |
| admin-portal | ⏳ Pending | Migration planned |
| api | ⏳ Pending | No UI, brand colors only |
| docs-site | ⏳ Pending | Migration planned |
| desktop | ⏳ Pending | Migration planned |
| mobile | ⏳ Pending | Migration planned |

## Related Contracts

- [ThemeContract.md](./ThemeContract.md) - Theme system contract
- [DesignContract.md](./DesignContract.md) - Design system contract
- [LanguageContract.md](./LanguageContract.md) - Language system contract

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-06-11 | Initial contract |

---

*Contract Status: Active*  
*Enforcement: Manual (automated pending)*

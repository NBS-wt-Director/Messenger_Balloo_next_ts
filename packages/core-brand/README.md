# @balloo/core-brand

Core brand assets for Balloo platform. Provides Logo component, brand colors, and typography guidelines.

## Installation

```bash
pnpm add @balloo/core-brand
```

## Usage

### Logo Component

```tsx
import { Logo } from '@balloo/core-brand';

// With image
<Logo src="/logo.jpg" alt="Balloo" size="md" />

// Fallback (Russia flag gradient)
<Logo size="lg" showText={true} />
```

### Brand Colors

```tsx
import { BRAND_COLORS } from '@balloo/core-brand';

console.log(BRAND_COLORS.primary);    // '#0039A6'
console.log(BRAND_COLORS.secondary);  // '#D52B1E'
```

## Components

### Logo

Official Balloo logo component with Russia flag gradient fallback.

**Props:**
- `src?: string` - Logo image URL
- `alt?: string` - Alt text (default: 'Balloo')
- `size?: 'sm' | 'md' | 'lg'` - Size (default: 'md')
- `showText?: boolean` - Show text (default: true)
- `className?: string` - Additional CSS classes

## Brand Guidelines

### Colors
- **Primary**: `#0039A6` (Russia blue)
- **Secondary**: `#D52B1E` (Russia red)
- **Accent**: `#007bff`

### Logo
- **Minimum Size**: 32px
- **Clear Space**: 8px

## API Reference

| Export | Type | Description |
|--------|------|-------------|
| `Logo` | Component | Logo component |
| `BRAND_COLORS` | `BrandColors` | Color palette |
| `BRAND_TYPOGRAPHY` | `BrandTypography` | Typography |
| `BRAND_GUIDELINES` | `BrandGuidelines` | Guidelines |
| `LOGO_GRADIENT` | `string` | Fallback gradient |

## Migration

**Phase 7** - Extracted from `messenger/src/components/ui/Logo.tsx`

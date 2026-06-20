# DESIGN — SUMMARYDOCS Web Reader Design System

## Overview

Unified design system for ALL pages of the SUMMARYDOCS documentation center. This document defines the visual language, components, and layout rules that MUST be followed for every screen in the application.

## ⚠️ MANDATORY RULE

**ALL pages in the SUMMARYDOCS web reader MUST follow this design system.**
Any new page, modal, component, or view MUST use the defined tokens, spacing, typography, and colors.
No exceptions. No custom styles that override the design tokens.

---

## 1. Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#2563eb` | Main brand, links, primary buttons |
| `--color-primary-hover` | `#1d4ed8` | Hover states for primary elements |
| `--color-primary-light` | `#dbeafe` | Backgrounds, badges |
| `--color-primary-text` | `#ffffff` | Text on primary background |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#16a34a` | Success states, active status |
| `--color-success-bg` | `#dcfce7` | Success backgrounds, badges |
| `--color-warning` | `#ca8a04` | Warning states, deprecated status |
| `--color-warning-bg` | `#fef9c3` | Warning backgrounds, badges |
| `--color-error` | `#dc2626` | Error states, errors |
| `--color-error-bg` | `#fee2e2` | Error backgrounds, badges |
| `--color-info` | `#0891b2` | Informational states |
| `--color-info-bg` | `#cffafe` | Info backgrounds, badges |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-gray-50` | `#f9fafb` | Page backgrounds |
| `--color-gray-100` | `#f3f4f6` | Card backgrounds, borders |
| `--color-gray-200` | `#e5e7eb` | Dividers, secondary borders |
| `--color-gray-300` | `#d1d5db` | Disabled states, placeholders |
| `--color-gray-400` | `#9ca3af` | Secondary text, icons |
| `--color-gray-500` | `#6b7280` | Body text, labels |
| `--color-gray-600` | `#4b5563` | Headings, emphasis |
| `--color-gray-700` | `#374151` | Dark text |
| `--color-gray-800` | `#1f2937` | Primary text |
| `--color-gray-900` | `#111827` | Headings, strong emphasis |
| `--color-white` | `#ffffff` | Card backgrounds, text on dark |

### Status Colors

| Type | Background | Text | Border |
|------|-----------|------|--------|
| **Active** | `#dcfce7` | `#166534` | `#86efac` |
| **Draft** | `#fef3c7` | `#92400e` | `#fcd34d` |
| **Deprecated** | `#fee2e2` | `#991b1b` | `#fca5a5` |
| **Info** | `#dbeafe` | `#1e40af` | `#93c5fd` |

---

## 2. Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Type Scale

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `h1` | 36px (2.25rem) | 700 | 1.2 | Page titles |
| `h2` | 28px (1.75rem) | 600 | 1.3 | Section titles |
| `h3` | 22px (1.375rem) | 600 | 1.4 | Card titles, subheadings |
| `body-lg` | 16px (1rem) | 400 | 1.6 | Body text |
| `body` | 14px (0.875rem) | 400 | 1.5 | Standard body |
| `body-sm` | 12px (0.75rem) | 400 | 1.4 | Captions, labels |
| `code` | 13px (0.8125rem) | 400 | 1.5 | Code, monospace |

### Text Colors

| Context | Color |
|---------|-------|
| Primary text | `--color-gray-900` |
| Secondary text | `--color-gray-600` |
| Tertiary text | `--color-gray-400` |
| Links | `--color-primary` |
| Links hover | `--color-primary-hover` |
| Disabled | `--color-gray-300` |

---

## 3. Spacing System

All spacing uses 4px base grid.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tiny gaps, icon padding |
| `--space-2` | 8px | Small gaps, list items |
| `--space-3` | 12px | Card padding, form gaps |
| `--space-4` | 16px | Default padding |
| `--space-5` | 20px | Component gaps |
| `--space-6` | 24px | Section padding |
| `--space-8` | 32px | Page padding |
| `--space-10` | 40px | Large sections |
| `--space-12` | 48px | Hero sections |

### Layout Padding

| Element | Padding |
|---------|---------|
| Page container | `px-6 py-8` (24px horizontal, 32px vertical) |
| Card | `p-4` (16px) |
| Card header | `px-4 pt-4 pb-2` |
| Card footer | `px-4 py-3` |
| Form group | `space-y-3` (12px between fields) |
| Button group | `gap-2` (8px) |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Inputs, badges |
| `--radius-md` | 8px | Cards, buttons, modals |
| `--radius-lg` | 12px | Large containers |
| `--radius-full` | 9999px | Avatars, pills |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards, nav items |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Hover cards, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, overlays |
| `--shadow-inner` | `inset 0 2px 4px rgba(0,0,0,0.05)` | Input focus |

---

## 6. Component Styles

### Buttons

| Variant | Background | Text | Hover | Border |
|---------|-----------|------|-------|--------|
| Primary | `--color-primary` | `--color-white` | `--color-primary-hover` | none |
| Secondary | `--color-gray-100` | `--color-gray-700` | `--color-gray-200` | `--color-gray-200` |
| Success | `--color-success` | `--color-white` | `#15803d` | none |
| Danger | `--color-error` | `--color-white` | `#b91c1c` | none |
| Ghost | transparent | `--color-gray-600` | `--color-gray-100` | none |

| Size | Padding | Font Size |
|------|---------|-----------|
| SM | `px-2 py-1` | 12px |
| MD | `px-4 py-2` | 14px |
| LG | `px-6 py-3` | 16px |

### Cards

| Property | Value |
|----------|-------|
| Background | `--color-white` |
| Border | `1px solid --color-gray-200` |
| Border Radius | `--radius-md` (8px) |
| Padding | `--space-4` (16px) |
| Shadow | `--shadow-sm` |
| Hover Shadow | `--shadow-md` |

### Inputs

| Property | Value |
|----------|-------|
| Background | `--color-white` |
| Border | `1px solid --color-gray-300` |
| Border Radius | `--radius-sm` (4px) |
| Padding | `--space-2` vertical, `--space-3` horizontal |
| Font Size | 14px |
| Focus Border | `2px solid --color-primary` |
| Focus Ring | `outline-none` + `ring-2 ring-blue-500` |
| Disabled | `--color-gray-100`, `--color-gray-400` text |

### Badges

| Property | Value |
|----------|-------|
| Padding | `1px 8px` |
| Font Size | 11px |
| Font Weight | 500 |
| Border Radius | `--radius-sm` (4px) |

### Tables

| Property | Value |
|----------|-------|
| Header Background | `--color-gray-50` |
| Header Text | `--color-gray-700` |
| Row Hover | `--color-gray-50` |
| Border | `1px solid --color-gray-200` |
| Cell Padding | `--space-3` horizontal, `--space-2` vertical |

### Modals

| Property | Value |
|----------|-------|
| Overlay | `bg-black/50` |
| Background | `--color-white` |
| Border Radius | `--radius-lg` (12px) |
| Max Width | `w-full max-w-2xl` |
| Max Height | `max-h-[80vh]` |
| Padding | `--space-6` (24px) |
| Shadow | `--shadow-lg` |

### Navigation

| Element | Style |
|---------|-------|
| Active item | `--color-primary` text, underline or left border |
| Inactive item | `--color-gray-600` text, hover to `--color-gray-900` |
| Header background | `--color-white` |
| Header border | `1px solid --color-gray-200` |
| Header sticky | `position: sticky; top: 0; z-index: 40` |

---

## 7. Page Layouts

### Standard Page Layout

```
┌─────────────────────────────────────┐
│           HEADER (sticky)            │
├─────────────────────────────────────┤
│                                     │
│   Page Container (max-w-7xl)        │
│   px-6 py-8                         │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Page Title (h1, 36px)      │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Subtitle / Description     │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Main Content Area          │   │
│   │  (cards, lists, tables)     │   │
│   └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│           FOOTER                     │
└─────────────────────────────────────┘
```

### Card Grid Layout

```
┌─────────────────────────────────────┐
│   Filters / Search Bar               │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ Card │  │ Card │  │ Card │      │
│  └──────┘  └──────┘  └──────┘      │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ Card │  │ Card │  │ Card │      │
│  └──────┘  └──────┘  └──────┘      │
│                                     │
└─────────────────────────────────────┘
```

Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

---

## 8. Dark Mode (Future)

Reserved for future implementation. Tokens will map to:
- `dark:--color-primary` = `#3b82f6`
- `dark:--color-gray-900` = `#f9fafb`
- `dark:--color-gray-50` = `#111827`

---

## 9. Accessibility

| Requirement | Value |
|-------------|-------|
| Minimum contrast ratio | 4.5:1 for normal text, 3:1 for large text |
| Focus indicators | Visible outline on all interactive elements |
| Keyboard navigation | All elements reachable via Tab/Enter/Escape |
| Screen readers | Semantic HTML, ARIA labels where needed |
| Font size | Minimum 14px for body text |

---

## 10. Implementation Rules

1. **Use Tailwind CSS utility classes** — do not write custom CSS unless absolutely necessary
2. **Reference design tokens** — use Tailwind's built-in color scale and spacing
3. **Follow component styles** — use defined button, card, input styles
4. **Maintain consistent padding** — 16px for cards, 24px for page containers
5. **Use semantic colors** — success/error/warning for status, not arbitrary colors
6. **Keep it simple** — no gradients, no animations (unless specified), no custom shadows
7. **Mobile first** — all layouts must be responsive

---

## 11. Required Pages Design

### Page 1: Home (`/`)
- **Layout**: Hero section with title and description
- **Elements**: Navigation cards to major sections (Catalog, App Docs, Linked View)
- **Design**: Clean, minimal, centered content
- **Mandatory**: Header + Footer

### Page 2: Document Catalog (`/catalog`)
- **Layout**: Filter bar at top, card grid below
- **Elements**: Category filters, search input, document cards with tags
- **Design**: Dense information display, consistent card heights
- **Mandatory**: Header + Footer

### Page 3: App Docs Index (`/docs/app-canonical`)
- **Layout**: Search bar at top, list of application entries
- **Elements**: App cards with title, status badge, node ID
- **Design**: List layout with hover states
- **Mandatory**: Header + Footer

### Page 4: App Viewer (`/docs/app-canonical/[nodeId]/[appId]`)
- **Layout**: Header with app info, content area with linked view
- **Elements**: Counters bar, type filters, object grid, detail panel
- **Design**: Three-column layout on desktop, single column on mobile
- **Mandatory**: Header + Footer

### Page 5: Linked View (`/appdocs`)
- **Layout**: App selector tabs at top, viewer below
- **Elements**: Tab buttons, counters, filters, object grid, detail panel
- **Design**: Similar to App Viewer but with app switching
- **Mandatory**: Header + Footer

### Page 6: All Documents (`/docs`)
- **Layout**: Search bar at top, file list below
- **Elements**: Search input, file cards with path and size
- **Design**: Simple list, monospace font for paths
- **Mandatory**: Header + Footer

### Page 7: Error (`/error`)
- **Layout**: Centered error message
- **Elements**: Error code, message, "Try again" button, "Go home" link
- **Design**: Minimal, centered, clear error state
- **Mandatory**: Header + Footer

### Page 8: 404 (`/not-found`)
- **Layout**: Centered 404 message
- **Elements**: 404 code, explanation, "Go home" button
- **Design**: Minimal, friendly error state
- **Mandatory**: Header + Footer

### Page 9: Privileged Editor Modal
- **Layout**: Full-screen overlay with centered modal
- **Elements**: Password input (if not verified), editable fields, diff summary, save/cancel buttons
- **Design**: Modal with scrollable content area, clear action buttons
- **Mandatory**: Overlay closes on Escape, backdrop click

---

## ⚠️ MANDATORY REQUIREMENT

**When creating any new page or component in the SUMMARYDOCS web reader:**

1. **Read this DESIGN.md document first**
2. **Follow the color palette** — use only defined tokens
3. **Follow the spacing system** — use 4px base grid
4. **Follow the typography scale** — use defined font sizes and weights
5. **Follow the component styles** — use defined button, card, input styles
6. **Ensure responsive layout** — mobile-first approach
7. **Include Header and Footer** — via root layout
8. **Include error handling** — via error.tsx

**Non-compliance will be flagged during code review.**

**All new screens MUST be documented in this document (Section 11) before implementation.**

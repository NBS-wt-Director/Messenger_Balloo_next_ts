---
title: User Environment Design Contract
description: Реконструированный дизайн-контракт пользовательской среды Balloo на основе messenger
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - design
  - user-environment
  - messenger
  - canonical
related_docs:
  - SUMMARY_DOCS/design/TECHNICAL_NODES_DESIGN_CONTRACT.md
  - SUMMARY_DOCS/DesignContract.md
  - SUMMARY_DOCS/BrandContract.md
  - SUMMARY_DOCS/ThemeContract.md
---

# 🎨 USER ENVIRONMENT DESIGN CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот контракт определяет **дизайн-систему пользовательской среды** Balloo, реконструированную из существующего кода messenger.

**Evidence Sources:**
- `messenger/src/app/globals.css` — CSS variables, themes, base styles
- `messenger/src/components/` — UI components
- `messenger/src/app/` — Page layouts and screens
- `messenger/tailwind.config.ts` — Tailwind configuration
- `packages/core-brand` — Brand assets (reconstructed)
- `packages/core-theme` — Theme system (reconstructed)

---

## 🏛️ VISUAL IDENTITY

### Core Principles

1. **Sharp Minimalism** — No rounded corners (`border-radius: 0`)
2. **High Contrast** — Clear visual hierarchy
3. **System Native** — Uses system fonts and native controls
4. **Theme-able** — 3 preset themes (dark, light, russia)
5. **Mobile-First** — Responsive from 375px to desktop

### Brand Integration

| Element | Specification | Source |
|---------|--------------|--------|
| **Primary Color** | `#0039A6` (Russia Blue) | BrandContract |
| **Secondary Color** | `#D52B1E` (Russia Red) | BrandContract |
| **Accent Color** | `#007bff` (Modern Blue) | BrandContract |
| **Logo Clear Space** | 8px minimum | BrandContract |
| **Logo Min Size** | 32px | BrandContract |

---

## 🎨 TOKEN SYSTEM

### CSS Variables (Reconstructed from globals.css)

```css
:root {
  /* Backgrounds */
  --background: #000000;
  --background-plain: #000000;
  --card: #1c1c1c;
  --card-solid: #1c1c1c;
  
  /* Foregrounds */
  --foreground: #ffffff;
  --card-foreground: #ffffff;
  --popover-foreground: #ffffff;
  
  /* Primary */
  --primary: #3b82f6;
  --primary-plain: #3b82f6;
  --primary-foreground: #ffffff;
  
  /* Secondary */
  --secondary: #2c2c2c;
  --secondary-solid: #2c2c2c;
  --secondary-foreground: #ffffff;
  
  /* Muted */
  --muted: #2c2c2c;
  --muted-solid: #2c2c2c;
  --muted-foreground: #b0b0b0;
  
  /* Accent */
  --accent: #3b82f6;
  --accent-foreground: #ffffff;
  
  /* Destructive */
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  
  /* Borders */
  --border: #404040;
  --border-solid: #404040;
  --border-plain: #404040;
  
  /* Inputs */
  --input: #2c2c2c;
  --input-solid: #2c2c2c;
  
  /* Ring (focus) */
  --ring: #3b82f6;
  
  /* Radius (CRITICAL: Always 0) */
  --radius: 0;
  
  /* Scrollbars */
  --scrollbar-thumb: #555555;
  --scrollbar-thumb-hover: #777777;
}
```

### Theme Variants

| Theme | Background | Foreground | Primary | Notes |
|-------|-----------|------------|---------|-------|
| **dark** | `#000000` | `#ffffff` | `#3b82f6` | Default |
| **light** | `#ffffff` | `#000000` | `#2563eb` | Light mode |
| **russia** | `gradient` | `#000000` | `#0039a6` | Russia flag |

---

## 📐 TYPOGRAPHY

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Font Sizes (Reconstructed)

| Size | Value | Usage |
|------|-------|-------|
| `xs` | 12px (0.75rem) | Captions |
| `sm` | 14px (0.875rem) | Secondary text |
| `base` | 16px (1rem) | Body text |
| `lg` | 18px (1.125rem) | Subheadings |
| `xl` | 20px (1.25rem) | Section titles |
| `2xl` | 24px (1.5rem) | Page titles |
| `3xl` | 30px (1.875rem) | Hero text |

### Font Weights

| Weight | Usage |
|--------|-------|
| 400 | Body text |
| 500 | Emphasis, buttons |
| 700 | Headings |

---

## 📏 SPACING SYSTEM

### Base Scale (Reconstructed from components)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro spacing |
| `--space-2` | 8px | Tight spacing |
| `--space-3` | 12px | Component padding |
| `--space-4` | 16px (1rem) | Base spacing |
| `--space-5` | 20px (1.25rem) | Section spacing |
| `--space-6` | 24px (1.5rem) | Card padding |
| `--space-8` | 32px (2rem) | Large spacing |
| `--space-12` | 48px (3rem) | Page sections |

### Border Width

| Element | Width |
|---------|-------|
| **Default Border** | 2px |
| **Input Border** | 2px |
| **Card Border** | 2px |
| **Modal Border** | 2px |

---

## 🧩 CORE COMPONENTS

### Button

```css
.btn-primary {
  background: var(--primary);
  color: var(--primary-foreground);
  border: 2px solid var(--primary);
  border-radius: 0; /* CRITICAL */
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  min-height: 44px; /* Mobile */
}
```

**States:** default, hover, active, disabled

### Input

```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: 0; /* CRITICAL */
  color: var(--foreground);
  font-size: 1rem;
}
```

**States:** default, focus, disabled, error

### Card

```css
.card {
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: 0; /* CRITICAL */
  padding: 1.5rem;
}
```

### Modal

```css
.modal-content {
  max-width: 28rem;
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: 0; /* CRITICAL */
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

---

## 📱 SCREEN ARCHETYPES

### Reconstructed from messenger/src/app/

| Screen Type | Examples | Pattern |
|-------------|----------|---------|
| **Auth** | login, register, forgot-password | Centered card form |
| **Chat List** | chats/ | List with search |
| **Chat Detail** | chats/[id] | Message list + input |
| **Settings** | settings/ | Card-based sections |
| **Profile** | profile/ | Avatar + info cards |
| **Admin** | admin/ | Dashboard layout |
| **Info** | about-balloo, privacy, terms | Content page |
| **Download** | downloads/ | Platform cards |

---

## 🧭 NAVIGATION MODEL

### Header Navigation

```
┌────────────────────────────────────────┐
│ [Logo] [Page Title]        [Actions]  │
├────────────────────────────────────────┤
```

### Footer Navigation

```
├────────────────────────────────────────┤
│ [Links] [Copyright] [Social]           │
└────────────────────────────────────────┘
```

### Mobile Navigation

- Header with burger menu
- Bottom safe area for gestures
- Touch-friendly targets (44px min)

---

## ⚡ INTERACTION STATES

### Hover States

```css
.btn:hover {
  transform: scale(1.02);
  transition: all 0.15s;
}
```

### Focus States

```css
input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--ring);
}
```

### Active States

```css
.btn:active {
  transform: scale(0.95);
}
```

### Disabled States

```css
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

## 📐 PLATFORM ADAPTATIONS

### Mobile (≤640px)

- Font size: 14px base
- Touch targets: 44px min
- Card padding: 16px
- Modal: 95vw max-width

### Tablet (641px - 1024px)

- Font size: 16px base
- Container: 100% width
- Card padding: 24px

### Desktop (≥1024px)

- Font size: 16px base
- Container: 1200px max
- Card padding: 32px

---

## ✅ INVARIANTS

### Critical (Must Never Violate)

1. **`border-radius: 0`** — No rounded corners anywhere
2. **`border: 2px solid`** — All borders 2px
3. **3 themes only** — dark, light, russia
4. **System fonts** — No custom font imports
5. **8px clear space** — Around logo

### Strong (Should Follow)

1. **44px touch targets** — On mobile
2. **High contrast** — WCAG AA minimum
3. **Consistent spacing** — Use token scale
4. **Semantic HTML** — Proper element usage

---

## 🚫 FORBIDDEN DEVIATIONS

### Never Do

- ❌ `border-radius: 4px` or any value > 0
- ❌ `rounded-*` Tailwind classes
- ❌ `border-radius: 50%` for circles
- ❌ Custom themes in user apps without contract
- ❌ Border width other than 2px (without reason)
- ❌ Font sizes outside defined scale
- ❌ Colors outside theme tokens

---

## 🤖 CODEGEN RELEVANCE

### For AI Code Generation

```json
{
  "designTokens": "SUMMARY_DOCS/state/design-tokens.json",
  "components": "SUMMARY_DOCS/state/design-components.json",
  "patterns": "SUMMARY_DOCS/state/design-screen-patterns.json",
  "invariants": ["no-rounded-corners", "2px-borders", "3-themes"]
}
```

### Template Variables

```typescript
interface DesignContext {
  theme: 'dark' | 'light' | 'russia';
  borderRadius: 0; // Always
  borderWidth: 2; // Default
  touchTarget: 44; // Mobile minimum
}
```

---

## 📖 RELATED DOCUMENTS

- [TECHNICAL_NODES_DESIGN_CONTRACT.md](./TECHNICAL_NODES_DESIGN_CONTRACT.md) — Technical UI contract
- [DESIGN_TOKEN_MAP.md](./DESIGN_TOKEN_MAP.md) — Token registry
- [COMPONENT_MAP.md](./COMPONENT_MAP.md) — Component registry
- [DesignContract.md](../DesignContract.md) — Original design contract
- [BrandContract.md](../BrandContract.md) — Brand guidelines

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**

# DESIGN_POLICY — Web Reader Design Compliance Policy

## Overview

This document defines the **mandatory design requirements** for ALL pages in the SUMMARYDOCS web reader.
It is a **binding policy** — all developers and AI agents MUST follow these rules.

---

## 1. DESIGN COMPLIANCE RULES

### Rule 1: ALL pages MUST follow DESIGN.md

Every page in the SUMMARYDOCS web reader MUST implement the design system defined in `DESIGN.md`.

**Scope:**
- All pages under `src/app/`
- All components under `src/components/`
- All modals, dialogs, overlays
- All forms, tables, cards, lists

**Enforcement:**
- Design compliance is required for code review
- Non-compliant pages will be rejected
- No exceptions without written approval from system architect

### Rule 2: ALL pages MUST have Header and Footer

Every page MUST include the global Header and Footer components.

**Enforcement:**
- Via root layout (`src/app/layout.tsx`)
- Even error pages and 404 pages MUST have Header and Footer
- No page may bypass this rule

### Rule 3: ALL pages MUST have Error handling

Every page MUST be covered by `src/app/error.tsx` for runtime errors.

**Enforcement:**
- Via Next.js App Router error boundaries
- Error pages MUST follow DESIGN.md styles

### Rule 4: ALL new screens MUST reference DESIGN.md

When creating any new page or component:

1. **Read `DESIGN.md`** before writing code
2. **Follow color palette** — use only defined colors
3. **Follow spacing** — use 4px base grid
4. **Follow typography** — use defined font sizes
5. **Follow components** — use defined button, card, input styles
6. **Ensure responsive** — mobile-first approach

**Template for new pages:**

```tsx
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* Content follows DESIGN.md */}
      </main>
      <Footer />
    </div>
  );
}
```

### Rule 5: NO custom styles that override design tokens

Developers MUST NOT:
- Define custom color variables outside DESIGN.md
- Override spacing values with arbitrary numbers
- Create custom shadows or border radii
- Add animations without explicit approval
- Use inline styles for presentation (except dynamic values)

**Allowed exceptions:**
- Dynamic values from state (e.g., progress bars)
- SVG icons and illustrations
- Conditional background colors from data (must use semantic tokens)

### Rule 6: ALL status indicators MUST use semantic colors

Status colors MUST follow the defined palette:

| Status | Color | Usage |
|--------|-------|-------|
| Active | `--color-success` | Active objects, success states |
| Draft | `--color-warning` | Draft objects, pending states |
| Deprecated | `--color-error` | Deprecated objects, errors |
| Info | `--color-info` | Informational badges |

**No arbitrary colors for status.**

### Rule 7: ALL interactive elements MUST have hover states

All buttons, links, and clickable cards MUST have hover states.

**Required hover states:**
- Buttons: darker background or lighter border
- Links: darker text color
- Cards: `shadow-md` on hover
- Table rows: `bg-gray-50` on hover

### Rule 8: ALL forms MUST have focus states

All input fields MUST have visible focus indicators.

**Required focus styles:**
- Border: `2px solid --color-primary`
- Ring: `ring-2 ring-blue-500`
- No `outline: none` without replacement

---

## 2. REQUIRED SCREENS

The following screens are **MANDATORY** and MUST exist in the web reader:

### 2.1 Core Pages

| # | Page | Path | Status |
|---|------|------|--------|
| 1 | Home | `/` | ✅ Implemented |
| 2 | Document Catalog | `/catalog` | ✅ Implemented |
| 3 | App Docs Index | `/docs/app-canonical` | ✅ Implemented |
| 4 | App Viewer | `/docs/app-canonical/[nodeId]/[appId]` | ✅ Implemented |
| 5 | Linked View | `/appdocs` | ✅ Implemented |
| 6 | All Documents | `/docs` | ✅ Implemented |
| 7 | Error Page | (runtime) | ✅ Implemented |
| 8 | 404 Page | `/nonexistent` | ✅ Implemented |

### 2.2 Modal Pages

| # | Page | Trigger | Status |
|---|------|---------|--------|
| 1 | Privileged Editor | Click "Edit" on any object | ✅ Implemented |

### 2.3 Future Required Screens

| # | Page | Description | Priority |
|---|------|-------------|----------|
| 1 | Object Detail View | Full detail view for single object | High |
| 2 | Search Results | Full-screen search results | Medium |
| 3 | Settings Page | User preferences, password change | Medium |
| 4 | Audit Log | View change history | Low |
| 5 | Node Tree View | Visual tree of nodes and apps | Low |

---

## 3. DESIGN CHECKLIST

Before submitting any new page or component, verify:

- [ ] Read `DESIGN.md` before starting
- [ ] Used only defined color tokens
- [ ] Used 4px base grid for spacing
- [ ] Used defined typography scale
- [ ] Used defined component styles
- [ ] Included Header and Footer
- [ ] Covered by error.tsx
- [ ] Responsive on mobile (320px+)
- [ ] Hover states on all interactive elements
- [ ] Focus states on all inputs
- [ ] Semantic colors for status
- [ ] No custom CSS overrides
- [ ] Tailwind utility classes only (no custom CSS)
- [ ] Accessible (contrast, keyboard nav)

---

## 4. VIOLATIONS

The following are **violations** of this policy:

| Violation | Severity | Action |
|-----------|----------|--------|
| Missing Header/Footer | Critical | Reject PR |
| Custom colors outside palette | High | Reject PR |
| No hover/focus states | Medium | Request changes |
| Non-responsive layout | High | Request changes |
| Inline styles for presentation | Medium | Request changes |
| No error handling | Critical | Reject PR |

---

## 5. ENFORCEMENT

This policy is enforced by:

1. **Code review** — reviewers MUST verify compliance
2. **Automated checks** — future: ESLint rules for design tokens
3. **Architecture review** — any exception requires architect approval

**This policy is effective immediately and applies to all developers and AI agents working on the SUMMARYDOCS web reader.**

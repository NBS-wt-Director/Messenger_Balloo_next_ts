# DESIGN_CHECKLIST — Screen Creation Checklist

## Overview

This checklist MUST be completed for EVERY new page, component, or modal created in the SUMMARYDOCS web reader.

---

## Pre-Implementation

- [ ] **Read DESIGN.md** — understand the design system
- [ ] **Read DESIGN_POLICY.md** — understand mandatory requirements
- [ ] **Check CATALOG_COMPLETE.md** — see existing pages, avoid duplicates
- [ ] **Define page purpose** — what does this page do?
- [ ] **Define layout** — which layout from DESIGN.md Section 7 applies?
- [ ] **Define components** — which components from DESIGN.md Section 6 are needed?

---

## Implementation

### Header & Footer

- [ ] **Header included** — `<Header />` component present
- [ ] **Footer included** — `<Footer />` component present
- [ ] **Root layout used** — page is in `src/app/` (not `pages/`)
- [ ] **Sticky header** — header uses `sticky top-0 z-40`

### Colors

- [ ] **Only defined colors used** — no custom hex values
- [ ] **Semantic colors for status** — success/error/warning used correctly
- [ ] **Primary color for links** — `text-blue-600` for links
- [ ] **Gray scale for text** — `text-gray-900` for primary, `text-gray-600` for secondary

### Typography

- [ ] **H1 for page titles** — `text-3xl font-bold` (36px)
- [ ] **H2 for section titles** — `text-2xl font-semibold` (28px)
- [ ] **H3 for card titles** — `text-lg font-semibold` (22px)
- [ ] **Body text 14px** — `text-sm` (14px) for standard body
- [ ] **Small text 12px** — `text-xs` (12px) for captions

### Spacing

- [ ] **4px base grid** — all spacing is multiple of 4
- [ ] **Card padding 16px** — `p-4` for cards
- [ ] **Page padding 24px** — `px-6 py-8` for page containers
- [ ] **Form gaps 12px** — `space-y-3` for form fields
- [ ] **Button gaps 8px** — `gap-2` for button groups

### Components

- [ ] **Buttons defined** — primary/secondary/success/danger/ghost
- [ ] **Cards defined** — white background, border, shadow
- [ ] **Inputs defined** — border, focus ring, disabled state
- [ ] **Badges defined** — status colors, padding, font size
- [ ] **Tables defined** — header background, row hover

### Interactivity

- [ ] **Hover states** — all buttons, links, cards have hover states
- [ ] **Focus states** — all inputs have focus ring
- [ ] **Disabled states** — buttons and inputs have disabled styles
- [ ] **Loading states** — async operations show loading indicators

### Responsive

- [ ] **Mobile first** — base styles for mobile, `md:` and `lg:` for larger
- [ ] **Grid responsive** — `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- [ ] **Text readable** — no text smaller than 12px on mobile
- [ ] **Touch targets** — buttons at least 44x44px on mobile

### Accessibility

- [ ] **Contrast ratio** — minimum 4.5:1 for text
- [ ] **Keyboard nav** — all elements reachable via Tab/Enter/Escape
- [ ] **Semantic HTML** — use `nav`, `main`, `footer`, `header`
- [ ] **ARIA labels** — interactive elements have labels

### Error Handling

- [ ] **Error boundary** — covered by `src/app/error.tsx`
- [ ] **Loading state** — shows loading indicator during async
- [ ] **Empty state** — shows message when no data
- [ ] **Error message** — shows user-friendly error

---

## Post-Implementation

- [ ] **Test on mobile** — check 320px width
- [ ] **Test on desktop** — check 1920px width
- [ ] **Test keyboard navigation** — Tab, Enter, Escape
- [ ] **Test hover states** — all interactive elements
- [ ] **Test focus states** — all inputs
- [ ] **Test responsive grid** — columns collapse correctly
- [ ] **Test dark mode** — (future) colors invert correctly
- [ ] **Update CATALOG_COMPLETE.md** — add new page to catalog
- [ ] **Update DESIGN.md** — add new page to Section 11

---

## Example: New Page

```tsx
'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* H1 for page title */}
        <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
        
        {/* Body text */}
        <p className="mt-2 text-sm text-gray-600">Description</p>
        
        {/* Card with proper spacing */}
        <div className="mt-6 bg-white border rounded-md p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
          <p className="mt-2 text-sm text-gray-600">Card content</p>
        </div>
        
        {/* Button with hover state */}
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
          Action
        </button>
      </main>
      <Footer />
    </div>
  );
}
```

---

## Final Verification

- [ ] All checklist items completed
- [ ] Code follows existing style (indentation, naming)
- [ ] No console errors or warnings
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Page visible in CATALOG_COMPLETE.md
- [ ] Page documented in DESIGN.md Section 11

# 🎨 Дизайн-система веб-интерфейса узла документации

**Статус:** ✅ Production  
**Стиль:** Balloo Messenger  
**Дата обновления:** 2026-06-20

---

## 🏗️ АРХИТЕКТУРА

### Tech Stack

| Компонент | Технология |
|-----------|-----------|
| Framework | Next.js 15 (App Router) |
| Язык | TypeScript |
| Стили | Tailwind CSS + CSS Variables |
| State | Zustand |
| Иконки | Lucide React |
| Шрифт | -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto |

---

## 🎨 DESIGN TOKENS

### Цвета (CSS Variables)

#### Dark Theme (по умолчанию)

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#000000` | Page background |
| `--foreground` | `#ffffff` | Text color |
| `--card` | `#1c1c1c` | Card background |
| `--primary` | `#3b82f6` | Primary buttons, links |
| `--secondary` | `#2c2c2c` | Secondary elements |
| `--muted` | `#2c2c2c` | Disabled, placeholders |
| `--muted-foreground` | `#b0b0b0` | Secondary text |
| `--border` | `#404040` | Borders, dividers |
| `--destructive` | `#dc2626` | Error states |
| `--ring` | `#3b82f6` | Focus rings |

#### Light Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#ffffff` | Page background |
| `--foreground` | `#000000` | Text color |
| `--card` | `#f5f5f5` | Card background |
| `--primary` | `#2563eb` | Primary buttons, links |
| `--secondary` | `#e5e5e5` | Secondary elements |
| `--muted` | `#e5e5e5` | Disabled, placeholders |
| `--muted-foreground` | `#525252` | Secondary text |
| `--border` | `#d4d4d4` | Borders, dividers |

#### Russia Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `transparent` | Page background |
| `--foreground` | `#000000` | Text color |
| `--primary` | `#0039a6` | Primary buttons, links |
| `--card-solid` | `#d3d3d3` | Card background |
| `--border-solid` | `#d4af37` | Borders, dividers |

### Размеры (4px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-xs` | `4px` | Small gaps |
| `spacing-sm` | `8px` | Medium gaps |
| `spacing-md` | `16px` | Default padding |
| `spacing-lg` | `24px` | Large padding |
| `spacing-xl` | `32px` | Page margins |
| `spacing-2xl` | `48px` | Section margins |

### Типографика

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| `h1` | `2rem` (32px) | `700` | `1.2` |
| `h2` | `1.5rem` (24px) | `700` | `1.3` |
| `h3` | `1.25rem` (20px) | `600` | `1.4` |
| `body` | `1rem` (16px) | `400` | `1.5` |
| `small` | `0.875rem` (14px) | `400` | `1.5` |
| `xs` | `0.75rem` (12px) | `400` | `1.4` |

---

## 🧩 КОМПОНЕНТЫ

### 1. Header

**Purpose:** Global header with navigation, theme switcher, user menu

**Props:**
```typescript
interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}
```

**Structure:**
```
Header
├── Back Button (optional)
├── Logo ("🎈 Balloo")
├── Page Title (optional)
└── User Menu
    ├── Theme Switcher
    │   ├── Dark
    │   ├── Light
    │   └── Russia
    └── User Avatar
```

**Styles:**
- Background: `var(--card)`
- Border-bottom: `2px solid var(--border)`
- Padding: `16px 24px`
- Height: `64px`
- Display: `flex`, `align-items: center`
- Backdrop blur: `10px`

**States:**
- Hover: `opacity: 0.8` on buttons
- Active: `background: var(--muted)` on icons

---

### 2. Footer

**Purpose:** Global footer with links and copyright

**Structure:**
```
Footer
├── Logo
├── Links
│   ├── About
│   ├── Features
│   ├── Privacy
│   └── Terms
├── Copyright
└── Slogan ("Переверни общение!")
```

**Styles:**
- Background: `var(--card)`
- Border-top: `2px solid var(--border)`
- Padding: `24px`
- Text: `var(--muted-foreground)`

---

### 3. Card

**Purpose:** Content container

**Props:**
```typescript
interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
}
```

**Structure:**
```
Card
├── Header (title + actions)
├── Body
└── Footer (optional)
```

**Styles:**
- Background: `var(--card)`
- Border: `2px solid var(--border)`
- Padding: `24px`
- Border-radius: `0` (как в messenger)

---

### 4. Button

**Purpose:** Interactive element

**Variants:**
- `primary` — `background: var(--primary)`, `color: white`
- `secondary` — `background: var(--secondary)`, `color: var(--foreground)`
- `destructive` — `background: var(--destructive)`, `color: white`
- `ghost` — `background: transparent`, `border: none`

**Sizes:**
- `sm` — `10px 16px`, `font-size: 14px`
- `md` — `12px 24px`, `font-size: 16px`
- `lg` — `16px 32px`, `font-size: 18px`

**States:**
- Hover: `opacity: 0.8`
- Focus: `box-shadow: 0 0 0 2px var(--ring)`
- Disabled: `opacity: 0.5`, `cursor: not-allowed`
- Active (touch): `transform: scale(0.95)`

---

### 5. Input

**Purpose:** Text input field

**Props:**
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'date';
  error?: string;
}
```

**Styles:**
- Background: `var(--card)`
- Border: `2px solid var(--border)`
- Padding: `12px 16px`
- Color: `var(--foreground)`
- Font-size: `16px`
- Focus: `border-color: var(--primary)`, `box-shadow: 0 0 0 2px var(--ring)`
- Disabled: `opacity: 0.5`

---

### 6. Select

**Purpose:** Dropdown selection

**Styles:**
- Background: `var(--card)`
- Border: `2px solid var(--border)`
- Padding: `12px 40px 12px 16px`
- Background-image: dropdown arrow SVG
- Focus: `border-color: var(--primary)`

---

### 7. Badge

**Purpose:** Status indicator

**Variants:**
- `active` — `background: #10b981` (green)
- `draft` — `background: #f59e0b` (yellow)
- `inactive` — `background: #6b7280` (gray)
- `error` — `background: #ef4444` (red)

**Styles:**
- Padding: `4px 8px`
- Border-radius: `4px`
- Font-size: `12px`
- Font-weight: `600`

---

### 8. Alert

**Purpose:** Information, warning, error messages

**Variants:**
- `info` — `border: 2px solid var(--primary)`, `background: rgba(59, 130, 246, 0.1)`
- `warning` — `border: 2px solid #f59e0b`, `background: rgba(245, 158, 11, 0.1)`
- `error` — `border: 2px solid #ef4444`, `background: rgba(239, 68, 68, 0.1)`
- `success` — `border: 2px solid #10b981`, `background: rgba(16, 185, 129, 0.1)`

**Structure:**
```
Alert
├── Icon (info/warning/error/success)
├── Title
└── Description
```

---

## 📱 RESPONSIVE LAYOUT

### Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `xs` | `< 375px` | Small mobile |
| `sm` | `< 640px` | Mobile |
| `md` | `< 1024px` | Tablet |
| `lg` | `>= 1024px` | Desktop |

### Mobile Styles

```css
@media (max-width: 640px) {
  html, body { font-size: 14px; }
  .container { padding: 0 16px; }
  .header { padding: 12px 16px; }
  .card { padding: 16px; }
  .modal-content { max-width: 95vw; }
  button, a { min-height: 44px; }
  input, textarea, select { font-size: 16px; }
}
```

### Safe Areas

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## 🎭 АНИМАЦИИ

### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide In

```css
@keyframes slideIn {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Slide Down

```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Slide Up

```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Pulse

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### Spin

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🖼️ СТРУКТУРА СТРАНИЦ

### 1. Documentation Home (`/docs`)

**Purpose:** Overview of all nodes and documentation

**Layout:**
```
Page
├── Header (title: "📚 Balloo Documentation")
├── Main Content
│   ├── Node Cards Grid
│   │   ├── Messenger Card
│   │   ├── API Card
│   │   └── ...
│   └── Search Bar
└── Footer
```

**Components:**
- `Header` — Global header
- `Footer` — Global footer
- `NodeCard` — Card for each node
- `SearchBar` — Search input
- `Badge` — Status indicators

---

### 2. Node Documentation (`/docs/[nodeId]`)

**Purpose:** Detailed documentation for a specific node

**Layout:**
```
Page
├── Header (title: nodeId, back button)
├── Main Content
│   ├── Hero Section
│   │   ├── Node Title
│   │   ├── Description
│   │   └── Status Badge
│   ├── Tabs
│   │   ├── Overview
│   │   ├── Screens
│   │   ├── Transitions
│   │   ├── Scenarios
│   │   └── Integrations
│   └── Tab Content
└── Footer
```

**Components:**
- `Header` — Global header with back button
- `TabNavigation` — Tab bar
- `DocumentationSection` — Content section
- `Table` — Data tables
- `CodeBlock` — Code examples

---

### 3. Screen Detail (`/docs/[nodeId]/screen/[screenId]`)

**Purpose:** Detailed documentation for a specific screen

**Layout:**
```
Page
├── Header (title: screenId, back button)
├── Main Content
│   ├── Screen Header
│   │   ├── Title
│   │   └── Status Badge
│   ├── Purpose
│   ├── Components
│   ├── UI Elements
│   ├── Actions
│   └── Related (transitions, scenarios, integrations)
└── Footer
```

---

### 4. Transition Detail (`/docs/[nodeId]/transition/[transitionId]`)

**Purpose:** Detailed documentation for a specific transition

**Layout:**
```
Page
├── Header (title: transitionId, back button)
├── Main Content
│   ├── Transition Header
│   │   ├── Title
│   │   └── Status Badge
│   ├── Source Screen
│   ├── Target Screen
│   ├── Trigger
│   ├── Conditions
│   └── Result
└── Footer
```

---

### 5. Scenario Detail (`/docs/[nodeId]/scenario/[scenarioId]`)

**Purpose:** Detailed documentation for a specific scenario

**Layout:**
```
Page
├── Header (title: scenarioId, back button)
├── Main Content
│   ├── Scenario Header
│   │   ├── Title
│   │   └── Status Badge
│   ├── Goal
│   ├── Actor
│   ├── Preconditions
│   ├── Steps (numbered list)
│   ├── Outputs
│   └── Exceptions
└── Footer
```

---

### 6. Integration Detail (`/docs/[nodeId]/integration/[integrationId]`)

**Purpose:** Detailed documentation for a specific integration

**Layout:**
```
Page
├── Header (title: integrationId, back button)
├── Main Content
│   ├── Integration Header
│   │   ├── Title
│   │   └── Status Badge
│   ├── Direction
│   ├── Target
│   ├── Purpose
│   ├── Protocol
│   ├── Auth
│   ├── Endpoints/Events
│   └── Data Flow Diagram
└── Footer
```

---

## 🎨 UX PATTERNS

### Empty State

```
[Icon]
[Title]
[Description]
[Action Button]
```

**Example:**
```
[📭]
[No documentation yet]
[This node needs documentation to be filled in manually.]
[Fill Documentation]
```

---

### Loading State

```
[Spinner]
```

**Example:**
```
<div className="min-h-screen flex items-center justify-center">
  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
</div>
```

---

### Error State

```
[Alert error]
  ├── Icon (X)
  ├── Title: "Error"
  └── Description: "Failed to load documentation"
[Retry Button]
```

---

### Success State

```
[Alert success]
  ├── Icon (Check)
  ├── Title: "Success"
  └── Description: "Documentation saved"
```

---

## 📋 СТАНДАРТЫ

### 1. Кодировка

- UTF-8

### 2. Форматирование

- 2 пробела для indentation
- Одинарные кавычки для строк
- Запятые в конце массивов/объектов
- Двойные кавычки для HTML атрибутов

### 3. Именование

- Файлы: `kebab-case` (например, `user-profile.tsx`)
- Компоненты: `PascalCase` (например, `UserProfile`)
- Переменные: `camelCase` (например, `userName`)
- Константы: `UPPER_SNAKE_CASE` (например, `MAX_LENGTH`)
- CSS классы: `kebab-case` (например, `user-profile-card`)

### 4. Состояния

- `isLoading: boolean` — Загрузка
- `isError: boolean` — Ошибка
- `data: T | null` — Данные
- `error: string | null` — Сообщение об ошибке

---

## 📚 ПРИМЕРЫ КОДА

### Header Компонент

```tsx
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header title="📚 Balloo Documentation" />
      <main className="flex-1">
        {/* Page content */}
      </main>
      <Footer />
    </div>
  );
}
```

### Card Компонент

```tsx
import { Card } from '@/components/ui/Card';

export function NodeCard({ node }) {
  return (
    <Card
      title={node.title}
      description={node.description}
      actions={<Badge status={node.status} />}
    >
      <p>Status: {node.status}</p>
      <p>Version: {node.version}</p>
    </Card>
  );
}
```

### Input Компонент

```tsx
import { Input } from '@/components/ui/Input';

export function SearchBar() {
  return (
    <Input
      placeholder="Search documentation..."
      type="text"
    />
  );
}
```

---

## 🔗 ССЫЛКИ

- [Messenger Documentation](/docs/working/messenger)
- [API Documentation](/docs/working/api)
- [Design Policy](/docs/design-policy)
- [Design Checklist](/docs/design-checklist)

---

**🎈 Balloo - Переверни общение!**

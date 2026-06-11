# @balloo/core-ui

Core UI components for Balloo platform with DesignContract enforcement.

**DesignContract Rule**: `border-radius: 0` - No rounded corners allowed.

## Installation

```bash
pnpm add @balloo/core-ui
```

## Components

| Component | Description | Status |
|-----------|-------------|--------|
| `Button` | Action button | ✅ |
| `Modal` | Dialog modal | ✅ |
| `Alert` | Toast notification | ✅ |
| `Card` | Container card | ✅ |

## Usage

### Button

```tsx
import { Button } from '@balloo/core-ui';

<Button variant="primary" size="md">Click me</Button>
```

### Modal

```tsx
import { Modal } from '@balloo/core-ui';

<Modal isOpen={isOpen} onClose={onClose} title="Title">
  Content
</Modal>
```

### Alert

```tsx
import { Alert } from '@balloo/core-ui';

<Alert message="Success!" type="success" onClose={onClose} />
```

### Card

```tsx
import { Card } from '@balloo/core-ui';

<Card variant="elevated" padding="4">Content</Card>
```

## Design Tokens

```typescript
import { BORDER_RADIUS, COLORS, SPACING } from '@balloo/core-ui';

// Always 0 - DesignContract enforced
console.log(BORDER_RADIUS.none); // '0'

// Brand colors
console.log(COLORS.primary); // '#0039A6'
```

## DesignContract

**CRITICAL**: All components MUST enforce:
- ✅ `border-radius: 0` (no rounded corners)
- ✅ Sharp, modern aesthetic

**Forbidden**:
- ❌ Tailwind `rounded*` classes
- ❌ Inline `borderRadius` styles > 0

## Migration

**Phase 8** - Extracted from `messenger/src/components/ui/`

## Related

- `@balloo/core-brand` - Brand assets
- `@balloo/core-theme` - Theme system

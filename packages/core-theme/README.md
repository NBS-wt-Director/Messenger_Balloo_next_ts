# @balloo/core-theme

Core theme system for Balloo platform. Provides platform preset themes and theme management utilities.

## Installation

```bash
pnpm add @balloo/core-theme
```

## Usage

### Basic Theme Switching

```typescript
import { useThemeStore, applyTheme, getPresetTheme } from '@balloo/core-theme';

// Get current theme
const { theme, setTheme, toggleTheme } = useThemeStore();

// Set theme
setTheme('dark');

// Toggle through themes (dark → light → russia → dark)
toggleTheme();

// Get preset theme details
const preset = getPresetTheme('russia');
console.log(preset?.colors.primary); // '#0039A6'
```

### SSR Theme Application

```typescript
import { applyTheme, getCurrentTheme } from '@balloo/core-theme';

// Apply theme on client side
applyTheme('light');

// Get current theme from localStorage
const current = getCurrentTheme();
```

### Platform Preset Themes

Exactly 3 platform preset themes are available:

| ID | Name | Description |
|----|------|-------------|
| `light` | Светлая | Light theme with white background |
| `dark` | Тёмная | Dark theme with dark background |
| `russia` | Россия | Russia flag theme |

```typescript
import { PRESET_THEMES, THEME_IDS } from '@balloo/core-theme';

// All preset themes
console.log(PRESET_THEMES);

// Theme IDs
console.log(THEME_IDS); // ['light', 'dark', 'russia']
```

## Theme Contract

This package enforces the [ThemeContract](../../workdocs/contracts/ThemeContract.md):

### Must Rules

1. **Platform Presets**: All nodes MUST support the 3 platform preset themes
2. **Source of Truth**: `packages/core-theme` is the single source for preset themes
3. **Custom Themes**: Custom themes are **user-app-only**

### Must Not Rules

- **Must NOT** create custom themes in admin/system nodes (admin, api, docs-site, abaut)
- **Must NOT** deviate from the 3 platform preset themes without separate contract

### Custom Themes (User Apps Only)

Custom themes are allowed only in:
- `apps/web-main` (messenger)
- `apps/mobile`
- `apps/desktop`

Custom themes are forbidden in:
- `apps/admin`
- `apps/api`
- `apps/docs-site`
- `apps/abaut`

**Save Rule**: Custom themes should be saved only after 2 days of usage.

## API Reference

### Types

- `ThemeColors` - Color palette interface
- `PresetTheme` - Platform preset theme
- `CustomTheme` - User custom theme
- `ThemeSubscription` - Theme subscription status
- `ThemePresetId` - Union type: `'dark' | 'light' | 'russia'`
- `ThemeStore` - Combined store interface

### Exports

| Export | Type | Description |
|--------|------|-------------|
| `PRESET_THEMES` | `PresetTheme[]` | Array of 3 platform preset themes |
| `THEME_COLORS` | `Record<string, ThemeColors>` | Theme colors by ID |
| `THEME_IDS` | `readonly string[]` | Theme IDs array |
| `DEFAULT_THEME_ID` | `ThemePresetId` | Default theme: `'dark'` |
| `useThemeStore` | `ZustandStore` | Theme management store |
| `applyTheme` | `function` | Apply theme to document |
| `getCurrentTheme` | `function` | Get current theme from localStorage |
| `getPresetTheme` | `function` | Get preset theme by ID |

## Migration Notes

This package was extracted from:
- `messenger/src/stores/settings-store.ts` (theme-store logic)
- `messenger/src/types/index.ts` (ThemeColors, PresetTheme types)

**Phase 6** of the migration roadmap.

## License

Internal use only (Balloo platform)

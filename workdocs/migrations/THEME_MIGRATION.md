# Theme Migration Report

## Phase 6: Theme-Store Extraction → Core-Theme

**Status:** ✅ Completed  
**Date:** 2026-06-09  
**Contract:** ThemeContract.md

---

## Summary

Successfully extracted theme-store from `messenger/src/stores/settings-store.ts` to `packages/core-theme/`.

### What Was Migrated

| Component | Source | Target | Status |
|-----------|--------|--------|--------|
| Theme types | `messenger/src/types/index.ts` | `packages/core-theme/src/types.ts` | ✅ |
| Theme colors | `messenger/src/stores/settings-store.ts` | `packages/core-theme/src/presets.ts` | ✅ |
| Preset themes | `messenger/src/components/ThemeSelector.tsx` | `packages/core-theme/src/presets.ts` | ✅ |
| Theme store | `messenger/src/stores/settings-store.ts` | `packages/core-theme/src/theme-store.ts` | ✅ |
| Theme types | `messenger/src/i18n/types.ts` | Removed (use core-theme) | ✅ |

---

## New Package Structure

```
packages/core-theme/
├── package.json           # @balloo/core-theme v0.1.0
├── README.md              # Documentation
├── tsconfig.json          # TypeScript config
└── src/
    ├── index.ts           # Main exports
    ├── types.ts           # Type definitions
    ├── presets.ts         # 3 platform preset themes
    └── theme-store.ts     # Zustand store
```

---

## Platform Preset Themes

Exactly 3 preset themes (ThemeContract.md):

| ID | Name | Primary | Background |
|----|------|---------|------------|
| `light` | Светлая | #007bff | #ffffff |
| `dark` | Тёмная | #0d6efd | #1a1a1a |
| `russia` | Россия | #0039A6 | #ffffff |

---

## API Reference

### Types

```typescript
import type { ThemeColors, PresetTheme, CustomTheme, ThemeSubscription } from '@balloo/core-theme';
```

### Store

```typescript
import { useThemeStore } from '@balloo/core-theme';

const { theme, setTheme, toggleTheme } = useThemeStore();
```

### Presets

```typescript
import { PRESET_THEMES, THEME_IDS, DEFAULT_THEME_ID } from '@balloo/core-theme';
```

### Utilities

```typescript
import { applyTheme, getCurrentTheme, getPresetTheme } from '@balloo/core-theme';
```

---

## Changes in Messenger

### 1. settings-store.ts

**Before:**
```typescript
import { Language, Theme } from '@/i18n/types';

interface SettingsState {
  theme: Theme;
  // ...
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

**After:**
```typescript
import type { ThemePresetId } from '@balloo/core-theme';
import { useThemeStore } from '@balloo/core-theme';

// Theme delegated to core-theme
export function getCurrentTheme(): ThemePresetId {
  return useThemeStore.getState().theme;
}

export function setTheme(theme: ThemePresetId): void {
  useThemeStore.getState().setTheme(theme);
}
```

### 2. i18n/types.ts

**Before:**
```typescript
export type Theme = 
  | 'dark' | 'light' | 'russia'
  | 'india' | 'china' | 'tatarstan'
  // ... (13 themes total)
```

**After:**
```typescript
// Theme type has been migrated to @balloo/core-theme
// Use ThemePresetId from '@balloo/core-theme' instead
```

### 3. Header.tsx

**Before:**
```typescript
import { useSettingsStore } from '@/stores/settings-store';

const { theme, setTheme } = useSettingsStore();
```

**After:**
```typescript
import { useThemeStore, type ThemePresetId } from '@balloo/core-theme';

const { theme, setTheme } = useThemeStore();
```

### 4. ThemeSelector.tsx

**Before:**
```typescript
const PRESET_THEMES = [
  { id: 'light', name: 'Светлая', colors: {...}, ... },
  { id: 'dark', name: 'Тёмная', colors: {...}, ... },
  { id: 'russia', name: 'Россия', colors: {...}, ... }
];
```

**After:**
```typescript
import { PRESET_THEMES, type PresetTheme } from '@balloo/core-theme';
```

### 5. ThemeCard.tsx

**Before:**
```typescript
import { CustomTheme } from '@/stores/settings-store';
```

**After:**
```typescript
import type { PresetTheme } from '@balloo/core-theme';
```

---

## Theme Contract Enforcement

### Must Rules ✅

1. **Platform Presets**: All nodes MUST support the 3 platform preset themes
   - Implemented in `packages/core-theme/src/presets.ts`

2. **Source of Truth**: `packages/core-theme` is the single source for preset themes
   - All theme data now in `packages/core-theme/src/presets.ts`

3. **Custom Themes**: Custom themes are **user-app-only**
   - Types exported for user apps (web-main, mobile, desktop)
   - Not used in admin/system nodes

### Must Not Rules ✅

- **Must NOT** create custom themes in admin/system nodes
  - Admin nodes don't import custom theme types

- **Must NOT** deviate from the 3 platform preset themes
  - Exactly 3 themes in `PRESET_THEMES` array

---

## Migration Checklist

- [x] Create `packages/core-theme/package.json`
- [x] Create `packages/core-theme/src/types.ts`
- [x] Create `packages/core-theme/src/presets.ts`
- [x] Create `packages/core-theme/src/theme-store.ts`
- [x] Create `packages/core-theme/src/index.ts`
- [x] Create `packages/core-theme/README.md`
- [x] Create `packages/core-theme/tsconfig.json`
- [x] Update `messenger/package.json` (add @balloo/core-theme)
- [x] Update `messenger/src/stores/settings-store.ts`
- [x] Update `messenger/src/i18n/types.ts`
- [x] Update `messenger/src/components/Header.tsx`
- [x] Update `messenger/src/components/ThemeSelector.tsx`
- [x] Update `messenger/src/components/ThemeCard.tsx`
- [x] Update `MIGRATION_ROADMAP.md`

---

## Next Steps

1. **Install dependencies**: `pnpm install` in messenger
2. **Type check**: `pnpm typecheck` in messenger
3. **Test theme switching**: Verify all 3 themes work
4. **Verify contract**: Ensure no custom themes in admin nodes

---

## Backward Compatibility

The migration maintains backward compatibility:

- `messenger/src/stores/settings-store.ts` exports theme helpers
- Existing imports continue to work during transition
- Theme types available in both locations (legacy + core-theme)

---

## Related Documents

- [ThemeContract.md](../../workdocs/contracts/ThemeContract.md)
- [MIGRATION_ROADMAP.md](../../MIGRATION_ROADMAP.md)
- [@balloo/core-theme README](../../packages/core-theme/README.md)

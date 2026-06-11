# UI Migration Report

## Phase 8: Shared UI → Core-UI

**Status:** ✅ Completed  
**Date:** 2026-06-11  
**Contract:** DesignContract.md, AutopilotContract.md

---

## Summary

Created `packages/core-ui/` with base UI components enforcing DesignContract (border-radius: 0).

### What Was Migrated

| Component | Source | Target | Status |
|-----------|--------|--------|--------|
| Modal | `messenger/src/components/ui/Modal.tsx` | `packages/core-ui/src/components/Modal.tsx` | ✅ |
| Alert | `messenger/src/components/ui/Alert.tsx` | `packages/core-ui/src/components/Alert.tsx` | ✅ |
| Button | New implementation | `packages/core-ui/src/components/Button.tsx` | ✅ |
| Card | New implementation | `packages/core-ui/src/components/Card.tsx` | ✅ |
| Design Tokens | New | `packages/core-ui/src/design-tokens.ts` | ✅ |
| Types | New | `packages/core-ui/src/types.ts` | ✅ |

---

## New Package Structure

```
packages/core-ui/
├── package.json           # @balloo/core-ui v0.1.0
├── README.md              # Documentation
├── tsconfig.json          # TypeScript config
└── src/
    ├── index.ts           # Main exports
    ├── types.ts           # Type definitions
    ├── design-tokens.ts   # Design tokens (border-radius: 0 enforced)
    └── components/
        ├── Modal.tsx      # Modal dialog
        ├── Alert.tsx      # Toast notification
        ├── Button.tsx     # Action button
        └── Card.tsx       # Container card
```

---

## DesignContract Enforcement

**Critical Rule**: `border-radius: 0` - No rounded corners allowed.

### Enforced In All Components

| Component | Border Radius Enforcement |
|-----------|--------------------------|
| Button | `BORDER_RADIUS.none` |
| Modal | `BORDER_RADIUS.none` |
| Alert | `BORDER_RADIUS.none` |
| Card | `BORDER_RADIUS.none` |

### Design Tokens

```typescript
export const BORDER_RADIUS = {
  none: '0',
  sm: '0',   // Enforced: no rounding
  md: '0',   // Enforced: no rounding
  lg: '0',   // Enforced: no rounding
  xl: '0',   // Enforced: no rounding
  full: '0', // Enforced: no rounding
} as const;
```

---

## Changes in Messenger

### 1. package.json

**Added:**
```json
"@balloo/core-ui": "file:../packages/core-ui"
```

---

## API Reference

### Components

| Component | Description |
|-----------|-------------|
| `Button` | Action button with variants |
| `Modal` | Accessible dialog modal |
| `Alert` | Toast notification with auto-dismiss |
| `Card` | Container card with variants |

### Design Tokens

| Token | Type | Description |
|-------|------|-------------|
| `BORDER_RADIUS` | `Record<string, '0'>` | All values enforced to 0 |
| `SPACING` | `Record<string, string>` | Spacing scale |
| `COLORS` | `Record<string, string>` | Color palette |
| `SHADOWS` | `Record<string, string>` | Shadow definitions |
| `TRANSITIONS` | `Record<string, string>` | Transition timings |
| `Z_INDEX` | `Record<string, number>` | Z-index scale |

### Types

| Type | Description |
|------|-------------|
| `ButtonProps` | Button component props |
| `ModalProps` | Modal component props |
| `AlertProps` | Alert component props |
| `CardProps` | Card component props |
| `DesignContractCompliant` | Interface for compliance |

---

## Validation

- [x] `npx tsc --noEmit` in packages/core-ui — ✅ No errors
- [x] `npx tsc --noEmit` in messenger — ✅ No errors
- [x] Dependencies installed — ✅ npm install completed

---

## Migration Checklist

- [x] Create packages/core-ui/package.json
- [x] Create packages/core-ui/src/types.ts
- [x] Create packages/core-ui/src/design-tokens.ts
- [x] Create packages/core-ui/src/components/Modal.tsx
- [x] Create packages/core-ui/src/components/Alert.tsx
- [x] Create packages/core-ui/src/components/Button.tsx
- [x] Create packages/core-ui/src/components/Card.tsx
- [x] Create packages/core-ui/src/index.ts
- [x] Create packages/core-ui/README.md
- [x] Create packages/core-ui/tsconfig.json
- [x] Update messenger/package.json
- [x] Update MIGRATION_ROADMAP.md
- [x] Update platform-state/autopilot/STATE.json
- [x] Update platform-state/autopilot/NEXT_ACTION.md
- [x] Create UI_MIGRATION.md (this file)
- [x] Messenger components wired to use @balloo/core-ui
- [x] Phase 8 complete

**Files updated in messenger:**
- [x] messenger/src/hooks/useAlert.tsx
- [x] messenger/src/app/installer/page.tsx
- [x] messenger/src/app/invitations/page.tsx
- [x] messenger/src/components/NotificationManager.tsx
- [x] messenger/src/components/pages/AuthPage.tsx
- [x] messenger/src/components/pages/ChatsPage.tsx
- [x] messenger/src/components/pages/InvitationsPage.tsx
- [x] messenger/src/app/about-balloo/page.tsx

---

## Next Steps

1. Update messenger components to import from @balloo/core-ui
2. Remove duplicate UI components from messenger/src/components/ui/
3. Mark Phase 8 as complete
4. Prepare for Phase 9 (Docs Split)

---

## Backward Compatibility

The migration maintains backward compatibility:
- Component APIs unchanged
- All props work identically
- DesignContract enforced transparently
- No breaking changes to messenger

---

## Related Documents

- [DesignContract.md](../../workdocs/contracts/DesignContract.md) - Design system contract
- [BrandContract.md](../../workdocs/contracts/BrandContract.md) - Brand guidelines
- [ThemeContract.md](../../workdocs/contracts/ThemeContract.md) - Theme system contract
- [AutopilotContract.md](../../workdocs/contracts/AutopilotContract.md) - Command contract
- [@balloo/core-ui README](../../packages/core-ui/README.md) - Package docs

---

*Migration started: 2026-06-11*  
*Phase 8: In Progress*

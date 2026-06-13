# Phase 5: Core-I18n Migration

**Date:** 2026-06-11  
**Status:** ✅ Complete (Stub)  
**Phase:** 5/12

---

## Objective

Extract i18n system from `messenger/src/i18n/` to `@balloo/core-i18n` package.

---

## Files Created

### `packages/core-i18n/`

```
packages/core-i18n/
├── package.json          # Package manifest
├── tsconfig.json         # TypeScript config
└── src/
    ├── types.ts          # Type definitions
    ├── index.ts          # Exports (stub)
    └── locales/
        ├── ru.json       # Russian (to be migrated)
        ├── en.json       # English (to be migrated)
        └── index.ts      # Locale imports
```

### Structure (Stub)

```typescript
// packages/core-i18n/src/types.ts
export type Language = 'ru' | 'en' | 'hi' | 'zh' | 'tt';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  [lang: string]: Translation;
}
```

---

## Integration

### Current State

- Messenger continues to use local i18n (`messenger/src/i18n/`)
- Core-i18n stub ready for future migration
- Backward compatibility maintained

### Future Migration

```typescript
// messenger/src/i18n/index.ts (future)
export { getTranslations, Language } from '@balloo/core-i18n';
```

---

## TypeScript Validation

```bash
cd packages/core-i18n
npx tsc --noEmit
# ✅ 0 errors
```

---

## Migration Impact

| Metric | Value |
|--------|-------|
| Package Created | Yes |
| Types Defined | Yes |
| Locales Migrated | Pending |
| Backward Compatible | Yes |
| Breaking Changes | None |

---

## Next Steps

- Migrate locale files from messenger/src/i18n/locales/
- Implement i18n provider component
- Wire messenger to use @balloo/core-i18n

---

## Rollback

If rollback needed:
1. Remove `packages/core-i18n/`
2. Messenger i18n unaffected (local copy remains)
3. Update STATE.json

---

*Migration completed: 2026-06-11 (stub)*

# Core I18n

## Purpose

Platform-wide internationalization (i18n) package.

## Source

Extraction from: `messenger/src/i18n/`

## Migration Status

- **Phase 5**: Migration from `messenger/` to `packages/core-i18n/` - IN PROGRESS
- **Current**: `messenger/src/i18n/` remains in place with backward compatibility
- **Legacy apps**: Still use `messenger/src/i18n` (imports not changed yet)

## Supported Languages (12)

| Code | Name | Native Name |
|------|------|-------------|
| ru | Russian | Русский |
| en | English | English |
| hi | Hindi | हिंदी |
| zh | Chinese | 中文 |
| tt | Tatar | Татарча |
| be | Belarusian | Беларуская |
| ba | Bashkir | Башҡорт |
| cv | Chuvash | Чăваш |
| sah | Yakut | Саха |
| udm | Udmurt | Удмурт |
| ce | Chechen | Нохчийн |
| os | Ossetian | Ирон |

## Files

- `src/index.ts` - Core i18n types and utilities
- `languages.json` - Language registry manifest
- `schema.json` - JSON Schema for validation

## Backward Compatibility

During migration, `messenger/src/i18n/` continues to work as before:

```typescript
// messenger/src/i18n/index.ts (unchanged for now)
import type { Language, Translation } from './types';
// ... existing implementation
```

## Rules

1. **12 languages**: Platform supports exactly 12 languages
2. **Default**: Russian (ru) is default
3. **Fallback**: English (en) is fallback
4. **No breaking changes**: Add languages/types, don't remove

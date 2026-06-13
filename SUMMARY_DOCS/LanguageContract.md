# LanguageContract

## Purpose

This contract defines the mandatory 12-language support for the entire Balloo platform.

## Source of Truth

- **Platform-level language registry**: `packages/core-i18n/languages.json`
- **Current implementation**: `messenger/src/i18n/types.ts` (to be migrated)

## Supported Languages (12 Total)

| Code | Name | Native Name | Priority |
|------|------|-------------|----------|
| `ru` | Russian | Русский | 1 (primary/default) |
| `en` | English | English | 2 (fallback) |
| `hi` | Hindi | हिन्दी | 3 |
| `zh` | Chinese | 中文 | 4 |
| `tt` | Tatar | Татарча | 5 |
| `be` | Belarusian | Беларуская | 6 |
| `ba` | Bashkir | Башҡорт | 7 |
| `cv` | Chuvash | Чăваш | 8 |
| `sah` | Yakut | Саха | 9 |
| `udm` | Udmurt | Удмурт | 10 |
| `ce` | Chechen | Нохчийн | 11 |
| `os` | Ossetian | Ирон | 12 |

## Must Rules

1. **Unified Language Registry**: All nodes MUST use the same language list
2. **Source of Truth**: `platform-level language registry` in `packages/core-i18n` is the single source of truth
3. **Default Language**: Russian (ru) for the platform
4. **Fallback Language**: English (en) for missing translations

## Should Rules

- All platform UI must be translatable to all 12 languages
- Translation files should follow markdown-first approach

## Must Not Rules

- **Must NOT add languages without updating the platform registry**
- **Must NOT use different language sets in different nodes**

## Machine-Binding Notes

Future machine-readable binding:
- `packages/core-i18n/languages.json` will be validated against this contract
- Build-time validation will ensure all 12 languages are present

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active
- **Total Languages**: 12

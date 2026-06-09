# TranslationContract

## Purpose

This contract defines the translation system for the Balloo platform.

## Source of Truth

- **Languages registry**: `packages/core-i18n/languages.json`
- **Current implementation**: `messenger/src/i18n/` (to be migrated)

## Structure

```
packages/core-i18n/
├── languages.json       # Languages list (source of truth)
├── locales/
│   ├── ru.ts
│   ├── en.ts
│   ├── hi.ts
│   └── ...
├── schema.json          # Schema for translations
└── README.md
```

## Must Rules

1. **Single Source**: `languages.json` is the authoritative language list
2. **Markdown-first**: Description of keys in markdown
3. **Machine-readable**: JSON schema for validation
4. **Fallback**: `en` for missing translations
5. **Default**: `ru` for the platform

## Should Rules

- Admin UI should provide visual translation management
- Translation coverage statistics should be displayed

## Machine-Binding Notes

Future machine-readable binding:
- `packages/core-i18n/schema.json` will validate translation files
- Build-time validation will ensure all 12 languages have translations

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active

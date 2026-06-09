# Translation Contract

## Purpose

Этот контракт определяет систему переводов для всей платформы Balloo.

## Structure

```
packages/core-i18n/
├── languages.json       # Список языков (источник истины)
├── locales/
│   ├── ru.ts
│   ├── en.ts
│   ├── hi.ts
│   └── ...
├── schema.json          # Schema для переводов
└── README.md
```

## Rules

1. **Single source**: `languages.json` - авторитетный список
2. **Markdown-first**: описания ключей в markdown
3. **Machine-readable**: JSON schema для валидации
4. **Fallback**: `en` для отсутствующих переводов
5. **Default**: `ru` для платформы

## Admin Feature (Future)

В админке v3:
- Web-инструмент для добавления/исправления переводов
- Визуальное сравнение переводов между языками
- Экспорт/импорт переводов
- Статистика покрытия переводов

## Source

- **Current**: `messenger/src/i18n/`
- **Future**: `packages/core-i18n/`

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active

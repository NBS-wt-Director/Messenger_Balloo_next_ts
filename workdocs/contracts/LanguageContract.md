# Language Contract

## Purpose

Этот контракт определяет общий список поддерживаемых языков для всей платформы Balloo.

## Supported Languages

| Code | Name | Native Name | Priority |
|------|------|-------------|----------|
| `ru` | Russian | Русский | 1 (primary) |
| `en` | English | English | 2 (fallback) |
| `hi` | Hindi | हिन्दी | 3 |
| `zh` | Chinese | 中文 | 4 |
| `tt` | Tatar | Татарча | 5 |
| `be` | Belarusian | Беларуская | 6 |
| `ba` | Bashkir | Башҡорт | 7 |
| `cv` | Chuvash | Чӑваш | 8 |
| `sah` | Yakut | Саха | 9 |
| `udm` | Udmurt | Удмурт | 10 |
| `ce` | Chechen | Нохчийн | 11 |
| `os` | Ossetian | Ирон | 12 |

## Rules

1. **Общий список**: все узлы используют один список языков
2. **Источник истины**: `packages/core-i18n/languages.json`
3. **Текущая реализация**: `messenger/src/i18n/types.ts`
4. **Fallback**: английский (en) для отсутствующих переводов
5. **Default**: русский (ru) для платформы

## Adding New Languages

1. Добавить в `Language` type
2. Добавить в `LANGUAGES` array
3. Создать файл переводов в `locales/{code}.ts`
4. Обновить manifests в всех узлах

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active
- **Total Languages**: 12

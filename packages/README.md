# Packages Directory

## Core Platform Packages (будущие)

### Brand & Design
- `core-brand` - Логотип, цвета, шрифты, brand assets
- `core-ui` - Общие UI компоненты
- `core-theme` - Preset themes, theme system
- `core-i18n` - i18n система, список языков, переводы

### Core Functionality
- `core-types` - Общие TypeScript типы
- `core-auth` - Аутентификация, авторизация
- `core-config` - Конфигурация (от @app-balloo/settings)
- `core-api-client` - API клиент
- `core-docs-schema` - Schema для документации
- `core-stats` - Статистика и аналитика
- `core-deploy` - Deployment конфигурация
- `core-tree-model` - Модель дерева узлов

### Data & Storage
- `storage-adapters` - Адаптеры для хранения (PostgreSQL, NoSQL)
- `data-access` - Data access layer

### WorkDocs
- `workdocs/contracts` - Контракты узлов
- `workdocs/nodes` - Определение узлов
- `workdocs/trees` - Деревья узлов
- `workdocs/releases` - Релизы

### Docs Content
- `docs-content/platform-state` - Состояние платформы
- `docs-content/designs` - Дизайн-документы

### Infra & Tools
- `infra` - Инфраструктура
- `tools` - Утилиты разработки

## Текущие пакеты

| Пакет | Статус | Куда переходит |
|-------|--------|----------------|
| `shared/` | Активен | База для core-types, core-utils |
| `settings/` | Активен | core-config |

## Правила

1. **Markdown-first**: contracts, схемы, манифесты в markdown
2. **Machine-readable**: markdown сопровождается JSON/YAML schema
3. **No breaking changes**: изменения с version bump
4. **Shared contracts**: интерфейсы между узлами в contracts/

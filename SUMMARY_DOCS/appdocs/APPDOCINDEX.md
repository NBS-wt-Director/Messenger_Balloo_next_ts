# APPDOCINDEX — Индекс канонической документации приложений

## Overview

Этот индекс описывает структуру и навигацию по каноническим объектам документации приложений в SUMMARYDOCS.

## Structure

```
SUMMARY_DOCS/appdocs/
├── APPDOCINDEX.md              ← этот файл
├── APPDOCVIEWERMODEL.md        ← модель просмотра
├── APPDOCEDITPOLICY.md         ← политика редактирования
├── APPDOCCODEGENINSTRUCTIONS.md ← инструкции для KodaCode
└── contracts/
    ├── AppScreenContract.md
    ├── AppTransitionContract.md
    ├── AppScenarioContract.md
    ├── AppIntegrationContract.md
    ├── AppDocLinkedViewContract.md
    └── AppDocEditContract.md
```

## Navigation

### По узлам
Каждый узел монорепо имеет свою ветку в `docs/app-canonical/<node-id>/`.

### По приложениям
Внутри каждого узла — папки приложений: `docs/app-canonical/<node-id>/<app-id>/`.

### По типам объектов
- **Screens**: `screens/<screen-id>.md`
- **Transitions**: `transitions/<transition-id>.md`
- **Scenarios**: `scenarios/<scenario-id>.md`
- **Integrations**: `integrations/<integration-id>.md`

### Maps
- `maps/screen-graph.json` — граф экранов и переходов
- `maps/scenario-map.json` — карта сценариев
- `maps/integration-map.json` — карта интеграций
- `maps/linked-view.json` — индекс для SUMMARYDOCS viewer

---

## Quick Links

- [Viewer Model](APPDOCVIEWERMODEL.md) — как смотреть объекты в SUMMARYDOCS
- [Edit Policy](APPDOCEDITPOLICY.md) — как редактировать (creator-superadmin)
- [KodaCode Instructions](APPDOCCODEGENINSTRUCTIONS.md) — как KodaCode использует эти объекты
- [Linked View Contract](contracts/AppDocLinkedViewContract.md) — интерфейс viewer
- [Edit Contract](contracts/AppDocEditContract.md) — интерфейс редактора

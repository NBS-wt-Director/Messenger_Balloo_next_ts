# APPDOCCODEGENINSTRUCTIONS — Инструкции для KodaCode

## Purpose

Описывает как KodaCode должен использовать каноническую документацию приложений.

## Core Principles

1. **Preserve all existing documentation layers** — никогда не удалять legacy docs
2. **Discover node/app structure** — автоматически обнаруживать узлы и приложения
3. **Create under dedicated directory** — только `docs/app-canonical/`
4. **Extract evidence** — из существующих docs, code, reports, contracts, states
5. **Generate sourceRefs** — каждая ссылка на источник
6. **Generate linked-view indexes** — для SUMMARYDOCS viewer
7. **Treat as primary development-facing layer** — приоритет при генерации кода
8. **Never delete legacy** — без отдельного migration ticket

## Discovery

KodaCode должен:
- Сканировать `SUMMARY_DOCS/state/node-tree.json` для discovery узлов
- Сканировать `SUMMARY_DOCS/state/app-doc-nodes.json` и `app-doc-apps.json`
- Сканировать `SUMMARY_DOCS/MANIFEST.json` для discovery приложений
- Сканировать `SUMMARY_DOCS/ROUTING.json` для discovery routes

## Creation Rules

### Screen
- Создавать при обнаружении новой UI-страницы или компонента
- Extract purpose, actors, elements из кода и docs
- Связать через relatedTransitions, relatedScenarios, relatedIntegrations

### Transition
- Создавать при обнаружении навигации между экранами
- Extract trigger, conditions из роутинга и кода
- Связать с sourceScreen и targetScreen

### Scenario
- Создавать при обнаружении пользовательского workflow
- Extract steps из playbooks, runbooks, contracts
- Связать через involvedScreens, involvedTransitions

### Integration
- Создавать при обнаружении API-вызовов, внешних сервисов, ботов
- Extract protocol, authRequirements из code и contracts
- Связать через relatedScreens, relatedScenarios

## SourceRefs

Каждый объект MUST содержать sourceRefs:
```json
"sourceRefs": [
  {
    "type": "contract",
    "path": "SUMMARY_DOCS/contracts/...",
    "title": "Описание источника"
  },
  {
    "type": "code",
    "path": "apps/.../Component.tsx",
    "lineRange": "45-120"
  },
  {
    "type": "report",
    "path": "SUMMARY_DOCS/reports/...",
    "title": "Отчёт"
  }
]
```

## Linked View Generation

После создания/обновления объектов KodaCode должен:
1. Обновить `maps/screen-graph.json`
2. Обновить `maps/scenario-map.json`
3. Обновить `maps/integration-map.json`
4. Обновить `maps/linked-view.json`
5. Обновить `SUMMARY_DOCS/state/app-doc-view-index.json`

# APPDOCVIEWERMODEL — Модель просмотра канонической документации

## Purpose

Описывает лаконичный linked-view для канонических объектов документации приложений в SUMMARYDOCS.

## Viewer Goals

1. Быстро выбрать узел
2. Быстро выбрать приложение внутри узла
3. Увидеть все 4 типа объектов в связке
4. Понимать связи без чтения markdown-файлов
5. Переходить в исходный markdown/json
6. Видеть sourceRefs на legacy docs

## UI Layout

```
┌─────────────────────────────────────────────────────┐
│  Node Selector  │  App Selector  │  Counters        │
├─────────────────────────────────────────────────────┤
│  Linked Relationship Panel                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Screens  │  │Transitions│  │Scenarios │         │
│  │ [list]   │  │ [graph]  │  │ [list]   │         │
│  └──────────┘  └──────────┘  └──────────┘         │
│  ┌──────────────────────────────────────────┐      │
│  │ Integrations                              │      │
│  │ [list with targets]                       │      │
│  └──────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────┤
│  Detail Panel / SourceRefs Panel                    │
└─────────────────────────────────────────────────────┘
```

## Counters

Компактная панель с числами:
- Screens: N
- Transitions: N
- Scenarios: N
- Integrations: N

## Filters

- Object type (Screen / Transition / Scenario / Integration)
- Status (draft / active / deprecated)
- Linked object
- Source availability (has sourceRefs / no sourceRefs)

## Navigation Flow

1. Выбор узла → загрузка manifest.json
2. Выбор приложения → загрузка linked-view.json
3. Отображение relationship panel
4. Клик по объекту → detail panel
5. Клик по sourceRef → переход к legacy doc

## Integration Points

- Загружает `manifest.json` для навигации по узлам
- Загружает `linked-view.json` для отображения связей
- Загружает `<object-id>.md` для детального просмотра
- Ссылается на `state/app-doc-view-index.json` для поиска

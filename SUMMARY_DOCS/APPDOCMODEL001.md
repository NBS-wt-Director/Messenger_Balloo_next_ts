# APP-DOC-MODEL-001 — Canonical Application Documentation Objects

## Status
Active

## Owner
Koda (AI) / Creator-Superadmin

## Priority
High

## Type
Documentation Architecture + Codegen + Privileged Editing + Verification

---

## Purpose

Ввести канонический слой документации приложений внутри узлов, не отменяя существующие документы, отчёты, контракты и наработки.

Сделать этот слой основным для дальнейшей разработки и для KodaCode.

Добавить в узел SUMMARYDOCS отдельный лаконичный способ просмотра новых объектов документации в связке друг с другом.

Добавить механизм их модификации из браузера только для creator-superadmin через генеральный пароль.

---

## Hierarchy

```
Node -> Application -> Documentation Objects
```

### Canonical Object Types

1. **Screen** — пользовательская или служебная интерфейсная поверхность
2. **Transition** — допустимый переход между экранами
3. **Scenario** — пользовательский сценарий взаимодействия с приложением
4. **Integration** — взаимодействие приложения с другими системами

---

## Relation Model

| Relation | Description |
|----------|-------------|
| Application contains Screens | Приложение содержит экраны |
| Application contains Transitions | Приложение содержит переходы |
| Application contains Scenarios | Приложение содержит сценарии |
| Application contains Integrations | Приложение содержит интеграции |
| Scenario uses Screens | Сценарий использует экраны |
| Scenario uses Transitions | Сценарий использует переходы |
| Screen may trigger Integration | Экран может запускать интеграцию |
| Integration may affect Transition outcome | Интеграция может влиять на результат перехода |
| Transition connects source Screen and target Screen | Переход соединяет экраны |
| Scenario may start at one Screen and end at many | Сценарий может начинаться и заканчиваться на экранах |

---

## Repository Rule

Существующая документация, отчёты, контракты, state-файлы, discovery-документы, playbooks и наработки сохраняются полностью. Они являются **source layer**.

Новые объекты являются **canonical application documentation layer**.

Никакой legacy cleanup, destructive migration или overwrite старых документов не допускается.

---

## Target Directory

```
docs/app-canonical/
  <node-id>/
    <app-id>/
      README.md
      manifest.json
      screens/
      transitions/
      scenarios/
      integrations/
      maps/
```

---

## Authorization

- **Read**: следует правилам видимости документов узла
- **Write**: creator-superadmin только, через генеральный пароль
- **Audit**: все изменения логируются

---

## See Also

- [APPDOCINDEX.md](appdocs/APPDOCINDEX.md)
- [APPDOCVIEWERMODEL.md](appdocs/APPDOCVIEWERMODEL.md)
- [APPDOCEDITPOLICY.md](appdocs/APPDOCEDITPOLICY.md)
- [APPDOCCODEGENINSTRUCTIONS.md](appdocs/APPDOCCODEGENINSTRUCTIONS.md)
- [Contracts](appdocs/contracts/)
- [Schemas](schemas/)

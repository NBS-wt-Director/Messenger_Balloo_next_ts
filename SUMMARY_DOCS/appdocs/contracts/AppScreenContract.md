# AppScreenContract — Контракт объекта Screen

## objectType
`screen`

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Фиксированное значение `"screen"` |
| nodeId | string | ✅ | ID узла монорепо |
| appId | string | ✅ | ID приложения внутри узла |
| screenId | string | ✅ | Уникальный ID экрана (kebab-case) |
| title | string | ✅ | Заголовок экрана |
| purpose | string | | Краткое описание назначения |
| actors | string[] | | Роли пользователей, взаимодействующих с экраном |
| entryConditions | string[] | | Условия входа на экран |
| exitConditions | string[] | | Условия выхода с экрана |
| elements | string[] | | Основные элементы интерфейса |
| actions | string[] | | Действия доступные на экране |
| relatedTransitions | string[] | | IDs связанных переходов |
| relatedScenarios | string[] | | IDs связанных сценариев |
| relatedIntegrations | string[] | | IDs связанных интеграций |
| sourceRefs | object[] | | Ссылки на источники |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## sourceRef Object

```json
{
  "type": "contract|code|report|state|playbook",
  "path": "путь к файлу в репозитории",
  "title": "Описание источника",
  "lineRange": "10-50" // опционально
}
```

## File Path

```
docs/app-canonical/<node-id>/<app-id>/screens/<screen-id>.md
```

## Example

```yaml
objectType: screen
nodeId: working
appId: messenger
screenId: login
title: "Экран входа"
purpose: "Авторизация пользователя в системе"
actors: ["public-user"]
entryConditions: []
exitConditions: ["user authenticated", "login failed"]
elements: ["email field", "password field", "login button", "forgot password link"]
actions: ["login", "forgot password", "register"]
relatedTransitions: ["trans:t-login-to-dashboard", "trans:t-login-to-register"]
relatedScenarios: ["sc:s-login-flow"]
relatedIntegrations: ["int:auth-email-password", "int:auth-yandex-oauth"]
sourceRefs:
  - type: code
    path: apps/messenger/src/pages/LoginPage.tsx
    title: "LoginPage component source"
status: active
```

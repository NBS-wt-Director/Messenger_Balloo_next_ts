# AppTransitionContract — Контракт объекта Transition

## objectType
`transition`

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Фиксированное значение `"transition"` |
| nodeId | string | ✅ | ID узла монорепо |
| appId | string | ✅ | ID приложения внутри узла |
| transitionId | string | ✅ | Уникальный ID перехода (kebab-case) |
| title | string | ✅ | Заголовок перехода |
| sourceScreenId | string | ✅ | ID экрана-источника |
| targetScreenId | string | ✅ | ID экрана-цели |
| trigger | string | ✅ | Триггер перехода (действие пользователя или системы) |
| conditions | string[] | | Условия выполнения перехода |
| result | string | | Результат успешного перехода |
| failureModes | string[] | | Возможные режимы отказа |
| relatedScenarios | string[] | | IDs связанных сценариев |
| relatedIntegrations | string[] | | IDs связанных интеграций |
| sourceRefs | object[] | | Ссылки на источники |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## File Path

```
docs/app-canonical/<node-id>/<app-id>/transitions/<transition-id>.md
```

## Example

```yaml
objectType: transition
nodeId: working
appId: messenger
transitionId: t-login-to-dashboard
title: "Вход в систему"
sourceScreenId: login
targetScreenId: dashboard
trigger: "user clicks login button with valid credentials"
conditions:
  - "user email exists"
  - "password matches"
  - "account not suspended"
result: "user authenticated, redirected to dashboard"
failureModes:
  - "invalid credentials"
  - "account suspended"
  - "network error"
relatedScenarios: ["sc:s-login-flow"]
relatedIntegrations: ["int:auth-email-password"]
sourceRefs:
  - type: code
    path: apps/messenger/src/pages/LoginPage.tsx
    title: "Login button handler"
status: active
```

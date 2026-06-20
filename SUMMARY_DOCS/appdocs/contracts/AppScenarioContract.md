# AppScenarioContract — Контракт объекта Scenario

## objectType
`scenario`

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Фиксированное значение `"scenario"` |
| nodeId | string | ✅ | ID узла монорепо |
| appId | string | ✅ | ID приложения внутри узла |
| scenarioId | string | ✅ | Уникальный ID сценария (kebab-case) |
| title | string | ✅ | Заголовок сценария |
| goal | string | ✅ | Цель сценария |
| actor | string | ✅ | Роль пользователя, выполняющего сценарий |
| preconditions | string[] | | Условия перед началом |
| steps | string[] | ✅ | Последовательность шагов |
| involvedScreens | string[] | | IDs экранов, участвующих в сценарии |
| involvedTransitions | string[] | | IDs переходов, участвующих в сценарии |
| outputs | string[] | | Результаты выполнения |
| exceptions | string[] | | Возможные исключения |
| sourceRefs | object[] | | Ссылки на источники |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## File Path

```
docs/app-canonical/<node-id>/<app-id>/scenarios/<scenario-id>.md
```

## Example

```yaml
objectType: scenario
nodeId: working
appId: messenger
scenarioId: sc-login-flow
title: "Поток авторизации"
goal: "Авторизовать пользователя в системе"
actor: "public-user"
preconditions:
  - "user has registered account"
  - "network connection available"
steps:
  - "User opens login screen"
  - "User enters email and password"
  - "User clicks login button"
  - "System validates credentials"
  - "User is redirected to dashboard"
involvedScreens:
  - "screens:login"
  - "screens:dashboard"
  - "screens:forgot-password"
involvedTransitions:
  - "trans:t-login-to-dashboard"
  - "trans:t-login-to-forgot-password"
outputs:
  - "user authenticated"
  - "session created"
exceptions:
  - "invalid credentials"
  - "account suspended"
  - "network failure"
sourceRefs:
  - type: contract
    path: SUMMARY_DOCS/contracts/auth-policy-manifest.json
    title: "Authentication policy"
status: active
```

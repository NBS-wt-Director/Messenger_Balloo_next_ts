# AppIntegrationContract — Контракт объекта Integration

## objectType
`integration`

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| objectType | string | ✅ | Фиксированное значение `"integration"` |
| nodeId | string | ✅ | ID узла монорепо |
| appId | string | ✅ | ID приложения внутри узла |
| integrationId | string | ✅ | Уникальный ID интеграции (kebab-case) |
| title | string | ✅ | Заголовок интеграции |
| direction | enum | ✅ | `inbound` \| `outbound` \| `bidirectional` |
| targetType | enum | ✅ | `app` \| `node` \| `service` \| `external-system` |
| targetId | string | ✅ | ID целевой системы |
| purpose | string | ✅ | Назначение интеграции |
| trigger | string | | Что запускает интеграцию |
| input | string | | Формат/тип входящих данных |
| output | string | | Формат/тип исходящих данных |
| protocolOrChannel | string | | Протокол или канал связи |
| authRequirements | string | | Требования к аутентификации |
| failureHandling | string | | Обработка отказов |
| relatedScreens | string[] | | IDs связанных экранов |
| relatedTransitions | string[] | | IDs связанных переходов |
| relatedScenarios | string[] | | IDs связанных сценариев |
| sourceRefs | object[] | | Ссылки на источники |
| status | enum | ✅ | `draft` \| `active` \| `deprecated` |

## direction Enum

- **inbound** — данные приходят в приложение
- **outbound** — данные уходят из приложения
- **bidirectional** — двусторонний обмен

## targetType Enum

- **app** — другое приложение монорепо
- **node** — другой узел монорепо
- **service** — внутренний сервис (API, queue, etc.)
- **external-system** — внешняя система (SMTP, OAuth, etc.)

## File Path

```
docs/app-canonical/<node-id>/<app-id>/integrations/<integration-id>.md
```

## Example

```yaml
objectType: integration
nodeId: working
appId: messenger
integrationId: int-auth-yandex-oauth
title: "Yandex OAuth аутентификация"
direction: inbound
targetType: external-system
targetId: yandex-id
purpose: "Авторизация пользователей через Яндекс ID"
trigger: "user clicks Yandex login button"
input: "OAuth authorization code"
output: "user profile data (email, name, avatar)"
protocolOrChannel: "OAuth 2.0 / HTTPS"
authRequirements: "Yandex OAuth client credentials"
failureHandling: "fallback to email-password auth, log error"
relatedScreens: ["screens:login"]
relatedTransitions: ["trans:t-login-with-yandex"]
relatedScenarios: ["sc:s-login-flow"]
sourceRefs:
  - type: code
    path: apps/messenger/src/api/auth/yandex.ts
    title: "Yandex OAuth API handler"
  - type: config
    path: apps/messenger/config.json
    title: "Yandex OAuth config"
status: active
```

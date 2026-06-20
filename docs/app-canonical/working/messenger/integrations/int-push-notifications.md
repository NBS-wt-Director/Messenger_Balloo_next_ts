---
objectType: integration
nodeId: working
appId: messenger
integrationId: int-push-notifications
title: "Push-уведомления"
direction: outbound
targetType: service
targetId: vapid-push-service
purpose: "Отправка push-уведомлений пользователям через VAPID/Web Push"
trigger: "new message sent in chat"
input: "message content, sender info, chat ID, recipient device tokens"
output: "delivery status (sent/failed), notification ID"
protocolOrChannel: "Web Push API / HTTPS"
authRequirements: "VAPID keys (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY), VAPID_SUBJECT"
failureHandling: "retry up to 3 times with exponential backoff, log failure, fallback to in-app notification"
relatedScreens: ["chat"]
relatedTransitions: ["t-dashboard-to-chat"]
relatedScenarios: ["sc-send-message"]
sourceRefs:
  - type: code
    path: messenger/src/api/push-notifications.ts
    title: "Push notification API"
  - type: code
    path: api/src/services/push-service.ts
    title: "Push service implementation"
  - type: config
    path: messenger/config.json
    title: "VAPID config"
status: active
---

# Интеграция: Push-уведомления

## Описание
Отправка push-уведомлений пользователям через VAPID/Web Push.

## Параметры
- **Направление:** outbound
- **Тип цели:** service
- **Цель:** vapid-push-service
- **Протокол:** Web Push API / HTTPS

## Связанные экраны
- [chat](../screens/chat.md)

## Связанные сценарии
- [sc-send-message](../scenarios/sc-send-message.md)

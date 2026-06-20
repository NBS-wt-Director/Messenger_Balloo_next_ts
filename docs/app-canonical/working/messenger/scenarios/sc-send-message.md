---
objectType: scenario
nodeId: working
appId: messenger
scenarioId: sc-send-message
title: "Отправка сообщения"
goal: "Отправить текстовое сообщение в чат"
actor: "company-staff"
preconditions: ["user is authenticated", "user is in a chat"]
steps:
  - "User navigates to dashboard and selects a chat → t-dashboard-to-chat"
  - "Chat screen opens with message history"
  - "User types message in message input"
  - "User clicks send button"
  - "Message is sent via WebSocket to api"
  - "Message appears in chat history"
  - "Push notification may be sent via int-push-notifications"
involvedScreens: ["dashboard", "chat"]
involvedTransitions: ["t-dashboard-to-chat"]
outputs: ["message delivered", "message visible in chat history", "push notification sent"]
exceptions: ["network failure", "message too long", "chat deleted", "user banned from chat"]
sourceRefs:
  - type: code
    path: messenger/src/components/MessageInput.tsx
    title: "Message input component"
  - type: code
    path: messenger/src/api/websocket.ts
    title: "WebSocket message handler"
status: active
---

# Сценарий: Отправка сообщения

## Цель
Отправить текстовое сообщение в чат.

## Актер
company-staff

## Шаги
1. User navigates to dashboard and selects a chat → t-dashboard-to-chat
2. Chat screen opens with message history
3. User types message in message input
4. User clicks send button
5. Message is sent via WebSocket to api
6. Message appears in chat history
7. Push notification may be sent via int-push-notifications

## Участвующие экраны
- [dashboard](../screens/dashboard.md)
- [chat](../screens/chat.md)

## Участвующие переходы
- [t-dashboard-to-chat](../transitions/t-dashboard-to-chat.md)

## Связанные интеграции
- [int-push-notifications](../integrations/int-push-notifications.md)

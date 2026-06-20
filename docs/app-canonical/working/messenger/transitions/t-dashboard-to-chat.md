---
objectType: transition
nodeId: working
appId: messenger
transitionId: t-dashboard-to-chat
title: "Открыть чат"
sourceScreenId: dashboard
targetScreenId: chat
trigger: "user selects a chat from the list"
conditions: ["user is authenticated", "chat exists"]
result: "user navigates to chat screen with message history"
failureModes: ["chat not found", "network error", "chat deleted"]
relatedScenarios: ["sc-send-message", "sc-browse-chats"]
relatedIntegrations: ["int-push-notifications"]
sourceRefs:
  - type: code
    path: messenger/src/pages/DashboardPage.tsx
    lineRange: "80-150"
    title: "Chat list item click handler"
  - type: code
    path: messenger/src/pages/ChatPage.tsx
    title: "Chat page loader"
status: active
---

# Переход: Открыть чат

## Описание
Переход с главной панели на экран чата при выборе чата из списка.

## Источник → Цель
`dashboard` → `chat`

## Триггер
user selects a chat from the list

## Связанные сценарии
- [sc-send-message](../scenarios/sc-send-message.md)
- [sc-browse-chats](../scenarios/sc-browse-chats.md)

## Связанные интеграции
- [int-push-notifications](../integrations/int-push-notifications.md)

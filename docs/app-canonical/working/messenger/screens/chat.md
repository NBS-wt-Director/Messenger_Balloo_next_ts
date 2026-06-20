---
objectType: screen
nodeId: working
appId: messenger
screenId: chat
title: "Экран чата"
purpose: "Просмотр и отправка сообщений в выбранном чате"
actors: ["company-staff", "alpha-staff", "public-user"]
entryConditions: ["user is authenticated", "user selected a chat from dashboard"]
exitConditions: ["user returns to dashboard", "user opens profile → settings", "user opens settings → settings"]
elements: ["message list", "message input", "send button", "attachment button", "user profile avatar", "back button"]
actions: ["send message", "attach file", "open user profile", "open settings", "go back to dashboard"]
relatedTransitions: ["t-chat-to-profile", "t-chat-to-settings"]
relatedScenarios: ["sc-send-message", "sc-attach-file"]
relatedIntegrations: ["int-push-notifications"]
sourceRefs:
  - type: code
    path: messenger/src/pages/ChatPage.tsx
    title: "ChatPage component"
  - type: code
    path: messenger/src/components/MessageInput.tsx
    title: "MessageInput component"
  - type: state
    path: SUMMARY_DOCS/state/auth-creator-superadmin.json
    title: "Actor roles definition"
status: active
---

# Экран чата (chat)

## Назначение
Просмотр и отправка сообщений в выбранном чате.

## Актеры
- company-staff
- alpha-staff
- public-user

## Связанные переходы
- t-chat-to-profile
- t-chat-to-settings

## Связанные сценарии
- [sc-send-message](scenarios/sc-send-message.md)
- sc-attach-file

## Связанные интеграции
- [int-push-notifications](integrations/int-push-notifications.md)

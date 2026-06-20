---
objectType: scenario
nodeId: working
appId: messenger
scenarioId: sc-browse-chats
title: "Просмотр списка чатов"
goal: "Найти и открыть нужный чат"
actor: "company-staff"
preconditions: ["user is authenticated"]
steps:
  - "User lands on dashboard → t-login-to-dashboard completed"
  - "Dashboard displays list of user's chats"
  - "User scrolls through chat list"
  - "User optionally uses search bar to filter chats"
  - "User clicks on desired chat → t-dashboard-to-chat"
  - "Chat screen opens"
involvedScreens: ["dashboard", "chat"]
involvedTransitions: ["t-dashboard-to-chat"]
outputs: ["chat opened", "message history loaded"]
exceptions: ["no chats available", "network error loading chats", "search returned no results"]
sourceRefs:
  - type: code
    path: messenger/src/components/ChatList.tsx
    title: "Chat list component"
  - type: code
    path: messenger/src/pages/DashboardPage.tsx
    title: "Dashboard page with chat list"
status: active
---

# Сценарий: Просмотр списка чатов

## Цель
Найти и открыть нужный чат.

## Актер
company-staff

## Шаги
1. User lands on dashboard → t-login-to-dashboard completed
2. Dashboard displays list of user's chats
3. User scrolls through chat list
4. User optionally uses search bar to filter chats
5. User clicks on desired chat → t-dashboard-to-chat
6. Chat screen opens

## Участвующие экраны
- [dashboard](../screens/dashboard.md)
- [chat](../screens/chat.md)

## Участвующие переходы
- [t-dashboard-to-chat](../transitions/t-dashboard-to-chat.md)

---
objectType: screen
nodeId: working
appId: messenger
screenId: dashboard
title: "Главная панель"
purpose: "Основной экран после авторизации — список чатов и навигация"
actors: ["company-staff", "alpha-staff", "public-user"]
entryConditions: ["user is authenticated"]
exitConditions: ["user opens chat → chat", "user opens settings → settings", "user opens profile → settings"]
elements: ["chat list", "new chat button", "user avatar", "settings button", "search bar"]
actions: ["open chat", "open settings", "open profile", "search chats", "create new chat"]
relatedTransitions: ["t-dashboard-to-chat", "t-dashboard-to-settings", "t-dashboard-to-profile"]
relatedScenarios: ["sc-browse-chats", "sc-view-profile"]
relatedIntegrations: []
sourceRefs:
  - type: code
    path: messenger/src/pages/DashboardPage.tsx
    title: "DashboardPage component"
  - type: code
    path: messenger/src/components/ChatList.tsx
    title: "ChatList component"
status: active
---

# Главная панель (dashboard)

## Назначение
Основной экран после авторизации — список чатов и навигация.

## Актеры
- company-staff
- alpha-staff
- public-user

## Связанные переходы
- [t-dashboard-to-chat](transitions/t-dashboard-to-chat.md)

## Связанные сценарии
- [sc-browse-chats](scenarios/sc-browse-chats.md)
- [sc-view-profile](scenarios/sc-view-profile.md)

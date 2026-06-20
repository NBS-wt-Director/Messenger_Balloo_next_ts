---
objectType: screen
nodeId: working
appId: messenger
screenId: settings
title: "Настройки"
purpose: "Управление настройками пользователя и профиля"
actors: ["company-staff", "alpha-staff"]
entryConditions: ["user is authenticated"]
exitConditions: ["user returns to dashboard"]
elements: ["profile section", "notification settings", "privacy settings", "theme selector", "logout button"]
actions: ["edit profile", "change notifications", "change theme", "logout"]
relatedTransitions: ["t-settings-to-profile"]
relatedScenarios: ["sc-manage-settings"]
relatedIntegrations: []
sourceRefs:
  - type: code
    path: messenger/src/pages/SettingsPage.tsx
    title: "SettingsPage component"
status: active
---

# Настройки (settings)

## Назначение
Управление настройками пользователя и профиля.

## Актеры
- company-staff
- alpha-staff

## Связанные сценарии
- [sc-manage-settings](scenarios/sc-manage-settings.md)

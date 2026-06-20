---
objectType: transition
nodeId: working
appId: messenger
transitionId: t-register-to-login
title: "Регистрация → Вход"
sourceScreenId: register
targetScreenId: login
trigger: "registration failed, return to login"
conditions: ["registration validation error", "email already exists"]
result: "user returns to login screen with error message"
failureModes: []
relatedScenarios: ["sc-register-flow"]
relatedIntegrations: []
sourceRefs:
  - type: code
    path: messenger/src/pages/RegisterPage.tsx
    title: "Registration failure handler"
status: active
---

# Переход: Регистрация → Вход

## Описание
Возврат на экран входа при ошибке регистрации.

## Источник → Цель
`register` → `login`

## Связанные сценарии
- [sc-register-flow](../scenarios/sc-register-flow.md)

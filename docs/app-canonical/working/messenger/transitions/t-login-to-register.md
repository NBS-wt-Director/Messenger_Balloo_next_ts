---
objectType: transition
nodeId: working
appId: messenger
transitionId: t-login-to-register
title: "Переход к регистрации"
sourceScreenId: login
targetScreenId: register
trigger: "user clicks register link"
conditions: []
result: "user navigates to registration screen"
failureModes: []
relatedScenarios: ["sc-login-flow"]
relatedIntegrations: []
sourceRefs:
  - type: code
    path: messenger/src/pages/LoginPage.tsx
    title: "Register link handler"
status: active
---

# Переход: Переход к регистрации

## Описание
Навигация с экрана входа на экран регистрации.

## Источник → Цель
`login` → `register`

## Триггер
user clicks register link

## Связанные сценарии
- [sc-login-flow](../scenarios/sc-login-flow.md)

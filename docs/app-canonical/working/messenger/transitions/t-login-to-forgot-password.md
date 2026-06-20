---
objectType: transition
nodeId: working
appId: messenger
transitionId: t-login-to-forgot-password
title: "Забыл пароль"
sourceScreenId: login
targetScreenId: settings
trigger: "user clicks forgot password link"
conditions: []
result: "user navigates to settings (password recovery section)"
failureModes: ["network error"]
relatedScenarios: ["sc-login-flow"]
relatedIntegrations: ["int-email-verification"]
sourceRefs:
  - type: code
    path: messenger/src/pages/LoginPage.tsx
    title: "Forgot password link handler"
status: active
---

# Переход: Забыл пароль

## Описание
Навигация с экрана входа на настройки (восстановление пароля).

## Источник → Цель
`login` → `settings`

## Триггер
user clicks forgot password link

## Связанные интеграции
- int-email-verification

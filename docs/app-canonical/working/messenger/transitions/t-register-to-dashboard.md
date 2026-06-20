---
objectType: transition
nodeId: working
appId: messenger
transitionId: t-register-to-dashboard
title: "Успешная регистрация"
sourceScreenId: register
targetScreenId: dashboard
trigger: "registration completed successfully"
conditions: ["email valid", "password meets requirements", "email not already registered"]
result: "user authenticated and redirected to dashboard"
failureModes: ["email already exists", "network error"]
relatedScenarios: ["sc-register-flow"]
relatedIntegrations: ["int-auth-email-password"]
sourceRefs:
  - type: code
    path: messenger/src/pages/RegisterPage.tsx
    title: "Registration success handler"
status: active
---

# Переход: Успешная регистрация

## Описание
Переход на главную панель после успешной регистрации.

## Источник → Цель
`register` → `dashboard`

## Триггер
registration completed successfully

## Связанные интеграции
- [int-auth-email-password](../integrations/int-auth-email-password.md)

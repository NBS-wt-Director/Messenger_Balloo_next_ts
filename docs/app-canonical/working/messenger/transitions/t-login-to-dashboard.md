---
objectType: transition
nodeId: working
appId: messenger
transitionId: t-login-to-dashboard
title: "Вход в систему"
sourceScreenId: login
targetScreenId: dashboard
trigger: "user clicks login button with valid credentials"
conditions: ["user email exists", "password matches", "account not suspended"]
result: "user authenticated, redirected to dashboard"
failureModes: ["invalid credentials", "account suspended", "network error"]
relatedScenarios: ["sc-login-flow"]
relatedIntegrations: ["int-auth-email-password", "int-auth-yandex-oauth"]
sourceRefs:
  - type: code
    path: messenger/src/pages/LoginPage.tsx
    lineRange: "45-120"
    title: "Login button handler"
  - type: code
    path: messenger/src/api/auth/email-password.ts
    title: "Email-password auth API"
status: active
---

# Переход: Вход в систему

## Описание
Переход с экрана входа на главную панель после успешной авторизации.

## Источник → Цель
`login` → `dashboard`

## Триггер
user clicks login button with valid credentials

## Условия
- user email exists
- password matches
- account not suspended

## Результат
user authenticated, redirected to dashboard

## Режимы отказа
- invalid credentials
- account suspended
- network error

## Связанные сценарии
- [sc-login-flow](../scenarios/sc-login-flow.md)

## Связанные интеграции
- [int-auth-email-password](../integrations/int-auth-email-password.md)
- [int-auth-yandex-oauth](../integrations/int-auth-yandex-oauth.md)

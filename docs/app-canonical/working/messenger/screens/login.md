---
objectType: screen
nodeId: working
appId: messenger
screenId: login
title: "Экран входа"
purpose: "Авторизация пользователя в системе через email/пароль или Yandex OAuth"
actors: ["public-user"]
entryConditions: []
exitConditions: ["user authenticated → dashboard", "login failed → stay on login", "user navigates to register → register", "user requests password reset → settings"]
elements: ["email input field", "password input field", "login button", "forgot password link", "register link", "Yandex OAuth button"]
actions: ["login", "navigate to register", "request password reset", "yandex oauth login"]
relatedTransitions: ["t-login-to-dashboard", "t-login-to-register", "t-login-to-forgot-password"]
relatedScenarios: ["sc-login-flow"]
relatedIntegrations: ["int-auth-email-password", "int-auth-yandex-oauth"]
sourceRefs:
  - type: code
    path: messenger/src/pages/LoginPage.tsx
    title: "LoginPage component source"
  - type: code
    path: messenger/src/api/auth/email-password.ts
    title: "Email-password auth handler"
  - type: code
    path: messenger/src/api/auth/yandex.ts
    title: "Yandex OAuth handler"
  - type: config
    path: messenger/config.json
    title: "Auth providers config"
  - type: state
    path: SUMMARY_DOCS/state/auth-policy-manifest.json
    title: "Authentication policy"
status: active
---

# Экран входа (login)

## Назначение
Авторизация пользователя в системе через email/пароль или Yandex OAuth.

## Актеры
- public-user

## Элементы
- email input field
- password input field
- login button
- forgot password link
- register link
- Yandex OAuth button

## Действия
- login
- navigate to register
- request password reset
- yandex oauth login

## Связанные переходы
- [t-login-to-dashboard](transitions/t-login-to-dashboard.md) — вход в систему
- [t-login-to-register](transitions/t-login-to-register.md) — переход к регистрации
- [t-login-to-forgot-password](transitions/t-login-to-forgot-password.md) — забыл пароль

## Связанные сценарии
- [sc-login-flow](scenarios/sc-login-flow.md) — поток авторизации

## Связанные интеграции
- [int-auth-email-password](integrations/int-auth-email-password.md) — email-password auth
- [int-auth-yandex-oauth](integrations/int-auth-yandex-oauth.md) — Yandex OAuth

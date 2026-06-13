---
title: Node Security Contract
description: Контракт безопасности узлов
version: 1.0.0
date: 2026-06-13
---

# 🔐 NODE SECURITY CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13

---

## 🎯 ЦЕЛЬ

Определить правила безопасности для узлов экосистемы.

---

## 🔑 ACCESS CONTROL

### Admin Services Access
- MUST require authentication
- MUST use 2FA for admin access
- MUST log all admin actions
- MUST NOT be publicly exposed without protection

### Operator Devices vs Execution Nodes
- Operator devices (laptop, phones) NEVER store production secrets unencrypted
- Execution nodes receive secrets via secure channel only
- SSH keys rotated every 90 days

---

## 📱 2FA / AUTH CONFIRMATION

**Phone Roles:**
- `phone_personal`: User 2FA, notifications
- `phone_service`: Admin 2FA, isolated access
- `phone_recovery_optional`: Emergency recovery codes

**Requirements:**
- ALL admin actions require 2FA confirmation
- ALL production deployments require 2FA
- Recovery codes stored encrypted on home_nas

---

## 🔒 SECRETS HANDLING

**Assumptions:**
- Secrets stored in encrypted form on work-server
- Secrets synced to home_nas encrypted
- Secrets NEVER stored on control-plane unencrypted
- Environment variables for runtime secrets

**Encryption:**
- AES-256 for files
- TLS 1.3 for transit
- Encrypted database for sensitive data

---

## 🚨 RECOVERY ACCESS POLICY

**Minimum Access:**
- laptop_control MUST have SSH key access to all nodes
- phone_personal MUST have recovery codes
- home_nas MUST have encrypted backup access

**Emergency Procedures:**
1. Access laptop_control via Tailscale
2. Use SSH to connect to target node
3. Authenticate with 2FA from phone_service
4. Execute recovery from home_nas backup

---

**Создано:** 2026-06-13

---

**🎈 Balloo**
---
title: Auth Index
description: Индекс всех документов авторизации Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - auth
  - index
  - canonical
related_docs:
  - SUMMARY_DOCS/access/ACCESS_INDEX.md
  - SUMMARY_DOCS/auth/AUTH_POLICY.md
---

# 🔐 AUTH INDEX

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 PURPOSE

Этот индекс определяет **все документы авторизации** платформы Balloo.

**Цель:** Централизованная навигация по auth documentation.

---

## 📁 DOCUMENT STRUCTURE

```
SUMMARY_DOCS/auth/
├── AUTH_INDEX.md                          ✅ This file
├── AUTH_POLICY.md                         ✅
├── AUTH_PROVIDER_MODEL.md                 ✅
├── AUTH_BINDING_MODEL.md                  ✅
├── AUTH_SESSION_MODEL.md                  ✅
├── AUTH_DEVICE_CONTEXT_MODEL.md           ✅
├── AUTH_CROSS_ENTRY_POLICY.md             ✅
├── AUTH_SECURITY_POLICY.md                ✅
├── AUTH_RECOVERY_MODEL.md                 ✅
├── AUTH_CREATOR_SUPERADMIN_MODEL.md       ✅
├── AUTH_CODEGEN_POLICY.md                 ✅
├── AUTH_DISCOVERY_REPORT.md               ✅
├── AUTH_CODEGEN_INSTRUCTIONS.md           ✅
├── CREATORS_SUPERADMIN_ACCOUNT.md         ✅
├── providers/                             ✅
├── contracts/                             ✅
├── matrices/                              ✅

SUMMARY_DOCS/contracts/auth/               ✅
SUMMARY_DOCS/state/auth-*.json             ✅
SUMMARY_DOCS/playbooks/auth-*.md           ✅
```

---

## 📋 CORE POLICY DOCUMENTS

| Document | Description | Audience |
|----------|-------------|----------|
| [AUTH_POLICY.md](./AUTH_POLICY.md) | Overall auth philosophy & principles | Both |
| [AUTH_PROVIDER_MODEL.md](./AUTH_PROVIDER_MODEL.md) | All auth providers by phase | Both |
| [AUTH_BINDING_MODEL.md](./AUTH_BINDING_MODEL.md) | Identity binding rules | Both |
| [AUTH_SESSION_MODEL.md](./AUTH_SESSION_MODEL.md) | Session lifecycle | Both |
| [AUTH_DEVICE_CONTEXT_MODEL.md](./AUTH_DEVICE_CONTEXT_MODEL.md) | Device/browser context | Both |
| [AUTH_CROSS_ENTRY_POLICY.md](./AUTH_CROSS_ENTRY_POLICY.md) | Cross-entry automatic login | Both |
| [AUTH_SECURITY_POLICY.md](./AUTH_SECURITY_POLICY.md) | Security requirements | Both |
| [AUTH_RECOVERY_MODEL.md](./AUTH_RECOVERY_MODEL.md) | Account recovery | Both |
| [AUTH_CREATOR_SUPERADMIN_MODEL.md](./AUTH_CREATOR_SUPERADMIN_MODEL.md) | Creator-superadmin auth | Both |
| [AUTH_CODEGEN_POLICY.md](./AUTH_CODEGEN_POLICY.md) | Codegen policy | AI |
| [AUTH_CODEGEN_INSTRUCTIONS.md](./AUTH_CODEGEN_INSTRUCTIONS.md) | Codegen instructions | AI |
| [AUTH_DISCOVERY_REPORT.md](./AUTH_DISCOVERY_REPORT.md) | Auth discovery report | Both |

---

## 👑 CREATOR-SUPERADMIN DOCUMENTS

| Document | Description | Audience |
|----------|-------------|----------|
| [CREATOR_SUPERADMIN_ACCOUNT.md](./CREATOR_SUPERADMIN_ACCOUNT.md) | Canonical account profile | Both |
| [contracts/PROVIDER_CONTRACT_creator-superadmin.md](./contracts/PROVIDER_CONTRACT_creator-superadmin.md) | Auth contract | AI |

---

## 🔐 PROVIDER DOCUMENTS

### Phase 1 Providers

| Document | Description | Audience |
|----------|-------------|----------|
| [providers/PROVIDER_SUMMARY_yandex-id.md](./providers/PROVIDER_SUMMARY_yandex-id.md) | Yandex.ID summary | Both |
| [providers/PROVIDER_SUMMARY_email-password.md](./providers/PROVIDER_SUMMARY_email-password.md) | Email+Password summary | Both |
| [providers/PROVIDER_SUMMARY_phone-3char-code.md](./providers/PROVIDER_SUMMARY_phone-3char-code.md) | Phone+3Char-Code summary | Both |
| [contracts/PROVIDER_CONTRACT_yandex-id.md](./contracts/PROVIDER_CONTRACT_yandex-id.md) | Yandex.ID contract | AI |
| [contracts/PROVIDER_CONTRACT_email-password.md](./contracts/PROVIDER_CONTRACT_email-password.md) | Email+Password contract | AI |
| [contracts/PROVIDER_CONTRACT_phone-3char-code.md](./contracts/PROVIDER_CONTRACT_phone-3char-code.md) | Phone+3Char-Code contract | AI |

### Phase 2 Providers

| Document | Description | Audience |
|----------|-------------|----------|
| [providers/PROVIDER_SUMMARY_gosuslugi.md](./providers/PROVIDER_SUMMARY_gosuslugi.md) | Gosuslugi summary | Both |
| [providers/PROVIDER_SUMMARY_max.md](./providers/PROVIDER_SUMMARY_max.md) | MAX summary | Both |
| [providers/PROVIDER_SUMMARY_qr-code.md](./providers/PROVIDER_SUMMARY_qr-code.md) | QR-Code summary | Both |
| [contracts/PROVIDER_CONTRACT_gosuslugi.md](./contracts/PROVIDER_CONTRACT_gosuslugi.md) | Gosuslugi contract | AI |
| [contracts/PROVIDER_CONTRACT_max.md](./contracts/PROVIDER_CONTRACT_max.md) | MAX contract | AI |
| [contracts/PROVIDER_CONTRACT_qr-code.md](./contracts/PROVIDER_CONTRACT_qr-code.md) | QR-Code contract | AI |

---

## 📊 MATRICES

| Document | Description | Audience |
|----------|-------------|----------|
| [matrices/AUTH_PROVIDER_MATRIX.md](./matrices/AUTH_PROVIDER_MATRIX.md) | Provider overview matrix | Both |
| [matrices/AUTH_PHASE_MATRIX.md](./matrices/AUTH_PHASE_MATRIX.md) | Phase comparison matrix | Both |
| [matrices/AUTH_ROLE_PROVIDER_MATRIX.md](./matrices/AUTH_ROLE_PROVIDER_MATRIX.md) | Role × Provider matrix | Both |
| [matrices/AUTH_NODE_PROVIDER_MATRIX.md](./matrices/AUTH_NODE_PROVIDER_MATRIX.md) | Node × Provider matrix | Both |
| [matrices/AUTH_DEVICE_CROSS_ENTRY_MATRIX.md](./matrices/AUTH_DEVICE_CROSS_ENTRY_MATRIX.md) | Cross-entry matrix | Both |
| [matrices/AUTH_SECURITY_REQUIREMENTS_MATRIX.md](./matrices/AUTH_SECURITY_REQUIREMENTS_MATRIX.md) | Security requirements matrix | Both |

---

## 📁 CONTRACTS

| Document | Description | Audience |
|----------|-------------|----------|
| [../contracts/auth/AuthPolicyContract.md](../contracts/auth/AuthPolicyContract.md) | Policy contract | AI |
| [../contracts/auth/AuthProviderContract.md](../contracts/auth/AuthProviderContract.md) | Provider contract | AI |
| [../contracts/auth/AuthBindingContract.md](../contracts/auth/AuthBindingContract.md) | Binding contract | AI |
| [../contracts/auth/AuthSessionContract.md](../contracts/auth/AuthSessionContract.md) | Session contract | AI |
| [../contracts/auth/AuthDeviceContextContract.md](../contracts/auth/AuthDeviceContextContract.md) | Device context contract | AI |
| [../contracts/auth/AuthCrossEntryContract.md](../contracts/auth/AuthCrossEntryContract.md) | Cross-entry contract | AI |
| [../contracts/auth/AuthSecurityContract.md](../contracts/auth/AuthSecurityContract.md) | Security contract | AI |
| [../contracts/auth/AuthRecoveryContract.md](../contracts/auth/AuthRecoveryContract.md) | Recovery contract | AI |
| [../contracts/auth/AuthCreatorSuperadminContract.md](../contracts/auth/AuthCreatorSuperadminContract.md) | Creator-superadmin contract | AI |
| [../contracts/auth/AuthCodegenContract.md](../contracts/auth/AuthCodegenContract.md) | Codegen contract | AI |

---

## 📁 STATE FILES

| File | Description | Audience |
|------|-------------|----------|
| [../state/auth-providers.json](../state/auth-providers.json) | Provider registry | AI |
| [../state/auth-provider-phases.json](../state/auth-provider-phases.json) | Phase definitions | AI |
| [../state/auth-binding-map.json](../state/auth-binding-map.json) | Binding mappings | AI |
| [../state/auth-session-map.json](../state/auth-session-map.json) | Session mappings | AI |
| [../state/auth-device-context-map.json](../state/auth-device-context-map.json) | Device context mappings | AI |
| [../state/auth-cross-entry-map.json](../state/auth-cross-entry-map.json) | Cross-entry mappings | AI |
| [../state/auth-user-classes.json](../state/auth-user-classes.json) | User class definitions | AI |
| [../state/auth-creator-superadmin.json](../state/auth-creator-superadmin.json) | Creator-superadmin profile | AI |
| [../state/auth-policy-manifest.json](../state/auth-policy-manifest.json) | Policy manifest | AI |

---

## 📖 PLAYBOOKS

| Document | Description | Audience |
|----------|-------------|----------|
| [../playbooks/auth-provider-rollout-playbook.md](../playbooks/auth-provider-rollout-playbook.md) | Provider rollout | Both |
| [../playbooks/account-binding-playbook.md](../playbooks/account-binding-playbook.md) | Account binding | Both |
| [../playbooks/session-revocation-playbook.md](../playbooks/session-revocation-playbook.md) | Session revocation | Both |
| [../playbooks/device-cross-entry-playbook.md](../playbooks/device-cross-entry-playbook.md) | Cross-entry flow | Both |
| [../playbooks/creator-superadmin-account-playbook.md](../playbooks/creator-superadmin-account-playbook.md) | Creator-superadmin account | Both |
| [../playbooks/auth-codegen-playbook.md](../playbooks/auth-codegen-playbook.md) | Auth codegen | AI |

---

## 🔑 KEY INVARIANTS

| ID | Invariant | Description |
|----|-----------|-------------|
| A001 | Auth ≠ Access | Authentication and authorization are separate |
| A002 | Creator-Superadmin Isolation | Separate privileged identity |
| A003 | Cross-Entry Continuity | Automatic login on same device/browser |
| A004 | Phase-Based Rollout | Providers enabled by phase |
| A005 | Binding Required | All providers require proper binding |
| A006 | Session Security | All sessions must be secured |
| A007 | Audit Required | All auth events must be logged |

---

## 📖 RELATED DOCUMENTS

- [../access/ACCESS_INDEX.md](../access/ACCESS_INDEX.md) — Access documentation index
- [../access/ACCESS_POLICY.md](../access/ACCESS_POLICY.md) — Access policy
- [./AUTH_POLICY.md](./AUTH_POLICY.md) — Auth policy

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**

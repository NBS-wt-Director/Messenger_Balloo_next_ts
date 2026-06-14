# 📚 Balloo Documentation Hub — INDEX

**Версия:** 2.0.0  
**Дата:** 2026-06-13  
**Статус:** ✅ Central Documentation Node  
**Author:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Это главный entry point всей документации Balloo monorepo.

**SUMMARY_DOCS** — центральный documentation node для:
- Всей рабочей документации проекта
- Contracts и specifications
- Architecture и topology
- AI и codegen workflows
- Web reader interface

---

## 📖 КАК ИСПОЛЬЗОВАТЬ

### Для человека:
1. Начните с **summary/ROOT_SUMMARY_DOCS.md** — обзор системы
2. Используйте навигацию ниже по категориям
3. Откройте нужный документ

### Для AI:
1. **MANIFEST.json** — machine-readable индекс
2. **ROUTING.json** — mapping путей
3. **appendix/AI_ENTRYPOINTS.md** — workflow инструкции

### Для codegen:
1. **contracts/** — specifications
2. **state/** — configuration
3. **playbooks/codegen-playbook.md** — codegen workflow

---

## 📁 СТРУКТУРА ДОКУМЕНТАЦИИ

### 📘 Policies (Политики)

| Документ | Описание |
|----------|----------|
| [DOC_SOURCE_POLICY.md](./DOC_SOURCE_POLICY.md) | Политика источников документации |
| [DOC_GENERATION_POLICY.md](./DOC_GENERATION_POLICY.md) | Политика генерации AI |
| [DOC_CODEGEN_POLICY.md](./DOC_CODEGEN_POLICY.md) | Политика кодогенерации |
| [DOC_WEB_READER_POLICY.md](./DOC_WEB_READER_POLICY.md) | Политика web reader |

### 📜 Contracts (Контракты)

#### Node Contracts:

| Документ | Описание |
|----------|----------|
| [NodeTreeContract.md](./contracts/node-contracts/NodeTreeContract.md) | Дерево узлов |
| [NodeRolesContract.md](./contracts/node-contracts/NodeRolesContract.md) | Роли узлов |
| [NodeDomainsContract.md](./contracts/node-contracts/NodeDomainsContract.md) | Домены узлов |
| [NodeNetworkingContract.md](./contracts/node-contracts/NodeNetworkingContract.md) | Сеть узлов |
| [NodeSecurityContract.md](./contracts/node-contracts/NodeSecurityContract.md) | Безопасность узлов |
| [NodeDeploymentContract.md](./contracts/node-contracts/NodeDeploymentContract.md) | Deployment узлов |
| [NodeRecoveryContract.md](./contracts/node-contracts/NodeRecoveryContract.md) | Восстановление узлов |

#### Project Policies:

| Документ | Описание |
|----------|----------|
| [NODE_DESCRIPTION_POLICY.md](./contracts/NODE_DESCRIPTION_POLICY.md) | Политика описания узлов |

### 📗 Summary (Сводки)

| Документ | Описание |
|----------|----------|
| [ROOT_SUMMARY_DOCS.md](./summary/ROOT_SUMMARY_DOCS.md) | Обзор SUMMARY_DOCS |
| [ROOT_NODE_SUMMARY.md](./summary/ROOT_NODE_SUMMARY.md) | Сводка дерева узлов |
| [NODE_SUMMARY_laptop_control.md](./summary/NODE_SUMMARY_laptop_control.md) | Control node |
| [NODE_SUMMARY_work_server.md](./summary/NODE_SUMMARY_work_server.md) | Production node |
| [NODE_SUMMARY_home_aio.md](./summary/NODE_SUMMARY_home_aio.md) | Dev node |
| [NODE_SUMMARY_home_nas.md](./summary/NODE_SUMMARY_home_nas.md) | Backup node |
| [NODE_SUMMARY_phones.md](./summary/NODE_SUMMARY_phones.md) | Mobile nodes |

### 🗺️ Topology (Топология)

| Документ | Описание |
|----------|----------|
| [DOMAIN_MAP.md](./topology/DOMAIN_MAP.md) | Карта доменов |
| [NETWORK_MAP.md](./topology/NETWORK_MAP.md) | Карта сети |
| [DEPLOYMENT_MAP.md](./topology/DEPLOYMENT_MAP.md) | Карта deployment |
| [RESTORE_PLAYBOOK.md](./topology/RESTORE_PLAYBOOK.md) | Playbook восстановления |
| [MESSENGER_NODE_BINDING.md](./topology/MESSENGER_NODE_BINDING.md) | Binding сервисов |

### 💾 State (Состояние)

| Файл | Описание |
|------|----------|
| [node-tree.json](./state/node-tree.json) | Дерево узлов |
| [node-domains.json](./state/node-domains.json) | Домены узлов |
| [node-services.json](./state/node-services.json) | Сервисы узлов |
| [node-recovery-order.json](./state/node-recovery-order.json) | Порядок восстановления |
| [doc-state.json](./state/doc-state.json) | Состояние документации |

### 📋 Playbooks

| Документ | Описание |
|----------|----------|
| [codegen-playbook.md](./playbooks/codegen-playbook.md) | Codegen workflow |

### 📎 Appendix (Приложения)

| Документ | Описание |
|----------|----------|
| [AI_ENTRYPOINTS.md](./appendix/AI_ENTRYPOINTS.md) | AI workflow инструкции |

---

## 🔑 KEY DOCUMENTS

### Для старта:
1. [summary/ROOT_SUMMARY_DOCS.md](./summary/ROOT_SUMMARY_DOCS.md) — что такое SUMMARY_DOCS
2. [contracts/node-contracts/NodeTreeContract.md](./contracts/node-contracts/NodeTreeContract.md) — дерево узлов
3. [topology/NETWORK_MAP.md](./topology/NETWORK_MAP.md) — сетевая топология

### Для AI workflows:
1. [appendix/AI_ENTRYPOINTS.md](./appendix/AI_ENTRYPOINTS.md) — порядок чтения
2. [playbooks/codegen-playbook.md](./playbooks/codegen-playbook.md) — codegen инструкция

### Для системы:
1. [MANIFEST.json](./MANIFEST.json) — machine-readable индекс
2. [ROUTING.json](./ROUTING.json) — mapping путей
3. [state/doc-state.json](./state/doc-state.json) — метаданные

---

## 🔄 LEGACY PATHS

Старые пути перемещены в SUMMARY_DOCS:

| Старая директория | Stub | Canonical |
|-------------------|------|-----------|
| workdocs/node-contracts/ | [README.md](../workdocs/node-contracts/README.md) | SUMMARY_DOCS/contracts/node-contracts/ |
| workdocs/node-summary/ | [README.md](../workdocs/node-summary/README.md) | SUMMARY_DOCS/summary/ |
| workdocs/contracts/ | [README.md](../workdocs/contracts/README.md) | SUMMARY_DOCS/contracts/ |
| infra/topology/ | [README.md](../infra/topology/README.md) | SUMMARY_DOCS/topology/ |
| platform-state/node-tree/ | [README.md](../platform-state/node-tree/README.md) | SUMMARY_DOCS/state/ |

---

## 📊 СТАТУС ДОКУМЕНТАЦИИ

| Категория | Статус | Docs |
|-----------|--------|------|
| Policies | ✅ Active | 4 |
| Node Contracts | ✅ Active | 7 |
| Summary | ✅ Active | 7 |
| Topology | ✅ Active | 5 |
| State | ✅ Active | 5 |
| Playbooks | ✅ Active | 1 |
| Appendix | ✅ Active | 1 |

**Всего:** 23 документа

---

## 🔗 LINKS

- **Canonical Root:** SUMMARY_DOCS/
- **Web Reader:** http://localhost:3010 (dev)
- **AI Entry:** [appendix/AI_ENTRYPOINTS.md](./appendix/AI_ENTRYPOINTS.md)
- **Codegen Entry:** [playbooks/codegen-playbook.md](./playbooks/codegen-playbook.md)
- **MANIFEST:** [MANIFEST.json](./MANIFEST.json)
- **ROUTING:** [ROUTING.json](./ROUTING.json)

---

**Создано:** 2026-06-13  
**Версия:** 2.0.0  
**Статус:** ✅ Central Documentation Node  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**

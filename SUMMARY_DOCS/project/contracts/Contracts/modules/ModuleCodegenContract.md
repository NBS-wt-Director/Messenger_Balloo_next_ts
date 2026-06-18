---
title: Module Codegen Contract
description: Code generation rules for modules
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - module
  - codegen
  - AI
  - contract
related_docs:
  - SUMMARY_DOCS/contracts/modules/ModuleContract.md
  - SUMMARY_DOCS/DOC_CODEGEN_POLICY.md
  - SUMMARY_DOCS/playbooks/codegen-playbook.md
---

# 💻 MODULE CODEGEN CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот контракт определяет правила генерации кода на основе module contracts.

**Primary Purpose:** Обеспечить AI codegen правильным контекстом для генерации кода на основе module contracts и module summaries.

---

## 1. ✅ CODEGEN CONTEXT

### Primary Context Sources:

| Источник | Тип | Purpose | Priority |
|----------|-----|---------|----------|
| **MODULE_CONTRACT_&lt;id&gt;.md** | AI-readable | Formal specification | HIGH |
| **MODULE_SUMMARY_&lt;id&gt;.md** | Human-readable | Overview | MEDIUM |
| **MODULE_MANIFEST.json** | Machine-readable | Registry data | HIGH |
| **MODULE_RELATIONS.json** | Machine-readable | Dependencies | HIGH |
| **Related contracts** | AI-readable | Interface specs | MEDIUM |
| **Existing code** | Implementation | Reference | LOW |

### Context Priority:

```
1. MODULE_CONTRACT — primary source for codegen
2. MODULE_MANIFEST — metadata for scaffolding
3. MODULE_RELATIONS — dependencies for integration
4. MODULE_SUMMARY — context for understanding
5. Related contracts — interface compliance
6. Existing code — reference only
```

---

## 2. ✅ CODEGEN REQUIREMENTS

### AI Codegen MUST Know:

| Information | Source | Usage |
|-------------|--------|-------|
| **Module type** | MODULE_CONTRACT | Scaffolding template |
| **Dependencies** | MODULE_RELATIONS | Import statements |
| **Endpoint surface** | MODULE_CONTRACT | API routes, handlers |
| **Node presence** | MODULE_CONTRACT | Deployment config |
| **Domain exposure** | MODULE_CONTRACT | Routing, DNS |
| **Authority type** | MODULE_CONTRACT | Source of truth |
| **Status** | MODULE_MANIFEST | Implementation priority |

### Codegen Input:

```json
{
  "moduleId": "messenger-api",
  "moduleType": "service",
  "status": "active",
  "dependencies": [
    {
      "moduleId": "core-types",
      "type": "code",
      "package": "@balloo/core-types"
    }
  ],
  "endpoints": [
    {
      "method": "GET",
      "path": "/messages",
      "description": "List messages"
    }
  ],
  "nodePresence": [
    {
      "nodeId": "work_server",
      "presence": "execution"
    }
  ],
  "domainExposure": {
    "type": "subdomain",
    "domain": "api.balloo.su"
  }
}
```

---

## 3. ✅ CODEGEN OUTPUT

### Generated Artifacts:

| Artifact Type | Module Type | Example |
|---------------|-------------|---------|
| **Service code** | service | messenger-api/index.ts |
| **Package code** | package | core-types/types.ts |
| **Component code** | component | messenger-ui/Chat.tsx |
| **Contract docs** | contract | messenger-contract.md |
| **Config files** | data | messenger-config.json |
| **Deployment** | hybrid | docker-compose.yml |
| **Scripts** | orchestration | deploy-messenger.sh |
| **Integration** | integration | tailscale-adapter.ts |
| **Interfaces** | interface | messenger-interface.ts |

### Output Structure:

```
generated/
├── messenger-api/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   └── handlers/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── core-types/
│   ├── src/
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
└── messenger-ui/
    ├── src/
    │   └── Chat.tsx
    ├── package.json
    └── tsconfig.json
```

---

## 4. ✅ CODEGEN RULES

### Rule 1: Module Contracts Are Primary Context

```
✅ AI codegen читает module contracts как primary context
✅ Module summaries дают overview
✅ MODULE_MANIFEST.json даёт metadata
```

### Rule 2: Conflicts Resolved in Favor of Canonical

```
✅ Conflicts between legacy scattered docs and canonical module docs
✅ Resolve in favor of SUMMARY_DOCS canonical docs
✅ Module contracts override legacy docs
```

### Rule 3: Codegen MUST Know Module Type

```
✅ service module → service scaffolding
✅ package module → package scaffolding
✅ component module → component scaffolding
✅ contract module → contract documentation
✅ documentation module → site generation
✅ data module → config files
✅ hybrid module → multiple artifacts
```

### Rule 4: Codegen MUST Know Dependencies

```
✅ Import statements from code dependencies
✅ Interface compliance from contract dependencies
✅ Runtime config from runtime dependencies
✅ Node placement from node dependencies
```

### Rule 5: Codegen MUST Know Endpoint Surface

```
✅ HTTP routes for service modules
✅ RPC methods for gRPC modules
✅ Event topics for event-driven modules
✅ Import surfaces for package modules
```

### Rule 6: Codegen MUST Know Node Presence

```
✅ Deployment configuration
✅ Port allocation
✅ Resource requirements
✅ Networking rules
```

### Rule 7: Codegen MUST Know Domain Exposure

```
✅ Subdomain allocation
✅ Path routing
✅ DNS configuration
✅ Reverse proxy rules
```

---

## 5. ✅ CODEGEN TEMPLATES

### Service Module Template:

```typescript
// MODULE_CONTRACT: <moduleId>
// Generated from: SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_<moduleId>.md

import express from 'express';
import { MessageType } from '@balloo/core-types';

const app = express();

// Endpoint: GET /messages
// Description: <from contract>
app.get('/messages', async (req, res) => {
  // Implementation from contract spec
});

// Endpoint: POST /messages
// Description: <from contract>
app.post('/messages', async (req, res) => {
  // Implementation from contract spec
});

export default app;
```

### Package Module Template:

```typescript
// MODULE_CONTRACT: <moduleId>
// Generated from: SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_<moduleId>.md

export interface <TypeName> {
  // Type definition from contract
  id: string;
  name: string;
  // ...
}

export function <FunctionName>(input: <InputType>): <OutputType> {
  // Implementation from contract spec
}
```

### Component Module Template:

```tsx
// MODULE_CONTRACT: <moduleId>
// Generated from: SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_<moduleId>.md

import React from 'react';
import { <PropsType> } from '@balloo/core-types';

export const <ComponentName>: React.FC<<PropsType>> = (props) => {
  // Component implementation from contract
  return (
    <div className="<component-class>">
      {/* UI from contract spec */}
    </div>
  );
};
```

---

## 6. ✅ CODEGEN WORKFLOW

```
1. Read MODULE_CONTRACT
   ↓
2. Parse module type, dependencies, endpoints
   ↓
3. Select template based on module type
   ↓
4. Generate code from contract spec
   ↓
5. Add imports from dependencies
   ↓
6. Add deployment config from node presence
   ↓
7. Add routing from domain exposure
   ↓
8. Validate against contract
   ↓
9. Output generated artifacts
```

---

## 7. ✅ CODEGEN VALIDATION

### Validation Checklist:

- [ ] **Module type correct** — template matches module type
- [ ] **Dependencies imported** — all code dependencies imported
- [ ] **Endpoints implemented** — all endpoints from contract
- [ ] **Interfaces compliant** — contract interfaces followed
- [ ] **Node presence configured** — deployment config correct
- [ ] **Domain exposure configured** — routing correct
- [ ] **Authority respected** — source of truth followed
- [ ] **Status considered** — inferred modules marked

### Validation Rules:

```
✅ No code without contract basis
✅ No endpoints not in contract
✅ No dependencies not declared
✅ No interfaces not specified
✅ All inferred modules marked
```

---

## 8. ✅ CODEGEN METADATA

### Generated File Header:

```typescript
/**
 * Generated from Module Contract
 * 
 * Module: <moduleId>
 * Type: <moduleType>
 * Source: SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_<moduleId>.md
 * Generated: <timestamp>
 * 
 * DO NOT EDIT MANUALLY
 * Edit the module contract and regenerate
 */
```

### Package.json Metadata:

```json
{
  "name": "@balloo/<moduleId>",
  "version": "1.0.0",
  "description": "<from MODULE_CONTRACT>",
  "moduleType": "<moduleType>",
  "generatedFrom": "SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_<moduleId>.md",
  "generatedAt": "<timestamp>",
  "balloo": {
    "moduleId": "<moduleId>",
    "moduleType": "<moduleType>",
    "status": "<status>",
    "canonicalContract": "SUMMARY_DOCS/modules/contracts/MODULE_CONTRACT_<moduleId>.md",
    "canonicalSummary": "SUMMARY_DOCS/modules/summary/MODULE_SUMMARY_<moduleId>.md"
  }
}
```

---

## 9. ✅ CODEGEN QUALITY

### Quality Metrics:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Contract compliance** | 100% | Contract spec vs generated code |
| **Dependency accuracy** | 100% | Declared vs imported |
| **Endpoint coverage** | 100% | Contract endpoints vs implemented |
| **Interface compliance** | 100% | Interface spec vs implementation |
| **Documentation coverage** | 100% | All modules documented |

### Quality Rules:

```
✅ No hallucinated features
✅ All features traceable to contract
✅ All dependencies declared
✅ All endpoints documented
✅ All interfaces compliant
```

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Codegen context определён
2. ✅ Codegen requirements специфицированы
3. ✅ Codegen output описан
4. ✅ Codegen rules зафиксированы
5. ✅ Codegen templates предоставлены
6. ✅ Codegen workflow описан
7. ✅ Codegen validation определён
8. ✅ Codegen metadata специфицирован
9. ✅ Codegen quality metrics установлены

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**

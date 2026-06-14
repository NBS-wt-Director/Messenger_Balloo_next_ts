---
title: Entity Definitions
description: Формальные определения сущностей дерева узлов Balloo
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: ai
tags:
  - entities
  - definitions
  - schema
  - canonical
related_docs:
  - SUMMARY_DOCS/appendix/domain-glossary.md
  - SUMMARY_DOCS/appendix/entity-relationships.md
---

# 🏗️ ENTITY DEFINITIONS

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот документ определяет **формальные схемы сущностей** для дерева узлов Balloo.

**Цель:** Обеспечить machine-readable definitions для AI и codegen.

---

## 📊 ENTITY SCHEMAS

### Branch

```typescript
interface Branch {
  branchId: string;              // "production" | "alpha" | "working"
  canonicalName: string;         // "Production" | "Alpha" | "Working"
  rootDomain: string;            // "balloo.su" | "alpha.balloo.su" | "working.balloo.su"
  maturity: "stable" | "beta" | "development";
  accessLevel: "public" | "limited" | "internal";
  nodeCount: number;
  technicalNodesPolicy: "minimal" | "priority_1";
  status: "active" | "deprecated";
}
```

### Node

```typescript
interface Node {
  nodeId: string;                // Unique identifier
  canonicalName: string;         // Full domain or name
  branch: BranchId;              // Branch binding
  nodeType: NodeType;            // Type classification
  domain: string | null;         // Production domain (null if no domain)
  localDevIdentity: string;      // localhost:PORT
  localDevRequiredDomain: false; // Always false
  productionDomainRequired: boolean;
  summaryDoc: string;            // Path to summary doc
  contractDoc: string;           // Path to contract doc
  settingsScope: SettingsScope[];
  codegenPriority: 1 | 2 | 3 | 4;
  technical: boolean;
  publicFacing: boolean;
  authRequired: boolean;
  relatedModules: string[];
  relatedNodes: string[];
  status: "active" | "planned" | "deprecated";
  versionScoped?: string;        // e.g., "4.*"
  notes?: string;
}
```

### NodeType

```typescript
type NodeType =
  | "public-root"
  | "api"
  | "api-ai"
  | "storage"
  | "docs"
  | "experimental"
  | "admin"
  | "workers"
  | "info"
  | "apps-portal"
  | "family"
  | "technical-docs"
  | "technical-orchestration"
  | "technical-codegen"
  | "technical-settings"
  | "technical-runtime";
```

### TechnicalNode

```typescript
interface TechnicalNode extends Node {
  technical: true;
  priority: 1;
  allowedUsers: string[];
  authExpectation: "password_protected" | "token_based" | "api_token" | "internal_auth";
  settingsAuthority: string[];
  relationToCodegen: string;
  relationToDocs: string;
  relationToRollout: string;
}
```

### PublicNode

```typescript
interface PublicNode extends Node {
  publicFacing: true;
  authRequired: false;  // For public pages
}
```

### Module

```typescript
interface Module {
  moduleId: string;
  canonicalName: string;
  type: "core" | "feature" | "service" | "library";
  relatedNodes: string[];
  endpoints: Endpoint[];
  status: "active" | "planned" | "deprecated";
}
```

### Endpoint

```typescript
interface Endpoint {
  endpointId: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  authRequired: boolean;
  rateLimit?: number;
  description: string;
}
```

### SettingsScope

```typescript
type SettingsScope =
  | "project-global"
  | "branch-level"
  | "node-level"
  | "feature-level"
  | "runtime-local"
  | "secret"
  | "generated"
  | "derived"
  | "storage-strategy"
  | "version-registry"
  | "rollout-control"
  | "codegen-settings"
  | "database-settings"
  | "docs-settings"
  | "admin-settings";
```

### RuntimeTarget

```typescript
interface RuntimeTarget {
  environment: "local_dev" | "working" | "alpha" | "production";
  identity: string;        // domain or localhost:PORT
  domainRequired: boolean;
  url: string;
  note?: string;
}
```

### DomainBinding

```typescript
interface DomainBinding {
  nodeId: string;
  production: {
    domain: string | null;
    required: boolean;
    canonical: string;
  };
  alpha?: {
    domain: string | null;
    required: boolean;
    canonical: string;
  };
  working?: {
    domain: string | null;
    required: boolean;
    canonical: string;
  };
  localDev: {
    identity: string;
    port: number;
    domainRequired: false;
  };
}
```

### ReleaseStage

```typescript
type ReleaseStage = "working" | "alpha" | "production";

interface ReleaseTransition {
  from: ReleaseStage;
  to: ReleaseStage;
  requirements: string[];
  approval: string[];
}
```

### Capability

```typescript
interface Capability {
  capabilityId: string;
  capabilityName: string;
  nodeId: string;
  status: "active" | "planned" | "deprecated";
  minVersion?: string;     // e.g., "3.1.0"
  maxVersion?: string;
  versionScoped?: string;  // e.g., "4.*"
  notes?: string;
  evidence?: string;
}
```

### AccessLevel

```typescript
type AccessLevel =
  | "public"
  | "private"
  | "restricted"
  | "creator-only"
  | "staff-only"
  | "internal";

interface AccessRule {
  nodeId: string;
  accessLevel: AccessLevel;
  authRequired: boolean;
  roleClasses?: string[];
  accessMethod: "web" | "api" | "internal";
  secretBearing: boolean;
  settingsAuthority: boolean;
  auditRequired: boolean;
}
```

### Dependency

```typescript
interface Dependency {
  nodeId: string;
  dependsOnNodes: string[];
  dependsOnModules: string[];
  dependsOnSettingsScopes: SettingsScope[];
  dependsOnRuntimeTargets: string[];
  dependsOnAuthLayer: boolean;
  dependsOnStorageLayer: boolean;
  dependencyType: "hard" | "optional" | "planned" | "environment-specific";
}
```

---

## 🔗 RELATED DOCUMENTS

- [domain-glossary.md](./domain-glossary.md) — Domain glossary
- [entity-relationships.md](./entity-relationships.md) — Entity relationships
- [NODETREE_MANIFEST.json](../nodes/NODETREE_MANIFEST.json) — Node registry

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active — Canonical Source of Truth  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Переверни общение!**

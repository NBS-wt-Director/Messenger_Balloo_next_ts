# TreeContract

## Purpose

This contract defines the tree model for the Balloo platform node structure.

## Source of Truth

- **Node definitions**: `packages/core-tree-model`
- **Current structure**: Repository directory layout

## Node Structure

```typescript
interface Node {
  id: string;
  type: 'app' | 'package' | 'contract' | 'doc' | 'tool';
  name: string;
  path: string;
  parent?: string;
  children?: string[];
  metadata: {
    status: 'active' | 'legacy' | 'planned';
    version?: string;
    dependencies?: string[];
  };
}
```

## Tree Structure (Target)

```
balloo-monorepo/
├── apps/
│   ├── web-main (messenger) [active]
│   ├── admin (admin-portal) [active]
│   ├── api [active]
│   ├── desktop [planned]
│   ├── mobile [planned]
│   ├── android-service [planned]
│   └── max-server [planned]
├── packages/
│   ├── shared [active → legacy]
│   ├── settings [active → legacy]
│   └── [core-* packages] [planned → active]
├── workdocs/
│   ├── contracts/ [active]
│   ├── nodes/ [planned]
│   └── trees/ [planned]
├── docs-content/ [planned]
└── infra/ [planned]
```

## Must Rules

1. **Unique IDs**: Each node MUST have a unique id
2. **Path-based**: path defines the location in the repository
3. **Status tracking**: status must be one of: active, legacy, planned
4. **Explicit dependencies**: dependencies between nodes must be declared

## Machine-Binding Notes

Future machine-readable binding:
- `packages/core-tree-model` will define the Node type
- `platform-state/manifests/` will contain the current tree state

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active

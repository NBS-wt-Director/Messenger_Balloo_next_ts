# Docs Contracts

API contracts and platform specifications.

## Structure

```
docs-contracts/
├── api/              # OpenAPI/Swagger specs
├── contracts/        # Platform contracts
└── schemas/          # JSON schemas
```

## Files

### Platform Contracts
- `AutopilotContract.md` - Autopilot mode contract
- `DesignContract.md` - Design system contract
- `BrandContract.md` - Brand guidelines contract

### API Contracts
- OpenAPI specifications for:
  - `api/` - Main API
  - `admin-api/` - Admin API
  - `notifications/` - Notifications API

### Schemas
- TypeScript type definitions (generated)
- JSON schemas for validation
- Protocol buffers (if applicable)

## Integration

Contracts are:
1. Written in Markdown for human readability
2. Accompanied by machine-readable specs (OpenAPI, JSON Schema)
3. Version controlled with git
4. Referenced in code via comments

## Source

Contracts from `workdocs/contracts/` are symlinked here:
```bash
ln -s ../../workdocs/contracts contracts
```

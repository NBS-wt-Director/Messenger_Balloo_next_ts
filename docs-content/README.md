# Docs Content

Platform documentation content (MDX files).

## Structure

```
docs-content/
├── guides/           # User guides
├── api/              # API documentation
├── concepts/         # Architecture concepts
└── references/       # Technical references
```

## Migration

Content from `docs/` is being organized into:
- `docs-content/` - MDX content
- `docs-site/` - Next.js documentation site
- `docs-contracts/` - API contracts
- `docs-migration/` - Migration guides

## Files

### Core Documentation
- `README.md` - Entry point
- `ARCHITECTURE.md` - System architecture
- `SPECIFICATION.md` - Product specification
- `TECH_STACK_AUDIT.md` - Tech stack overview

### API Documentation
- `API_DOCUMENTATION.md` - API reference
- `MIGRATION_TO_EXTERNAL_API.md` - API migration guide

### Project Documentation
- `PROJECT_SUMMARY.md` - Project overview
- `MONOREPO_DOCUMENTATION.md` - Monorepo structure
- `DEPLOYMENT.md` - Deployment guide

### Migration Documentation
- `MIGRATION_GUIDE.md` - Migration steps
- `MIGRATION_SUMMARY.md` - Migration progress

See parent `docs/` directory for complete file list.

## Rules

1. **Markdown-first**: All documentation in markdown
2. **Machine-readable**: JSON/YAML schemas accompany markdown
3. **Version control**: All docs versioned with git

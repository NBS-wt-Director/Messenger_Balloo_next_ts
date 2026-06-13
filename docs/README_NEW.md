# Balloo Documentation

Official documentation for the Balloo platform.

## Quick Links

- [Getting Started](./docs-content/README.md)
- [Architecture](./docs-content/architecture.md)
- [API Reference](./docs-content/api/)
- [Migration Guides](./docs-migration/)

## Documentation Structure

```
docs/
├── docs-content/        # Documentation content (MDX)
│   ├── guides/         # User guides
│   ├── api/            # API documentation
│   ├── concepts/       # Architecture concepts
│   └── references/     # Technical references
│
├── docs-site/          # Next.js documentation site
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   └── components/ # React components
│   └── package.json
│
├── docs-contracts/     # API contracts
│   ├── api/           # OpenAPI specs
│   ├── contracts/     # Platform contracts
│   └── schemas/       # JSON schemas
│
├── docs-migration/     # Migration guides
│   └── README.md
│
└── README.md           # This file
```

## Running Documentation Site

```bash
cd docs-site
npm install
npm run dev
```

Open [http://localhost:3010](http://localhost:3010) in your browser.

## Contributing

1. Create content in `docs-content/`
2. Update pages in `docs-site/`
3. Test locally
4. Submit PR

## Legacy Documentation

Legacy documentation files remain in the parent `docs/` directory for backward compatibility. They will be gradually migrated to the new structure.

See [Migration Guide](./docs-migration/README.md) for details.

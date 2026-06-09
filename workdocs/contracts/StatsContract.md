# Stats Contract

## Purpose

Этот контракт определяет систему сбора и отображения статистики платформы.

## Metrics

### Application Metrics
- Total users
- Active users (daily, weekly, monthly)
- Message count
- File uploads
- API requests
- Error rates

### Platform Metrics
- Node count
- Package usage
- Contract compliance
- Build status
- Deployment frequency

### Display Rules
- **Primary display**: apps/admin (admin-portal)
- **Export formats**: JSON, CSV, PDF
- **Update frequency**: real-time (WebSocket)
- **Retention**: 90 days

## Source

- **Current**: `messenger/src/lib/stats` (if exists)
- **Future**: `packages/core-stats`

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active

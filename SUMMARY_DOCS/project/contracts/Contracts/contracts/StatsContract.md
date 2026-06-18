# StatsContract

## Purpose

This contract defines the statistics collection and display system for the Balloo platform.

## Source of Truth

- **Stats implementation**: `packages/core-stats`
- **Primary display**: `apps/admin`

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

## Must Rules

1. **Primary Display**: Stats MUST be displayed in `apps/admin`
2. **Export Formats**: Must support JSON, CSV, PDF
3. **Update Frequency**: Real-time via WebSocket
4. **Retention**: 90 days default retention

## Machine-Binding Notes

Future machine-readable binding:
- `packages/core-stats` will define the stats schema
- Metrics will be collected via platform-wide instrumentation

## Version

- **Contract Version**: 1.0.0
- **Last Updated**: 2026-06-09
- **Status**: Active

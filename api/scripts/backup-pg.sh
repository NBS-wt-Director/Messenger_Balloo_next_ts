#!/bin/bash
# Automatic PostgreSQL Backup Script
# Запуск: cron 0 3 * * * /path/to/backup-pg.sh

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_NAME="${DB_NAME:-balloo_production}"
DB_USER="${DB_USER:-balloo}"
DB_HOST="${DB_HOST:-localhost}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql"
GZIPPED_FILE="${BACKUP_FILE}.gz"

# Create backup directory if not exists
mkdir -p "${BACKUP_DIR}"

echo "🚀 Starting PostgreSQL backup..."
echo "   Database: ${DB_NAME}"
echo "   File: ${BACKUP_FILE}"

# Create backup using pg_dump
docker exec postgres pg_dump -U ${DB_USER} ${DB_NAME} > ${BACKUP_FILE}

# Compress backup
gzip ${BACKUP_FILE}
echo "✅ Backup created: ${GZIPPED_FILE}"

# Calculate size
SIZE=$(du -h ${GZIPPED_FILE} | cut -f1)
echo "   Size: ${SIZE}"

# Delete old backups
echo "🗑️  Cleaning old backups (older than ${RETENTION_DAYS} days)..."
find ${BACKUP_DIR} -name "backup_${DB_NAME}_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
echo "✅ Cleanup completed"

# Print latest backups
echo "📦 Latest backups:"
ls -lh ${BACKUP_DIR}/backup_${DB_NAME}_*.sql.gz 2>/dev/null | tail -5

echo "✅ Backup completed successfully!"

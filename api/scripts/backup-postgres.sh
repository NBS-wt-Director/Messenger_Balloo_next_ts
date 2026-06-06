#!/bin/bash
# PostgreSQL Backup Script
# Автоматическое резервное копирование БД

set -e

# ============================================
# CONFIGURATION
# ============================================

BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
DB_NAME="balloo_production"
DB_USER="balloo"
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
PG_PASSWORD="${DB_PASSWORD}"

# ============================================
# CREATE BACKUP DIRECTORY
# ============================================

mkdir -p "$BACKUP_DIR"

# ============================================
# GENERATE BACKUP FILENAME
# ============================================

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql.gz"

# ============================================
# CREATE BACKUP
# ============================================

echo "📦 Creating backup: $BACKUP_FILE"

docker exec balloo-postgres pg_dump \
    -U "$DB_USER" \
    -h localhost \
    -p "$DB_PORT" \
    "$DB_NAME" | gzip > "$BACKUP_FILE"

# ============================================
# VERIFY BACKUP
# ============================================

if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup created: $BACKUP_FILE ($SIZE)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# ============================================
# CLEAN OLD BACKUPS
# ============================================

echo "🧹 Cleaning old backups (older than $RETENTION_DAYS days)..."

find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ Cleanup complete"

# ============================================
# LIST BACKUPS
# ============================================

echo ""
echo "📋 Available backups:"
ls -lh "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null || echo "  (none)"

# ============================================
# EXPORT BACKUP NAME FOR CI/CD
# ============================================

echo "$BACKUP_FILE" > /tmp/last_backup.txt

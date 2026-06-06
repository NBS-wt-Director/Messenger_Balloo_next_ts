#!/bin/bash
# Setup PostgreSQL for App Balloo
# Автоматическая настройка PostgreSQL

set -e

echo "🚀 Setting up PostgreSQL for App Balloo..."

# ============================================
# CONFIGURATION
# ============================================

DB_NAME="balloo_production"
DB_USER="balloo"
DB_PASSWORD=$(cat ../secrets/db_password.txt 2>/dev/null || echo "changeme_now_$(openssl rand -hex 16)")
PG_IMAGE="postgres:15-alpine"
PG_PORT="5432"

# ============================================
# CREATE SECRETS
# ============================================

if [ ! -d "../secrets" ]; then
    echo "📁 Creating secrets directory..."
    mkdir -p ../secrets
fi

if [ ! -f "../secrets/db_password.txt" ]; then
    echo "🔐 Generating database password..."
    echo "$DB_PASSWORD" > ../secrets/db_password.txt
    chmod 600 ../secrets/db_password.txt
fi

# ============================================
# START POSTGRESQL CONTAINER
# ============================================

echo "🐳 Starting PostgreSQL container..."

docker run -d \
    --name balloo-postgres \
    -e POSTGRES_USER="$DB_USER" \
    -e POSTGRES_PASSWORD="$DB_PASSWORD" \
    -e POSTGRES_DB="$DB_NAME" \
    -v pgdata:/var/lib/postgresql/data \
    -p "$PG_PORT":5432 \
    --restart unless-stopped \
    "$PG_IMAGE"

echo "⏳ Waiting for PostgreSQL to start..."
sleep 5

# ============================================
# WAIT FOR POSTGRESQL
# ============================================

for i in {1..30}; do
    if docker exec balloo-postgres pg_isready -U "$DB_USER" > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL failed to start"
        exit 1
    fi
    
    echo "⏳ Waiting... ($i/30)"
    sleep 2
done

# ============================================
# CREATE DATABASE URL
# ============================================

echo "🔗 Generating DATABASE_URL..."
echo "postgresql://$DB_USER:$DB_PASSWORD@localhost:$PG_PORT/$DB_NAME" > ../secrets/database_url.txt

# ============================================
# SETUP COMPLETE
# ============================================

echo ""
echo "✅ PostgreSQL setup complete!"
echo ""
echo "📝 Configuration:"
echo "   Host: localhost"
echo "   Port: $PG_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""
echo "🔐 Secrets saved to:"
echo "   ../secrets/db_password.txt"
echo "   ../secrets/database_url.txt"
echo ""
echo "🚀 Next steps:"
echo "   1. Update api/.env:"
echo "      DATABASE_URL=\$(cat ../secrets/database_url.txt)"
echo ""
echo "   2. Run migration:"
echo "      cd api && node scripts/migrate-to-pg.js"
echo ""
echo "   3. Restart API:"
echo "      docker-compose restart api"
echo ""

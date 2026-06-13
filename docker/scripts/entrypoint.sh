#!/bin/sh
set -e

# Entrypoint script for Balloo services

echo "Starting ${APP_NAME:-service}..."

# Wait for dependencies if needed
if [ -n "${WAIT_FOR_DB}" ]; then
    echo "Waiting for database..."
    until nc -z "${DB_HOST:-postgres}" "${DB_PORT:-5432}"; do
        echo "  - Database not ready, waiting..."
        sleep 2
    done
    echo "  - Database is ready!"
fi

if [ -n "${WAIT_FOR_REDIS}" ]; then
    echo "Waiting for Redis..."
    until nc -z "${REDIS_HOST:-redis}" "${REDIS_PORT:-6379}"; do
        echo "  - Redis not ready, waiting..."
        sleep 2
    done
    echo "  - Redis is ready!"
fi

# Run migrations if enabled
if [ "${RUN_MIGRATIONS}" = "true" ]; then
    echo "Running database migrations..."
    npm run db:migrate
fi

# Start the application
echo "Starting application..."
exec "$@"

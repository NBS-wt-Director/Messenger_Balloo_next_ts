#!/bin/sh
set -e

# Health check script for Balloo services

HEALTH_ENDPOINT="${HEALTH_ENDPOINT:-/health}"
HEALTH_PORT="${HEALTH_PORT:-3000}"

echo "Checking health at http://localhost:${HEALTH_PORT}${HEALTH_ENDPOINT}"

if curl -f http://localhost:${HEALTH_PORT}${HEALTH_ENDPOINT} > /dev/null 2>&1; then
    echo "Service is healthy"
    exit 0
else
    echo "Service is unhealthy"
    exit 1
fi

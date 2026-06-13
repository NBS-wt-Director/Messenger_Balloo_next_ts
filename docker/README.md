# Balloo Platform - Docker Base Images

Shared Docker configurations for the Balloo platform.

## Structure

```
docker/
├── base/                    # Base images
│   ├── node/               # Node.js base image
│   │   ├── Dockerfile
│   │   └── README.md
│   └── nginx/              # Nginx base image
│       ├── Dockerfile
│       └── README.md
├── configs/                # Shared configs
│   ├── nginx/
│   │   └── nginx.conf
│   └── supervisord/
│       └── supervisord.conf
└── scripts/                # Shared scripts
    ├── healthcheck.sh
    └── entrypoint.sh
```

## Base Images

### Node.js Base Image

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### Nginx Base Image

```dockerfile
FROM nginx:alpine AS base

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

## Usage

### For API Service

```dockerfile
FROM balloo/node-base:latest

WORKDIR /app
COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
```

### For Frontend Service

```dockerfile
FROM balloo/node-base:latest

WORKDIR /app
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]
```

## Best Practices

1. **Multi-stage builds** - Reduce image size
2. **Non-root user** - Security
3. **Production dependencies only** - Smaller images
4. **Health checks** - Container orchestration
5. **Dumb-init** - Proper signal handling

---

*Auto-generated: 2026-06-12*  
*Phase 11: Infra Normalization*

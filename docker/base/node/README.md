# Balloo Node.js Base Image

Multi-stage Docker build for Node.js applications in the Balloo platform.

## Features

- ✅ Multi-stage build for minimal image size
- ✅ Non-root user for security
- ✅ Production dependencies only
- ✅ Health check endpoint
- ✅ dumb-init for proper signal handling
- ✅ Node.js 20 (LTS)

## Usage

### Option 1: Direct Build

```dockerfile
FROM balloo/node-base:latest

WORKDIR /app
COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
```

### Option 2: Extend Base Dockerfile

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

USER nodejs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

## Build

```bash
# Build base image
docker build -t balloo/node-base:latest -f docker/base/node/Dockerfile .

# Build application
docker build -t balloo/api:latest ./api
```

## Run

```bash
# Run with environment variables
docker run -d \
  -p 3001:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  balloo/api:latest
```

## Health Check

The base image includes a health check that verifies the `/health` endpoint:

```bash
# Manual health check
curl http://localhost:3000/health
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | production | Node environment |
| PORT | 3000 | Application port |

## Best Practices

1. **Use multi-stage builds** - Reduces final image size
2. **Run as non-root** - Security best practice
3. **Use .dockerignore** - Exclude unnecessary files
4. **Pin versions** - Use specific Node.js version
5. **Clean npm cache** - Reduce image size

---

*Created: 2026-06-12*  
*Phase 11: Infra Normalization*

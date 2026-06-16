# Media Server Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies for sharp
RUN apk add --no-cache libc6-compat

COPY package.json ./
COPY package-lock.json* ./

RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install runtime dependencies for sharp
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/index.js"]

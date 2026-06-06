FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start server
CMD ["npm", "start"]

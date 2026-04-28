#!/bin/bash

# ===========================================
# DEPLOY SCRIPT FOR alpha.balloo.su
# ===========================================

echo "🚀 Starting deployment to alpha.balloo.su..."

# 1. ОСТАНОВИМ PM2 ПЕРЕД ВСЕМ!
echo "🛑 Stopping PM2 application..."
pm2 stop messenger-alpha 2>/dev/null || true

# 2. Переходим в проект
cd ~/Messenger_Balloo_next_ts

# 3. КРИТИЧЕСКИ ВАЖНО: УДАЛЯЕМ workspaces из корневого package.json
# Это предотвращает ошибку с expo-device и другими пакетами из других workspaces
echo "🔧 Fixing root package.json (removing workspaces)..."
cat > package.json << 'EOF'
{
  "name": "balloo-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:web": "cd messenger && npm run dev",
    "build:web": "cd messenger && npm run build",
    "lint:web": "cd messenger && npm run lint",
    "test:web": "cd messenger && npm test"
  },
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
EOF

# 4. Обновляем код через Git
echo "📦 Updating code from Git..."
git pull origin main

# 5. Переходим в messenger
cd messenger

# 6. Сохраняем .env.production (если есть)
if [ -f .env.production ]; then
    echo "💾 Backing up .env.production..."
    cp .env.production /tmp/env.production.backup
fi

# 7. УДАЛЯЕМ .env.local (КРИТИЧЕСКИ ВАЖНО!)
echo "🗑️  Removing .env.local if exists..."
rm -f .env.local

# 8. Восстанавливаем .env.production из бэкапа или создаём новый
if [ -f /tmp/env.production.backup ]; then
    echo "📝 Restoring .env.production from backup..."
    cp /tmp/env.production.backup .env.production
else
    echo "📝 Creating new .env.production..."
    cat > .env.production << 'EOF'
# ===========================================
# PRODUCTION ENVIRONMENT - alpha.balloo.su
# ===========================================

NODE_ENV=production

# URLs
NEXT_PUBLIC_APP_URL=https://alpha.balloo.su
NEXT_PUBLIC_API_URL=https://alpha.balloo.su/api
NEXT_PUBLIC_SERVER_URL=https://alpha.balloo.su

# Security
JWT_SECRET=qhB74DY5AYgLNknsUAPbyANb2HgUXZM1FINy8O51JOklvgx7Bhn4oGGDe0J0MORN
NEXTAUTH_SECRET=G8lmx76bCLJktj5y4J63pxlNOpda82EX5ru7ghCbg2Y=
ENCRYPTION_KEY=sECmSzKbSwdFIbX12ZVWdkzq7SzgNHHDDaccmo9pV3HlB4jc6Zi6xSu28wcacdIG

# Yandex OAuth
YANDEX_CLIENT_ID=d85039fba2e548dda7107120ec99dc01
YANDEX_CLIENT_SECRET=79ee8aa5f8e94691b423588077268ed2
YANDEX_DISK_API_URL=https://cloud-api.yandex.net/v1/disk
YANDEX_DISK_TOKEN=

# Push Notifications (VAPID)
VAPID_PUBLIC_KEY=BK2ry-hpw8IowwtQ5NrgbBTW6Oh2TAY2KB0zZaHhov6Bgwte1lsXLW1GDJaGO5KiTta1dJVyNT6Cd8F5kL0Iy-s
VAPID_PRIVATE_KEY=_71NmXD1ZWwASVQcY0mLLzFbxoT3WkVXYWgkvEIdimI
VAPID_SUBJECT=mailto:robot@balloo.su

# Email
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=robot@balloo.su
SMTP_PASS=wfosbmhyfyfvmvve

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60

# Admin
ADMIN_EMAIL=robot@balloo.su

# SQLite
DATABASE_URL="file:./prisma/dev.db"
EOF
fi

# 9. Полная очистка
echo "🧹 Cleaning up..."
rm -rf node_modules package-lock.json .next

# 10. Устанавливаем зависимости (теперь БЕЗ workspaces конфликтов!)
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# 11. Генерируем Prisma client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# 12. СОБИРАЕМ ПРОЕКТ
echo "🏗️  Building project..."
NODE_ENV=production npx next build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # 13. Запускаем новый процесс
    echo "▶️  Starting application..."
    NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha"
    
    # 14. Сохраняем конфигурацию PM2
    pm2 save
    
    echo "✅ Deployment completed successfully!"
    echo "📊 Application status:"
    pm2 status
    echo "📝 Last 50 log lines:"
    pm2 logs messenger-alpha --lines 50
else
    echo "❌ Build failed! Check the error above."
    echo "PM2 not started. Fix the build error first."
    exit 1
fi
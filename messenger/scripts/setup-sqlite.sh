#!/bin/bash

# ===========================================
# Script для настройки SQLite базы данных
# ===========================================

set -e

echo "🔧 Настройка SQLite для Balloo Messenger..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверяем, существует ли папка prisma
if [ ! -d "prisma" ]; then
    echo -e "${YELLOW}Создаю папку prisma...${NC}"
    mkdir -p prisma
fi

# Проверяем, существует ли файл .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Создаю .env.local из .env.example...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ .env.local создан${NC}"
else
    echo -e "${GREEN}✓ .env.local уже существует${NC}"
fi

# Проверяем DATABASE_URL
if ! grep -q "DATABASE_URL=\"file:" .env.local; then
    echo -e "${YELLOW}⚠️  DATABASE_URL не настроен для SQLite. Обновляю...${NC}"
    
    # Удаляем старую строку DATABASE_URL если есть
    sed -i '/^DATABASE_URL=/d' .env.local
    
    # Добавляем новую
    echo 'DATABASE_URL="file:./prisma/dev.db"' >> .env.local
    echo -e "${GREEN}✓ DATABASE_URL обновлён${NC}"
fi

# Проверяем наличие schema.prisma
if [ ! -f "prisma/schema.prisma" ]; then
    echo -e "${RED}❌ prisma/schema.prisma не найден!${NC}"
    echo "Сначала создайте схему базы данных."
    exit 1
fi

# Проверяем provider в schema.prisma
if grep -q "provider = \"sqlite\"" prisma/schema.prisma; then
    echo -e "${GREEN}✓ Schema настроен на SQLite${NC}"
else
    echo -e "${YELLOW}⚠️  Schema не настроен на SQLite. Обновляю...${NC}"
    sed -i 's/provider = "postgresql"/provider = "sqlite"/g' prisma/schema.prisma
    sed -i 's/url      = env("DATABASE_URL")/url      = "file:\/\/\/.\/prisma\/dev.db"/g' prisma/schema.prisma
    echo -e "${GREEN}✓ Schema обновлён${NC}"
fi

# Проверяем, установлен ли Prisma
if ! command -v npx &> /dev/null || ! npm list prisma &> /dev/null; then
    echo -e "${YELLOW}Устанавливаю Prisma...${NC}"
    npm install -D prisma @prisma/client
fi

echo ""
echo -e "${GREEN}✓ Подготовка завершена${NC}"
echo ""
echo -e "${YELLOW}Следующие шаги:${NC}"
echo "  1. npm run db:generate  # Генерируем Prisma Client"
echo "  2. npm run db:migrate   # Создаем таблицы в БД"
echo "  3. npx prisma db seed   # Заполняем тестовыми данными"
echo ""
echo "База данных будет создана автоматически: prisma/dev.db"
echo ""

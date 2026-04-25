#!/bin/bash

# ===========================================
# Script для настройки PostgreSQL базы данных
# Устанавливается локально на сервере Beget
# ===========================================

set -e

echo "🔧 Настройка PostgreSQL для Balloo Messenger..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверяем, установлен ли PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}PostgreSQL не установлен. Устанавливаем...${NC}"
    
    # Для Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
    # Для CentOS/RHEL
    elif command -v yum &> /dev/null; then
        sudo yum install -y postgresql-server postgresql-contrib
    else
        echo -e "${RED}❌ Не удалось автоматически установить PostgreSQL. Установите вручную.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ PostgreSQL уже установлен${NC}"
fi

# Проверяем, запущен ли PostgreSQL
if ! pg_isready &> /dev/null; then
    echo -e "${YELLOW}Запускаем PostgreSQL...${NC}"
    
    # Для Ubuntu/Debian
    if command -v systemctl &> /dev/null; then
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    else
        sudo service postgresql start
    fi
else
    echo -e "${GREEN}✓ PostgreSQL уже запущен${NC}"
fi

# Создаем базу данных и пользователя
echo -e "${GREEN}✓ PostgreSQL запущен${NC}"

# Получаем пароль из .env.local или генерируем новый
DB_PASSWORD=""
if [ -f .env.local ]; then
    DB_PASSWORD=$(grep '^DATABASE_URL=' .env.local | sed 's/DATABASE_URL="postgresql:\/\/[^:]*:\([^@]*\)@.*/\1/' 2>/dev/null || echo "")
fi

if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 12 | tr -d '/+=' | head -c 12)
    echo -e "${YELLOW}⚠️  Пароль базы данных сгенерирован:${NC}"
    echo "   $DB_PASSWORD"
    echo "   Сохраните его в безопасном месте!"
fi

# Создаем пользователя и базу данных
echo -e "${YELLOW}Создаем базу данных 'balloo' и пользователя...${NC}"

sudo -u postgres psql << EOF
-- Создаем пользователя, если не существует
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'balloo') THEN
      CREATE ROLE balloo WITH LOGIN PASSWORD '$DB_PASSWORD';
      RAISE NOTICE 'Пользователь balloo создан';
   ELSE
      RAISE NOTICE 'Пользователь balloo уже существует';
   END IF;
END
\$\$;

-- Создаем базу данных, если не существует
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'balloo') THEN
      CREATE DATABASE balloo OWNER balloo;
      RAISE NOTICE 'База данных balloo создана';
   ELSE
      RAISE NOTICE 'База данных balloo уже существует';
   END IF;
END
\$\$;

-- Даем права
GRANT ALL PRIVILEGES ON DATABASE balloo TO balloo;
EOF

# Проверяем подключение
echo -e "${GREEN}✓ База данных создана${NC}"
echo -e "${YELLOW}Проверяем подключение...${NC}"

if sudo -u postgres psql -d balloo -c "SELECT version();" &> /dev/null; then
    echo -e "${GREEN}✓ Подключение успешно!${NC}"
else
    echo -e "${RED}❌ Не удалось подключиться к базе данных${NC}"
    exit 1
fi

# Обновляем .env.local если нужно
if [ -f .env.local ]; then
    echo -e "${YELLOW}Обновляем DATABASE_URL в .env.local...${NC}"
    
    # Проверяем, есть ли уже DATABASE_URL
    if ! grep -q "^DATABASE_URL=" .env.local; then
        echo "DATABASE_URL=\"postgresql://balloo:$DB_PASSWORD@localhost:5432/balloo?schema=public\"" >> .env.local
        echo -e "${GREEN}✓ DATABASE_URL добавлен в .env.local${NC}"
    else
        echo -e "${GREEN}✓ DATABASE_URL уже существует в .env.local${NC}"
    fi
else
    echo -e "${YELLOW}Создаем .env.local...${NC}"
    cp .env.example .env.local
    
    # Добавляем DATABASE_URL
    echo "DATABASE_URL=\"postgresql://balloo:$DB_PASSWORD@localhost:5432/balloo?schema=public\"" >> .env.local
    echo -e "${GREEN}✓ .env.local создан${NC}"
fi

echo ""
echo "=============================================="
echo -e "${GREEN}✅ PostgreSQL настроен успешно!${NC}"
echo "=============================================="
echo ""
echo "Следующие шаги:"
echo "  1. npm run db:generate  # Генерируем Prisma Client"
echo "  2. npm run db:migrate   # Применяем миграции"
echo "  3. npx prisma db seed   # Создаем тестовые данные"
echo ""
echo "Пароль базы данных: $DB_PASSWORD"
echo "Сохраните его в безопасном месте!"
echo ""
echo "📁 База данных находится в том же проекте:"
echo "   Сервер: localhost (на этом же сервере)"
echo "   База: balloo"
echo "   Пользователь: balloo"
echo ""

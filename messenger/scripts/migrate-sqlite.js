/**
 * Script для миграции и инициализации SQLite БД
 * Запускается перед стартом приложения
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PRISMA_DIR = path.join(__dirname, '..', 'prisma');
const DB_PATH = path.join(PRISMA_DIR, 'dev.db');

console.log('🔧 Миграция SQLite базы данных...');

// Проверяем существование schema.prisma
const schemaPath = path.join(PRISMA_DIR, 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error('❌ prisma/schema.prisma не найден!');
  process.exit(1);
}

// Проверяем существование package.json
const packagePath = path.join(__dirname, '..', 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json не найден!');
  process.exit(1);
}

// Проверяем наличие .env.production или .env (для локальной разработки)
const envProductionPath = path.join(__dirname, '..', '.env.production');
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');

// НЕ создаём .env.local автоматически - это ломает сборку на сервере!
// Если нужен локальный конфиг - создайте .env.local вручную
if (!fs.existsSync(envProductionPath) && !fs.existsSync(envPath) && !fs.existsSync(envLocalPath)) {
  console.error('❌ Ни один из файлов .env.production, .env или .env.local не найден!');
  console.error('Для продакшена создайте .env.production, для разработки - .env.local');
  process.exit(1);
}

// Проверяем, что DATABASE_URL настроен на SQLite
const envContent = fs.readFileSync(envPath, 'utf-8');
if (!envContent.includes('DATABASE_URL="file:')) {
  console.log('⚠️  DATABASE_URL не настроен на SQLite. Обновляю...');
  const updatedEnv = envContent.replace(
    /DATABASE_URL=.*/,
    'DATABASE_URL="file:./prisma/dev.db"'
  );
  fs.writeFileSync(envPath, updatedEnv);
  console.log('✓ DATABASE_URL обновлён');
}

// Проверяем provider в schema.prisma
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
if (!schemaContent.includes('provider = "sqlite"')) {
  console.log('⚠️  Schema не настроен на SQLite. Обновляю...');
  const updatedSchema = schemaContent
    .replace(/provider = "postgresql"/g, 'provider = "sqlite"')
    .replace(/url\s*=.*env\(.*\)/g, 'url = "file:./dev.db"');
  fs.writeFileSync(schemaPath, updatedSchema);
  console.log('✓ Schema обновлён');
}

console.log('\n✅ Подготовка завершена!');
console.log('\n📝 Выполните команды вручную:');
console.log('  npm run db:generate   # Генерируем Prisma Client');
console.log('  npm run db:push       # Создаем таблицы в БД');
console.log('  npm run db:seed       # Заполняем тестовыми данными');
console.log('\nИли выполните:');
console.log('  npm run db:setup-full # Полная настройка (если установлена Prisma 6)');

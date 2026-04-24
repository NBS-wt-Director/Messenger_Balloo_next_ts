// Скрипт для быстрой диагностики ошибок
// Запустите: node scripts/check.js

const fs = require('fs');
const path = require('path');

const errors = [];

// Проверка файлов
const files = [
  'src/app/layout.tsx',
  'src/app/admin/page.tsx',
  'src/app/settings/page.tsx',
  'src/components/Header.tsx',
  'src/components/PWAInstall.tsx',
  'src/components/Providers.tsx',
  'src/stores/auth-store.ts',
  'src/stores/settings-store.ts',
  'src/lib/admin.ts',
];

console.log('Проверка файлов...\n');

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file} - НЕ НАЙДЕН`);
    errors.push(file);
  }
});

console.log('\nПроверка CSS...\n');

const cssFiles = [
  'src/app/globals.css',
  'src/app/admin/page.css',
  'src/app/settings/settings.css',
  'src/components/layout/Header.css',
];

cssFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file} - НЕ НАЙДЕН`);
    errors.push(file);
  }
});

if (errors.length > 0) {
  console.log(`\n❌ Найдено ошибок: ${errors.length}`);
  process.exit(1);
} else {
  console.log(`\n✅ Все файлы на месте!`);
}

#!/usr/bin/env node

/**
 * Скрипт для исправления всех импортов из @/lib/database
 * Заменяет импорты функций RxDB на прямые вызовы SQLite
 */

const fs = require('fs');
const path = require('path');

const messengerDir = path.join(__dirname, '..');
const apiDir = path.join(messengerDir, 'src', 'app', 'api');

// Функция для рекурсивного поиска всех .ts и .tsx файлов
function findFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      findFiles(fullPath, files);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Функция для замены импортов
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixed = false;

  // Если файл не использует @/lib/database, пропускаем
  if (!content.includes("from '@/lib/database'")) {
    return false;
  }

  console.log(`\n📝 Обработка: ${filePath.replace(messengerDir + '/', '')}`);

  // Заменяем импорт db
  if (content.includes("import { getDatabase } from '@/lib/database';")) {
    content = content.replace("import { getDatabase } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getDatabase');
  }

  if (content.includes("import { getUsersCollection } from '@/lib/database';")) {
    content = content.replace("import { getUsersCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getUsersCollection');
  }

  if (content.includes("import { getChatsCollection } from '@/lib/database';")) {
    content = content.replace("import { getChatsCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getChatsCollection');
  }

  if (content.includes("import { getMessagesCollection } from '@/lib/database';")) {
    content = content.replace("import { getMessagesCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getMessagesCollection');
  }

  if (content.includes("import { getNotificationsCollection } from '@/lib/database';")) {
    content = content.replace("import { getNotificationsCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getNotificationsCollection');
  }

  if (content.includes("import { getInvitationsCollection } from '@/lib/database';")) {
    content = content.replace("import { getInvitationsCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getInvitationsCollection');
  }

  if (content.includes("import { getContactsCollection } from '@/lib/database';")) {
    content = content.replace("import { getContactsCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getContactsCollection');
  }

  if (content.includes("import { getReportsCollection } from '@/lib/database';")) {
    content = content.replace("import { getReportsCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getReportsCollection');
  }

  if (content.includes("import { getAttachmentsCollection } from '@/lib/database';")) {
    content = content.replace("import { getAttachmentsCollection } from '@/lib/database';", "import db from '@/lib/database';");
    fixed = true;
    console.log('  ✅ Заменен импорт getAttachmentsCollection');
  }

  // Убираем дубликаты импортов
  if (content.includes("import db from '@/lib/database';")) {
    const importMatches = content.match(/import db from '@\/lib\/database';/g);
    if (importMatches && importMatches.length > 1) {
      content = content.replace(/import db from '@\/lib\/database';\s*import db from '@\/lib\/database';/g, "import db from '@/lib/database';");
      console.log('  ✅ Удален дублирующий импорт db');
    }
  }

  // Заменяем await getDatabase() на просто использование db
  if (content.includes('await getDatabase()')) {
    content = content.replace(/const\s+\w+\s*=\s*await\s+getDatabase\(\);/g, '// SQLite db уже доступен');
    content = content.replace(/await\s+getDatabase\(\);/g, '// SQLite db уже инициализирован');
    fixed = true;
    console.log('  ✅ Заменен вызов await getDatabase()');
  }

  // Если файл был изменен, записываем его
  if (fixed && content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  💾 Файл сохранен`);
    return true;
  }

  return fixed;
}

// Основная логика
console.log('🔧 Начало исправления импортов базы данных...\n');

const files = findFiles(apiDir);
let fixedCount = 0;

for (const file of files) {
  try {
    if (fixFile(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`  ❌ Ошибка обработки ${file}:`, error.message);
  }
}

// Также исправляем lib/db-init.ts если нужно
const dbInitPath = path.join(messengerDir, 'src', 'lib', 'db-init.ts');
if (fs.existsSync(dbInitPath)) {
  fixFile(dbInitPath);
}

console.log(`\n✅ Готово! Исправлено файлов: ${fixedCount}`);
console.log(`\n⚠️  ВНИМАНИЕ: Этот скрипт только заменяет импорты.`);
console.log(`Вам нужно вручную проверить и исправить логику запросов в каждом файле,`);
console.log(`заменяя RxDB запросы на SQLite db.prepare().run() вызовы.`);

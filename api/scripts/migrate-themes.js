/**
 * Migration Script: Themes
 * Запуск: node scripts/migrate-themes.js
 */

const { db, initDatabase } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Starting themes migration...');
  
  try {
    // Инициализируем БД если не создана
    await initDatabase();
    
    // Читаем SQL файл
    const sqlPath = path.join(__dirname, '../src/schema/themes.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Выполняем миграцию
    db.exec(sql);
    
    console.log('✅ Themes tables created successfully');
    
    // Проверяем таблицы
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('user_themes', 'theme_subscriptions', 'theme_history')
    `).all();
    
    console.log(`📊 Created ${tables.length} tables:`, tables.map(t => t.name).join(', '));
    
    console.log('✅ Migration completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();

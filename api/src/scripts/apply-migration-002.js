/**
 * Скрипт применения миграции 002
 * Создание таблиц функций и настроек
 */

const { db, runMigrations } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function applyMigration002() {
  console.log('Applying migration 002: Create functions and settings tables...');
  
  try {
    // Read migration SQL file
    const migrationPath = path.join(__dirname, '002_create_functions_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements`);
    
    // Execute each statement
    let executed = 0;
    for (const statement of statements) {
      try {
        db.exec(statement);
        executed++;
        console.log(`✓ Executed statement ${executed}/${statements.length}`);
      } catch (error) {
        console.error(`✗ Error executing statement ${executed + 1}:`, error.message);
        throw error;
      }
    }
    
    console.log('✅ Migration 002 completed successfully!');
    console.log(`Tables created: project_functions, project_functions_history, system_settings, documentation_versions`);
    
    // Log migration
    const logMigration = db.prepare(`
      INSERT OR IGNORE INTO _migrations (name, applied_at)
      VALUES (?, CURRENT_TIMESTAMP)
    `);
    logMigration.run('002_create_functions_table');
    
  } catch (error) {
    console.error('❌ Migration 002 failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  applyMigration002();
}

module.exports = { applyMigration002 };

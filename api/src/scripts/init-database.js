/**
 * Скрипт инициализации базы данных
 * Запускается при первом старте или вручную через npm run db:init
 */

require('dotenv').config();

async function main() {
  console.log('Initializing database...\n');
  
  try {
    const { initDatabase, closeDatabase } = require('../config/database');
    await initDatabase();
    console.log('\n✅ Database initialized successfully!');
    console.log(`📁 Database file: ${require('../config/database').DB_PATH}`);
    closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
    process.exit(1);
  }
}

main();

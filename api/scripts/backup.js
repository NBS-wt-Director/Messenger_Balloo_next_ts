#!/usr/bin/env node
/**
 * Backup Script
 * Автоматическое резервное копирование БД и файлов
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const logger = require('../src/config/logger');

// Конфигурация
const CONFIG = {
  backupDir: process.env.BACKUP_DIR || './backups',
  dbPath: process.env.DB_PATH || './data/database.db',
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
  compress: true
};

// ============================================
// CREATE BACKUP
// ============================================

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupId = uuidv4();
  const backupName = `backup_${timestamp}_${backupId}`;
  const backupPath = path.join(CONFIG.backupDir, backupName);

  logger.info(`Starting backup: ${backupName}`);

  try {
    // Создать директорию бэкапа
    fs.mkdirSync(backupPath, { recursive: true });

    // Бэкап базы данных
    if (fs.existsSync(CONFIG.dbPath)) {
      const dbBackupPath = path.join(backupPath, 'database.db');
      fs.copyFileSync(CONFIG.dbPath, dbBackupPath);
      logger.info(`Database backed up: ${CONFIG.dbPath}`);
    } else {
      logger.warn(`Database not found: ${CONFIG.dbPath}`);
    }

    // Бэкап конфигурации
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      fs.copyFileSync(envPath, path.join(backupPath, '.env'));
      logger.info('Environment backed up');
    }

    // Сжатие (опционально)
    if (CONFIG.compress) {
      const archivePath = `${backupPath}.tar.gz`;
      execSync(`tar -czf ${archivePath} -C ${backupPath} .`, { stdio: 'ignore' });
      fs.rmSync(backupPath, { recursive: true });
      logger.info(`Backup compressed: ${archivePath}`);
    }

    logger.info(`Backup completed: ${backupName}`);
    return { success: true, backupName, path: backupPath };
  } catch (error) {
    logger.error('Backup failed:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// CLEAN OLD BACKUPS
// ============================================

function cleanOldBackups() {
  const cutoffDate = Date.now() - (CONFIG.retentionDays * 24 * 60 * 60 * 1000);
  
  try {
    const backups = fs.readdirSync(CONFIG.backupDir);
    let cleaned = 0;

    backups.forEach(file => {
      if (!file.startsWith('backup_')) return;

      const filePath = path.join(CONFIG.backupDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < cutoffDate) {
        fs.rmSync(filePath, { recursive: true });
        cleaned++;
        logger.info(`Cleaned old backup: ${file}`);
      }
    });

    logger.info(`Cleaned ${cleaned} old backup(s)`);
    return { success: true, cleaned };
  } catch (error) {
    logger.error('Cleanup failed:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// RESTORE BACKUP
// ============================================

function restoreBackup(backupName) {
  const backupPath = path.join(CONFIG.backupDir, backupName);
  const archivePath = `${backupPath}.tar.gz`;

  logger.info(`Starting restore: ${backupName}`);

  try {
    // Проверить существование бэкапа
    const backupExists = fs.existsSync(archivePath) || fs.existsSync(backupPath);
    if (!backupExists) {
      return { success: false, error: 'Backup not found' };
    }

    // Распаковать если нужно
    if (fs.existsSync(archivePath)) {
      const tempDir = path.join(CONFIG.backupDir, 'temp_restore');
      fs.mkdirSync(tempDir, { recursive: true });
      execSync(`tar -xzf ${archivePath} -C ${tempDir}`, { stdio: 'ignore' });
    }

    // Восстановить базу данных
    const dbBackup = path.join(backupPath, 'database.db');
    if (fs.existsSync(dbBackup)) {
      const dbDest = path.join(process.cwd(), CONFIG.dbPath);
      fs.mkdirSync(path.dirname(dbDest), { recursive: true });
      fs.copyFileSync(dbBackup, dbDest);
      logger.info('Database restored');
    }

    logger.info(`Restore completed: ${backupName}`);
    return { success: true };
  } catch (error) {
    logger.error('Restore failed:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// LIST BACKUPS
// ============================================

function listBackups() {
  try {
    const backups = fs.readdirSync(CONFIG.backupDir)
      .filter(file => file.startsWith('backup_'))
      .map(file => {
        const filePath = path.join(CONFIG.backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          created: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created);

    return { success: true, backups };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// CLI
// ============================================

const command = process.argv[2];

switch (command) {
  case 'create':
    const result = createBackup();
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
    break;

  case 'clean':
    const cleanResult = cleanOldBackups();
    console.log(JSON.stringify(cleanResult, null, 2));
    break;

  case 'restore':
    const backupName = process.argv[3];
    if (!backupName) {
      console.error('Usage: node backup.js restore <backup-name>');
      process.exit(1);
    }
    const restoreResult = restoreBackup(backupName);
    console.log(JSON.stringify(restoreResult, null, 2));
    process.exit(restoreResult.success ? 0 : 1);
    break;

  case 'list':
    const listResult = listBackups();
    console.log(JSON.stringify(listResult, null, 2));
    break;

  default:
    console.log('Usage: node backup.js <create|clean|restore|list>');
    console.log('  create   - Create new backup');
    console.log('  clean    - Remove old backups');
    console.log('  restore  - Restore from backup');
    console.log('  list     - List all backups');
}

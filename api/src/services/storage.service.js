/**
 * File Storage Service
 * Абстракция для работы с хранилищем файлов
 * Поддержка нескольких провайдеров (Yandex Disk, S3, Local)
 */

const logger = require('../config/logger');
const { db } = require('../config/database');

// ============================================
// CONFIGURATION
// ============================================

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'yandex'; // yandex, s3, local
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 50 * 1024 * 1024; // 50MB

// ============================================
// YANDEX DISK PROVIDER
// ============================================

const yandexService = require('./yandex-disk.service');

const yandexProvider = {
  name: 'yandex',
  
  async uploadFile(userId, filePath, fileName, metadata = {}) {
    try {
      const result = await yandexService.uploadFile(filePath, fileName, userId);
      
      // Сохранить информацию о файле в БД
      const fileId = require('uuid').v4();
      db.prepare(`
        INSERT INTO files (id, user_id, file_name, storage_id, storage_type, size, mime_type, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        fileId,
        userId,
        fileName,
        result.fileId,
        'yandex',
        metadata.size || 0,
        metadata.mimeType || '',
        JSON.stringify(metadata),
        Date.now()
      );
      
      return {
        success: true,
        fileId,
        url: result.url,
        storageId: result.fileId
      };
    } catch (error) {
      logger.error('Yandex upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async deleteFile(fileId) {
    try {
      const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);
      
      if (file && file.storage_type === 'yandex') {
        const result = await yandexService.deleteFile(file.storage_id);
        
        db.prepare('DELETE FROM files WHERE id = ?').run(fileId);
        
        return {
          success: true,
          deleted: true
        };
      }
      
      return {
        success: false,
        error: 'File not found or wrong provider'
      };
    } catch (error) {
      logger.error('Yandex delete failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async getFileUrl(fileId) {
    try {
      const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);
      
      if (!file) {
        return {
          success: false,
          error: 'File not found'
        };
      }
      
      if (file.storage_type === 'yandex') {
        const result = await yandexService.getFileUrl(file.storage_id);
        return {
          success: true,
          url: result.url
        };
      }
      
      return {
        success: false,
        error: 'Unsupported storage type'
      };
    } catch (error) {
      logger.error('Yandex get url failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async listFiles(userId, limit = 50, offset = 0) {
    try {
      const files = db.prepare(`
        SELECT * FROM files 
        WHERE user_id = ? AND storage_type = 'yandex'
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).all(userId, limit, offset);
      
      const total = db.prepare(`
        SELECT COUNT(*) as count FROM files 
        WHERE user_id = ? AND storage_type = 'yandex'
      `).get(userId).count;
      
      return {
        success: true,
        files,
        total,
        limit,
        offset
      };
    } catch (error) {
      logger.error('Yandex list files failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// ============================================
// S3 PROVIDER (Future)
// ============================================

const s3Provider = {
  name: 's3',
  
  async uploadFile(userId, filePath, fileName, metadata = {}) {
    // TODO: Implement S3 upload
    logger.warn('S3 provider not implemented yet');
    return {
      success: false,
      error: 'S3 provider not implemented'
    };
  },
  
  async deleteFile(fileId) {
    logger.warn('S3 provider not implemented yet');
    return {
      success: false,
      error: 'S3 provider not implemented'
    };
  },
  
  async getFileUrl(fileId) {
    logger.warn('S3 provider not implemented yet');
    return {
      success: false,
      error: 'S3 provider not implemented'
    };
  },
  
  async listFiles(userId, limit = 50, offset = 0) {
    logger.warn('S3 provider not implemented yet');
    return {
      success: false,
      error: 'S3 provider not implemented'
    };
  }
};

// ============================================
// LOCAL PROVIDER (Development)
// ============================================

const fs = require('fs').promises;
const path = require('path');

const localProvider = {
  name: 'local',
  storagePath: process.env.LOCAL_STORAGE_PATH || './uploads',
  
  async uploadFile(userId, filePath, fileName, metadata = {}) {
    try {
      const userPath = path.join(this.storagePath, userId);
      await fs.mkdir(userPath, { recursive: true });
      
      const fileNameWithId = `${Date.now()}_${fileName}`;
      const destPath = path.join(userPath, fileNameWithId);
      
      await fs.copyFile(filePath, destPath);
      
      const stats = await fs.stat(destPath);
      
      const fileId = require('uuid').v4();
      db.prepare(`
        INSERT INTO files (id, user_id, file_name, storage_id, storage_type, size, mime_type, metadata, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        fileId,
        userId,
        fileName,
        fileNameWithId,
        'local',
        stats.size,
        metadata.mimeType || '',
        JSON.stringify(metadata),
        Date.now()
      );
      
      return {
        success: true,
        fileId,
        url: `/api/v1/files/${fileId}/download`,
        storageId: fileNameWithId
      };
    } catch (error) {
      logger.error('Local upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async deleteFile(fileId) {
    try {
      const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);
      
      if (file && file.storage_type === 'local') {
        const filePath = path.join(this.storagePath, file.user_id, file.storage_id);
        await fs.unlink(filePath);
        
        db.prepare('DELETE FROM files WHERE id = ?').run(fileId);
        
        return {
          success: true,
          deleted: true
        };
      }
      
      return {
        success: false,
        error: 'File not found or wrong provider'
      };
    } catch (error) {
      logger.error('Local delete failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async getFileUrl(fileId) {
    try {
      const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);
      
      if (!file) {
        return {
          success: false,
          error: 'File not found'
        };
      }
      
      if (file.storage_type === 'local') {
        return {
          success: true,
          url: `/api/v1/files/${fileId}/download`
        };
      }
      
      return {
        success: false,
        error: 'Unsupported storage type'
      };
    } catch (error) {
      logger.error('Local get url failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async listFiles(userId, limit = 50, offset = 0) {
    try {
      const files = db.prepare(`
        SELECT * FROM files 
        WHERE user_id = ? AND storage_type = 'local'
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).all(userId, limit, offset);
      
      const total = db.prepare(`
        SELECT COUNT(*) as count FROM files 
        WHERE user_id = ? AND storage_type = 'local'
      `).get(userId).count;
      
      return {
        success: true,
        files,
        total,
        limit,
        offset
      };
    } catch (error) {
      logger.error('Local list files failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// ============================================
// SELECT PROVIDER
// ============================================

const providers = {
  yandex: yandexProvider,
  s3: s3Provider,
  local: localProvider
};

const provider = providers[STORAGE_PROVIDER];

if (!provider) {
  throw new Error(`Unknown storage provider: ${STORAGE_PROVIDER}`);
}

logger.info(`Storage provider initialized: ${provider.name}`);

// ============================================
// EXPORTS
// ============================================

module.exports = {
  uploadFile: (userId, filePath, fileName, metadata) => 
    provider.uploadFile(userId, filePath, fileName, metadata),
  
  deleteFile: (fileId) => provider.deleteFile(fileId),
  
  getFileUrl: (fileId) => provider.getFileUrl(fileId),
  
  listFiles: (userId, limit, offset) => 
    provider.listFiles(userId, limit, offset),
  
  getProvider: () => provider.name,
  
  MAX_FILE_SIZE
};

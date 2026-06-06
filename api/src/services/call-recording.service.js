/**
 * Call Recording Service
 * Запись звонков и загрузка на Яндекс.Диск
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const logger = require('../config/logger');

// Директория для временных записей
const RECORDINGS_DIR = path.join(__dirname, '../../recordings');

// Гарантируем существование директории
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
}

/**
 * Инициализировать запись звонка
 * @param {string} callId - ID звонка
 * @returns {object} - Путь для записи и метаинформация
 */
function initRecording(callId) {
  const recordingId = uuidv4();
  const timestamp = Date.now();
  const filename = `${recordingId}_${timestamp}.webm`;
  const filepath = path.join(RECORDINGS_DIR, filename);
  
  return {
    recordingId,
    filename,
    filepath,
    status: 'initializing'
  };
}

/**
 * Получить поток для записи аудио/видео
 * @param {string} callId - ID звонка
 * @param {string} recordingId - ID записи
 * @returns {object} - Поток для записи
 */
function getRecordingStream(callId, recordingId) {
  const filepath = path.join(RECORDINGS_DIR, `${recordingId}.webm`);
  const writeStream = fs.createWriteStream(filepath);
  
  return {
    writeStream,
    filepath,
    recordingId,
    callId,
    write: (chunk) => {
      writeStream.write(chunk);
    },
    end: () => {
      writeStream.end();
      return filepath;
    }
  };
}

/**
 * Загрузить запись на Яндекс.Диск
 * @param {string} filePath - Путь к файлу записи
 * @param {string} userId - ID пользователя для загрузки
 * @param {string} yandexToken - Access токен Яндекса
 * @returns {object} - Результат загрузки
 */
async function uploadToYandexDisk(filePath, userId, yandexToken) {
  try {
    const filename = path.basename(filePath);
    const filesize = fs.statSync(filePath).size;
    
    // 1. Получить ссылку на загрузку
    const uploadUrlResponse = await axios.get(
      'https://cloud-api.yandex.net/v1/disk/resources/upload',
      {
        params: {
          path: `AppBalloo/CallRecordings/${filename}`,
          overwrite: true
        },
        headers: {
          Authorization: `OAuth ${yandexToken}`
        }
      }
    );
    
    const uploadUrl = uploadUrlResponse.data.href;
    
    // 2. Загрузить файл
    const fileStream = fs.createReadStream(filePath);
    await axios.put(uploadUrl, fileStream, {
      headers: {
        'Content-Type': 'audio/webm'
      }
    });
    
    // 3. Получить информацию о файле
    const fileInfoResponse = await axios.get(
      'https://cloud-api.yandex.net/v1/disk/resources',
      {
        params: {
          path: `AppBalloo/CallRecordings/${filename}`
        },
        headers: {
          Authorization: `OAuth ${yandexToken}`
        }
      }
    );
    
    const diskPath = fileInfoResponse.data.path;
    const yandexDiskId = fileInfoResponse.data.id;
    
    logger.info(`Recording uploaded to Yandex Disk: ${diskPath}`);
    
    return {
      success: true,
      diskPath,
      yandexDiskId,
      filename
    };
  } catch (error) {
    logger.error('Upload to Yandex Disk error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Получить публичную ссылку на запись
 * @param {string} yandexToken - Access токен Яндекса
 * @param {string} diskPath - Путь на Яндекс.Диске
 * @returns {string} - Публичная ссылка
 */
async function getPublicUrl(yandexToken, diskPath) {
  try {
    const response = await axios.get(
      'https://cloud-api.yandex.net/v1/disk/resources/public',
      {
        params: {
          path: diskPath
        },
        headers: {
          Authorization: `OAuth ${yandexToken}`
        }
      }
    );
    
    return response.data.publicUrl;
  } catch (error) {
    logger.error('Get public URL error:', error);
    return null;
  }
}

/**
 * Удалить локальный файл записи
 * @param {string} filepath - Путь к файлу
 */
function deleteLocalFile(filepath) {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      logger.info(`Local recording deleted: ${filepath}`);
    }
  } catch (error) {
    logger.error('Delete local file error:', error);
  }
}

/**
 * Получить путь к записи по ID звонка
 * @param {string} callId - ID звонка
 * @returns {string|null} - Путь к записи
 */
function getRecordingPath(callId) {
  const files = fs.readdirSync(RECORDINGS_DIR);
  const recordingFile = files.find(f => f.startsWith(callId));
  
  if (recordingFile) {
    return path.join(RECORDINGS_DIR, recordingFile);
  }
  
  return null;
}

/**
 * Получить список всех записей
 * @returns {Array} - Список записей
 */
function getAllRecordings() {
  const files = fs.readdirSync(RECORDINGS_DIR);
  
  return files.map(file => {
    const filepath = path.join(RECORDINGS_DIR, file);
    const stats = fs.statSync(filepath);
    
    return {
      filename: file,
      filepath,
      size: stats.size,
      createdAt: stats.mtime
    };
  });
}

/**
 * Очистить старые записи (старше 30 дней)
 */
function cleanupOldRecordings(days = 30) {
  const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
  const files = fs.readdirSync(RECORDINGS_DIR);
  
  files.forEach(file => {
    const filepath = path.join(RECORDINGS_DIR, file);
    const stats = fs.statSync(filepath);
    
    if (stats.mtimeMs < cutoffDate) {
      fs.unlinkSync(filepath);
      logger.info(`Old recording deleted: ${file}`);
    }
  });
}

module.exports = {
  initRecording,
  getRecordingStream,
  uploadToYandexDisk,
  getPublicUrl,
  deleteLocalFile,
  getRecordingPath,
  getAllRecordings,
  cleanupOldRecordings,
  RECORDINGS_DIR
};

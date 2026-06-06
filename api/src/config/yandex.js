/**
 * Конфигурация Яндекс интеграций
 * OAuth авторизация и Яндекс.Диск
 */

// Yandex OAuth
const YANDEX_OAUTH = {
  authorizeUrl: 'https://oauth.yandex.ru/authorize',
  tokenUrl: 'https://oauth.yandex.ru/token',
  clientId: process.env.YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET,
  redirectUri: process.env.YANDEX_REDIRECT_URI || 'http://localhost:3001/api/v1/auth/yandex/callback',
  scope: 'login:email social:read disk:app_folder'
};

// Yandex Disk
const YANDEX_DISK = {
  baseUrl: process.env.YANDEX_DISK_BASE_URL || 'https://cloud-api.yandex.net/v1/disk',
  appFolder: 'messenger', // Папка в Яндекс.Диске пользователя
  
  // URL для получения временной ссылки на загрузку
  getUploadUrl: (path) => `${YANDEX_DISK.baseUrl}/resources/upload?path=${encodeURIComponent(path)}&overwrite=true`,
  
  // URL для скачивания
  getDownloadUrl: (path) => `${YANDEX_DISK.baseUrl}/resources/download?path=${encodeURIComponent(path)}`,
  
  // Получить информацию о файле
  getFileInfo: (path) => `${YANDEX_DISK.baseUrl}/resources?path=${encodeURIComponent(path)}`,
  
  // Список файлов в папке
  listFiles: (path = '/') => `${YANDEX_DISK.baseUrl}/resources?path=${encodeURIComponent(path)}&limit=100`,
  
  // Создать папку
  createFolder: (path) => `${YANDEX_DISK.baseUrl}/resources`,
  
  // Опубликовать файл (получить публичную ссылку)
  publishFile: (path) => `${YANDEX_DISK.baseUrl}/resources/publish`,
  
  // Удалить файл
  deleteFile: (path) => `${YANDEX_DISK.baseUrl}/resources?path=${encodeURIComponent(path)}`,
  
  // Получить квоту
  getQuota: () => `${YANDEX_DISK.baseUrl}/quota`
};

// Проверка конфигурации
function validateConfig() {
  const warnings = [];
  
  if (!YANDEX_OAUTH.clientId) {
    warnings.push('YANDEX_CLIENT_ID не настроен. Яндекс.Авторизация не будет работать.');
  }
  
  if (!YANDEX_OAUTH.clientSecret) {
    warnings.push('YANDEX_CLIENT_SECRET не настроен. Яндекс.Авторизация не будет работать.');
  }
  
  return warnings;
}

module.exports = {
  YANDEX_OAUTH,
  YANDEX_DISK,
  validateConfig
};

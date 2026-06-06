/**
 * Криптография и шифрование
 * E2E шифрование для сообщений и файлов
 * Шифрование Яндекс токенов
 */

const CryptoJS = require('crypto-js');

/**
 * Ключ шифрования для Яндекс токенов
 * Должен быть 32 символа для AES-256
 */
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-characters-key-here!!';

/**
 * Шифрование данных
 * @param {string} data - Данные для шифрования
 * @param {string} key - Ключ шифрования (опционально)
 * @returns {string} - Зашифрованные данные в base64
 */
function encrypt(data, key = ENCRYPTION_KEY) {
  if (!data) return null;
  const encrypted = CryptoJS.AES.encrypt(data, key).toString();
  return encrypted;
}

/**
 * Расшифровка данных
 * @param {string} encryptedData - Зашифрованные данные
 * @param {string} key - Ключ расшифровки (опционально)
 * @returns {string} - Расшифрованные данные
 */
function decrypt(encryptedData, key = ENCRYPTION_KEY) {
  if (!encryptedData) return null;
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

/**
 * Хэширование пароля (bcrypt не используется здесь, есть отдельная утилита)
 * Для E2E ключей используется Web Crypto API на клиенте
 */

/**
 * Генерация случайной строки (для токенов, кодов)
 * @param {number} length - Длина строки
 * @returns {string} - Случайная строка
 */
function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Генерация короткого кода (для приглашений, верификации)
 * @param {number} length - Длина кода (по умолчанию 6)
 * @returns {string} - Код
 */
function generateCode(length = 6) {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Хэширование строки (SHA-256)
 * @param {string} data - Данные для хэширования
 * @returns {string} - Hex хэш
 */
function hash(data) {
  return CryptoJS.SHA256(data).toString();
}

/**
 * Проверка хэша
 * @param {string} data - Исходные данные
 * @param {string} hash - Хэш для проверки
 * @returns {boolean} - Результат проверки
 */
function verifyHash(data, hash) {
  return hash(data) === hash;
}

/**
 * Кодирование в base64
 * @param {string} data - Данные
 * @returns {string} - Base64 строка
 */
function toBase64(data) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
}

/**
 * Декодирование из base64
 * @param {string} base64 - Base64 строка
 * @returns {string} - Исходные данные
 */
function fromBase64(base64) {
  return CryptoJS.enc.Base64.parse(base64).toString(CryptoJS.enc.Utf8);
}

module.exports = {
  encrypt,
  decrypt,
  generateRandomString,
  generateCode,
  hash,
  verifyHash,
  toBase64,
  fromBase64
};

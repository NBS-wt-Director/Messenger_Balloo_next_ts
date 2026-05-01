/**
 * Генерация аватарок пользователей
 * Восьмиугольник с уникальным цветом и паттерном
 */

const crypto = require('crypto');

/**
 * Генерация цвета на основе ID пользователя
 */
function generateAvatarColor(userId) {
  const hash = crypto.createHash('sha256').update(userId).digest('hex');
  const r = parseInt(hash.substring(0, 2), 16);
  const g = parseInt(hash.substring(2, 4), 16);
  const b = parseInt(hash.substring(4, 6), 16);
  
  // Делаем цвет более ярким (увеличиваем яркость)
  const brightness = 180;
  const r2 = Math.max(r, brightness);
  const g2 = Math.max(g, brightness);
  const b2 = Math.max(b, brightness);
  
  return `rgb(${r2}, ${g2}, ${b2})`;
}

/**
 * Генерация SVG аватара (восьмиугольник)
 */
function generateAvatarSVG(userId, displayName) {
  const color = generateAvatarColor(userId);
  const initials = getInitials(displayName);
  
  // Координаты восьмиугольника
  const octagonPoints = `10,3 70,3 97,30 97,70 70,97 30,97 3,70 3,30`;
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <polygon points="${octagonPoints}" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="50" y="62" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
    </svg>
  `;
  
  return svg;
}

/**
 * Получение инициалов из имени
 */
function getInitials(displayName) {
  if (!displayName) return 'U';
  
  const names = displayName.trim().split(' ');
  if (names.length === 0) return 'U';
  if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
  
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

/**
 * Преобразование SVG в Base64
 */
function svgToBase64(svg) {
  const buffer = Buffer.from(svg);
  return `data:image/svg+xml;base64,${buffer.toString('base64')}`;
}

/**
 * Генерация аватара пользователя
 */
function generateUserAvatar(userId, displayName) {
  const svg = generateAvatarSVG(userId, displayName);
  return svgToBase64(svg);
}

/**
 * Обновление истории аватарок (хранить 10 последних)
 */
function updateAvatarHistory(avatarHistory, newAvatar) {
  const history = JSON.parse(avatarHistory || '[]');
  
  // Добавляем новую аватарку в начало
  history.unshift(newAvatar);
  
  // Оставляем только 10 последних
  return JSON.stringify(history.slice(0, 10));
}

/**
 * Получение аватара (с фоллбеком на генерацию)
 */
function getAvatar(userId, displayName, existingAvatar) {
  if (existingAvatar) return existingAvatar;
  return generateUserAvatar(userId, displayName);
}

module.exports = {
  generateUserAvatar,
  updateAvatarHistory,
  getAvatar,
  getInitials,
  generateAvatarColor
};

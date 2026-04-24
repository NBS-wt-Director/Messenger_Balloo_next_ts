/**
 * Создание заглушек для изображений
 * Запускается: node scripts/create-image-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Цвета для градиента (Россия: белый-синий-красный)
const COLORS = {
  red: '#dc2626',
  white: '#ffffff',
  blue: '#0039a6',
  primary: '#3b82f6'
};

// SVG шаблоны
const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.red};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${COLORS.white};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.blue};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#grad)"/>
  <text x="200" y="240" font-family="Arial, sans-serif" font-size="120" font-weight="bold" fill="${COLORS.blue}" text-anchor="middle">B</text>
  <text x="200" y="340" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="${COLORS.blue}" text-anchor="middle">Balloo</text>
</svg>
`;

const MASCOT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${COLORS.blue};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${COLORS.primary};stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#grad2)"/>
  <circle cx="70" cy="80" r="15" fill="white"/>
  <circle cx="130" cy="80" r="15" fill="white"/>
  <circle cx="70" cy="80" r="5" fill="${COLORS.blue}"/>
  <circle cx="130" cy="80" r="5" fill="${COLORS.blue}"/>
  <path d="M 70 120 Q 100 150 130 120" stroke="white" stroke-width="8" fill="none" stroke-linecap="round"/>
</svg>
`;

const ICON_SVG = (size, text) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="20" fill="${COLORS.primary}"/>
  <text x="${size/2}" y="${size/2}" font-family="Arial, sans-serif" font-size="${size/3}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>
`;

const BADGE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
  <rect width="72" height="72" rx="12" fill="${COLORS.red}"/>
  <text x="36" y="45" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">🔔</text>
</svg>
`;

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Создана папка: ${dirPath}`);
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log(`✅ Создан файл: ${filePath}`);
}

function main() {
  console.log('🎨 Создание заглушек для изображений...\n');

  const publicDir = path.join(__dirname, '..', 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const qrDir = path.join(publicDir, 'qr');
  const avatarsDir = path.join(publicDir, 'avatars');

  // Создать папки
  createDirectory(publicDir);
  createDirectory(iconsDir);
  createDirectory(qrDir);
  createDirectory(avatarsDir);

  // Основные изображения
  console.log('\n📌 Основные изображения:');
  writeFile(path.join(publicDir, 'logo.svg'), LOGO_SVG);
  writeFile(path.join(publicDir, 'mascot.svg'), MASCOT_SVG);

  // PWA иконки
  console.log('\n📱 PWA иконки:');
  const icons = [
    { size: 72, text: '72' },
    { size: 96, text: '96' },
    { size: 128, text: '128' },
    { size: 144, text: '144' },
    { size: 152, text: '152' },
    { size: 192, text: '192' },
    { size: 384, text: '384' },
    { size: 512, text: '512' }
  ];

  icons.forEach(({ size, text }) => {
    writeFile(path.join(iconsDir, `icon-${size}x${size}.svg'), ICON_SVG(size, text));
  });

  // Badge для уведомлений
  console.log('\n🔔 Уведомления:');
  writeFile(path.join(iconsDir, 'badge-72x72.svg'), BADGE_SVG);

  // QR-код (заглушка)
  console.log('\n📷 QR-код:');
  const qrSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">' +
    '<rect width="300" height="300" fill="white"/>' +
    '<rect x="20" y="20" width="80" height="80" fill="black"/>' +
    '<rect x="200" y="20" width="80" height="80" fill="black"/>' +
    '<rect x="20" y="200" width="80" height="80" fill="black"/>' +
    '<text x="150" y="280" font-family="Arial" font-size="14" fill="#666" text-anchor="middle">QR-код для СБП</text>' +
    '<text x="150" y="160" font-family="Arial" font-size="12" fill="#999" text-anchor="middle">8 (912) 202-30-35</text>' +
  '</svg>';
  writeFile(path.join(qrDir, 'support-qr.svg'), qrSvg);

  // Аватар разработчика
  console.log('\n👤 Аватары:');
  const avatarSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
    '<circle cx="100" cy="100" r="90" fill="' + COLORS.primary + '"/>' +
    '<circle cx="100" cy="80" r="40" fill="white"/>' +
    '<path d="M 20 180 Q 100 100 180 180" fill="white"/>' +
    '<text x="100" y="195" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Иван О.</text>' +
  '</svg>';
  writeFile(path.join(avatarsDir, 'developer.svg'), avatarSvg);

  console.log('\n✅ Готово! Созданы SVG-заглушки для всех изображений.');
  console.log('\n💡 Совет: Замените SVG на PNG для продакшена:');
  console.log('   - Откройте SVG в Figma/Canva');
  console.log('   - Экспортируйте как PNG нужных размеров');
  console.log('   - Замените файлы в public/');
}

main();

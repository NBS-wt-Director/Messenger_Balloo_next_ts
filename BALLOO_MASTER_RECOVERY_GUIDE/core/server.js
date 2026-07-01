/**
 * BALLOO_MASTER_RECOVERY_GUIDE Core Server v5.0
 * Рендер данных на лету без кеширования
 * 
 * Запуск: node core/server.js
 * URL: http://localhost:3440
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3440;
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const STATIC_DIR = path.join(ROOT, 'static');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * Загрузка JSON данных из data/{section}/main.json
 * Без кеширования — каждый раз читаем с диска
 */
function loadData(section) {
  try {
    const dataPath = path.join(DATA_DIR, section, 'main.json');
    if (!fs.existsSync(dataPath)) {
      // Пробуем загрузить из подраздела
      const subPath = path.join(DATA_DIR, section + '.json');
      if (fs.existsSync(subPath)) {
        return JSON.parse(fs.readFileSync(subPath, 'utf-8'));
      }
      return null;
    }
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (e) {
    console.error(`❌ Ошибка загрузки ${section}:`, e.message);
    return null;
  }
}

/**
 * Рендер HTML страницы
 */
function renderHTML(section, data) {
  const templatePath = path.join(STATIC_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    return '<h1>❌ Template not found</h1>';
  }
  
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // Внедряем данные в HTML
  html = html.replace(
    '<!-- DATA_INJECTION -->',
    `<script>window.SECTION_DATA = ${JSON.stringify(data)}; window.SECTION_ID = "${section}";</script>`
  );
  
  return html;
}

/**
 * Обработка запросов
 */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${pathname}`);
  
  // Запрет кеширования
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  
  // API: загрузка данных раздела
  if (pathname.startsWith('/api/data/')) {
    const section = pathname.replace('/api/data/', '');
    const data = loadData(section);
    
    if (data === null) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Section "${section}" not found` }));
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }
  
  // API: список всех разделов
  if (pathname === '/api/sections') {
    try {
      const sections = fs.readdirSync(DATA_DIR)
        .filter(item => {
          const itemPath = path.join(DATA_DIR, item);
          return fs.statSync(itemPath).isDirectory();
        })
        .map(section => {
          const data = loadData(section);
          return {
            id: section,
            title: data?.title || section,
            version: data?.version || '1.0',
            hasSubsections: data?.subsections?.length > 0
          };
        });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sections));
      return;
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
      return;
    }
  }
  
  // Статические файлы
  let filePath = path.join(STATIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Проверка существования файла
  if (!fs.existsSync(filePath)) {
    // Пробуем как директорию с index.html
    filePath = path.join(filePath, 'index.html');
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('<h1>❌ 404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end(`<h1>❌ 500 Error</h1><p>${err.message}</p>`);
      }
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  🎈 BALLOO_MASTER_RECOVERY_GUIDE Core Server v5.0       ║
║  Рендер данных на лету (без кеширования)                ║
╠══════════════════════════════════════════════════════════╣
║  URL: http://localhost:${PORT}                            ║
║  Data: ${DATA_DIR.padEnd(45)}║
║  Static: ${STATIC_DIR.padEnd(44)}║
╠══════════════════════════════════════════════════════════╣
║  API Endpoints:                                          ║
║  GET /api/sections     — список разделов                ║
║  GET /api/data/{id}    — данные раздела                 ║
╚══════════════════════════════════════════════════════════╝
  `);
});

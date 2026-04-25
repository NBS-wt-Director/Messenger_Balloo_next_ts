# 💻 Balloo Desktop

**Electron приложение для Windows, macOS и Linux**

---

## 📑 Содержание

1. [Обзор](#обзор)
2. [Быстрый Старт](#быстрый-старт)
3. [Структура](#структура)
4. [Фичи](#фичи)
5. [Сборка](#сборка)
6. [Деплой](#деплой)

---

## Обзор

Desktop приложение Balloo на Electron для кроссплатформенной работы.

### Статус: 🚧 В разработке (40%)

---

## Быстрый Старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить разработку
npm run dev
```

---

## Структура

```
desktop/
├── electron/            # Electron main process
│   ├── main.js          # Main entry point
│   ├── preload.js       # Preload script
│   └── tray.js          # System tray
├── renderer/            # React приложение
│   └── src/
├── assets/              # Icons, resources
└── package.json
```

---

## Фичи

### Готово ✅

- [x] Базовый Electron app
- [x] System tray
- [x] Auto-update ready

### В разработке 🚧

- [ ] Full UI integration
- [ ] Native notifications
- [ ] Global shortcuts

### План 📋

- [ ] Offline mode
- [ ] File associations
- [ ] Auto-start on login

---

## Сборка

### Windows

```bash
npm run build:win
# dist/Balloo Setup x.x.x.exe
```

### macOS

```bash
npm run build:mac
# dist/Balloo-x.x.x.dmg
```

### Linux

```bash
npm run build:linux
# dist/*.AppImage, .deb, .rpm
```

---

## Деплой

### GitHub Releases

```bash
# Build для всех платформ
npm run build:win
npm run build:mac
npm run build:linux

# Upload
gh release upload v1.0.0 \
  dist/Balloo-Setup-1.0.0.exe \
  dist/Balloo-1.0.0.dmg \
  dist/Balloo-1.0.0.AppImage
```

### Microsoft Store

```bash
# Build MSIX
npm run build:win -- --publish always
```

### Mac App Store

```bash
# Prepare for MAS
npm run build:mas
```

---

## Конфигурация

**package.json (electron-builder):**
```json
{
  "build": {
    "appId": "ru.balloo.app",
    "win": {
      "target": ["nsis"],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": ["dmg"],
      "icon": "assets/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb", "rpm"],
      "icon": "assets/icon.png"
    }
  }
}
```

---

**Balloo Desktop - Рабочий стол под контролем!** 💻

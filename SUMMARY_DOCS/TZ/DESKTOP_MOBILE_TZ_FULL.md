# 📋 Техническое задание: Desktop & Mobile Applications

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** Balloo Cross-Platform Applications  
**Версия:** 1.0.0  
**Технологии:** Electron (desktop), React Native (mobile)  
**Общий бэкенд:** API Server (PostgreSQL)  

## 2. DESKTOP APPLICATIONS (Windows/Linux/macOS)

### 2.1 Стек
- **Framework:** Electron 28+
- **UI:** React 19 + Tailwind CSS
- **State:** Zustand
- **Build:** electron-builder
- **Language:** TypeScript

### 2.2 Структура
```
desktop/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.js
│   │   ├── api.js
│   │   └── updater.js
│   └── renderer/       # React app (share with web)
│       ├── App.tsx
│       ├── components/
│       └── hooks/
├── public/
├── electron-builder.yml
└── package.json
```

### 2.3 Функционал
- Полная функциональность messenger
- Native notifications
- System tray integration
- Auto-update (GitHub Releases/S3)
- Keychain encryption (local storage)
- Offline mode (local cache)
- File system access
- Print support

### 2.4 Electron Main Process
```javascript
// src/main/index.js
const { app, BrowserWindow, Tray, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  
  mainWindow.loadURL('http://localhost:3000'); // или production build
}

// System Tray
function createTray() {
  tray = new Tray('/path/to/icon.png');
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setToolTip('Balloo Messenger');
  tray.setContextMenu(contextMenu);
}

// Auto-updater
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();
```

### 2.5 Package.json (electron-builder)
```json
{
  "build": {
    "appId": "com.balloo.messenger",
    "productName": "Balloo Messenger",
    "directories": {
      "output": "dist_electron"
    },
    "win": {
      "target": ["nsis", "portable"],
      "icon": "build/icon.ico"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "build/icon.icns",
      "category": "public.app-category.messaging"
    }
  }
}
```

## 3. MOBILE APPLICATIONS (iOS/Android)

### 3.1 Стек
- **Framework:** React Native 0.73+
- **UI:** React Native Elements / NativeBase
- **Navigation:** React Navigation 6
- **State:** Zustand
- **Language:** TypeScript

### 3.2 Структура
```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── ChatListScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── store/
│   ├── api/
│   └── utils/
├── android/
├── ios/
└── package.json
```

### 3.3 Навигация
```typescript
// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Chats" component={ChatListScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### 3.4 Функционал
- Push notifications (FCM/APNs)
- Camera access (photos/videos)
- Gallery access
- Contact sync (опционально)
- Biometric auth (FaceID/TouchID)
- Offline mode (SQLite)
- Voice messages
- Video calls (WebRTC)

### 3.5 Push Notifications
```typescript
// utils/pushNotifications.ts
import messaging from '@react-native-firebase/messaging';

async function requestPermissions() {
  const authStatus = await messaging.requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
}

async function getDeviceToken() {
  const token = await messaging.getToken();
  return token;
}

// Subscribe to FCM
async function subscribeToTopic(topic) {
  await messaging().subscribeToTopic(topic);
}
```

## 4. ОБЩИЕ КОМПОНЕНТЫ

### 4.1 Shared Packages
```
packages/
├── core-ui/        # UI компоненты (React + React Native)
├── core-theme/     # Themes system
├── core-types/     # TypeScript типы
└── core-api/       # API client (shared)
```

### 4.2 API Client (Shared)
```typescript
// packages/core-api/src/client.ts
const API_URL = process.env.API_URL || 'http://localhost:3001';

export async function apiRequest(endpoint, options = {}) {
  const token = await getToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  return response.json();
}
```

## 5. ТЕКУЩИЙ СТАТУС

✅ **Реализовано:**
- API endpoints (все платформы)
- Docker infrastructure
- Core packages (theme, UI)

⚠️ **Частично:**
- Desktop (структура проекта)
- Mobile (структура проекта)

❌ **Не реализовано:**
- Full desktop app (Electron)
- Full mobile app (React Native)
- Push notifications
- Offline mode
- Biometric auth
- Voice/Video calls

---

**Дата создания:** 2026-06-23  
**Версия документа:** 1.0

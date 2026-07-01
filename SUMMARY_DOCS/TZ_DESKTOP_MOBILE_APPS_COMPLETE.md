# ТЕХНИЧЕСКОЕ ЗАДАНИЕ: DESKTOP & MOBILE APPS

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название:** Balloo Multi-Platform Apps  
**Версия:** 1.0.0  
**Стек:** Различные для каждой платформы  
**Общее:** API URL, WebSocket, E2E шифрование

## 2. DESKTOP APPS

### 2.1 Windows App

**Технология:** Electron + React  
**Порт:** 3003  
**Дистрибутив:** .exe installer

#### 2.1.1 Структура
```
desktop/
├── electron/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script
│   └── icons/               # Иконки
├── src/
│   ├── app/                 # React app (как messenger)
│   └── components/          # Компоненты
├── package.json
└── electron-builder.json
```

#### 2.1.2 Electron Main Process
**Файл:** `electron/main.js`

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:3000'); // Next.js dev
  // В production: mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers
ipcMain.handle('get-platform', () => process.platform);
ipcMain.handle('get-version', () => app.getVersion());
```

#### 2.1.3 Preload Script
**Файл:** `electron/preload.js`

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  getVersion: () => ipcRenderer.invoke('get-version'),
  // Дополнительные API
});
```

#### 2.1.4 UI Компоненты
- **Layout:** идентичен messenger
- **Дополнительно:**
  - System Tray icon
  - Auto-update check
  - Native notifications
  - File system access (для загрузки файлов)

#### 2.1.5 Build Configuration
**Файл:** `electron-builder.json`

```json
{
  "appId": "com.balloo.desktop",
  "productName": "Balloo Desktop",
  "directories": {
    "output": "dist"
  },
  "win": {
    "target": ["nsis"],
    "icon": "build/icons/256x256.png"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true
  }
}
```

### 2.2 macOS App

**Технология:** Electron + React  
**Дистрибутив:** .dmg

#### 2.2.1 Отличия от Windows
- **Icon:** .icns формат
- **Code Signing:** требуется
- **Notarization:** требуется
- **Auto-update:** Sparkle framework

#### 2.2.2 Build Configuration
```json
{
  "mac": {
    "category": "public.app-category.messaging",
    "target": ["dmg", "zip"],
    "icon": "build/icons/1024x1024.png",
    "hardenedRuntime": true,
    "gatekeeperAssess": false
  }
}
```

### 2.3 Linux App

**Технология:** Electron + React  
**Дистрибутив:** .deb, .rpm, AppImage

#### 2.3.1 Отличия
- **Icon:** .png форматы
- **Packages:** deb (Ubuntu/Debian), rpm (Fedora/RHEL)
- **AppImage:** portable версия

#### 2.3.2 Build Configuration
```json
{
  "linux": {
    "target": ["deb", "rpm", "AppImage"],
    "icon": "build/icons/",
    "category": "Network"
  }
}
```

## 3. MOBILE APPS

### 3.1 iOS App

**Технология:** React Native  
**Язык:** Swift (native modules)  
**Дистрибутив:** TestFlight, App Store

#### 3.1.1 Структура
```
mobile/ios/
├── Balloo/                  # Xcode project
│   ├── AppDelegate.swift
│   ├── Info.plist
│   └── Images.xcassets
├── Balloo.xcodeproj
├── Balloo.xcworkspace
└── Podfile
```

#### 3.1.2 AppDelegate
**Файл:** `mobile/ios/Balloo/AppDelegate.swift`

```swift
import UIKit
import React
import React_RCTAppDelegate

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication,
                          didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    self.moduleName = "Balloo"
    self.packageName = "com.balloo.mobile"
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

#### 3.1.3 UI Компоненты
- **Layout:** идентичен messenger
- **Native features:**
  - Push notifications (APNs)
  - Biometric auth (Face ID/Touch ID)
  - Camera access
  - Photo library access
  - Contacts access

#### 3.1.4 Info.plist
```xml
<key>NSCameraUsageDescription</key>
<string>Balloo needs access to your camera to take photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Balloo needs access to your photo library</string>
<key>NSMicrophoneUsageDescription</key>
<string>Balloo needs access to your microphone for calls</string>
<key>NSContactsUsageDescription</key>
<string>Balloo needs access to your contacts to find friends</string>
```

### 3.2 Android App

**Технология:** React Native  
**Язык:** Kotlin (native modules)  
**Дистрибутив:** Google Play, APK

#### 3.2.1 Структура
```
mobile/android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/balloo/
│   │   │   ├── MainActivity.kt
│   │   │   └── MainApplication.kt
│   │   └── res/
│   ├── build.gradle
│   └── proguard-rules.pro
└── gradle/
```

#### 3.2.2 MainActivity
**Файл:** `mobile/android/app/src/main/java/com/balloo/MainActivity.kt`

```kotlin
package com.balloo

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
  }

  override fun getMainComponentName(): String = "Balloo"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

#### 3.2.3 UI Компоненты
- **Layout:** идентичен messenger
- **Native features:**
  - Push notifications (FCM)
  - Biometric auth (Fingerprint)
  - Camera access
  - Photo library access
  - Contacts access

#### 3.2.4 AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />
```

## 4. ОБЩИЕ КОМПОНЕНТЫ

### 4.1 Библиотека общих компонентов
```
shared/
├── src/
│   ├── api/                 # API клиент
│   ├── crypto/              # E2E шифрование
│   ├── components/          # UI компоненты
│   ├── hooks/               # React hooks
│   ├── stores/              # Zustand stores
│   └── types/               # TypeScript типы
├── package.json
└── tsconfig.json
```

### 4.2 API Клиент
**Файл:** `shared/src/api/client.ts`

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor для добавления токена
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
```

### 4.3 E2E Шифрование
**Файл:** `shared/src/crypto/index.ts`

```typescript
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

// Генерация ключей
export function generateKeys() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    privateKey: naclUtil.encodeBase64(keyPair.secretKey)
  };
}

// Шифрование
export function encrypt(message: string, recipientPublicKey: string): string {
  const messageUint8 = naclUtil.decodeUTF8(message);
  const recipientPubKey = naclUtil.decodeBase64(recipientPublicKey);
  const nonce = nacl.randomBytes(24);
  
  const encrypted = nacl.box(messageUint8, nonce, recipientPubKey, keyPair.secretKey);
  
  return naclUtil.encodeBase64(
    new Uint8Array([...nonce, ...encrypted])
  );
}

// Расшифровка
export function decrypt(encryptedMessage: string, senderPublicKey: string): string {
  const messageUint8 = naclUtil.decodeBase64(encryptedMessage);
  const nonce = messageUint8.slice(0, 24);
  const message = messageUint8.slice(24);
  const senderPubKey = naclUtil.decodeBase64(senderPublicKey);
  
  const decrypted = nacl.box.open(message, nonce, senderPubKey, keyPair.secretKey);
  
  return naclUtil.decodeUTF8(decrypted);
}
```

### 4.4 UI Компоненты (кроссплатформенные)

#### 4.4.1 Button
**Файл:** `shared/src/components/Button.tsx`

```typescript
import React from 'react';

interface ButtonProps {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false
}) => {
  const baseStyles = {
    padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
    borderRadius: '8px',
    fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1
  };

  const variantStyles = {
    primary: { backgroundColor: '#4F46E5', color: '#FFFFFF' },
    secondary: { backgroundColor: '#E5E7EB', color: '#1F2937' },
    danger: { backgroundColor: '#EF4444', color: '#FFFFFF' }
  };

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      style={{ ...baseStyles, ...variantStyles[variant] }}
    >
      {text}
    </button>
  );
};
```

## 5. АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ

### 5.1 Desktop (Electron)
- **Library:** electron-updater
- **Server:** GitHub Releases / S3
- **Interval:** при запуске
- **User Control:** показать уведомление

### 5.2 Mobile
- **iOS:** TestFlight (beta), App Store (release)
- **Android:** Google Play / APK download
- **Auto:** через store update mechanism

## 6. PUSH УВЕДОМЛЕНИЯ

### 6.1 iOS (APNs)
- **Library:** react-native-push-notification
- **Certificate:** .p12
- **Payload:** { title, body, data }

### 6.2 Android (FCM)
- **Library:** react-native-push-notification
- **Server Key:** из Firebase Console
- **Payload:** { title, body, data }

### 6.3 Desktop (Web)
- **Library:** web-push
- **VAPID Keys:** из переменной окружения
- **Subscription:** хранится на сервере

## 7. СБОРКА И ДЕПЛОЙ

### 7.1 Desktop
```bash
# Build
npm run build:electron

# Package
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

### 7.2 Mobile
```bash
# iOS
cd mobile/ios
pod install
xcodebuild -workspace Balloo.xcworkspace -scheme Balloo -configuration Release

# Android
cd mobile/android
./gradlew assembleRelease
```

## 8. ТЕСТИРОВАНИЕ

### 8.1 Desktop
- **Jest:** unit tests
- **Playwright:** E2E tests
- **Electron:** native tests

### 8.2 Mobile
- **Jest:** unit tests
- **Detox:** E2E tests
- **Fastlane:** CI/CD

---

**Статус:** ⚠️ Требуется реализация для каждой платформы  
**Последнее обновление:** 2026-06-23

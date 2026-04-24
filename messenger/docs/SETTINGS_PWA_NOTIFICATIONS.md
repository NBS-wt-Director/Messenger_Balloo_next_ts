# ⚙️ PWA и Уведомления - Настройки Balloo Messenger

## Дата: 2024

---

## ✅ Выполненные Изменения

### 1. 📱 PWA (Progressive Web App)

#### Функционал:
- ✅ **Проверка установки** - определяет, установлено ли приложение
- ✅ **Проверка возможности установки** - показывает кнопку "Установить"
- ✅ **Установка приложения** - кнопка запускает beforeinstallprompt
- ✅ **Статусы:**
  - 🟢 Установлено
  - 🔵 Доступна установка
  - 🟡 Недоступно (инфо)

#### Реализация:

```typescript
interface PWAStatus {
  isInstalled: boolean;      // Установлено ли
  isInstallable: boolean;    // Можно ли установить
  deferredPrompt: any;       // Событие для установки
}
```

#### Проверка установки:
```typescript
const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
```

#### Установка:
```typescript
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  setPwaStatus({ isInstallable: true, deferredPrompt: e });
});

const handleInstallPWA = async () => {
  pwaStatus.deferredPrompt.prompt();
  const { outcome } = await pwaStatus.deferredPrompt.userChoice;
  // outcome === 'accepted' | 'dismissed'
};
```

---

### 2. 🔔 Уведомления

#### Функционал:
- ✅ **Вкл/Выкл уведомлений** - главный переключатель
- ✅ **Проверка разрешения** - granted/denied/default
- ✅ **Запрос разрешения** - кнопка "Разрешить"
- ✅ **Дополнительные настройки:**
  - Звук
  - Вибрация
  - Desktop уведомления

#### Реализация:

```typescript
interface NotificationSettings {
  enabled: boolean;          // Включены ли
  permission: 'granted' | 'denied' | 'default';
  sound: boolean;           // Звук
  vibrate: boolean;         // Вибрация
  desktop: boolean;         // Desktop
}
```

#### Проверка разрешения:
```typescript
const checkNotificationPermission = () => {
  if ('Notification' in window) {
    const permission = Notification.permission;
    setNotificationSettings({ ...prev, permission, enabled: permission === 'granted' });
  }
};
```

#### Запрос разрешения:
```typescript
const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  setNotificationSettings({ ...prev, permission, enabled: permission === 'granted' });
};
```

---

## 🎨 UI Компоненты

### 1. Секция Уведомлений

```tsx
<section className="settings-section">
  <div className="settings-section-header">
    {enabled ? <BellRing /> : <BellOff />}
    <h2>Уведомления</h2>
  </div>
  
  {/* Главный переключатель */}
  <div className="settings-row-toggle">
    <div className="settings-toggle-info">
      <span>Уведомления</span>
      <span className="settings-desc">
        {enabled ? 'Включены' : 'Выключены'}
      </span>
    </div>
    <label className="settings-toggle">
      <input type="checkbox" checked={enabled} onChange={toggleNotifications} />
      <span className="settings-toggle-switch" />
    </label>
  </div>

  {/* Статус разрешения */}
  <div className="settings-notification-status">
    <div className="status-indicator">
      {permission === 'granted' && <Check className="status-success" />}
      {permission === 'denied' && <X className="status-error" />}
      {permission === 'default' && <Bell className="status-warning" />}
      <span>{statusText}</span>
    </div>
    {permission !== 'granted' && (
      <button onClick={requestNotificationPermission}>Разрешить</button>
    )}
  </div>

  {/* Дополнительные настройки */}
  <div className="settings-notification-options">
    <label className="settings-toggle">
      <input checked={sound} onChange={...} disabled={!enabled} />
      <span>Звук</span>
    </label>
    <label className="settings-toggle">
      <input checked={vibrate} onChange={...} disabled={!enabled} />
      <span>Вибрация</span>
    </label>
    <label className="settings-toggle">
      <input checked={desktop} onChange={...} disabled={!enabled} />
      <span>Desktop уведомления</span>
    </label>
  </div>
</section>
```

### 2. Секция PWA

```tsx
<section className="settings-section">
  <div className="settings-section-header">
    <Smartphone size={20} />
    <h2>Приложение</h2>
  </div>

  {isInstalled ? (
    <div className="pwa-status-item">
      <Check className="status-success" />
      <span>Приложение установлено</span>
    </div>
  ) : isInstallable ? (
    <div className="pwa-status-item">
      <Download className="status-info" />
      <span>Доступна установка</span>
      <button onClick={handleInstallPWA}>Установить</button>
    </div>
  ) : (
    <div className="pwa-status-item">
      <Smartphone className="status-warning" />
      <span>PWA доступно</span>
    </div>
  )}

  <div className="settings-pwa-info">
    <h3>Преимущества приложения:</h3>
    <ul className="pwa-features">
      <li>⚡ Быстрый запуск</li>
      <li>📱 Работает офлайн</li>
      <li>🔔 Push-уведомления</li>
      <li>💾 Меньше расход памяти</li>
      <li>🔄 Автообновление</li>
    </ul>
  </div>
</section>
```

---

## 📁 Изменённые Файлы

### Обновлённые:
1. `src/app/settings/page.tsx` - Добавлены PWA и уведомления
2. `src/app/settings/settings.css` - Стили для новых компонентов

### Созданные:
3. `docs/SETTINGS_PWA_NOTIFICATIONS.md` - Этот документ

---

## 🎨 CSS Стили

### Статусы:
```css
.status-success { color: #10b981; }  /* Зелёный */
.status-error { color: #ef4444; }    /* Красный */
.status-warning { color: #f59e0b; }  /* Жёлтый */
.status-info { color: #3b82f6; }     /* Синий */
```

### Переключатель:
```css
.settings-toggle input:checked + .settings-toggle-switch {
  background: var(--primary);
  border-color: var(--primary);
}

.settings-toggle input:disabled + .settings-toggle-switch {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### PWA Кнопки:
```css
.settings-btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  transition: all 0.2s;
}

.settings-btn-primary:hover {
  transform: translateY(-1px);
}
```

---

## 🔧 API Browser

### Notification API:
```javascript
// Проверка поддержки
'Notification' in window

// Запрос разрешения
Notification.requestPermission()
  .then(permission => {
    // 'granted' | 'denied' | 'default'
  });

// Создание уведомления
new Notification('Заголовок', {
  body: 'Текст',
  icon: '/icon.png'
});
```

### BeforeInstallPrompt:
```javascript
// Слушаем событие
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Сохраняем событие
  deferredPrompt = e;
});

// Запускаем установку
deferredPrompt.prompt();
```

---

## ✅ Результат

### Страница Настроек:
- ✅ **PWA:**
  - Проверка установки
  - Кнопка установки (если доступно)
  - Статус установки
  - Список преимуществ

- ✅ **Уведомления:**
  - Главный переключатель
  - Статус разрешения (3 состояния)
  - Кнопка "Разрешить"
  - Звук (вкл/выкл)
  - Вибрация (вкл/выкл)
  - Desktop уведомления (вкл/выкл)

### UX:
- ✅ Автоматическая проверка при загрузке
- ✅ Блокировка настроек при выключенных уведомлениях
- ✅ Визуальные индикаторы статусов
- ✅ Понятные описания состояний

---

## 🚀 Следующие Шаги

1. **Добавить manifest.json** для PWA
2. **Service Worker** для офлайн работы
3. **Push API** для push-уведомлений
4. **Интеграция с уведомлениями чатов**

**Готово!** 🎉

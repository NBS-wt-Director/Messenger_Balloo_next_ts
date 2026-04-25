# 📸 Изображения Balloo Messenger

Все изображения, которые вы добавляете в проект, кладите в корень проекта: **`/media/`**

## 🖼️ Основные Изображения

### 1. Логотип
- **Файл:** `media/logo.jpg`
- **Используется в:** Header, Footer
- **Доступ по пути:** `/logo.jpg`

### 2. Маскот (Персонаж)
- **Файл:** `media/mascot.png`
- **Используется в:** 
  - Бургер меню
  - Favicon (автоматически копируется)
  - PWA иконки
- **Доступ по пути:** `/mascot.png`
- **Favicon:** `/favicon.ico`

### 3. Компания
- **Файл:** `media/company_logo.jpg`
- **Используется в:** Раздел "О компании"
- **Доступ по пути:** `/company_logo.jpg`

### 4. QR-код для оплаты
- **Файл:** `media/qr_helpus.jpg`
- **Используется в:** Страница поддержки
- **Доступ по пути:** `/qr_helpus.jpg`

---

## 📝 Правила

1. **Все новые изображения** → в `/media/`
2. **Автоматическая копировка** → скрипт может копировать из `/media/` в `/public/`
3. **В коде используем** → пути начиная с `/` (например, `/logo.jpg`)

---

## 🔧 Технические Детали

### Автозагрузка Favicon
```html
<link rel="icon" href="/favicon.ico" />
<link rel="shortcut icon" href="/favicon.ico" />
```

### PWA Manifest
```json
{
  "icons": [
    {
      "src": "/mascot.png",
      "sizes": "any",
      "type": "image/png"
    }
  ]
}
```

### Header Logo
```tsx
<Logo src="/logo.jpg" alt="Balloo Messenger" size="md" />
```

### Burger Menu
```tsx
<BurgerMenu mascotSrc="/mascot.png" mascotAlt="Balloo Mascot" size="md" />
```

---

## ✅ Статус Изображений

| Файл | Путь | Статус |
|------|------|--------|
| logo.jpg | `/logo.jpg` | ✅ Подключён |
| mascot.png | `/mascot.png` | ✅ Подключён |
| favicon.ico | `/favicon.ico` | ✅ Подключён |
| company_logo.jpg | `/company_logo.jpg` | ✅ Готов к использованию |
| qr_helpus.jpg | `/qr_helpus.jpg` | ✅ Готов к использованию |

---

## 🚀 Следующие Шаги

1. **QR-код для оплаты** - использовать на странице `/support`
2. **Компания логотип** - использовать на странице `/about-company`
3. **Добавить новые изображения** - просто положите в `/media/` и используйте путь `/имя_файла.расширение`

# Balloo Platform — Полный обзор экранов, функций и структур данных

**Дата создания:** 25.06.2026  
**Последнее обновление:** 2026-06-27  
**Платформа:** Balloo Platform  
**Владелец:** NBS — web-tech  
**Версия:** 3.5 (canonical migration completed)  
**Тип документа:** Архитектурное описание, НЕ исходный код

> ⚠️ **Позиционирование:** Этот документ — архитектурное описание платформы, описывающее как работает, структурирована и видится платформа:
> - **V1 (start-release)** — стартовый релиз мессенджера
> - **V2 (OneYersPlatformRelease)** — полная платформа с Premium, AI, маркетплейсом
>
> Это НЕ recovery-гайд и НЕ исходный код. Все фрагменты кода — архитектурные заглушки для иллюстрации концепции.  

---

## Структура проекта

```
BALLOO_MASTER_RECOVERY_GUIDE/
├── RULES/                          ← Правовые документы V1
│   ├── privacy_policy.md           ← Политика ПДн (RF 152-FZ, RB 76-Z, India DPDP, China PIPL)
│   └── terms_of_service.md         ← Пользовательское соглашение
├── mockups/                        ← Макеты V1 (базовая версия)
│   ├── home_screen.html            ← Главный экран: список чатов
│   ├── chat_list.html              ← Список чатов / просмотр чата
│   ├── attachments.html            ← Просмотр всех вложений
│   ├── auth_screen.html            ← Авторизация/Регистрация
│   ├── downloads.html              ← Загрузки
│   ├── about_balloo.html           ← О Balloo
│   ├── about_company.html          ← О компании NBS
│   ├── features.html               ← Функции V1
│   ├── support_project.html        ← Поддержать проект
│   ├── terms.html                  ← Пользовательское соглашение
│   ├── privacy.html                ← Политика конфиденциальности
│   ├── support.html                ← Служба поддержки
│   ├── version_history.html        ← История версий
│   ├── settings_screen.html        ← Настройки
│   ├── error_404.html              ← 404
│   └── contact_card.html           ← Визитка контакта
├── V2_ENHANCEMENTS/                ← Макеты и документы V2 (улучшения)
│   ├── README.md                   ← Руководство по V2
│   ├── documents/
│   │   ├── v2_features.md          ← Функции V2
│   │   ├── v2_privacy_addendum.md  ← Дополнение к Политике ПДн
│   │   └── v2_terms_addendum.md    ← Дополнение к Соглашению
│   └── mockups/
│       ├── home_screen_v2.html     ← Главный экран V2 (активные кнопки)
│       ├── balonishka.html         ← Балунишка Борис
│       ├── marketplace.html        ← Рынок
│       ├── ai_chat.html            ← AI-ассистент
│       └── wallet.html             ← Кошелёк
└── features_sql.sql                ← SQL предзаполнение V1 + V2
```

---

## ГЛАВНАЯ НАВИГАЦИЯ (v3.5)

### Layout-структура (Desktop 1440px)

```
┌────────────────────────────────────────────────────────────────────┐
│ Header: 72px, full width                                         │
│ ┌──────┬──────────────────────────────────────┬──────────────────┐ │
│ │ 🐻   │   Balloo [🔍 Поиск...]               │  [🌐] 👤 ▼      │ │
│ │ Маскот│                                      │                  │ │
│ │ 40px │   Заголовок страницы                 │  🌐=Язык  👤=Профиль│ │
│ └──────┴──────────────────────────────────────┴──────────────────┘ │
├──────────┬─────────────────────────────────────────────────────────┤
│ Sidebar  │  Main Content                                         │
│ 260px    │  padding 24px                                         │
│          │                                                       │
│ СКРЫТО   │  (по умолчанию sidebar скрыт)                        │
│          │                                                       │
│ Вызывается│  ─── Разные страницы ────────────────────────────    │
│ по кнопке │                                                       │
│ 🐻 Маскот │                                                       │
│          │                                                       │
│ ──────────│  Пример: /chats — список чатов                      │
│ МЕСЕНДЖЕР │  Пример: /settings — настройки                      │
│ 💬 Чаты    │  Пример: /features — голосования                   │
│ 📞 Звонки  │                                                       │
│ ⭐ Избранное│                                                      │
│ 📁 Архив   │                                                       │
│          │  Пример: /profile — профиль                          │
│ ОБНАРУЖИТЬ│  Пример: /admin — админка                           │
│ 🏪 Рынок   │                                                       │
│ 🐻 Балунишка│                                                      │
│ 📰 Новости │                                                       │
│          │  Пример: /support — поддержка                        │
│ ПОДДЕРЖКА │  Пример: /downloads — загрузки                       │
│ 📞 Поддержка│                                                      │
│ ❤️ Поддержать│                                                      │
│ 📜 История│                                                       │
│          │  Пример: landing — главная страница                   │
│ СКАЧАТЬ   │                                                       │
│ ⬇️ Приложение│                                                     │
│ 📂 Файлы   │                                                       │
│          │                                                       │
│ О ПЛАТФОРМЕ│                                                       │
│ ℹ️ О Balloo │                                                       │
│ 🏢 О компании│                                                      │
│ ✨ Функции │                                                       │
│          │                                                       │
│ ПРАВОВАЯ ИНФО│                                                      │
│ 📄 Условия │                                                       │
│ 🔒 Конфиденциальность│                                               │
│          │                                                       │
│ ЭКСТРЕННЫЕ│                                                        │
│ 🚨 МЧС    │                                                        │
│ 👮 Полиция │                                                        │
└──────────┴─────────────────────────────────────────────────────────┘
```

### Ключевые принципы навигации

| Элемент | Расположение | Описание |
|---------|-------------|----------|
| **Левое меню (Sidebar)** | Скрыто по умолчанию | Открывается по клику на 🐻 маскот. Ширина 260px. Overlay + backdrop. |
| **Маскот (BurgerMenu)** | Header, left | Кнопка 🐻 40×40px. Триггер для sidebar. Анимация hover scale. |
| **Переключатель языков** | Header, right | Кнопка 🌐 → dropdown с 12+ языками. Grid 4 колонки. |
| **Переключатель тем** | Header, right (user dropdown) | Внутри dropdown пользователя: 3 темы (dark/light/russia). |
| **Профиль пользователя** | Header, right | Аватар-октагон 36×36px. Dropdown: профиль, настройки, выход. |
| **Левая панель чатов** | ChatList (внутри main) | Отдельно от sidebar. Список чатов с поиском. 300-360px. |

### Зависимости компонентов

```
Header.tsx
├── BurgerMenu.tsx          ← маскот (левый триггер sidebar)
├── ThemeSelector.tsx       ← все темы (кнопка "?")
├── Logo.tsx                ← логотип Balloo
└── Settings (stored)       ← language, theme

ChatList.tsx                ← отдельный компонент, НЕ sidebar
├── SearchBar
├── ChatCard
└── NewChatButton

Sidebar (inline в mockups)  ← скрываемое меню
├── MAIN_MENU_ITEMS         ← /, /downloads, /about-balloo...
├── AUTH_MENU_ITEMS         ← /chats, /settings, /admin, /profile
└── Sections: Messenger, Discover, Support, Download, About, Legal
```

## V1 — Базовая версия

### 1. Главные экраны V1

| Экран | Файл | Описание |
|-------|------|----------|
| **Чаты** | `mockups/home_screen.html` | Список чатов (ГЛАВНЫЙ экран) |
| Вложения | `mockups/attachments.html` | Все файлы, фото, видео с фильтрами |
| Рынок | `mockups/marketplace.html` | Кнопка неактивная (tooltip: "В разработке V2") |
| Балунишка | `mockups/home_screen.html` | Кнопка неактивная (tooltip: "В разработке V2") |

### 2. Все экраны V1

| Экран | Файл | Описание |
|-------|------|----------|
| Авторизация | `auth_screen.html` | Вход, регистрация, 2FA |
| Чаты | `home_screen.html` | Главный экран: список чатов |
| Чат | `chat_list.html` | Просмотр чата, вложения, темы |
| Вложения | `attachments.html` | Фильтрация по типу, дате |
| Загрузки | `downloads.html` | Скачивание приложений, файлы |
| О Balloo | `about_balloo.html` | Миссия, ценности, версия |
| О компании | `about_company.html` | NBS — web-tech, контакты |
| Функции | `features.html` | Каталог всех функций V1 |
| Поддержать | `support_project.html` | Пожертвования |
| Согласие | `terms.html` | Пользовательское соглашение |
| Конфиденциальность | `privacy.html` | Политика ПДн |
| Поддержка | `support.html` | Тикеты, FAQ, контакты |
| Версии | `version_history.html` | История обновлений |
| Настройки | `settings_screen.html` | Профиль, приватность, темы |
| 404 | `error_404.html` | Страница не найдена |

### 2. Структуры данных

#### User (Пользователь)
```json
{
  "id": "UUID",
  "email": "string",
  "phone": "string|null",
  "username": "string",
  "avatar": "string|null",
  "bio": "string|null",
  "language": "string",
  "theme": "dark|light|russia",
  "created_at": "timestamp",
  "last_active": "timestamp"
}
```

#### Chat (Чат)
```json
{
  "id": "UUID",
  "type": "private|group|channel",
  "name": "string",
  "avatar": "string|null",
  "peer_id": "UUID|null",
  "member_ids": "UUID[]",
  "admin_ids": "UUID[]",
  "is_pinned": "boolean",
  "is_muted": "boolean",
  "is_archived": "boolean",
  "unread_count": "number",
  "last_message": "Message|null",
  "encryption_enabled": "boolean"
}
```

#### Message (Сообщение)
```json
{
  "id": "UUID",
  "chat_id": "UUID",
  "sender_id": "UUID",
  "type": "text|photo|video|file|voice|sticker|location|contact",
  "content": "string",
  "reply_to_id": "UUID|null",
  "forward_from_id": "UUID|null",
  "forward_from_name": "string|null",
  "attachments": "Attachment[]",
  "reactions": "Reaction[]",
  "is_edited": "boolean",
  "is_deleted": "boolean",
  "self_destruct_ttl": "number|null",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Attachment (Вложение)
```json
{
  "id": "UUID",
  "message_id": "UUID",
  "file_type": "photo|video|document|voice|sticker",
  "file_path": "string",
  "file_size": "number",
  "mime_type": "string",
  "thumbnail_path": "string|null",
  "duration": "number|null"
}
```

#### Reaction (Реакция)
```json
{
  "id": "UUID",
  "message_id": "UUID",
  "user_id": "UUID",
  "emoji": "string"
}
```

### 3. Функции V1 (каталог)

| Категория | Функции |
|-----------|---------|
| Auth | login, register, 2fa_totp, 2fa_sms, password_reset, social_yandex, profile, account_delete |
| Messenger | chat_list, private_chat, group_chat, channel, message_send/edit/delete/reply/forward/pin/reaction/search |
| Media | voice_message, video_message, stickers, emoji |
| Calls | voice, video, group_voice, group_video |
| Files | send, download, photo, document, location, contact |
| Security | e2ee, self_destruct, passcode, sessions |
| Settings | profile, privacy, notifications, themes, language, storage, about_balloo, about_company, terms, privacy_policy, support, features |
| Discover | balonishka, marketplace, news |
| Support | create_ticket, ticket_list, faq, feedback, donate, version_history |
| Downloads | app, files |

---

## V2 — План развития (Модернизация)

**Документы:** `V2_ENHANCEMENTS/documents/`  
**Макеты:** `V2_ENHANCEMENTS/mockups/`  

### 1. Главные экраны V2

| Экран | Файл | Описание |
|-------|------|----------|
| **Чаты** | `V2_ENHANCEMENTS/mockups/home_screen_v2.html` | Список чатов + активные кнопки |
| Балунишка | `V2_ENHANCEMENTS/mockups/balonishka.html` | Анимированный маскот Борис |
| Рынок | `V2_ENHANCEMENTS/mockups/marketplace.html` | Маркетплейс товаров |
| AI-чат | `V2_ENHANCEMENTS/mockups/ai_chat.html` | AI-ассистент |
| Кошелёк | `V2_ENHANCEMENTS/mockups/wallet.html` | Платежи и транзакции |

### 2. Функции V2

| Категория | Функции |
|-----------|---------|
| Балунишка | mascot_animation, greeting, suggestions, easter_eggs |
| Рынок | sell, buy, cart, escrow, ratings, reviews |
| Кошелёк | wallet, deposit, withdraw, transfer, payment |
| AI | chatbot, content_gen, smart_reply, auto_translate |
| Messenger V2 | custom_reactions, threads, scheduled, auto_translate |
| Files V2 | upload_1gb, auto_download |
| Settings V2 | data_ttl, export_granular, analytics |
| Platform | api, webhooks, white_label |

### 3. Новые структуры данных V2

#### Marketplace Item
```json
{
  "id": "UUID",
  "seller_id": "UUID",
  "title": "string",
  "price": "number",
  "category": "string",
  "is_available": "boolean"
}
```

#### Wallet
```json
{
  "user_id": "UUID",
  "balance": "number",
  "currency": "RUB",
  "transactions": "Transaction[]"
}
```

#### AI Chat
```json
{
  "id": "UUID",
  "user_id": "UUID",
  "messages": "AI_MESSAGE[]",
  "model": "string"
}
```

---

## SQL для предзаполнения

Файл: `features_sql.sql`

```sql
-- V1: is_premium = FALSE, released_at IS NOT NULL
-- V2: is_premium = TRUE,  released_at IS NULL

-- Таблица: platform_functions (85+ V1 + 40+ V2)
-- Таблица: platform_versions (4 версии)
-- Таблица: platform_themes (3 темы)
```

---

## Правовые документы

### V1 (основные)
- `RULES/privacy_policy.md` — Политика ПДн
- `RULES/terms_of_service.md` — Пользовательское соглашение

### V2 (дополнения)
- `V2_ENHANCEMENTS/documents/v2_privacy_addendum.md` — Дополнение к Политике
- `V2_ENHANCEMENTS/documents/v2_terms_addendum.md` — Дополнение к Соглашению

---

## Навигация V1 (актуальная v3.5)

### Header (правое меню)
```
┌──────────────────────────────────────────────────────────┐
│ 🐻 Маскот │ Balloo [🔍] │ 🌐(Язык) │ 👤(Профиль)        │
│           │ Заголовок    │ dropdown │ dropdown           │
│           │ страницы     │          │                    │
└──────────────────────────────────────────────────────────┘
```

### Sidebar (левое меню — скрытое, вызывается по 🐻)
```
┌──────────────────────────┐
│ МЕСЕНДЖЕР                │
│ 💬 Чаты                  │
│ 📞 Звонки                │
│ ⭐ Избранное             │
│ 📁 Архив                 │
│                          │
│ ОБНАРУЖИТЬ               │
│ 🏪 Рынок                 │
│ 🐻 Балунишка             │
│ 📰 Новости               │
│                          │
│ ПОДДЕРЖКА                │
│ 📞 Поддержка             │
│ ❤️ Поддержать проект     │
│ 📜 История версий        │
│                          │
│ СКАЧАТЬ                  │
│ ⬇️ Приложение            │
│ 📂 Файлы                 │
│                          │
│ О ПЛАТФОРМЕ              │
│ ℹ️ О Balloo              │
│ 🏢 О компании            │
│ ✨ Функции               │
│                          │
│ ПРАВОВАЯ ИНФОРМАЦИЯ      │
│ 📄 Условия использования │
│ 🔒 Конфиденциальность    │
│                          │
│ ЭКСТРЕННЫЕ СЛУЖБЫ        │
│ 🚨 МЧС                    │
│ 👮 Полиция               │
└──────────────────────────┘
```

### Footer (подвал — минимальный)
```
┌──────────────────────────────────────────────────────────┐
│ NBS — web-tech © 2026  │  v1.0.0  │  [Функции] [Поддержка]│
└──────────────────────────────────────────────────────────┘
```

---

*Документ создан: 25.06.2026*  
*Обновлено: 2026-06-27 — canonical migration completed, naming policy applied, metrics recomputed*  
*Платформа: Balloo Platform v3.5*  
*Владелец: NBS — web-tech*
*Статус: Source of Truth*

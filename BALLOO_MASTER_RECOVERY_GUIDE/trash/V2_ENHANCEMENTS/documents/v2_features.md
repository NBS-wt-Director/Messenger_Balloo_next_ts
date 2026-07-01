# Balloo Platform — План развития V2 (Модернизация)

**Версия:** 2.0  
**Дата начала:** 01.09.2026  
**Дата релиза:** 01.12.2026  
**Статус:** В разработке  

---

## 1. Обзор изменений V2

Версия 2.0 — это переход от базового мессенджера к полнофункциональной коммуникационной платформе с AI-ассистентом, маркетплейсом и бизнес-инструментами.

### Что меняется:
- ✅ Добавлен маскот-помощник "Балунишка Борис" с анимацией
- ✅ Добавлен маркетплейс "Рынок" для товаров и услуг
- ✅ Встроен AI-ассистент для помощи и генерации контента
- ✅ Premium-подписка с расширенными функциями
- ✅ White Label для бизнеса

---

## 2. Новые функции V2

### 2.1. Балунишка (Маскот-помощник)

**Slug:** `discover_balonishka`

**Описание:** Анимированный маскот Борис — медвежонок, который помогает пользователю ориентироваться в приложении, подсказывает функции, реагирует на действия.

**Функционал:**
- Анимация при загрузке (float + blink)
- Приветствие при открытии
- Подсказки по использованию
- Реакция на бездействие
- Easter eggs (интерактивные элементы)

**Данные:**
```json
{
  "id": "UUID",
  "state": "idle|happy|thinking|working|sleeping",
  "animation_id": "string",
  "interaction_history": "Interaction[]",
  "last_interaction": "timestamp"
}
```

### 2.2. Рынок (Маркетплейс)

**Slug:** `discover_marketplace`

**Описание:** Встроенный маркетплейс для покупки и продажи товаров, услуг, цифровых продуктов.

**Функционал:**
- Каталог товаров и услуг
- Поиск и фильтрация по категориям
- Корзина и оформление заказа
- Встроенный кошелёк
- Эскроу-сделки (безопасные платежи)
- Рейтинг продавцов
- Система отзывов

**Данные:**
```json
{
  "item": {
    "id": "UUID",
    "seller_id": "UUID",
    "title": "string",
    "description": "text",
    "price": "number",
    "currency": "RUB",
    "category": "string",
    "images": "string[]",
    "is_available": "boolean",
    "seller_rating": "number",
    "created_at": "timestamp"
  },
  "wallet": {
    "user_id": "UUID",
    "balance": "number",
    "currency": "RUB",
    "transactions": "Transaction[]"
  }
}
```

### 2.3. AI-ассистент

**Slug:** `ai_chatbot`

**Функционал:**
- Встроенный чат с AI
- Генерация текстов, описаний, ответов
- Умные ответы в чатах (предложения)
- Автоперевод сообщений на язык чата
- AI-модерация контента

**Данные:**
```json
{
  "chat": {
    "id": "UUID",
    "user_id": "UUID",
    "messages": "AI_MESSAGE[]",
    "model": "string",
    "created_at": "timestamp"
  },
  "message": {
    "id": "UUID",
    "role": "user|assistant",
    "content": "string",
    "tokens_used": "number",
    "created_at": "timestamp"
  }
}
```

### 2.4. Premium-функции

**Slug:** `msg_file_upload_1gb`, `msg_scheduled`, `msg_auto_download`

**Функционал:**
- Файлы до 1 ГБ (вместо 100 МБ)
- Запланированные сообщения
- Автозагрузка медиа по типу сети
- Расширенные настройки приватности (TTL данных)
- Гранулярный экспорт данных
- Аналитика использования

### 2.5. White Label

**Slug:** `platform_white_label`

**Описание:** Брендированная версия платформы для организаций.

**Функционал:**
- Настройка логотипа и цветов
- Кастомный домен
- Брендированные уведомления
- Корпоративная аутентификация (SSO)
- Выделенная поддержка

**Данные:**
```json
{
  "white_label": {
    "organization_id": "UUID",
    "brand_name": "string",
    "logo": "string",
    "colors": "JSONB",
    "custom_domain": "string",
    "sso_enabled": "boolean"
  }
}
```

### 2.6. Developer API

**Slug:** `platform_api`, `platform_webhooks`

**Функционал:**
- REST API для интеграции
- Webhooks для событий
- SDK для Python, JavaScript, Go
- Документация API

---

## 3. Новые экраны V2

| Экран | Файл | Описание |
|-------|------|----------|
| Балунишка | `balonishka.html` | Анимированный маскот Борис, центральный экран |
| Рынок | `marketplace.html` | Маркетплейс товаров и услуг |
| AI Чат | `ai_chat.html` | Встроенный AI-ассистент |
| Кошелёк | `wallet.html` | Встроенный кошелёк для транзакций |
| Продажа | `sell_item.html` | Создание объявления на Рынке |
| Admin | `admin_dashboard.html` | Панель администратора |
| API Docs | `api_docs.html` | Документация Developer API |

---

## 4. Модификации экранов V1

### Главный экран (home_screen.html)
- **V1:** Кнопки "Балунишка" и "Рынок" неактивные с подсказкой "В разработке (V2)"
- **V2:** Кнопки становятся активными, открывают соответствующие экраны

### Чаты
- **V1:** Базовый чат
- **V2:** Добавлены треды, запланированные сообщения, автоперевод

### Настройки
- **V1:** Базовые настройки
- **V2:** Добавлены TTL данных, гранулярный экспорт, аналитика

---

## 5. Структуры данных V2

### Marketplace Item
```json
{
  "id": "UUID",
  "seller_id": "UUID",
  "title": "string",
  "description": "text",
  "price": "number",
  "currency": "RUB",
  "category": "string",
  "images": "string[]",
  "is_available": "boolean",
  "seller_rating": "number",
  "reviews_count": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Transaction
```json
{
  "id": "UUID",
  "from_user_id": "UUID|null",
  "to_user_id": "UUID|null",
  "amount": "number",
  "currency": "RUB",
  "type": "deposit|withdraw|purchase|payout|donation",
  "status": "pending|completed|failed",
  "reference_id": "UUID|null",
  "created_at": "timestamp"
}
```

### Escrow Deal
```json
{
  "id": "UUID",
  "buyer_id": "UUID",
  "seller_id": "UUID",
  "item_id": "UUID",
  "amount": "number",
  "status": "created|paid|shipped|delivered|disputed|refunded",
  "created_at": "timestamp"
}
```

---

## 6. План релиза

### Этап 1 (01.09 — 15.09.2026)
- Разработка маскота Бориса
- Создание маркетплейса (базовый)
- AI-ассистент (базовый)

### Этап 2 (16.09 — 30.09.2026)
- Кошелёк и платёжная интеграция
- Эскроу-сделки
- Premium-подписка

### Этап 3 (01.10 — 15.10.2026)
- Developer API
- Webhooks
- White Label

### Этап 4 (16.10 — 30.11.2026)
- Тестирование
- Оптимизация
- Подготовка к релизу

### Релиз (01.12.2026)
- Версия 2.0.0
- Миграция данных
- Коммуникация с пользователями

---

## 7. Бюджет V2

| Статья | Стоимость |
|--------|----------|
| Разработка маскота | 500 000 ₽ |
| Маркетплейс | 1 200 000 ₽ |
| AI-ассистент | 800 000 ₽ |
| Кошелёк и платежи | 600 000 ₽ |
| Developer API | 400 000 ₽ |
| White Label | 300 000 ₽ |
| Тестирование | 300 000 ₽ |
| **Итого** | **4 100 000 ₽** |

---

## 8. Метрики успеха V2

| Метрика | Целевое значение |
|---------|-----------------|
| DAU (Daily Active Users) | +50% к V1 |
| Premium-конверсия | 5% |
| Средний чек на Рынке | 1 500 ₽ |
| AI-использование | 30% пользователей |
| NPS | > 50 |

---

*Документ создан: 25.06.2026*  
*Платформа: Balloo Platform*  
*Владелец: NBS — web-tech*

# Инициализация страниц и предложений функций

## Автоматическая инициализация

Запустите скрипт инициализации (требуется запущенный сервер dev):

```bash
# В отдельном терминале запустите сервер
npm run dev

# В другом терминале выполните инициализацию
node scripts/init-data.mjs
```

## Ручная инициализация через API

### 1. Инициализация страниц

```bash
# Страница поддержки
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "support",
    "title": "Поддержать проект",
    "content": "Ваша поддержка помогает развивать Balloo Messenger",
    "sections": [
      {
        "id": "sbp",
        "type": "payment",
        "title": "СБП (Система Быстрых Платежей)",
        "content": "Перевод по номеру телефона через Сбербанк",
        "data": {
          "method": "sbp",
          "phone": "+7 (999) 123-45-67",
          "bank": "Сбербанк",
          "recipient": "Иван Оберюхтин"
        }
      },
      {
        "id": "qr",
        "type": "qr",
        "title": "QR-код для оплаты",
        "content": "Отсканируйте QR-код для быстрого перевода",
        "data": { "qrCodeUrl": "" }
      }
    ],
    "metadata": { "icon": "Heart", "color": "#ef4444"
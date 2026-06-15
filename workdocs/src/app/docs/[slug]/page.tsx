/**
 * Documentation Page
 * Страница документации
 */

'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const docsContent: Record<string, { title: string; content: string; category: string }> = {
  'quick-start': {
    title: 'Быстрый старт',
    category: 'Начало работы',
    content: `
# Быстрый старт

Запуск платформы Balloo за 5 минут.

## Предварительные требования

- Docker 20.10+
- Docker Compose 2.0+
- 4 CPU cores
- 8 GB RAM

## Установка

### 1. Клонирование репозитория

\`\`\`bash
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Balloo
\`\`\`

### 2. Настройка окружения

\`\`\`bash
cp .env.example .env
\`\`\`

Отредактируйте \`.env\` файл:

\`\`\`env
JWT_SECRET=your-secret-key
DB_PASSWORD=your-db-password
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
\`\`\`

### 3. Запуск сервисов

\`\`\`bash
docker-compose -f docker-compose.full.yml up -d --build
\`\`\`

### 4. Проверка статуса

\`\`\`bash
docker-compose -f docker-compose.full.yml ps
\`\`\`

### 5. Открыть в браузере

- **balloo.su:** http://localhost:3000
- **messenger:** http://localhost:3002
- **admin:** http://localhost:3003
- **nodes-switcher:** http://localhost:3007

## Создание первого пользователя

\`\`\`bash
curl -X POST http://localhost:3001/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@balloo.su",
    "password": "Admin123",
    "displayName": "Администратор"
  }'
\`\`\`

## Тестирование

\`\`\`bash
npm run test
\`\`\`

## Следующие шаги

- [Архитектура](/docs/architecture)
- [API Документация](/docs/api-overview)
- [Развёртывание](/docs/docker-compose)
    `,
  },
  'architecture': {
    title: 'Архитектура',
    category: 'Начало работы',
    content: `
# Архитектура Платформы

## Обзор

Balloo Platform — это микросервисная архитектура с 20 узлами.

## Слои

### Infrastructure Layer

- PostgreSQL 15 — основная БД
- Redis 7 — кэш и очереди
- Nginx — reverse proxy

### Core Services Layer (Group A/B)

- API Gateway — центральный API
- Android Service — backend для мобильных
- Android SMS Node — SMS шлюз
- Kodegen — AI генерация кода

### Application Layer (Group C/D/E)

- Messenger — мессенджер
- Admin Portal — админка
- Workdocs — документация
- Working — sandbox

## Коммуникация

\`\`\`
┌─────────────┐
│   Nginx     │
└──────┬──────┘
       │
┌──────▼──────┐
│  API Gateway│
└──────┬──────┘
       │
┌──────▼──────────────┐
│   Service Nodes     │
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ Application Nodes   │
└─────────────────────┘
\`\`\`

## Безопасность

- JWT аутентификация
- HTTPS/WSS
- Rate limiting
- CORS policy
    `,
  },
  'api-overview': {
    title: 'Обзор API',
    category: 'API Документация',
    content: `
# API Документация

## Базовый URL

\`\`\`
Production: https://api.working.balloo.su
Development: http://localhost:3001
\`\`\`

## Аутентификация

Все запросы требуют JWT токен:

\`\`\`bash
Authorization: Bearer <your-token>
\`\`\`

## Основные endpoints

### Auth

| Method | Endpoint | Описание |
|--------|----------|----------|
| POST | /api/auth/register | Регистрация |
| POST | /api/auth/login | Вход |
| POST | /api/auth/logout | Выход |
| GET | /api/auth/me | Текущий пользователь |

### Users

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | /api/users/:id | Профиль |
| PUT | /api/users/me | Обновление |
| DELETE | /api/users/me/account | Удаление |

### Chats

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | /api/chats | Список чатов |
| POST | /api/chats | Создать чат |
| GET | /api/chats/:id | Информация |

### Messages

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | /api/chats/:id/messages | Сообщения |
| POST | /api/chats/:id/messages | Отправить |
| DELETE | /api/messages/:id | Удалить |

## WebSocket

\`\`\`
wss://api.working.balloo.su/ws?token=<jwt-token>
\`\`\`

### События

- \`message:new\` — новое сообщение
- \`message:read\` — прочитано
- \`chat:update\` — обновление чата
- \`typing\` — печатает
    `,
  },
  'sms-service': {
    title: 'SMS Service',
    category: 'Сервисы',
    content: `
# SMS Service

Отправка SMS через Android устройства.

## Архитектура

\`\`\`
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Client    │────▶│  API Gateway     │────▶│ Android Service │
└─────────────┘     └──────────────────┘     └─────────────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────┐
                                        │ Android SMS Node │
                                        └──────────────────┘
\`\`\`

## API Endpoints

### Отправить SMS

\`\`\`bash
POST /api/sms/send
Authorization: Bearer <token>

{
  "phone": "+79991234567",
  "message": "Ваш код: 123456",
  "priority": "normal"
}
\`\`\`

### Отправить OTP

\`\`\`bash
POST /api/sms/otp

{
  "phone": "+79991234567",
  "purpose": "login"
}
\`\`\`

### Проверить OTP

\`\`\`bash
POST /api/sms/otp/verify

{
  "otpId": "uuid",
  "code": "123456"
}
\`\`\`

### Статус SMS

\`\`\`bash
GET /api/sms/status/:messageId
\`\`\`

### История SMS

\`\`\`bash
GET /api/sms/history?limit=50&offset=0
\`\`\`

### Статус Android узлов

\`\`\`bash
GET /api/sms/android-nodes
\`\`\`

## Лимиты

- 100 SMS/день для обычных пользователей
- 1000 SMS/день для премиум
- Rate limiting: 10 запросов/минуту
    `,
  },
  'docker-compose': {
    title: 'Docker Compose',
    category: 'Развёртывание',
    content: `
# Docker Compose

## Запуск

\`\`\`bash
# Все сервисы
docker-compose -f docker-compose.full.yml up -d

# Конкретный сервис
docker-compose -f docker-compose.full.yml up -d api

# Пересборка
docker-compose -f docker-compose.full.yml up -d --build
\`\`\`

## Остановка

\`\`\`bash
# Остановить
docker-compose -f docker-compose.full.yml down

# С удалением данных
docker-compose -f docker-compose.full.yml down -v
\`\`\`

## Логи

\`\`\`bash
# Все сервисы
docker-compose -f docker-compose.full.yml logs -f

# Конкретный сервис
docker-compose -f docker-compose.full.yml logs -f api
\`\`\`

## Масштабирование

\`\`\`bash
docker-compose -f docker-compose.full.yml up -d --scale api=3
\`\`\`

## Мониторинг

\`\`\`bash
# Статус
docker-compose -f docker-compose.full.yml ps

# Использование ресурсов
docker stats
\`\`\`

## Production

Для production используйте:

- Отдельные secrets для паролей
- SSL сертификаты
- External database
- Load balancer
    `,
  },
};

export default function DocPage() {
  const params = useParams();
  const slug = params.slug as string;
  const doc = docsContent[slug];
  const [copied, setCopied] = useState(false);

  if (!doc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404
          </h1>
          <p className="text-gray-600 mb-8">
            Документация не найдена
          </p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← На главную
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Назад
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{doc.category}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            {doc.title}
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            {doc.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-3xl font-bold mb-6">{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-semibold mt-8 mb-4">{line.slice(3)}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-xl font-semibold mt-6 mb-3">{line.slice(4)}</h3>;
              }
              if (line.startsWith('```')) {
                return null;
              }
              if (line.startsWith('- ') || line.startsWith('| ')) {
                return <p key={i} className="text-gray-700 my-2">{line}</p>;
              }
              if (line.trim()) {
                return <p key={i} className="text-gray-700 my-4">{line}</p>;
              }
              return null;
            })}
          </div>
        </article>

        {/* Share */}
        <div className="mt-8 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Все документы
          </Link>
          <button
            onClick={handleCopy}
            className="text-sm text-gray-600 hover:text-gray-700"
          >
            {copied ? '✓ Скопировано' : '📋 Копировать ссылку'}
          </button>
        </div>
      </main>
    </div>
  );
}

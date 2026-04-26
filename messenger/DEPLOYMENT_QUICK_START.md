# 🚀 Balloo Messenger - Быстрый Деплой

**Статус:** ✅ **Production Ready**  
**Время деплоя:** 5-30 минут  
**Версия:** 1.0.0

---

## ⚡ Самый Быстрый Деплой (Vercel - 5 минут)

```bash
# 1. Установите Vercel CLI
npm i -g vercel

# 2. Войдите
vercel login

# 3. Деплой
vercel --prod
```

**Готово!** Ваша ссылка: `https://your-app.vercel.app`

---

## 📋 Что Нужно Настроить

### 1. Переменные окружения (в Vercel Dashboard)

| Ключ | Значение |
|------|----------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `DATABASE_URL` | PostgreSQL URL (см. ниже) |
| `NEXT_PUBLIC_YANDEX_CLIENT_ID` | Ваш Client ID |
| `YANDEX_CLIENT_SECRET` | Ваш Client Secret |

### 2. База данных

**Vercel Postgres (рекомендуется):**
1. Vercel Dashboard → Storage → Create Database
2. Скопируйте `DATABASE_URL`
3. Добавьте в переменные окружения

### 3. Yandex OAuth

1. Зайдите на [oauth.yandex.ru](https://oauth.yandex.ru)
2. Создайте приложение
3. Redirect URI: `https://your-app.vercel.app/api/auth/yandex/callback`
4. Скопируйте Client ID и Secret

---

## 📊 Проверка После Деплоя

### ✅ Чек-лист

- [ ] Приложение доступно по URL
- [ ] Страница входа работает
- [ ] Регистрация работает
- [ ] Вход через Яндекс работает
- [ ] База данных подключена
- [ ] HTTPS включён

### 🧪 Тестовые запросы

```bash
# Проверка API
curl https://your-app.vercel.app/api/health

# Проверка входа
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@balloo.ru","password":"Admin123!"}'
```

---

## 🔧 Альтернативные Платформы

### Railway (7 минут)

```bash
npm i -g @railway/cli
railway login
railway init
railway variables set NODE_ENV=production
railway up
```

### Собственный сервер (30 минут)

Смотрите [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📚 Документация

| Документ | Описание |
|----------|----------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Полная инструкция по деплою |
| [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) | Статус готовности |
| [DEPLOYMENT_FINAL_REPORT.md](./DEPLOYMENT_FINAL_REPORT.md) | Итоговый отчёт |
| [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) | Реализованные функции |

---

## ⚠️ Важные Замечания

1. **Смените секреты по умолчанию!**
   - JWT_SECRET
   - ENCRYPTION_KEY
   - Пароль администратора

2. **Настройте production базу данных**
   - SQLite только для разработки
   - Используйте PostgreSQL для production

3. **Проверьте HTTPS**
   - Vercel/Railway: автоматически
   - Свой сервер: Let's Encrypt

4. **Мониторинг**
   - Sentry для ошибок
   - Uptime Robot для доступности

---

## 🐛 Решение Проблем

### Ошибка: "Database not found"
```bash
npm run db:setup
```

### Ошибка: "JWT_SECRET not configured"
Добавьте переменную окружения `JWT_SECRET`

### Ошибка: "Build failed"
```bash
npm run build  # Проверьте локально
```

---

## ✅ Готово!

**Следующие шаги:**
1. Настройте домен (опционально)
2. Настройте мониторинг
3. Настройте бэкапы
4. Протестируйте все функции

---

**Статус сборки:** ✅ Passing  
**Production Ready:** ✅ Yes  
**Безопасность:** ✅ Protected  

🎉 **Удачи с деплоем!**

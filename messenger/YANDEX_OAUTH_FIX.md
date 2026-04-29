# Исправление авторизации через Яндекс

## Что было исправлено

### 1. AuthPage.tsx
- Добавлен импорт `getYandexAuthUrl` из `@/api/auth`
- Функция `handleYandex()` теперь вызывает реальную OAuth авторизацию вместо заглушки

### 2. .env.production
- Добавлена переменная `NEXT_PUBLIC_YANDEX_CLIENT_ID=9ddfa97aa58f44b991f0a2a01a7fa9b1`
- Установлены `YANDEX_CLIENT_ID` и `YANDEX_CLIENT_SECRET`

## Шаги по деплою на сервер

### 1. Commit изменений

```bash
cd ~/Messenger_Balloo_next_ts

# Проверка изменений
git status
git diff messenger/src/components/pages/AuthPage.tsx
git diff messenger/.env.production

# Добавляем все изменения
git add .

# Коммит
git commit -m "fix: Yandex OAuth авторизация - исправлена функция handleYandex и добавлены переменные окружения"

# Пуш в репозиторий
git push origin main
```

### 2. Настройка Yandex OAuth приложения

**Зайди на:** https://oauth.yandex.ru/

1. **Создай новое приложение** или выбери существующее с Client ID: `9ddfa97aa58f44b991f0a2a01a7fa9b1`
2. **Настрой параметры:**
   - Название: Balloo Messenger Alpha
   - Платформа: Web
   - Callback URL: `https://alpha.balloo.su/api/auth/yandex/callback`
   - Разрешения:
     - ✓ `email` (обязательно)
     - ✓ `login:info` или `login` (обязательно)
     - ✓ `disk:app_folders` (для загрузки файлов, опционально)
3. **Нажми "Сохранить"**
4. **Нажми "Опубликовать"** (статус должен быть "Опубликовано", не "В разработке")

### 3. Обновление на сервере

```bash
cd ~/Messenger_Balloo_next_ts/messenger

# 1. Проверь, что DNS работает
ping alpha.balloo.su

# 2. Проверь, что приложение работает
curl -I http://localhost:3000

# 3. Останови приложение
pm2 stop messenger-alpha

# 4. Очисти кэш Next.js
rm -rf .next

# 5. Пересобери проект (ВАЖНО! NEXT_PUBLIC переменные вшиваются при сборке)
NODE_ENV=production npx next build

# 6. Запусти приложение
NODE_ENV=production pm2 start "npx next start -p 3000" --name "messenger-alpha" --update-env

# 7. Сохрани процесс
pm2 save

# 8. Проверь статус
pm2 status

# 9. Проверь логи
pm2 logs messenger-alpha --lines 20

# 10. Проверь, что приложение отвечает
curl -I http://localhost:3000
```

### 4. Проверка работы

1. **Открой:** `https://alpha.balloo.su/login`
2. **Нажми Ctrl+F5** (жёсткая перезагрузка страницы)
3. **Нажми "Войти через Яндекс"**
4. **Должен открыться Яндекс OAuth** с запросом разрешений
5. **После авторизации** должен быть редирект обратно на сайт

### 5. Если что-то не работает

#### Проверь логи PM2:
```bash
pm2 logs messenger-alpha --lines 50
```

#### Проверь переменные окружения:
```bash
cat .env.production | grep YANDEX
```

Должно быть:
```
NEXT_PUBLIC_YANDEX_CLIENT_ID=9ddfa97aa58f44b991f0a2a01a7fa9b1
YANDEX_CLIENT_ID=9ddfa97aa58f44b991f0a2a01a7fa9b1
YANDEX_CLIENT_SECRET=81178677a1344bfea7f3f9c1dfaa1d73
```

#### Проверь настройки Yandex OAuth:
- Зайди на: https://oauth.yandex.ru/techno/9ddfa97aa58f44b991f0a2a01a7fa9b1
- Убедись, что Callback URL: `https://alpha.balloo.su/api/auth/yandex/callback`
- Убедись, что статус: "Опубликовано"

#### Проверь ошибки в браузере:
1. Открой `https://alpha.balloo.su/login`
2. Нажми F12
3. Перейди в Console
4. Нажми "Войти через Яндекс"
5. Скопируй текст ошибки (если есть)

## Дополнительные исправления

### RxDB DB9 ошибка (не критично)
Эта ошибка связана с локальной базой данных в браузере и не влияет на авторизацию.

### SSL сертификат
Если SSL не работает:
```bash
# Проверь сертификат
sudo ls -la /etc/letsencrypt/live/alpha.balloo.su/

# Если нет - получи через webroot
sudo certbot certonly --webroot -w /var/www/certbot -d alpha.balloo.su

# Перезагрузи nginx
sudo nginx -t
sudo systemctl restart nginx
```

## Контакты
Если остались вопросы - обратись к администратору сервера.

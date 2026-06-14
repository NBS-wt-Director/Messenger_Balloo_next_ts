# 📱 Balloo Android SMS Node

**Версия:** 0.1.0  
**Платформа:** Android 10+  
**Назначение:** Отправка SMS OTP кодов через Android устройство

---

## 📋 Требования

- Android устройство (телефон/планшет)
- Android SDK 30+
- React Native 0.73+
- SIM-карта с тарифом на SMS
- Подключение к интернету (WiFi/mobile)

---

## 🔧 Установка

### 1. Клонирование репозитория

```bash
cd android-sms-node
npm install
```

### 2. Настройка Android SDK

```bash
# Проверка установки
adb version
react-native doctor

# При необходимости установить SDK
# https://developer.android.com/studio
```

### 3. Настройка приложения

Откройте `src/App.tsx` и настройте:

```typescript
const DEFAULT_API_URL = 'https://api.working.balloo.su/sms';
```

---

## 🚀 Сборка APK

### Debug APK

```bash
npm run android
```

### Release APK

```bash
npm run build:apk
```

APK файл будет создан в корне: `balloo-sms-node.apk`

### Установка на устройство

```bash
# Через USB (отладка по USB должна быть включена)
adb install balloo-sms-node.apk

# Или скопируйте APK на устройство и установите вручную
```

---

## ⚙️ Настройка

### 1. Запуск приложения

Откройте приложение на Android устройстве.

### 2. Конфигурация API

Введите параметры:

| Поле | Значение |
|------|----------|
| **API URL** | `https://api.working.balloo.su/sms` |
| **API Token** | Токен из `.env` (`SMS_API_TOKEN`) |

### 3. Предоставление разрешений

Приложение запросит разрешения:

- ✅ **Отправка SMS** — обязательно
- ✅ **Интернет** — обязательно
- ✅ **Автозапуск** — рекомендуется

### 4. Активация сервиса

Переключите тумблер **"Сервис активен"** в положение ON.

---

## 📊 Мониторинг

### Статистика в приложении

- **Отправлено** — количество успешных SMS
- **Ошибок** — количество неудачных отправок
- **Последний запрос** — информация о последней SMS

### Логи

```bash
# Просмотр логов в реальном времени
adb logcat | grep -i balloo

# Экспорт логов
adb logcat -d > balloo-sms-logs.txt
```

---

## 🔌 API Integration

### Polling endpoint

Приложение опрашивает API каждые 5 секунд:

```
GET /api/sms/pending
Authorization: Bearer <token>

Response:
{
  "pending": [
    {
      "requestId": "uuid",
      "phone": "+79991234567",
      "code": "123",
      "timestamp": 1686744000000
    }
  ]
}
```

### Report endpoint

После отправки SMS приложение отправляет отчёт:

```
POST /api/sms/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestId": "uuid",
  "status": "sent" | "failed",
  "timestamp": 1686744000000
}
```

---

## 🐛 Troubleshooting

### SMS не отправляется

1. Проверьте баланс SIM-карты
2. Убедитесь, что есть сигнал сети
3. Проверьте разрешение на отправку SMS
4. Проверьте логи: `adb logcat | grep -i sms`

### Приложение не подключается к API

1. Проверьте API URL
2. Проверьте API токен
3. Убедитесь, что устройство имеет доступ к интернету
4. Проверьте firewall/антивирус

### Фоновая служба останавливается

1. Отключите оптимизацию батареи для приложения
2. Включите автозапуск
3. Закрепите приложение в памяти

---

## 📱 Production Deployment

### 1. Подготовка устройства

- Заряд батареи > 80%
- Постоянное подключение к питанию
- WiFi или стабильный mobile интернет
- Отключите спящий режим

### 2. Настройка

- Установите последнюю версию APK
- Настройте API параметры
- Активируйте сервис
- Проверьте отправку тестовой SMS

### 3. Мониторинг

- Проверяйте статистику ежедневно
- Проверяйте логи еженедельно
- Следите за балансом SIM-карты

---

## 🔐 Security

- API токен хранится в зашифрованном AsyncStorage
- HTTPS соединение с API
- Нет хранения SMS кодов после отправки
- Автоматическая очистка очереди

---

## 📦 Dependencies

```json
{
  "react-native": "0.73.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "react-native-permissions": "^4.0.0",
  "react-native-sms-android": "^1.0.6",
  "axios": "^1.6.0"
}
```

---

## 📞 Support

**Email:** o8eryuhtin@yandex.ru  
**GitHub:** https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 0.1.0

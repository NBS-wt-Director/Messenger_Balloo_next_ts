# 🎈 BALLOO Platform Analysis — Local Development Guide

## Запуск

### Быстрый старт
```powershell
cd BALLOO_MASTER_RECOVERY_GUIDE\steps
node server-3030.js
```
Откроется: http://BALLOO_PLATFORM_ANALYSIS.ksysha:3030

### С автооткрытием браузера
```powershell
cd BALLOO_MASTER_RECOVERY_GUIDE\steps
.\start-balloo-analysis.ps1
```

## Локальный домен

### Добавить запись в hosts (требует админа)
```powershell
cd BALLOO_MASTER_RECOVERY_GUIDE\steps
.\run-with-admin.ps1 .\add-hosts.ps1
```

### Удалить запись из hosts
```powershell
cd BALLOO_MASTER_RECOVERY_GUIDE\steps
.\run-with-admin.ps1 .\remove-hosts.ps1
```

## Автозапуск

### Настроить автозапуск при входе в систему
```powershell
cd BALLOO_MASTER_RECOVERY_GUIDE\steps
.\run-with-admin.ps1 .\setup-autostart.ps1
```

### Управление автозапуском
```powershell
# Посмотреть задачу
Get-ScheduledTask -TaskName "BALLOO Platform Analysis Server"

# Запустить вручную
Start-ScheduledTask -TaskName "BALLOO Platform Analysis Server"

# Удалить
Unregister-ScheduledTask -TaskName "BALLOO Platform Analysis Server" -Confirm:$false
```

## Локальные домены

| Домен | Порт | URL |
|-------|------|-----|
| BALLOO_PLATFORM_ANALYSIS.ksysha | 3030 | http://BALLOO_PLATFORM_ANALYSIS.ksysha:3030 |
| api.balloo.ksysha | 3031 | http://api.balloo.ksysha:3031 |
| admin.balloo.ksysha | 3032 | http://admin.balloo.ksysha:3032 |

Полный список: `BALLOO_MASTER_RECOVERY_GUIDE/local-domains.json`

## Справочник портов

Все порты для локальной разработки:
- 3030 — BALLOO Platform Analysis (основной)
- 3031 — API Gateway (заглушка)
- 3032 — Admin Panel (заглушка)

> ⚠️ **Важно:** Локальные порты 3*** — только для localhost-разработки.
> Не использовать как настройки для продакшен/дев-серверов.

## Troubleshooting

### Порт уже занят
```powershell
netstat -ano | findstr :3030
taskkill /PID <PID> /F
```

### Домен не резолвится
```powershell
ipconfig /flushdns
```

### Браузер показывает пустую страницу
- Проверь консоль DevTools (F12)
- Убедись, что сервер запущен
- Попробуй http://localhost:3030

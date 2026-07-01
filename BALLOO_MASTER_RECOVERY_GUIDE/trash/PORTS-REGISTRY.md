# 📊 Local Ports & Domains Registry

> Справочник локальных портов и доменов для разработки на Ksysha-PC
> 
> ⚠️ **Важно:** Локально ≠ продакшен/дев на сервере. Только для localhost.

## 🌐 Домены

| Домен | Порт | URL | Статус |
|-------|------|-----|--------|
| `BALLOO_PLATFORM_ANALYSIS.ksysha` | 3030 | http://BALLOO_PLATFORM_ANALYSIS.ksysha:3030 | ✅ Активен |
| `api.balloo.ksysha` | 3031 | http://api.balloo.ksysha:3031 | 📋 Заглушка |
| `admin.balloo.ksysha` | 3032 | http://admin.balloo.ksysha:3032 | 📋 Заглушка |

## 📁 Файлы проекта

```
BALLOO_MASTER_RECOVERY_GUIDE/
├── local-domains.json          # Основной справочник
├── LOCAL_DEV.md                # Инструкция по локальной разработке
├── steps/
│   ├── server-3030.js          # Сервер для 3030 порта
│   ├── server-3031.js          # Сервер для 3031 порта (создать)
│   ├── server-3032.js          # Сервер для 3032 порта (создать)
│   ├── start-balloo-analysis.ps1  # Запуск с автооткрытием
│   ├── add-hosts.ps1           # Добавить домены в hosts (Admin)
│   ├── remove-hosts.ps1        # Удалить домены из hosts (Admin)
│   ├── setup-autostart.ps1     # Настроить автозапуск (Admin)
│   ├── run-with-admin.ps1      # Перезапуск с правами админа
│   └── 20260626-1402.html      # Основной файл
```

## 🚀 Быстрый старт

```powershell
# 1. Добавить домен в hosts (один раз, от Admin)
cd BALLOO_MASTER_RECOVERY_GUIDE\steps
.\run-with-admin.ps1 .\add-hosts.ps1

# 2. Запустить сервер
.\start-balloo-analysis.ps1

# 3. Открыть браузер
http://BALLOO_PLATFORM_ANALYSIS.ksysha:3030
```

## 🔄 Автозапуск

```powershell
# Настроить
.\run-with-admin.ps1 .\setup-autostart.ps1

# Управлять
Get-ScheduledTask -TaskName "BALLOO Platform Analysis Server"
Start-ScheduledTask -TaskName "BALLOO Platform Analysis Server"
Unregister-ScheduledTask -TaskName "BALLOO Platform Analysis Server" -Confirm:$false
```

## 🛠 Troubleshooting

```powershell
# Порт занят
netstat -ano | findstr :3030
taskkill /PID <PID> /F

# Домен не резолвится
ipconfig /flushdns

# Проверить hosts
type "$env:systemroot\System32\drivers\etc\hosts" | findstr ksysha
```

## 📝 Правила

- Локальные порты: `3030-3039` для разработки
- Локальный домен: `*.ksysha` (имя ноутбука)
- Не использовать в продакшен/дев-настройках сервера
- hosts файл требует прав администратора

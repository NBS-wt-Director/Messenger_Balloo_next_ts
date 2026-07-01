# 🐧 План миграции на Linux — Balloo Platform

**Дата:** 2026-07-02  
**Автор:** NLP-Core-Team  
**Версия:** 1.0  

---

## 📊 Характеристики текущего компьютера

| Компонент | Значение |
|-----------|----------|
| **Процессор** | AMD Ryzen 7 5825U (8 ядер / 16 потоков, до 2.0 ГГц) |
| **Оперативная память** | 32 ГБ DDR4 3200 МГц (2x16 ГБ) |
| **Видеокарта** | AMD Radeon Graphics (встроенная) |
| **Накопитель** | SSD 512 ГБ (FORESEE XP1100F512G) |
| **Текущая ОС** | Windows 11 Home Single Language |
| **Архитектура** | x86-64 |

---

## 🎯 Рекомендованный дистрибутив

### **Fedora Workstation 40+**

**Почему Fedora:**

| Критерий | Оценка | Обоснование |
|----------|--------|-------------|
| **Совместимость с AMD** | ⭐⭐⭐⭐⭐ | Отличная поддержка Ryzen из коробки |
| **Разработка (Next.js/TS)** | ⭐⭐⭐⭐⭐ | Свежие версии Node.js, npm, Docker |
| **Стабильность** | ⭐⭐⭐⭐⭐ | Testing ground для RHEL, надёжная |
| **Сообщество** | ⭐⭐⭐⭐⭐ | Активная поддержка, документация |
| **Русский язык** | ⭐⭐⭐⭐⭐ | Полная локализация |
| **Игры (Steam)** | ⭐⭐⭐⭐ | Proton работает отлично |
| **Простота установки** | ⭐⭐⭐⭐ | Интуитивный установщик |

**Альтернативы:**
- **Ubuntu 24.04 LTS** — если нужна максимальная стабильность
- **Pop!_OS 22.04** — если будут проблемы с драйверами
- **Linux Mint 21** — если нужен максимально простой переход с Windows

---

## 📦 Полный список софта

### 🔧 Разработка

| Софт | Назначение | Команда установки |
|------|------------|-------------------|
| **Node.js 22 LTS** | Runtime для Next.js | `sudo dnf install nodejs npm` |
| **Docker + Compose** | Контейнеризация | `sudo dnf install docker docker-compose` |
| **PostgreSQL 16** | База данных | `sudo dnf install postgresql-server postgresql-contrib` |
| **Redis 7** | Кеш и очереди | `sudo dnf install redis` |
| **VS Code** | Редактор кода | `sudo dnf install code` (через repo) |
| **Git** | Version control | `sudo dnf install git` |
| **Postman** | Тестирование API | `flatpak install flathub com.getpostman.Postman` |
| **DBeaver** | GUI для БД | `flatpak install flathub io.dbeaver.DBeaver` |

### 🤖 ИИ локально (Ollama)

| Модель | Размер | Назначение | Команда |
|--------|--------|------------|---------|
| **Llama 3.1 8B** | ~4.7 ГБ | Универсальная, быстрая | `ollama run llama3.1` |
| **Mistral 7B** | ~4.1 ГБ | Код, тексты | `ollama run mistral` |
| **DeepSeek Coder 6.7B** | ~3.8 ГБ | Генерация кода | `ollama run deepseek-coder` |
| **Stable Diffusion XL** | ~6.5 ГБ | Генерация изображений | `ollama run sdxl` |
| **Whisper Large** | ~3 ГБ | Распознавание речи | `ollama run whisper` |

**Установка Ollama:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable ollama
sudo systemctl start ollama
```

### 🎵 Мультимедиа

| Софт | Назначение | Команда установки |
|------|------------|-------------------|
| **VLC** | Видеоплеер | `sudo dnf install vlc` |
| **OBS Studio** | Запись экрана/стримы | `sudo dnf install obs-studio` |
| **Audacity** | Редактор аудио | `sudo dnf install audacity` |
| **GIMP** | Редактор изображений | `sudo dnf install gimp` |
| **Kdenlive** | Видеомонтаж | `sudo dnf install kdenlive` |

### 📄 Офис (русский, бесплатный, аналог WPS)

| Софт | Назначение | Команда установки |
|------|------------|-------------------|
| **LibreOffice 24.2** | Полный офисный пакет | `sudo dnf install libreoffice libreoffice-langpack-ru` |
| **OnlyOffice Desktop** | Альтернатива (MS Office-совместимый) | `flatpak install flathub org.onlyoffice.desktopeditors` |

**Рекомендация:** OnlyOffice ближе к WPS по интерфейсу и совместимости с форматами MS Office.

### 🎮 Игры (Steam)

| Софт | Назначение | Команда установки |
|------|------------|-------------------|
| **Steam** | Игровая платформа | `sudo dnf install steam` |
| **Proton** | Запуск Windows-игр | В настройках Steam |
| **Lutris** | Менеджер игр | `sudo dnf install lutris` |
| **Heroic Games Launcher** | Epic Games Store | `flatpak install flathub com.heroicgameslauncher.hgl` |

### 🌐 Браузер

| Софт | Назначение | Команда установки |
|------|------------|-------------------|
| **Yandex Browser** | Миграция из Windows | Скачать с [yandex.ru](https://browser.yandex.ru/) |
| **Firefox** | Резервный браузер | `sudo dnf install firefox` |

**Миграция из Яндекс.Браузера Windows:**
1. Установить Яндекс.Браузер на Linux
2. Войти в аккаунт Яндекс
3. Синхронизация закладок/паролей автоматически

### 🔌 Драйвера

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| **AMD GPU** | ✅ В ядре | Драйвера встроены в ядро Linux |
| **AMD CPU** | ✅ В ядре | Полная поддержка Ryzen |
| **Wi-Fi** | ✅ В ядре | Большинство адаптеров работают из коробки |
| **Звук** | ✅ PipeWire | Современная аудиосистема |
| **Bluetooth** | ✅ В ядре | BlueZ стек |

**Проверка драйверов после установки:**
```bash
lspci -k | grep -A 2 -i vga    # Видеокарта
lsmod | grep amdgpu            # AMD драйвер
rfkill list                    # Wi-Fi/Bluetooth
```

### 📦 Дополнительно

| Софт | Назначение | Команда установки |
|------|------------|-------------------|
| **Flatpak** | Менеджер приложений | `sudo dnf install flatpak` |
| **GNOME Tweaks** | Настройка интерфейса | `sudo dnf install gnome-tweaks` |
| **Timeshift** | Бэкап системы | `sudo dnf install timeshift` |
| **GParted** | Управление дисками | `sudo dnf install gparted` |
| **htop** | Мониторинг процессов | `sudo dnf install htop` |
| **neofetch** | Info о системе | `sudo dnf install neofetch` |

---

## 📋 Пошаговый план установки

### Шаг 1: Подготовка

```bash
# 1. Создать загрузочную флешку (на Windows)
# - Скачать Fedora Workstation 40: https://fedoraproject.org/
# - Использовать Rufus или BalenaEtcher

# 2. Сохранить важные данные
# - Закладки: синхронизация Яндекс
# - Пароли: экспорт из браузера
# - Файлы: на внешний диск или облако

# 3. Записать текущие настройки
# - Wi-Fi пароли
# - Настройки программ
```

### Шаг 2: Установка Fedora

```
1. Загрузиться с флешки
2. Выбрать "Try Fedora" (проверить совместимость)
3. Запустить "Install to Hard Drive"
4. Выбрать язык: Русский
5. Разметка диска:
   - / (root): 100 ГБ (ext4)
   - /home: 350 ГБ (ext4)
   - swap: 32 ГБ (равно RAM)
6. Создать пользователя
7. Установить
8. Перезагрузиться
```

### Шаг 3: Первоначальная настройка

```bash
# 1. Обновить систему
sudo dnf update -y

# 2. Включить RPM Fusion (доп. репозитории)
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

# 3. Установить кодеки
sudo dnf groupupdate multimedia --setopt="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin
sudo dnf groupupdate sound-and-video

# 4. Включить Docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# 5. Включить PostgreSQL
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 6. Установить Flatpak
sudo dnf install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

### Шаг 4: Установка софта

```bash
# Разработка
sudo dnf install nodejs npm git docker docker-compose postgresql-server redis

# Мультимедиа
sudo dnf install vlc obs-studio audacity gimp kdenlive

# Офис
sudo dnf install libreoffice libreoffice-langpack-ru

# Игры
sudo dnf install steam lutris

# Утилиты
sudo dnf install gnome-tweaks timeshift gparted htop neofetch

# Flatpak приложения
flatpak install flathub org.onlyoffice.desktopeditors
flatpak install flathub com.getpostman.Postman
flatpak install flathub io.dbeaver.DBeaver
flatpak install flathub com.heroicgameslauncher.hgl

# Ollama
curl -fsSL https://ollama.com/install.sh | sh
```

### Шаг 5: Миграция данных

```
1. Установить Яндекс.Браузер
   - Скачать с yandex.ru
   - Войти в аккаунт
   - Дождаться синхронизации

2. Перенести файлы
   - Документы: ~/Documents
   - Загрузки: ~/Downloads
   - Проекты: ~/Projects

3. Настроить разработку
   - Клонировать репозитории
   - Установить зависимости
   - Настроить Docker
```

---

## ⚖️ Оценка перехода

### Простота: **7/10**

**Почему не 10:**
- Нужна подготовка (флешка, бэкап)
- Некоторые программы требуют настройки
- Привыкание к новому интерфейсу (1-2 недели)

**Почему не 1:**
- Fedora имеет отличный установщик
- Большинство драйверов работают из коробки
- Много русскоязычных руководств

---

### ✅ Плюсы

| Категория | Преимущества |
|-----------|--------------|
| **Производительность** | +20-30% скорости, меньше потребление RAM |
| **Разработка** | Нативная поддержка Docker, Node.js, PostgreSQL |
| **Безопасность** | Меньше уязвимостей, нет телеметрии |
| **Контроль** | Полный контроль над системой |
| **Стоимость** | Бесплатно (экономия ~15 000 ₽ на Windows) |
| **Игры** | Steam Proton работает отлично (80% Windows-игр) |
| **Приватность** | Нет сбора данных, нет обязательных обновлений |
| **Стабильность** | Реже требует перезагрузки |

---

### ❌ Минусы

| Категория | Недостатки |
|-----------|------------|
| **Совместимость** | Некоторые Windows-программы не работают |
| **Игры** | Anti-cheat игры не работают (Valorant, FACEIT) |
| **Office** | Форматирование может "плыть" при обмене с MS Office |
| **Поддержка** | Меньше готовых решений на русском |
| **Привыкание** | 1-2 недели на адаптацию |
| **Peripherals** | Некоторые принтеры/сканеры могут не работать |

---

### ⚠️ Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| **Потеря данных** | Средняя | Критическое | Бэкап перед установкой + Timeshift |
| **Не работают драйвера** | Низкая | Высокое | Live USB тест перед установкой |
| **Не работают программы** | Средняя | Среднее | Wine/Flatpak/VM для критичных |
| **Проблемы с Wi-Fi** | Низкая | Высокое | USB Wi-Fi адаптер в резерве |
| **Не работает звук** | Низкая | Среднее | PipeWire настройка, внешняя звуковая |
| **Steam игры не запускаются** | Средняя | Низкое | Proton DB проверка перед покупкой |

---

## 🎯 Итоговая рекомендация

### **Устанавливать: Fedora Workstation 40**

**Оптимальная конфигурация:**

```
Процессор: AMD Ryzen 7 5825U ✅ (полная поддержка)
RAM: 32 ГБ ✅ (более чем достаточно)
SSD: 512 ГБ ✅ (комфортно для разработки)
GPU: AMD Radeon ✅ (драйвера в ядре)
```

**Почему Fedora, а не Ubuntu:**
- Свежие версии пакетов (Node.js, Docker, PostgreSQL)
- Лучшая поддержка AMD из коробки
- Меньше "навязанного" софта (snap)
- Более "чистый" GNOME

**Почему не Arch/Manjaro:**
- Нужна стабильность для работы
- Меньше времени на настройку системы
- Официальная поддержка Red Hat

---

## 📞 Контакты для помощи

- **Fedora RU:** https://fedoraproject.org/ru/
- **Форум:** https://forum.fedora-project.org/
- **Telegram:** @fedora_ru
- **Reddit:** r/Fedora

---

## 📚 Полезные ссылки

- **Установка Fedora:** https://docs.fedoraproject.org/en-US/quick-docs/getting-started/
- **RPM Fusion:** https://rpmfusion.org/
- **Flatpak:** https://flatpak.org/setup/Fedora
- **Ollama:** https://ollama.com/
- **Proton DB:** https://www.protondb.com/ (проверка игр)
- **OnlyOffice:** https://www.onlyoffice.com/ru/download-desktop.aspx

---

*Файл сохранён на рабочий стол: `linux_migration_plan.md`*

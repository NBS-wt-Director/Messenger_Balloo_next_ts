# 🐧 План миграции на Linux — Balloo Platform (DEB-совместимая)

**Дата:** 2026-07-02  
**Автор:** NLP-Core-Team  
**Версия:** 2.0  
**Ключевые требования:** DEB-совместимость, автономность, настройка панелей, НЕ Ubuntu

---

## 📊 Характеристики текущего компьютера

| Компонент | Значение |
|-----------|----------|
| **Процессор** | AMD Ryzen 7 5825U (8 ядер / 16 потоков, до 2.0 ГГц) |
| **Оперативная память** | 32 ГБ DDR4 3200 МГц (2x16 ГБ) |
| **Видеокарта** | AMD Radeon Graphics (встроенная) |
| **Накопитель** | SSD 512 ГБ (FORESEE XP1100F512G) |
| **Текущая ОС** | Windows 11 Home |
| **Архитектура** | x86-64 |
| **Имя компьютера** | KSYUSHA |
| **Пользователь** | IvanO |

---

## 🎯 Рекомендованный дистрибутив

### **Linux Mint 22 "Wilma" Cinnamon Edition** ⭐

**Почему Linux Mint:**

| Критерий | Оценка | Обоснование |
|----------|--------|-------------|
| **DEB-совместимость** | ⭐⭐⭐⭐⭐ | Репозитории Debian/Ubuntu, .deb пакеты |
| **Настройка панелей** | ⭐⭐⭐⭐⭐ | Верхняя + нижняя из коробки |
| **Автономность** | ⭐⭐⭐⭐⭐ | TLP, power management из коробки |
| **Совместимость с AMD** | ⭐⭐⭐⭐⭐ | Драйвера в ядре |
| **Разработка** | ⭐⭐⭐⭐⭐ | Все пакеты доступны |
| **Стабильность** | ⭐⭐⭐⭐⭐ | LTS основа |
| **Русский язык** | ⭐⭐⭐⭐⭐ | Полная локализация |
| **Игры (Steam)** | ⭐⭐⭐⭐ | Proton работает отлично |
| **Простота** | ⭐⭐⭐⭐⭐ | Для перехода с Windows |
| **Работопригодность** | ⭐⭐⭐⭐⭐ | Создан для продуктивности |

**Почему НЕ Ubuntu:**
- ❌ Snap-пакеты навязываются
- ❌ Телеметрия Canonical
- ❌ Частые проблемы с обновлениями
- ❌ Меньше контроля

**Альтернативы (DEB-совместимые):**
- **MX Linux 23** — максимальная лёгкость (Xfce)
- **Debian 12** — максимальная стабильность (консервативный)
- **Zorin OS 17** — сходство с Windows (Pro версия платная)

---

## 🖥️ Настройка панелей (Cinnamon Desktop)

### Верхняя панель — Системная информация

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ [Меню] [Dash] [Окна]                          [CPU 25%] [RAM 8/32GB] [📶]    ║
║                                               [🔋 85%] [15:30] [ivano@KSYUSHA]║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Applets для верхней панели:**

| Applet | Назначение | Установка |
|--------|------------|-----------|
| **System Monitor** | CPU, RAM, Network | Встроенный |
| **Power Management** | Батарея, % | Встроенный |
| **Weather** | Погода | Встроенный |
| **Clipboard** | Буфер обмена | `sudo apt install clipboard-indicator` |
| **CPU Frequency** | Частота CPU | `sudo apt install cinnamon-applets-cpu-freq-indicator` |
| **Thermal Monitor** | Температуры | `sudo apt install cinnamon-applets-thermal-monitor` |

**Настройка:**
1. Правый клик на панели → "Applets"
2. Вкладка "Download" → установить недостающие
3. Вкладка "Manage" → добавить на панель
4. Настроить обновление (1-2 секунды)

### Нижняя панель — Рабочие окна

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ [🏠] [💻 VS Code] [🦊 Яндекс] [📁 Files] [⚙️ Settings] [🎮 Steam]     [🗑️]   ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**Настройка:**
1. Правый клик → "Panel Settings"
2. Включить "Panel launchers"
3. Добавить ярлыки приложений
4. Настроить автоскрытие (опционально)

**Горячие клавиши:**
- `Ctrl+Alt+T` — Terminal
- `Super` (Win) — Меню
- `Alt+Tab` — Переключение окон
- `Super+D` — Показать рабочий стол

---

## 📦 Полный список софта (DEB-совместимый)

### 🔧 Разработка

| Софт | Назначение | Команда установки |
|------|------------|-------------------|
| **Node.js 22 LTS** | Runtime | `curl -fsSL https://deb.nodesource.com/setup_22.x \| sudo -E bash - && sudo apt install -y nodejs` |
| **Docker + Compose** | Контейнеры | `sudo apt install docker.io docker-compose` |
| **PostgreSQL 16** | БД | `sudo apt install postgresql postgresql-contrib` |
| **Redis 7** | Кеш | `sudo apt install redis-server` |
| **VS Code** | Редактор | `sudo apt install code` (через repo) |
| **Git** | Version control | `sudo apt install git` |
| **Postman** | API тесты | `wget -qO - https://dl.postman.com/postman-pub.gpg \| sudo apt-key add - && echo "deb https://dl.postman.com/native/deb any any" \| sudo tee -a /etc/apt/sources.list.d/postman.list` |
| **DBeaver** | GUI для БД | `sudo apt install dbeaver-ce` (snap) или Flatpak |

### 🤖 ИИ локально (Ollama)

```bash
# Установка Ollama
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable ollama
sudo systemctl start ollama

# Модели (оптимальные для 32GB RAM)
ollama run llama3.1          # 8B (~4.7GB) - универсальная
ollama run mistral           # 7B (~4.1GB) - код/тексты
ollama run deepseek-coder    # 6.7B (~3.8GB) - код
ollama run sdxl              # Генерация изображений
ollama run whisper           # Распознавание речи
```

| Модель | Размер | Назначение | RAM требуется |
|--------|--------|------------|---------------|
| Llama 3.1 8B | ~4.7 ГБ | Универсальная | 8 ГБ |
| Mistral 7B | ~4.1 ГБ | Код, тексты | 8 ГБ |
| DeepSeek Coder 6.7B | ~3.8 ГБ | Генерация кода | 8 ГБ |
| Stable Diffusion XL | ~6.5 ГБ | Изображения | 12 ГБ |
| Whisper Large | ~3 ГБ | Речь | 6 ГБ |

### 🎵 Мультимедиа

| Софт | Назначение | Команда |
|------|------------|---------|
| **VLC** | Видеоплеер | `sudo apt install vlc` |
| **OBS Studio** | Запись/стримы | `sudo apt install obs-studio` |
| **Audacity** | Аудио редактор | `sudo apt install audacity` |
| **GIMP** | Графический редактор | `sudo apt install gimp` |
| **Kdenlive** | Видеомонтаж | `sudo apt install kdenlive` |

### 📄 Офис (русский, аналог WPS, бесплатный)

| Софт | Назначение | Команда |
|------|------------|---------|
| **OnlyOffice Desktop** | Офисный пакет | `wget https://download.onlyoffice.com/install/desktop/editors/linux/onlyoffice-desktopeditors_amd64.deb && sudo apt install ./onlyoffice-desktopeditors_amd64.deb` |
| **LibreOffice 24.2** | Альтернатива | `sudo apt install libreoffice libreoffice-l10n-ru` |

**Рекомендация:** OnlyOffice ближе к WPS по интерфейсу и совместимости с форматами MS Office (.docx, .xlsx, .pptx).

### 🎮 Игры (Steam)

| Софт | Назначение | Команда |
|------|------------|---------|
| **Steam** | Игровая платформа | `sudo apt install steam` |
| **Proton** | Windows-игры | В настройках Steam → Steam Play |
| **Lutris** | Менеджер игр | `sudo apt install lutris` |
| **Heroic** | Epic Games | Flatpak: `flatpak install flathub com.heroicgameslauncher.hgl` |

### 🌐 Браузер

| Софт | Назначение | Команда |
|------|------------|---------|
| **Yandex Browser** | Миграция из Windows | Скачать: https://browser.yandex.ru/ |
| **Firefox** | Резервный | `sudo apt install firefox` |

**Миграция из Яндекс.Браузера (Windows → Linux):**
1. В Windows: синхронизация с аккаунтом Яндекс
2. На Linux: установить Яндекс.Браузер, войти в аккаунт
3. Закладки/пароли синхронизируются автоматически

### 🔌 Драйвера

| Компонент | Статус | Примечание |
|-----------|--------|------------|
| **AMD GPU** | ✅ В ядре | Драйвер `amdgpu` встроен |
| **AMD CPU** | ✅ В ядре | Полная поддержка Ryzen |
| **Wi-Fi** | ✅ В ядре | Большинство адаптеров работают |
| **Звук** | ✅ PipeWire | Современная аудиосистема |
| **Bluetooth** | ✅ BlueZ | Встроенный стек |

**Проверка после установки:**
```bash
lspci -k | grep -A 2 -i vga    # Видеокарта
lsmod | grep amdgpu            # AMD драйвер
rfkill list                    # Wi-Fi/Bluetooth
```

### 📦 Дополнительно

| Софт | Назначение | Команда |
|------|------------|---------|
| **Flatpak** | Менеджер приложений | `sudo apt install flatpak` |
| **TLP** | Энергосбережение | `sudo apt install tlp tlp-rdw` |
| **Timeshift** | Бэкап системы | `sudo apt install timeshift` |
| **GParted** | Управление дисками | `sudo apt install gparted` |
| **htop** | Мониторинг | `sudo apt install htop` |
| **neofetch** | Info о системе | `sudo apt install neofetch` |
| **GDebi** | Установка .deb | `sudo apt install gdebi` |

---

## 📋 Пошаговый план установки

### Шаг 1: Подготовка

```bash
# 1. Скачать Linux Mint 22 Cinnamon
# https://linuxmint.com/download.php
# Выбрать: linuxmint-22-cinnamon-64bit.iso

# 2. Создать загрузочную флешку (на Windows)
# - Использовать Rufus: https://rufus.ie/
# - Выбрать ISO, флешку 8GB+
# - Схема раздела: GPT (для UEFI)

# 3. Сохранить данные
# - WiFi профили: скопировать wifi_profiles/
# - Закладки: синхронизация Яндекс
# - Файлы: внешний диск или облако

# 4. Записать настройки
# - Имя ПК: KSYUSHA
# - Пользователь: ivano
# - WiFi пароли: в xml файлах
```

### Шаг 2: Установка Linux Mint

```
1. Загрузиться с флешки (F12/F2 при старте)
2. Выбрать "Start Linux Mint"
3. Проверить работу Wi-Fi, звука
4. Запустить "Install Linux Mint"
5. Язык: Русский
6. Раскладка: Русская + Английская
7. Кодеки: ✅ Установить мультимедиа кодеки
8. Разметка диска:
   - / (root): 100 ГБ (ext4)
   - /home: 350 ГБ (ext4)
   - swap: 32 ГБ (равно RAM)
9. Часовой пояс: Екатеринбург
10. Пользователь:
    - Имя: Ivan O
    - Имя ПК: KSYUSHA
    - Имя пользователя: ivano
    - Пароль: [ваш пароль]
11. Установить
12. Перезагрузиться
```

### Шаг 3: Первоначальная настройка

```bash
# 1. Обновить систему
sudo apt update && sudo apt upgrade -y

# 2. Установить драйвера (если нужно)
sudo ubuntu-drivers autoinstall  # или Driver Manager в меню

# 3. Включить TLP (энергосбережение)
sudo apt install tlp tlp-rdw
sudo tlp start

# 4. Включить Docker
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ivano

# 5. Включить PostgreSQL
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 6. Включить Flatpak
sudo apt install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# 7. Настроить панели
# Правый клик на панели → Panel Settings → Applets
```

### Шаг 4: Установка софта

```bash
# Разработка
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git docker.io docker-compose postgresql redis-server

# Мультимедиа
sudo apt install -y vlc obs-studio audacity gimp kdenlive

# Офис
wget https://download.onlyoffice.com/install/desktop/editors/linux/onlyoffice-desktopeditors_amd64.deb
sudo apt install -y ./onlyoffice-desktopeditors_amd64.deb
sudo apt install -y libreoffice libreoffice-l10n-ru

# Игры
sudo apt install -y steam lutris

# Утилиты
sudo apt install -y tlp tlp-rdw timeshift gparted htop neofetch gdebi

# Flatpak приложения
flatpak install -y flathub com.getpostman.Postman
flatpak install -y flathub io.dbeaver.DBeaver
flatpak install -y flathub com.heroicgameslauncher.hgl

# Ollama
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl enable ollama
sudo systemctl start ollama

# Яндекс.Браузер
wget https://repo.yandex.ru/yandex-browser/YANDEX-BROWSER-KEY-GPG
sudo apt-key add YANDEX-BROWSER-KEY-GPG
echo "deb [arch=amd64] https://repo.yandex.ru/yandex-browser/deb stable main" | sudo tee /etc/apt/sources.list.d/yandex-browser.list
sudo apt update
sudo apt install -y yandex-browser
```

### Шаг 5: Импорт WiFi

```bash
# Скопировать профили с Windows
mkdir ~/wifi_import
# Скопировать файлы из wifi_profiles/ в ~/wifi_import/

# Конвертировать и импортировать
cd ~/wifi_import
for xml in *.xml; do
    ssid=$(grep -oP '(?<=<name>)[^<]+' "$xml")
    password=$(grep -oP '(?<=<keyMaterial>)[^<]+' "$xml")
    if [ -n "$password" ]; then
        nmcli connection add type wifi con-name "$ssid" ssid "$ssid" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "$password"
        echo "✅ Добавлена: $ssid"
    fi
done

# Проверить
nmcli connection show
```

### Шаг 6: Миграция данных

```
1. Установить Яндекс.Браузер
   - Войти в аккаунт Яндекс
   - Дождаться синхронизации

2. Перенести файлы
   - Документы: ~/Documents
   - Загрузки: ~/Downloads
   - Проекты: ~/Projects

3. Настроить разработку
   git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
   cd Messenger_Balloo_next_ts
   npm install
```

---

## ⚖️ Оценка перехода

### Простота: **8/10**

**Почему не 10:**
- Нужна подготовка (флешка, бэкап)
- 1-2 недели на привыкание

**Почему не 1:**
- Mint создан для перехода с Windows
- Отличный установщик
- Драйвера из коробки

---

### ✅ Плюсы

| Категория | Преимущества |
|-----------|--------------|
| **Производительность** | +20-30% скорости, меньше RAM |
| **Разработка** | Нативная поддержка Docker, Node.js |
| **Безопасность** | Меньше уязвимостей |
| **Контроль** | Полный контроль над системой |
| **Стоимость** | Бесплатно (экономия ~15 000 ₽) |
| **Игры** | 80% Windows-игр через Proton |
| **Приватность** | Нет телеметрии |
| **Стабильность** | Реже требует перезагрузки |
| **DEB-совместимость** | Все .deb пакеты работают |
| **Панели** | Гибкая настройка из коробки |
| **Автономность** | TLP, оптимизация батареи |

---

### ❌ Минусы

| Категория | Недостатки |
|-----------|------------|
| **Совместимость** | Некоторые Windows-программы не работают |
| **Игры** | Anti-cheat не работают (Valorant) |
| **Office** | Форматирование может "плыть" |
| **Поддержка** | Меньше решений на русском |
| **Привыкание** | 1-2 недели адаптации |

---

### ⚠️ Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| **Потеря данных** | Средняя | Критическое | Бэкап + Timeshift |
| **Не работают драйвера** | Низкая | Высокое | Live USB тест |
| **Не работают программы** | Средняя | Среднее | Flatpak/Wine/VM |
| **Проблемы с Wi-Fi** | Низкая | Высокое | USB Wi-Fi адаптер |
| **Steam игры не запускаются** | Средняя | Низкое | Проверка на ProtonDB |

---

## 🎯 Итоговая рекомендация

### **Устанавливать: Linux Mint 22 "Wilma" Cinnamon**

**Оптимальная конфигурация:**
```
CPU: AMD Ryzen 7 5825U ✅
RAM: 32 ГБ ✅
SSD: 512 ГБ ✅
GPU: AMD Radeon ✅
Hostname: KSYUSHA
Username: ivano
```

**Почему Mint:**
- DEB-совместимость ✅
- Настройка панелей из коробки ✅
- Автономность (TLP) ✅
- Работопригодность ✅
- НЕ Ubuntu ✅

---

## 📞 Контакты для помощи

- **Linux Mint RU:** https://linuxmint-ru.ru/
- **Форум:** https://forums.linuxmint.com/
- **Telegram:** @linuxmint_ru
- **Reddit:** r/linuxmint

---

## 📚 Полезные ссылки

- **Скачать Mint:** https://linuxmint.com/download.php
- **Документация:** https://linuxmint.com/documentation.php
- **Ollama:** https://ollama.com/
- **Proton DB:** https://www.protondb.com/
- **OnlyOffice:** https://www.onlyoffice.com/ru/
- **NodeSource:** https://github.com/nodesource/distributions

---

*Файл сохранён на рабочий стол: `linux_migration_plan.md`*

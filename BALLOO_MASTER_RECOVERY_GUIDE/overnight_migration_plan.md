# 🚀 Миграция на Linux Mint 22 ЗА ОДНУ НОЧЬ

**Дата:** 2026-07-02  
**Цель:** Полный переход с Windows на Linux Mint за 6-8 часов  
**Дистрибутив:** Linux Mint 22 "Wilma" Cinnamon Edition (DEB, НЕ Ubuntu)

---

## 📊 Реальная конфигурация устройства

| Компонент | Значение |
|-----------|----------|
| **Диск 0** | SSD 512 ГБ (FORESEE XP1100F512G) — Windows C: |
| **Диск 1** | SD-карта 122 ГБ (FAT32) — D: |
| **Система** | KSYUSHA, пользователь IvanO |
| **WiFi** | 68 профилей сохранено |

---

## ⏰ Таймлайн на одну ночь (18:00 → 02:00)

| Время | Этап | Длительность |
|-------|------|--------------|
| **18:00-19:00** | Подготовка (бэкап, флешка) | 1 час |
| **19:00-21:00** | Установка Linux Mint | 2 часа |
| **21:00-22:00** | Базовая настройка | 1 час |
| **22:00-00:00** | Установка софта (Dev + AI) | 2 часа |
| **00:00-01:00** | Настройка панелей | 1 час |
| **01:00-02:00** | Перенос Balloo, тесты | 1 час |

**Итого:** 8 часов

---

## 🎯 Итоговая разметка диска

```
┌─────────────────────────────────────────────────────────┐
│  Диск 0: SSD 512 ГБ (FORESEE XP1100F512G)               │
├─────────────────────────────────────────────────────────┤
│  EFI System             │ 300 МБ ( FAT32, оставить)     │
│  [Удалить] Windows C:   │ 476 ГБ → ОСВОБОДИТЬ           │
│  [Удалить] Recovery     │ 1.1 ГБ → ОСВОБОДИТЬ           │
│  Linux Mint / (root)    │ 100 ГБ (ext4)                 │
│  Linux Mint /home       │ 150 ГБ (ext4)                 │
│  /development           │ 250 ГБ (ext4) ⭐              │
│  Linux swap             │ 32 ГБ (swap, = RAM)           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Диск 1: SD-карта 122 ГБ (FAT32)                        │
├─────────────────────────────────────────────────────────┤
│  D: Общие данные    │ 122 ГБ (NTFS после форматирования)│
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Этап 1: Подготовка (18:00-19:00)

### 1.1 Бэкап критичных данных

```powershell
# 1. Сохранить WiFi профили (уже сделано)
#    BALLOO_MASTER_RECOVERY_GUIDE/wifi_profiles/ (68 файлов)

# 2. Сохранить системную информацию
hostname
whoami
# KSYUSHA, IvanO

# 3. Скопировать важные файлы на SD-карту (D:)
xcopy "C:\Users\IvanO\Documents\Balloo" "D:\Balloo_Backup" /E /I /H
xcopy "C:\Users\IvanO\OneDrive\Desktop\проекты\app_balloo" "D:\Balloo_Project" /E /I /H

# 4. Проверить SD-карту
dir D:\
```

### 1.2 Создание загрузочной флешки

```
1. Скачать Linux Mint 22 Cinnamon (прямо сейчас):
   https://mirror.yandex.ru/linuxmint/stable/22/linuxmint-22-cinnamon-64bit.iso
   Размер: 2.5 ГБ, ~15-30 минут

2. Скачать Rufus:
   https://rufus.ie/

3. Записать образ на флешку 8ГБ+:
   - Схема раздела: GPT
   - Целевая система: UEFI
   - Время записи: ~10 минут
```

### 1.3 Подготовка диска

```powershell
# Отключить Fast Boot
powercfg /h off

# Сжать диск C: (до 100 ГБ для Linux)
# Управление дисками → C: → Сжать том → 380000 МБ
```

---

## 🐧 Этап 2: Установка Linux Mint (19:00-21:00)

### 2.1 Загрузка с флешки

```
1. Перезагрузка → F12 (Boot Menu)
2. Выбрать USB-флешку
3. "Start Linux Mint"
```

### 2.2 Разметка диска (ВАЖНО!)

```
1. Запустить "Install Linux Mint"
2. Язык: Русский
3. Раскладка: Русская + Английская
4. Кодеки: ✅ Установить

5. Тип установки: "Другой вариант"

6. Удалить разделы Windows на диске 0:
   - Раздел 3: Windows C: (476 ГБ) → Удалить
   - Раздел 4: Recovery (1.1 ГБ) → Удалить
   - ⚠️ НЕ трогать раздел 1 (EFI System 300 МБ)!

7. Создать разделы в освободившемся месте:

   a) / (root):
      - Размер: 100000 МБ
      - Тип: Первичный
      - Файловая система: ext4
      - Точка монтирования: /

   b) /home:
      - Размер: 150000 МБ
      - Тип: Первичный
      - Файловая система: ext4
      - Точка монтирования: /home

   c) /development:
      - Размер: 250000 МБ (всё оставшееся)
      - Тип: Первичный
      - Файловая система: ext4
      - Точка монтирования: /development

   d) swap:
      - Размер: 32000 МБ
      - Тип: Логический
      - Использовать как: Раздел подкачки

8. Загрузчик: /dev/nvme0n1 (диск, не раздел!)
9. Часовой пояс: Екатеринбург
10. Пользователь:
    - Имя: Ivan O
    - ПК: KSYUSHA
    - Логин: ivano
    - Пароль: [ваш]
```

### 2.3 Первая загрузка

```
1. Извлечь флешку
2. Загрузится Linux Mint
3. Проверить WiFi, звук, тачпад
```

---

## ⚙️ Этап 3: Базовая настройка (21:00-22:00)

### 3.1 Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

### 3.2 Установка драйверов

```bash
# Проверить проприетарные драйверы
sudo ubuntu-drivers devices
sudo ubuntu-drivers autoinstall

# Для AMD Ryzen (если у вас AMD)
sudo apt install firmware-amd-graphics
```

### 3.3 Настройка WiFi

```bash
# Импортировать WiFi профили
cd /home/ivano/Downloads
# Скопировать wifi_profiles с SD-карты

# Для каждого профиля:
for xml in *.xml; do
    ssid=$(grep -oP '(?<=<name>)[^<]+' "$xml")
    password=$(grep -oP '(?<=<keyMaterial>)[^<]+' "$xml")
    nmcli connection add type wifi con-name "$ssid" ssid "$ssid" \
        wifi-sec.key-mgmt wpa-psk wifi-sec.psk "$password"
done
```

### 3.4 Настройка hostname

```bash
sudo hostnamectl set-hostname KSYUSHA
echo "127.0.1.1 KSYUSHA" | sudo tee -a /etc/hosts
```

### 3.5 Монтирование SD-карты

```bash
# Форматировать в NTFS (если нужно)
sudo mkfs.ntfs /dev/mmcblk0p1 -L "DATA"

# Автомонтирование
sudo mkdir /mnt/data
sudo blkid  # узнать UUID
sudo nano /etc/fstab
# Добавить: UUID=xxxx-xxxx  /mnt/data  ntfs-3g  defaults  0  0

sudo mount -a
```

---

## 📦 Этап 4: Установка софта (22:00-00:00)

### 4.1 Разработка (Dev)

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git docker.io docker-compose postgresql redis-server

# Проверка
node --version  # v22.x
npm --version   # 10.x
git --version   # 2.x
docker --version

# Клонировать Balloo
cd /development
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Messenger_Balloo_next_ts
npm install
```

### 4.2 ИИ (AI)

```bash
# Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Модели
ollama pull llama3.1          # Тексты (8B)
ollama pull mistral           # Код (7B)
ollama pull deepseek-coder    # Код (6.7B)
ollama pull sdxl              # Изображения

# Проверка
ollama run llama3.1 "Привет!"
```

### 4.3 Офис и браузер

```bash
# OnlyOffice (русский, DEB)
wget https://download.onlyoffice.com/install/desktop/editors/linux/onlyoffice-desktopeditors_amd64.deb
sudo apt install ./onlyoffice-desktopeditors_amd64.deb

# Yandex Browser (синхронизация)
wget https://repo.yandex.ru/yandex-browser/deb/pool/main/y/yandex-browser-stable/yandex-browser-stable_*.amd64.deb
sudo apt install ./yandex-browser-stable_*.amd64.deb
```

### 4.4 Медиа и запись

```bash
# OBS Studio (запись лекций)
sudo apt install obs-studio

# Audacity (аудио)
sudo apt install audacity

# VLC
sudo apt install vlc

# GIMP (графика)
sudo apt install gimp
```

### 4.5 Утилиты

```bash
# TLP (автономность)
sudo apt install tlp tlp-rdw
sudo tlp start

# GParted (разметка)
sudo apt install gparted

# htop (мониторинг)
sudo apt install htop
```

---

## 🖥️ Этап 5: Настройка панелей Cinnamon (00:00-01:00)

### 5.1 Верхняя панель (меню, окна, сеть, звук, Bluetooth, трей, время, погода, язык)

```
Правый клик на верхней панели → Настройки панели

1. Левая сторона (слева направо):
   - Меню (кнопка "Меню")
   - Список окон (группировать окна)
   - Разделитель (гибкий)

2. Правая сторона (справа налево):
   - Сеть (NetworkManager)
   - Звук
   - Bluetooth
   - Системный трей
   - Погода (applet)
   - Часы (формат: ДД МММ ЧЧ:ММ)
   - Раскладка клавиатуры

Настройка:
- Размер панели: 28px
- Авто-скрытие: выкл
- Прозрачность: 0%
```

### 5.2 Нижняя панель (CPU, память, IP, сеть, батарея, оперативка, дата, дела)

```
Правый клик на нижней панели → Настройки панели

1. Добавить апплеты (справа налево):
   - Системный монитор (CPU: температура/загрузка)
   - Использование памяти (RAM)
   - Индикатор батареи
   - Сетевой монитор (IP, скорость)
   - Календарь (дата)
   - Заметки/Дела (Xnote или Sticky Notes)
   - Свернуть все окна

2. Настройка системного монитора:
   - Показать: CPU загрузка %, Температура
   - Обновление: 2 сек
   - Цвет: зелёный/жёлтый/красный

3. Настройка памяти:
   - Показать: RAM %, Swap %
   - Формат: 8.2/16 ГБ (51%)

4. Настройка сети:
   - Показать: IP адрес, SSID, скорость
   - Формат: 192.168.1.X | WiFi | ↑10 ↓50 MB/s

Настройка:
- Размер панели: 28px
- Положение: низ
- Авто-скрытие: выкл
```

### 5.3 Установка дополнительных апплетов

```bash
# Установка через менеджер апплетов Cinnamon:
# Меню → Апплеты → Скачать

- System Monitor (CPU/RAM/Temp)
- Weather (OpenWeatherMap)
- Network Speed
- Sticky Notes (дела)
- Battery Percentage
```

### 5.4 Конфигурация панелей (резервное копирование)

```bash
# Экспорт настроек панелей
gsettings get org.cinnamon panels-enabled > ~/panel_backup.txt
gsettings get org.cinnamon enabled-applets >> ~/panel_backup.txt

# Копировать на SD-карту
cp ~/panel_backup.txt /mnt/data/
```

---

## 🎯 Этап 6: Перенос Balloo и тесты (01:00-02:00)

### 6.1 Восстановление Balloo

```bash
# С SD-карты
cp -r /mnt/data/Balloo_Project /development/
cd /development/Messenger_Balloo_next_ts

# Установить зависимости
npm install

# Запустить сервер
npm run dev
```

### 6.2 Проверка работы

```bash
# Проверить сервер
curl http://localhost:3440/api/sections

# Проверить базу данных
psql -U postgres -c "\l"

# Проверить Docker
docker ps

# Проверить Ollama
ollama list
```

### 6.3 Финальные настройки

```bash
# Автозапуск сервера Balloo
nano ~/.bashrc
# Добавить:
# cd /development/Messenger_Balloo_next_ts && npm run dev &

# Создать ярлык на рабочем столе
cd ~/Desktop
cat > balloo-server.desktop << EOF
[Desktop Entry]
Name=Balloo Server
Exec=gnome-terminal --working-directory=/development/Messenger_Balloo_next_ts -e "npm run dev"
Type=Application
Icon=utilities-terminal
EOF
chmod +x balloo-server.desktop
```

---

## ✅ Чеклист перед поездом

- [ ] Флешка с Linux Mint 22 записана
- [ ] Бэкап на SD-карту скопирован
- [ ] Пароль от WiFi записан
- [ ] Зарядка ноутбука с собой
- [ ] Флешка 8ГБ+ с собой

---

## 🚨 Экстренная помощь

### Если не загружается:

```bash
# Загрузиться с Live USB
sudo add-apt-repository ppa:yannubuntu/boot-repair
sudo apt update
sudo apt install boot-repair
boot-repair
```

### Если нет WiFi:

```bash
# Использовать USB WiFi адаптер
# Или tethering с телефона через USB

# Включить режим модема на телефоне
# Подключить USB
nmcli connection show
```

### Если не работает звук:

```bash
# Переустановить PulseAudio
sudo apt install --reinstall pulseaudio pavucontrol
pulseaudio -k
pulseaudio --start
```

---

## 🎯 Итог

**После 8 часов:**
- ✅ Windows удалён
- ✅ Linux Mint 22 установлен
- ✅ Верхняя панель: меню, окна, сеть, звук, Bluetooth, трей, время, погода, язык
- ✅ Нижняя панель: CPU (температура/занятость), память, IP, сеть, батарея, оперативка, дата, дела
- ✅ /development 250 ГБ для Balloo/лекций/творчества
- ✅ WiFi подключён (68 профилей)
- ✅ Dev-окружение: Node.js 22, Docker, PostgreSQL, Redis
- ✅ AI: Ollama (Llama 3.1, Mistral, DeepSeek Coder)
- ✅ Автономность: TLP включён

**Готов к работе в поезде!** 🚂

---

*План для быстрой миграции без потери данных*

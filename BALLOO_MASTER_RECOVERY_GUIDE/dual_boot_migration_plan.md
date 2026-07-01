# 🐧 Dual-Boot: Windows + Linux Mint 22

**Дата:** 2026-07-02  
**Цель:** Параллельная установка с последующим удалением Windows  

---

## 📋 План из 3 этапов

### Этап 1: Dual-Boot (параллельная установка)
**Срок:** 1-2 недели  
**Цель:** Перенос данных, тестирование Linux

### Этап 2: Полная миграция
**Срок:** 1 неделя  
**Цель:** Перенос всех данных, настройка окружения

### Этап 3: Удаление Windows
**Срок:** 1 день  
**Цель:** Освобождение диска для разработки

---

## 📁 Этап 1: Dual-Boot установка

### Требования

| Требование | Значение |
|------------|----------|
| **Свободное место** | Минимум 100 ГБ (рекомендуется 150 ГБ) |
| **Флешка** | 8 ГБ+ для загрузочного образа |
| **Бэкап** | Обязателен перед изменением разделов |
| **Время** | 2-3 часа |

### Разметка диска (до)

```
┌─────────────────────────────────────────────────────────┐
│  Диск 0: 512 ГБ SSD                                     │
├─────────────────────────────────────────────────────────┤
│  [C:] Windows 11          │ 350 ГБ (NTFS)               │
│  [D:] Данные              │ 150 ГБ (NTFS)               │
│  Восстановление           │ 1 ГБ                        │
│  EFI System               │ 100 МБ                      │
└─────────────────────────────────────────────────────────┘
```

### Разметка диска (после Dual-Boot)

```
┌─────────────────────────────────────────────────────────┐
│  Диск 0: 512 ГБ SSD                                     │
├─────────────────────────────────────────────────────────┤
│  [C:] Windows 11          │ 200 ГБ (NTFS)               │
│  [Linux] / (root)         │ 100 ГБ (ext4)               │
│  [Linux] /home            │ 200 ГБ (ext4)               │
│  [Linux] swap             │ 32 ГБ (swap)                │
│  [D:] Данные (общий)      │ 150 ГБ (NTFS)               │
│  EFI System               │ 100 МБ (общий)              │
└─────────────────────────────────────────────────────────┘
```

### Пошаговая установка Dual-Boot

#### Шаг 1: Подготовка в Windows

```powershell
# 1. Очистить место на диске C:
#    - Удалить временные файлы
#    - Очистить корзину
#    - Перенести большие файлы на D:

# 2. Сжать раздел C:
#    - Win+X → Управление дисками
#    - Правый клик на C: → Сжать том
#    - Размер: 200000 МБ (200 ГБ для Linux)
#    - Сжать

# 3. Отключить Fast Boot:
#    - Панель управления → Электропитание
#    - Действие кнопок питания
#    - Изменение недоступных параметров
#    - Снять галочку "Включить быстрый запуск"

# 4. Отключить Secure Boot (в BIOS):
#    - Перезагрузка → F2/F12 (вход в BIOS)
#    - Security → Secure Boot → Disabled
#    - Save & Exit
```

#### Шаг 2: Создание загрузочной флешки

```
1. Скачать Linux Mint 22 Cinnamon:
   https://linuxmint.com/download.php
   Файл: linuxmint-22-cinnamon-64bit.iso (2.5 ГБ)

2. Скачать Rufus:
   https://rufus.ie/

3. В Rufus:
   - Устройство: флешка 8ГБ+
   - Метод загрузки: Выбрать ISO
   - Схема раздела: GPT
   - Целевая система: UEFI
   - Начать

4. Дождаться записи (~10 минут)
```

#### Шаг 3: Установка Linux Mint

```
1. Перезагрузка с флешки (F12 при старте)
2. Выбрать: "Start Linux Mint"
3. Проверить работу Wi-Fi, звука
4. Запустить "Install Linux Mint"

5. Язык: Русский
6. Раскладка: Русская + Английская

7. Кодеки: ✅ Установить мультимедиа кодеки

8. Тип установки: ⚠️ ВАЖНО!
   → "Другой вариант" (ручная разметка)

9. Разметка (в нераспределённом месте 200 ГБ):

   a) Создать раздел / (root):
      - Размер: 100000 МБ (100 ГБ)
      - Тип: Первичный
      - Место: Начало
      - Использовать как: Журналируемая ext4
      - Точка монтирования: /

   b) Создать раздел /home:
      - Размер: 68000 МБ (~68 ГБ)
      - Тип: Первичный
      - Место: Начало
      - Использовать как: Журналируемая ext4
      - Точка монтирования: /home

   c) Создать раздел swap:
      - Размер: 32000 МБ (32 ГБ = RAM)
      - Тип: Логический
      - Использовать как: Раздел подкачки

10. Загрузчик (GRUB):
    - Устройство: /dev/nvme0n1 (диск, НЕ раздел)
    - Это позволит выбирать ОС при загрузке

11. Часовой пояс: Екатеринбург

12. Пользователь:
    - Имя: Ivan O
    - Имя ПК: KSYUSHA
    - Имя пользователя: ivano
    - Пароль: [ваш пароль]

13. Установить
14. Дождаться установки (~20 минут)
15. Перезагрузиться
16. Вынуть флешку
```

#### Шаг 4: Первая загрузка

```
При загрузке появится меню GRUB:

┌─────────────────────────────────────────┐
│  GNU GRUB                               │
├─────────────────────────────────────────┤
│  > Linux Mint GNU/Linux                 │
│    Linux Mint GNU/Linux (recovery)      │
│    Windows Boot Manager                 │
│    Memory test (memtest86+)             │
└─────────────────────────────────────────┘

Стрелки: выбор ОС
Enter: загрузка
Таймер: 10 сек (загрузится Linux по умолчанию)
```

---

## 📁 Этап 2: Перенос данных

### Настройка доступа к разделам

```bash
# В Linux смонтировать раздел D: (данные)
sudo mkdir /mnt/data
sudo mount /dev/nvme0n1pX /mnt/data  # X = номер раздела D:

# Автомонтирование при загрузке
sudo blkid  # узнать UUID раздела D:
sudo nano /etc/fstab
# Добавить строку:
# UUID=XXXX-XXXX  /mnt/data  ntfs-3g  defaults  0  0
```

### Перенос файлов

```bash
# Создать структуру папок в /home/ivano/
mkdir -p ~/Documents/{Balloo,Лекции,Творчество}
mkdir -p ~/Projects
mkdir -p ~/Media/{Фото,Видео,Музыка}

# Копирование из Windows раздела C:
# (смонтирован автоматически в /media/ivano/Windows)

cp -r /media/ivano/Windows/Users/IvanO/Documents/* ~/Documents/
cp -r /media/ivano/Windows/Users/IvanO/Desktop/* ~/Desktop/
cp -r /media/ivano/Windows/Users/IvanO/Downloads/* ~/Downloads/

# Копирование из общего раздела D:
cp -r /mnt/data/Projects/* ~/Projects/
cp -r /mnt/data/Media/* ~/Media/
```

### Настройка окружения для разработки

```bash
# Установить Node.js, Docker, PostgreSQL
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git docker.io docker-compose postgresql redis-server

# Клонировать Balloo репозиторий
cd ~/Projects
git clone https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts.git
cd Messenger_Balloo_next_ts
npm install

# Проверить работу
npm run dev
```

### Настройка для лекций и творчества

```bash
# OnlyOffice (офис)
wget https://download.onlyoffice.com/install/desktop/editors/linux/onlyoffice-desktopeditors_amd64.deb
sudo apt install ./onlyoffice-desktopeditors_amd64.deb

# OBS Studio (запись лекций)
sudo apt install obs-studio

# Audacity (аудио)
sudo apt install audacity

# GIMP (графика)
sudo apt install gimp

# Ollama (ИИ для творчества)
curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3.1  # Тексты
ollama run sdxl      # Изображения
```

---

## 🗑️ Этап 3: Удаление Windows (после 1-2 недель)

### Проверка перед удалением

```bash
# ✅ Все файлы перенесены?
ls -la ~/Documents/
ls -la ~/Projects/

# ✅ Все программы работают?
node --version
docker --version
psql --version

# ✅ WiFi подключается?
nmcli connection show --active

# ✅ Бэкап сделан?
# (внешний диск или облако)
```

### Удаление Windows

```
1. Загрузиться в Linux Mint

2. Открыть GParted:
   sudo apt install gparted
   sudo gparted

3. Удалить разделы Windows:
   - Windows C: (NTFS, 200 ГБ)
   - Windows Recovery (NTFS, 1 ГБ)
   - ⚠️ НЕ удалять EFI System (100 МБ)!
   - ⚠️ НЕ удалять разделы Linux!

4. Освободившееся место → новый раздел:
   - Имя: [Development]
   - Файловая система: ext4
   - Точка монтирования: /development
   - Размер: всё доступное (~200 ГБ)

5. Применить изменения

6. Обновить GRUB:
   sudo update-grub

7. Перезагрузиться
```

### Итоговая разметка диска

```
┌─────────────────────────────────────────────────────────┐
│  Диск 0: 512 ГБ SSD                                     │
├─────────────────────────────────────────────────────────┤
│  [Linux] / (root)         │ 100 ГБ (ext4)               │
│  [Linux] /home            │ 200 ГБ (ext4)               │
│  [Development]            │ 200 ГБ (ext4)               │
│  [Linux] swap             │ 32 ГБ (swap)                │
│  EFI System               │ 100 МБ (общий)              │
└─────────────────────────────────────────────────────────┘
```

### Настройка раздела разработки

```bash
# Создать точку монтирования
sudo mkdir /development
sudo chown ivano:ivano /development

# Структура для разработки/лекций/творчества
mkdir -p /development/{Balloo,Лекции,Творчество,Media}

# Символические ссылки из home
ln -s /development/Balloo ~/Projects/Balloo
ln -s /development/Лекции ~/Documents/Лекции
ln -s /development/Творчество ~/Documents/Творчество
```

---

## ⚠️ Важные предупреждения

### Перед установкой Dual-Boot

| Действие | Обязательно |
|----------|-------------|
| Бэкап важных данных | ✅ Да |
| Проверка целостности ISO | ✅ Да |
| Зарядка ноутбука | ✅ 100% |
| Отключение Fast Boot | ✅ Да |
| Отключение Secure Boot | ✅ Да |

### Риски и решения

| Риск | Вероятность | Решение |
|------|-------------|---------|
| Потеря данных | Средняя | Бэкап на внешний диск |
| Не загружается Windows | Низкая | Boot-Repair в Live USB |
| Не загружается Linux | Низкая | GRUB reinstall из Live USB |
| Проблемы с Wi-Fi | Низкая | USB Wi-Fi адаптер временно |

---

## 🎯 Таймлайн

| Этап | Длительность | Действия |
|------|--------------|----------|
| **Подготовка** | 1 день | Бэкап, сжатие диска, флешка |
| **Установка Dual-Boot** | 2-3 часа | Разметка, установка |
| **Перенос данных** | 1-2 дня | Копирование, настройка |
| **Тестирование** | 1-2 недели | Работа в Linux, проверка |
| **Удаление Windows** | 1 день | GParted, настройка |
| **Финальная настройка** | 1 день | Раздел разработки |

**Итого:** 2-3 недели на полную миграцию

---

## 📞 Экстренная помощь

### Если Windows не загружается после GRUB:

```bash
# Загрузиться с Live USB
sudo add-apt-repository ppa:yannubuntu/boot-repair
sudo apt update
sudo apt install boot-repair
boot-repair
```

### Если Linux не загружается:

```bash
# Загрузиться с Live USB
sudo mount /dev/nvme0n1pX /mnt  # X = раздел Linux
sudo mount --bind /dev /mnt/dev
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys
sudo chroot /mnt
grub-install /dev/nvme0n1
update-grub
exit
reboot
```

---

*План для плавной миграции с сохранением данных*

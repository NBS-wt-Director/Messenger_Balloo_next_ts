# 🖥️ Детальная настройка панелей Cinnamon

**Верхняя панель:** Меню, Окна, Сеть, Звук, Bluetooth, Трей, Время, Погода, Язык  
**Нижняя панель:** CPU (температура/занятость), Память, IP, Сеть, Батарея, Оперативка, Дата, Дела

---

## 📊 Реальная конфигурация устройства

| Параметр | Значение |
|----------|----------|
| **SSD** | 512 ГБ (FORESEE XP1100F512G) |
| **SD-карта** | 122 ГБ (FAT32) |
| **RAM** | 32 ГБ (исходя из swap 32 ГБ) |
| **CPU** | AMD Ryzen (требуется проверка) |
| **WiFi** | 68 профилей |

---

## 🔧 Шаг 1: Установка необходимых апплетов

### 1.1 Через менеджер апплетов (GUI)

```
1. Меню → Системные настройки → Апплеты
2. Вкладка "Загрузка"
3. Установить:
   - System Monitor (CPU/RAM/Temp)
   - Weather (OpenWeatherMap)
   - Network Speed
   - Sticky Notes
   - Battery Percentage
   - IP Address Display

4. Нажать "Обновить"
5. Перейти во вкладку "Управление"
6. Включить все установленные апплеты
```

### 1.2 Через терминал

```bash
# Установить пакет апплетов Cinnamon Spices
sudo apt install cinnamon-spices-applets

# Конфигурационные файлы апплетов находятся в:
# ~/.local/share/cinnamon/applets/
```

---

## 🔝 Шаг 2: Настройка ВЕРХНЕЙ панели

### 2.1 Левая сторона (слева направо)

```
1. Кнопка "Меню" (cinnamon-menu@applet.org)
   - Правый клик → Настроить
   - Показать имена приложений: да
   - Размер иконок: 22px
   - Стиль: классический

2. Список окон (window-list@cinnamon.org)
   - Правый клик → Настроить
   - Группировать окна: да
   - Показывать только на текущем рабочем столе: нет
   - Размер значков: 20px

3. Разделитель (панель1:left)
   - Правый клик → Настроить
   - Тип: гибкий разделитель
```

### 2.2 Правая сторона (справа налево)

```
1. Сеть (network@cinnamon.org)
   - Правый клик → Настроить
   - Показывать скорость: да
   - Показывать SSID: да

2. Звук (sound@cinnamon.org)
   - Правый клик → Настроить
   - Показывать уровень громкости: да
   - Управление воспроизведением: да

3. Bluetooth (bluetooth@cinnamon.org)
   - Правый клик → Настроить
   - Показывать значок в трее: да

4. Системный трей (systray@cinnamon.org)
   - Правый клик → Настроить
   - Показывать все значки: да
   - Исключения: нет

5. Погода (weather@mockturtz)
   - Правый клик → Настроить
   - Город: Екатеринбург
   - Единицы: Цельсий
   - Обновление: 30 минут
   - Формат: +22° ☁️

6. Часы (calendar@cinnamon.org)
   - Правый клик → Настроить
   - Формат времени: ЧЧ:ММ
   - Формат даты: ДД МММ
   - Показывать секунды: нет
   - Календарь по клику: да

7. Раскладка клавиатуры (keyboard@cinnamon.org)
   - Правый клик → Настроить
   - Показывать флаг: да
   - Переключение: Ctrl+Shift
```

### 2.3 Настройки панели

```
Правый клик на верхней панели → Настройки панели

- Размер панели: 28 пикселей
- Вертикальная позиция: верх
- Авто-скрытие: выкл
- Прозрачность: 0%
- Цвет фона: #2C2C2C (тёмно-серый)
- Цвет текста: #FFFFFF (белый)
```

---

## 🔽 Шаг 3: Настройка НИЖНЕЙ панели

### 3.1 Создание нижней панели

```
1. Правый клик на верхней панели → Настройки панели
2. Нажать "+" (добавить панель)
3. Выбрать позицию: низ
4. Размер: 28 пикселей
```

### 3.2 Апплеты нижней панели (справа налево)

```
1. Системный монитор (System Monitor)
   - Правый клик → Настроить
   - Показать CPU: да
   - Показать температуру: да
   - Порог температуры: 70°C (жёлтый), 85°C (красный)
   - Частота обновления: 2 сек
   - Формат: CPU: 45% | 62°C

2. Использование памяти (Memory Usage)
   - Правый клик → Настроить
   - Показать RAM: да
   - Показать Swap: да
   - Формат: RAM: 8.2/32 ГБ (26%)

3. Индикатор батареи (Battery)
   - Правый клик → Настроить
   - Показывать процент: да
   - Показывать время: да
   - Формат: 🔋 85% (2:30)

4. Сетевой монитор (Network Speed)
   - Правый клик → Настроить
   - Показать IP: да
   - Показать скорость: да
   - Формат: 192.168.1.X | ↑10 ↓50 MB/s

5. Календарь (Date)
   - Правый клик → Настроить
   - Формат: ДД ММММ ГГГГ
   - Показывать день недели: да
   - Формат: Чт 02 Июль 2026

6. Заметки/Дела (Sticky Notes)
   - Правый клик → Настроить
   - Цвет заметок: жёлтый
   - Шрифт: Monospace 10
   - Автосохранение: да

7. Свернуть все окна (Show Desktop)
   - Правый клик → Настроить
   - Иконка: рабочий стол
   - Действие: свернуть все
```

### 3.3 Настройки нижней панели

```
Правый клик на нижней панели → Настройки панели

- Размер панели: 28 пикселей
- Вертикальная позиция: низ
- Авто-скрытие: выкл
- Прозрачность: 0%
- Цвет фона: #1A1A1A (очень тёмный)
- Цвет текста: #E0E0E0 (светло-серый)
```

---

## 📦 Шаг 4: Установка дополнительных апплетов

### 4.1 System Monitor (CPU/RAM/Temp)

```bash
# Через GUI:
Меню → Системные настройки → Апплеты → Загрузка → System Monitor → Установить

# Конфигурация:
~/.config/cinnamon/spices/applets/System\ Monitor@xxxx/settings.json

{
  "cpu_enabled": true,
  "temp_enabled": true,
  "ram_enabled": true,
  "update_interval": 2000,
  "temp_threshold_warn": 70,
  "temp_threshold_crit": 85
}
```

### 4.2 Weather (OpenWeatherMap)

```bash
# Через GUI:
Меню → Системные настройки → Апплеты → Загрузка → Weather → Установить

# Получить API ключ:
https://openweathermap.org/api

# Конфигурация:
~/.config/cinnamon/spices/applets/Weather@xxxx/settings.json

{
  "city": "Yekaterinburg",
  "api_key": "ваш_ключ",
  "units": "metric",
  "update_interval": 1800
}
```

### 4.3 Network Speed

```bash
# Через GUI:
Меню → Системные настройки → Апплеты → Загрузка → Network Speed → Установить

# Конфигурация:
{
  "show_ip": true,
  "show_ssid": true,
  "show_speed": true,
  "update_interval": 1000
}
```

### 4.4 Sticky Notes (Дела)

```bash
# Через GUI:
Меню → Системные настройки → Апплеты → Загрузка → Sticky Notes → Установить

# Конфигурация:
{
  "default_color": "#FFFF99",
  "font": "Monospace 10",
  "autosave": true,
  "save_path": "/home/ivano/Documents/notes"
}
```

---

## 💾 Шаг 5: Резервное копирование настроек

### 5.1 Экспорт настроек панелей

```bash
# Создать резервную копию
mkdir -p /mnt/data/cinnamon_backup

# Экспорт настроек панелей
gsettings get org.cinnamon panels-enabled > /mnt/data/cinnamon_backup/panels.txt
gsettings get org.cinnamon enabled-applets >> /mnt/data/cinnamon_backup/panels.txt
gsettings get org.cinnamon enabled-desklets >> /mnt/data/cinnamon_backup/panels.txt
gsettings get org.cinnamon enabled-extensions >> /mnt/data/cinnamon_backup/panels.txt

# Копировать конфиги апплетов
cp -r ~/.config/cinnamon/spices/applets /mnt/data/cinnamon_backup/

# Копировать конфиги панели
cp -r ~/.cinnamon/configs /mnt/data/cinnamon_backup/

# Проверка
ls -la /mnt/data/cinnamon_backup/
```

### 5.2 Импорт настроек (после переустановки)

```bash
# Восстановить конфиги
cp -r /mnt/data/cinnamon_backup/applets ~/.config/cinnamon/spices/
cp -r /mnt/data/cinnamon_backup/configs ~/.cinnamon/

# Применить настройки
gsettings set org.cinnamon panels-enabled "$(cat /mnt/data/cinnamon_backup/panels.txt)"

# Перезапустить Cinnamon
Alt+F2 → r → Enter
```

---

## 🎨 Шаг 6: Темы и оформление

### 6.1 Установка тёмной темы

```bash
# Установить темы
sudo apt install mint-y-theme

# Применить тему
gsettings set org.cinnamon.theme name 'Mint-Y-Dark'

# Установить иконки
sudo apt install mint-x-icons
gsettings set org.cinnamon.desktop.interface icon-theme 'Mint-X-Dark'

# Установить курсор
gsettings set org.cinnamon.desktop.interface cursor-theme 'Mint-Y-Dark'
```

### 6.2 Настройка шрифтов

```bash
# Установить шрифты
sudo apt install fonts-roboto fonts-noto fonts-noto-cjk

# Применить шрифты
gsettings set org.cinnamon.desktop.interface font-name 'Roboto 10'
gsettings set org.cinnamon.desktop.interface monospace-font-name 'JetBrains Mono 10'
gsettings set org.cinnamon.desktop.interface document-font-name 'Roboto 11'
```

---

## ⚡ Шаг 7: Оптимизация автономности

### 7.1 TLP (Power Management)

```bash
# Установить TLP
sudo apt install tlp tlp-rdw
sudo tlp start

# Конфигурация
sudo nano /etc/tlp.conf

# Изменить:
CPU_SCALING_GOVERNOR_ON_AC=performance
CPU_SCALING_GOVERNOR_ON_BAT=powersave
CPU_ENERGY_PERF_POLICY_ON_AC=performance
CPU_ENERGY_PERF_POLICY_ON_BAT=power
WIFI_PWR_ON_AC=off
WIFI_PWR_ON_BAT=on
```

### 7.2 Индикатор батареи на панели

```
Правый клик на индикаторе батареи → Настроить

- Показывать процент: да
- Показывать время: да
- Предупреждение: 15%
- Критический уровень: 5%
- Действие при критическом: гибернация
```

---

## 🔍 Шаг 8: Проверка работы

### 8.1 Проверка апплетов

```bash
# Список установленных апплетов
cinnamon-spice-manager applets

# Проверка системного монитора
watch -n 2 'cat /proc/cpuinfo | grep "cpu MHz" | head -1'

# Проверка температуры
sensors

# Проверка батареи
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

### 8.2 Перезапуск Cinnamon

```
Если что-то не работает:

1. Alt+F2
2. Ввести: r
3. Нажать Enter

Или через терминал:
killall -HUP cinnamon
```

---

## 📋 Итоговая конфигурация панелей

### Верхняя панель (28px, #2C2C2C)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ☰ Меню  [Окно1] [Окно2]           🌐 WiFi  🔊 Звук  📶 BT  ⚙️  +22°  14:30  RU │
└─────────────────────────────────────────────────────────────────────────┘
```

### Нижняя панель (28px, #1A1A1A)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🖥️ CPU: 45% | 62°C  💾 8.2/32 ГБ  🔋 85% (2:30)  🌐 192.168.1.X  📅 02 Июль  📝 Дела  🏠 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

*Готово к настройке за 1 час!*

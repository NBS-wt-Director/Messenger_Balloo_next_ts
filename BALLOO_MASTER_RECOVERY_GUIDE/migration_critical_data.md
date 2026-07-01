# 🔐 Критически важные данные для миграции

**Дата экспорта:** 2026-07-02  
**Компьютер:** KSYUSHA  
**Пользователь:** IvanO  

---

## 🖥️ Системная информация

| Параметр | Значение |
|----------|----------|
| **Имя компьютера** | KSYUSHA |
| **Имя пользователя** | IvanO |
| **Домен** | KSYUSHA |
| **Полное имя ПК** | KSYUSHA\IvanO |

### Для настройки на Linux:

```bash
# hostname (имя компьютера)
sudo hostnamectl set-hostname KSYUSHA

# username (имя пользователя)
# Создаётся при установке Linux
Username: ivano
Password: [ваш пароль]

# Full name
chfn -f "Ivan O" ivano
```

---

## 📡 WiFi профили (68 сетей)

**Путь экспорта:** `BALLOO_MASTER_RECOVERY_GUIDE/wifi_profiles/`  
**Формат:** XML (Windows netsh)  
**Пароли:** ✅ Включены в экспорт (key=clear)

### Основные домашние/рабочие сети:

| SSID | Приоритет | Использование |
|------|-----------|---------------|
| OberHomeIA | Высокий | Дом |
| Freedom_Yubileyniy | Высокий | Работа |
| Иван | Средний | Дом резерв |
| Жизньмарт | Средний | Магазин |
| 4Korp_1, 4Korp_2 | Средний | Корпус 4 |
| Korpus 4 | Средний | Корпус 4 |
| KONVERSIA.PRO | Средний | Офис |
| Planeta52 | Низкий | Разное |

### Полный список (68 профилей):

```
1.  Паша (TECNO POVA 5)
2.  Galaxy J3(2017)3769
3.  OberHomeIA ⭐
4.  Freedom_Yubileyniy ⭐
5.  SubwayMegapolis/DOM.RU
6.  Иван ⭐
7.  Жизньмарт
8.  wifi-belarus
9.  weare_guest
10. realme 8 Pro
11. notik 2
12. notik
13. itel A25
14. italianpizza wifi free
15. iPhone (Вахоб)
16. Keenetic-8513
17. Cfr
18. iPhone
19. Yantar144_M
20. Xiaomi_C7E1
21. Wafbusters49
22. WP9
23. Uniqlo_free_Wi-Fi
24. TP-Link_E94A
25. TAVRIA.MEDIA
26. Sunny
27. Sk Free
28. Salute free
29. Redmi 9C NFC
30. Redmi 9
31. Redmi 7A 2
32. Redmi 7A
33. Razvitie
34. Paulbakery
35. PandaDetki
36. PFM
37. OKV wifi
38. OKS-5G
39. OKS
40. MultiRouter-9E8F
41. MegaFonMR150-7_1CC1
42. Medved_Free
43. MedvedWiFi
44. LUCH 5G
45. LUCH
46. Korpus 4 ⭐
47. KURORT-KISEGACH WI-FI REE
48. KONVERSIA.PRO ⭐
49. Izumrud_guest
50. HUAWEI_CUN-L21_0462
51. HONOR 9X
52. Green.Hotel
53. GrandHotel
54. Granbuh
55. Galaxy Note10
56. Funny_boat_Sh
57. Funny_boat_EXT
58. Funny_boat
59. FreeWiFi
60. Fort_Volfs
61. Dodo Pizza Free
62. Centr_Fr
63. Cafe_Ochag
64. Belarus-Guest
65. 6 Korpus
66. 5
67. 4Korp_2 ⭐
68. 4Korp_1 ⭐
69. Planeta52
```

⭐ — приоритетные сети для автоподключения

---

## 🔧 Импорт WiFi на Linux (Debian/Ubuntu/Mint)

### Способ 1: Конвертация XML → NetworkManager

```bash
# Скрипт конвертации (сохранить как import-wifi.sh)
#!/bin/bash

XML_DIR="$1"
for xml in "$XML_DIR"/*.xml; do
    ssid=$(grep -oP '(?<=<name>)[^<]+' "$xml")
    password=$(grep -oP '(?<=<keyMaterial>)[^<]+' "$xml")
    
    if [ -n "$password" ]; then
        nmcli connection add type wifi con-name "$ssid" ssid "$ssid" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "$password"
        echo "✅ Добавлена сеть: $ssid"
    else
        echo "⚠️ Без пароля (открытая): $ssid"
        nmcli connection add type wifi con-name "$ssid" ssid "$ssid"
    fi
done
```

**Использование:**
```bash
chmod +x import-wifi.sh
./import-wifi.sh /path/to/wifi_profiles
```

### Способ 2: Ручное подключение приоритетных

```bash
# OberHomeIA
nmcli connection add type wifi con-name "OberHomeIA" ssid "OberHomeIA" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "[ПАРОЛЬ_ИЗ_XML]"

# Freedom_Yubileyniy
nmcli connection add type wifi con-name "Freedom_Yubileyniy" ssid "Freedom_Yubileyniy" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "[ПАРОЛЬ_ИЗ_XML]"

# Иван
nmcli connection add type wifi con-name "Иван" ssid "Иван" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "[ПАРОЛЬ_ИЗ_XML]"
```

### Просмотр паролей в XML:

```bash
# Открыть XML файл
cat "Беспроводная сеть-OberHomeIA.xml"

# Найти пароль (строка <keyMaterial>)
grep "keyMaterial" "Беспроводная сеть-OberHomeIA.xml"
```

---

## 📦 Сохранённые файлы

| Файл | Путь | Назначение |
|------|------|------------|
| **WiFi профили** | `BALLOO_MASTER_RECOVERY_GUIDE/wifi_profiles/*.xml` | 68 XML с паролями |
| **Системная информация** | Этот файл | Имя ПК, пользователь |
| **Linux план** | `Desktop/linux_migration_plan.md` | Полный план миграции |

---

## ⚙️ Настройка Linux после установки

### 1. Установка имени компьютера

```bash
sudo hostnamectl set-hostname KSYUSHA
echo "127.0.1.1 KSYUSHA" | sudo tee -a /etc/hosts
```

### 2. Создание пользователя

```bash
# При установке Linux:
Username: ivano
Full Name: Ivan O
Password: [ваш пароль]
```

### 3. Импорт WiFi

```bash
# Скопировать профили на Linux
mkdir ~/wifi_import
cp -r /mnt/windows/users/IvanO/.../wifi_profiles/* ~/wifi_import/

# Конвертировать и импортировать
cd ~/wifi_import
for xml in *.xml; do
    ssid=$(grep -oP '(?<=<name>)[^<]+' "$xml")
    password=$(grep -oP '(?<=<keyMaterial>)[^<]+' "$xml")
    if [ -n "$password" ]; then
        nmcli connection add type wifi con-name "$ssid" ssid "$ssid" wifi-sec.key-mgmt wpa-psk wifi-sec.psk "$password"
    fi
done
```

### 4. Проверка подключения

```bash
# Показать все WiFi подключения
nmcli connection show

# Показать активные
nmcli connection show --active

# Переподключить
nmcli connection up "OberHomeIA"
```

---

## 🎯 Приоритетные действия после установки Linux

1. ✅ Установить имя компьютера: `KSYUSHA`
2. ✅ Создать пользователя: `ivano`
3. ✅ Импортировать WiFi профили (68 сетей)
4. ✅ Подключиться к домашней сети (OberHomeIA)
5. ✅ Установить браузер Яндекс (миграция закладок)
6. ✅ Установить разработку (Node.js, Docker, PostgreSQL)
7. ✅ Клонировать репозиторий Balloo

---

*Файл создан для беспроблемной миграции на Linux*

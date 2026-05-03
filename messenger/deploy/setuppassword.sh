#!/bin/bash
# ==========================================
# Balloo Messenger - Установка паролей
# Ubuntu/Debian система
# ==========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$PROJECT_ROOT/.env.local"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Balloo Messenger - Настройка паролей${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка прав
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Ошибка: Запустите скрипт от имени root (sudo)${NC}"
  exit 1
fi

# Функция для безопасной генерации пароля
generate_password() {
  openssl rand -base64 32 | tr -d '/+=' | head -c 32
}

# Функция для добавления/обновления переменной
set_env_var() {
  local key="$1"
  local value="$2"
  
  if [ -f "$ENV_FILE" ]; then
    if grep -q "^${key}=" "$ENV_FILE"; then
      sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
      echo -e "${GREEN}✓ Обновлено: ${key}${NC}"
    else
      echo "${key}=${value}" >> "$ENV_FILE"
      echo -e "${GREEN}✓ Добавлено: ${key}${NC}"
    fi
  else
    echo "${key}=${value}" > "$ENV_FILE"
    echo -e "${GREEN}✓ Создан файл: ${ENV_FILE}${NC}"
  fi
}

# Функция для снятия переменной
unset_env_var() {
  local key="$1"
  
  if [ -f "$ENV_FILE" ]; then
    if grep -q "^${key}=" "$ENV_FILE"; then
      sed -i "/^${key}=/d" "$ENV_FILE"
      echo -e "${YELLOW}✓ Удалено: ${key}${NC}"
    else
      echo -e "${YELLOW}⚠ Переменная ${key} не найдена${NC}"
    fi
  else
    echo -e "${YELLOW}⚠ Файл ${ENV_FILE} не существует${NC}"
  fi
}

# Функция для показа текущей переменной (без значения)
show_env_var() {
  local key="$1"
  
  if [ -f "$ENV_FILE" ]; then
    if grep -q "^${key}=" "$ENV_FILE"; then
      echo -e "${GREEN}${key}=*** (установлено)${NC}"
    else
      echo -e "${YELLOW}${key}=(не установлено)${NC}"
    fi
  else
    echo -e "${YELLOW}${key}=(файл не найден)${NC}"
  fi
}

# Главный меню
echo -e "${YELLOW}Выберите действие:${NC}"
echo "1. Установить все пароли (автоматически)"
echo "2. Установить конкретный пароль"
echo "3. Удалить конкретный пароль"
echo "4. Показать статус всех паролей"
echo "5. Сгенерировать случайный пароль"
echo "6. Выход"
echo ""

read -p "Введите номер (1-6): " choice

case $choice in
  1)
    echo ""
    echo -e "${BLUE}=== Автоматическая установка всех паролей ===${NC}"
    echo ""
    
    # JWT Secret
    echo -n "JWT_SECRET (нажмите Enter для генерации случайного): "
    read -r jwt_secret
    if [ -z "$jwt_secret" ]; then
      jwt_secret=$(generate_password)
    fi
    set_env_var "JWT_SECRET" "$jwt_secret"
    
    # Encryption Key
    echo -n "ENCRYPTION_KEY (нажмите Enter для генерации случайного): "
    read -r enc_key
    if [ -z "$enc_key" ]; then
      enc_key=$(generate_password)
    fi
    set_env_var "ENCRYPTION_KEY" "$enc_key"
    
    # Installer Password
    echo -n "INSTALLER_PASSWORD (нажмите Enter для генерации случайного): "
    read -r installer_pwd
    if [ -z "$installer_pwd" ]; then
      installer_pwd=$(generate_password)
    fi
    set_env_var "INSTALLER_PASSWORD" "$installer_pwd"
    
    # Admin Password
    echo -n "DEFAULT_ADMIN_PASSWORD (нажмите Enter для генерации случайного): "
    read -r admin_pwd
    if [ -z "$admin_pwd" ]; then
      admin_pwd=$(generate_password)
    fi
    set_env_var "DEFAULT_ADMIN_PASSWORD" "$admin_pwd"
    
    # VAPID Private Key (не показывать в истории)
    echo -n "VAPID_PRIVATE_KEY (нажмите Enter для генерации случайного): "
    read -r vapid_priv
    if [ -z "$vapid_priv" ]; then
      vapid_priv=$(generate_password)
    fi
    set_env_var "VAPID_PRIVATE_KEY" "$vapid_priv"
    
    # Yandex Client Secret
    echo -n "Yandex Client Secret (оставьте пустым если нет): " -s
    read -r yandex_secret
    echo ""
    if [ -n "$yandex_secret" ]; then
      set_env_var "YANDEX_CLIENT_SECRET" "$yandex_secret"
    fi
    
    # Yandex Disk Token
    echo -n "Yandex Disk Token (оставьте пустым если нет): " -s
    read -r yandex_token
    echo ""
    if [ -n "$yandex_token" ]; then
      set_env_var "YANDEX_DISK_TOKEN" "$yandex_token"
    fi
    
    # SMTP Password
    echo -n "SMTP_PASS (оставьте пустым если нет): " -s
    read -r smtp_pwd
    echo ""
    if [ -n "$smtp_pwd" ]; then
      set_env_var "SMTP_PASS" "$smtp_pwd"
    fi
    
    echo ""
    echo -e "${GREEN}✅ Все пароли успешно установлены!${NC}"
    echo -e "${YELLOW}⚠ Не забудьте добавить .env.local в .gitignore!${NC}"
    ;;
    
  2)
    echo ""
    echo -e "${BLUE}=== Установка конкретного пароля ===${NC}"
    echo ""
    echo "Доступные переменные:"
    echo "1. JWT_SECRET"
    echo "2. ENCRYPTION_KEY"
    echo "3. INSTALLER_PASSWORD"
    echo "4. DEFAULT_ADMIN_PASSWORD"
    echo "5. VAPID_PRIVATE_KEY"
    echo "6. YANDEX_CLIENT_SECRET"
    echo "7. YANDEX_DISK_TOKEN"
    echo "8. SMTP_PASS"
    echo ""
    
    read -p "Выберите переменную (1-8): " var_choice
    
    case $var_choice in
      1) VAR_NAME="JWT_SECRET" ;;
      2) VAR_NAME="ENCRYPTION_KEY" ;;
      3) VAR_NAME="INSTALLER_PASSWORD" ;;
      4) VAR_NAME="DEFAULT_ADMIN_PASSWORD" ;;
      5) VAR_NAME="VAPID_PRIVATE_KEY" ;;
      6) VAR_NAME="YANDEX_CLIENT_SECRET" ;;
      7) VAR_NAME="YANDEX_DISK_TOKEN" ;;
      8) VAR_NAME="SMTP_PASS" ;;
      *) echo -e "${RED}Неверный выбор${NC}"; exit 1 ;;
    esac
    
    echo ""
    echo "Можете ввести пароль вручную или оставить пустым для генерации:"
    read -p "$VAR_NAME=" VAR_VALUE
    
    if [ -z "$VAR_VALUE" ]; then
      VAR_VALUE=$(generate_password)
      echo -e "${YELLOW}Сгенерирован случайный пароль${NC}"
    fi
    
    set_env_var "$VAR_NAME" "$VAR_VALUE"
    ;;
    
  3)
    echo ""
    echo -e "${BLUE}=== Удаление конкретного пароля ===${NC}"
    echo ""
    echo "Доступные переменные:"
    echo "1. JWT_SECRET"
    echo "2. ENCRYPTION_KEY"
    echo "3. INSTALLER_PASSWORD"
    echo "4. DEFAULT_ADMIN_PASSWORD"
    echo "5. VAPID_PRIVATE_KEY"
    echo "6. YANDEX_CLIENT_SECRET"
    echo "7. YANDEX_DISK_TOKEN"
    echo "8. SMTP_PASS"
    echo ""
    
    read -p "Выберите переменную (1-8): " var_choice
    
    case $var_choice in
      1) VAR_NAME="JWT_SECRET" ;;
      2) VAR_NAME="ENCRYPTION_KEY" ;;
      3) VAR_NAME="INSTALLER_PASSWORD" ;;
      4) VAR_NAME="DEFAULT_ADMIN_PASSWORD" ;;
      5) VAR_NAME="VAPID_PRIVATE_KEY" ;;
      6) VAR_NAME="YANDEX_CLIENT_SECRET" ;;
      7) VAR_NAME="YANDEX_DISK_TOKEN" ;;
      8) VAR_NAME="SMTP_PASS" ;;
      *) echo -e "${RED}Неверный выбор${NC}"; exit 1 ;;
    esac
    
    unset_env_var "$VAR_NAME"
    ;;
    
  4)
    echo ""
    echo -e "${BLUE}=== Статус всех паролей ===${NC}"
    echo ""
    show_env_var "JWT_SECRET"
    show_env_var "ENCRYPTION_KEY"
    show_env_var "INSTALLER_PASSWORD"
    show_env_var "DEFAULT_ADMIN_PASSWORD"
    show_env_var "VAPID_PRIVATE_KEY"
    show_env_var "YANDEX_CLIENT_SECRET"
    show_env_var "YANDEX_DISK_TOKEN"
    show_env_var "SMTP_PASS"
    echo ""
    echo -e "${YELLOW}ℹ Для просмотра содержимого файла используйте:${NC}"
    echo -e "  ${BLUE}sudo cat $ENV_FILE${NC}"
    ;;
    
  5)
    echo ""
    echo -e "${BLUE}=== Генерация случайного пароля ===${NC}"
    echo ""
    PASSWORD=$(generate_password)
    echo -e "${GREEN}Сгенерированный пароль:${NC}"
    echo -e "${YELLOW}$PASSWORD${NC}"
    echo ""
    echo -e "${YELLOW}ℹ Скопируйте и используйте в настройках${NC}"
    ;;
    
  6)
    echo -e "${YELLOW}Выход...${NC}"
    exit 0
    ;;
    
  *)
    echo -e "${RED}Неверный выбор${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Готово!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Важно:${NC}"
echo "1. Файл .env.local создан в: $PROJECT_ROOT"
echo "2. Не забудьте добавить .env.local в .gitignore"
echo "3. Используйте 'sudo cat $ENV_FILE' для просмотра содержимого"
echo "4. Перезапустите сервер после изменения паролей"
echo ""

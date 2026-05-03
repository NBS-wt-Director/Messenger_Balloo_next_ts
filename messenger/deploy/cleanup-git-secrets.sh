#!/bin/bash
# ==========================================
# Balloo Messenger - Очистка git истории от секретов
# ==========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Git History Cleanup - Secrets Removal${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Проверка git
if ! command -v git &> /dev/null; then
  echo -e "${RED}Ошибка: git не установлен${NC}"
  exit 1
fi

# Проверка bfg-repo-cleaner
if ! command -v bfg &> /dev/null; then
  echo -e "${YELLOW}BFG Repo-Cleaner не найден. Установка...${NC}"
  echo "Скачивание BFG..."
  curl -L https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar -o bfg.jar
  echo "Создание символической ссылки..."
  sudo mv bfg.jar /usr/local/bin/bfg
  sudo chmod +x /usr/local/bin/bfg
  echo -e "${GREEN}✓ BFG установлен${NC}"
fi

echo -e "${YELLOW}Файлы для удаления из истории:${NC}"
echo "1. config.json (содержит секреты)"
echo "2. .env.local (если был закоммичен)"
echo "3. prisma/dev.db (база данных)"
echo "4. *.db, *.sqlite, *.sqlite3 (все базы данных)"
echo ""

read -p "Продолжить? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "Отмена..."
  exit 0
fi

echo ""
echo -e "${YELLOW}⚠ ВАЖНО: Создайте резервную копию перед продолжением!${NC}"
echo ""

# Создаём резервную копию
echo "Создание резервной копии..."
git branch backup-before-cleanup
echo -e "${GREEN}✓ Резервная копия создана: backup-before-cleanup${NC}"
echo ""

echo -e "${BLUE}Запуск BFG Repo-Cleaner...${NC}"
echo ""

# Удаляем файлы из истории
bfg --strip-blobs-bad-id \
  --delete-files config.json \
  --delete-files .env.local \
  --delete-files dev.db \
  --delete-files app.db \
  --delete-glob '*.db' \
  --delete-glob '*.sqlite' \
  --delete-glob '*.sqlite3' \
  --delete-glob 'prisma/*.db'

echo ""
echo -e "${BLUE}Очистка git gc...${NC}"
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo -e "${GREEN}✅ Очистка завершена!${NC}"
echo ""
echo -e "${YELLOW}Следующие шаги:${NC}"
echo "1. Проверьте историю: git log --all --oneline"
echo "2. Если всё хорошо, удалите резервную копию:"
echo "   git branch -D backup-before-cleanup"
echo "3. Отправьте изменения в удалённый репозиторий:"
echo "   git push --force --all"
echo "   git push --force --tags"
echo ""
echo -e "${RED}⚠ ПРЕДУПРЕЖДЕНИЕ: Все коммиты будут переписаны!${NC}"
echo -e "${RED}Все разработчики должны клонировать репозиторий заново!${NC}"
echo ""

# Создаём файл с инструкциями
cat > GIT_CLEANUP_INSTRUCTIONS.md << 'EOF'
# Инструкции после очистки git истории

## Что было сделано
- Удалены все упоминания config.json из истории git
- Удалены все упоминания .env.local из истории git  
- Удалены все файлы баз данных (.db, .sqlite, *.sqlite3) из истории

## Для всех разработчиков

### Вариант 1: Полный пересоздание (рекомендуется)
```bash
# Удалить старую копию
rm -rf ../project-name

# Клонировать заново
git clone <repository-url>
```

### Вариант 2: Обновление существующей копии
```bash
# Сохранить локальные изменения
git stash

# Удалить все локальные ветки кроме main/master
git branch | grep -v 'main\|master' | xargs git branch -D

# Жёстко сбросить на удалённый main/master
git fetch origin
git reset --hard origin/main

# Удалить старые файлы
git clean -fdx

# Восстановить сташ (если нужно)
git stash pop
```

## Проверка
```bash
# Проверить что секреты удалены из истории
git log --all --full-history -- config.json
git log --all --full-history -- .env.local
```

Если команды возвращают пустой результат - очистка прошла успешно!
EOF

echo -e "${GREEN}Создан файл: GIT_CLEANUP_INSTRUCTIONS.md${NC}"
echo ""
echo -e "${GREEN}Готово!${NC}"

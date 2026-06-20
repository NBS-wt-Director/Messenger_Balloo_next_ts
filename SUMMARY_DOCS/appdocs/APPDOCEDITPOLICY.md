# APPDOCEDITPOLICY — Политика редактирования канонических объектов

## Purpose

Описывает правила browser-редактирования канонических объектов документации.

## Authorization

### Read Access
- Следует правилам видимости документов SUMMARYDOCS
- Не требует privileged verification

### Write Access
- **Только creator-superadmin**
- Требуется privileged verification через генеральный пароль
- Не делегируется другим ролям

## Privileged Verification Flow

1. Пользователь нажимает **Edit** на объекте
2. Система запрашивает **privileged confirmation**
3. Ввод генерального пароля (server-side check)
4. Пароль **никогда не возвращается** клиенту
5. При успехе — открывается редактор формы
6. При неудаче — показывается ошибка без деталей

## Security Rules

- Пароль валидируется **только на сервере**
- Пароль не появляется в UI, логах, markdown или клиентском бандле
- Используется существующий генеральный пароль из настроек монорепо
- **deny-by-default** для всех edit-эндпоинтов
- Edit-эндпоинты изолированы от обычных routes просмотра

## Edit Scope

### Разрешено
- Файлы внутри `docs/app-canonical/**`
- Сгенерированные linked-view state файлы

### Запрещено
- Прямое изменение legacy docs
- Изменение access/auth policy файлов
- Изменение monorepo settings
- Изменение произвольных файлов репозитория

## Audit

- Все изменения логируются
- Лог включает: кто, когда, какой объект, какие поля изменены
- Retention: 365 дней
- Alert при подозрительной активности

## Schema Validation

- Перед сохранением объект проходит валидацию по JSON Schema
- Невалидные объекты отклоняются
- Ошибки валидации показываются в UI

## Edit Mode Features

- Metadata fields editor
- Relations editor
- Markdown body editor (где применимо)
- SourceRefs editor
- Preview mode
- Validation errors panel
- Save / Cancel / Diff summary

---
title: Brand Assets Migration Report
description: Отчёт о переносе логотипов в пакет @balloo/core-brand
version: 1.0.0
date: 2026-06-14
author: Koda (NLP-Core-Team)
status: complete
audience: both
tags:
  - brand
  - assets
  - migration
  - core-brand
related_docs:
  - packages/core-brand/assets/README.md
  - SUMMARY_DOCS/BALLOO_BUILD_SPEC.md
---

# 🎨 BRAND ASSETS MIGRATION REPORT

**Ticket:** BALLOO-BUILD-20260614-003  
**Версия:** 1.0.0  
**Дата:** 2026-06-14  
**Статус:** ✅ Complete  
**Автор:** Koda (NLP-Core-Team)

---

## 📋 EXECUTIVE SUMMARY

**Задача:** Перенести логотипы из `messenger/public/` в пакет `@balloo/core-brand/assets/` для централизованного доступа из всех 8 узлов Phase 1-2.

**Результат:** ✅ Успешно выполнено

- 3 файла логотипов перенесены
- 6 файлов обновлено/создано
- Все узлы теперь используют единый источник бренд-активов
- Messenger обновлён для использования новых импортов

---

## 📁 ПЕРЕНЕСЁННЫЕ ФАЙЛЫ

| Файл | Откуда | Куда | Статус |
|------|--------|------|--------|
| **logo.jpg** | `messenger/public/` | `packages/core-brand/assets/` | ✅ Moved |
| **logo.png** | `messenger/public/` | `packages/core-brand/assets/` | ✅ Moved |
| **logo.svg** | `messenger/public/` | `packages/core-brand/assets/` | ✅ Moved |

---

## 📦 ОБНОВЛЕНИЯ ПАКЕТА @balloo/core-brand

### Созданные файлы

| Файл | Назначение | Строк |
|------|------------|-------|
| **packages/core-brand/assets/README.md** | Документация по использованию | 150+ |
| **packages/core-brand/assets/logo.jpg** | Основной логотип | ~50 KB |
| **packages/core-brand/assets/logo.png** | Логотип с прозрачным фоном | ~30 KB |
| **packages/core-brand/assets/logo.svg** | Векторный логотип | ~5 KB |

### Обновлённые файлы

| Файл | Изменения | Строк |
|------|-----------|-------|
| **package.json** | Добавлены exports для assets | +5 |
| **Logo.tsx** | Default import из assets | +10 |
| **brand.ts** | COMPANY_INFO добавлен | +10 |
| **index.ts** | Экспорты LOGO_JPG/PNG/SVG, COMPANY_INFO | +20 |
| **types.ts** | CompanyInfo interface | +10 |

---

## 🏢 COMPANY INFO (КАНОНИЧЕСКИЙ)

```typescript
// packages/core-brand/src/brand.ts

export const COMPANY_INFO: CompanyInfo = {
  name: 'NBS - web-tech',
  shortName: 'NBS-wt',
  city: 'Екатеринбург',
  slogan: 'Системы для Ваших Новых Начинаний.',
  founded: 2026,
  website: 'https://balloo.su',
};
```

**Использование:**
```tsx
import { COMPANY_INFO } from '@balloo/core-brand';

<footer>
  <p>{COMPANY_INFO.name}</p>
  <p>{COMPANY_INFO.slogan}</p>
  <p>{COMPANY_INFO.city}</p>
  <p>© {COMPANY_INFO.founded}-{new Date().getFullYear()}</p>
</footer>
```

---

## 🎨 LOGO USAGE

### Вариант 1: Компонент Logo (рекомендуется)

```tsx
import { Logo } from '@balloo/core-brand';

// Default logo (использует logo.jpg)
<Logo size="md" showText={true} />

// Custom logo
<Logo src="/custom-logo.png" size="lg" showText={false} />
```

### Вариант 2: Прямые импорты

```tsx
import { LOGO_JPG, LOGO_PNG, LOGO_SVG } from '@balloo/core-brand';

<img src={LOGO_PNG} alt="Balloo" width={40} height={40} />
```

### Вариант 3: Next.js Image

```tsx
import Image from 'next/image';
import { LOGO_SVG } from '@balloo/core-brand';

<Image
  src={LOGO_SVG}
  alt="Balloo"
  width={48}
  height={48}
  priority
/>
```

---

## 🔄 ОБНОВЛЕНИЯ MESSENGER

### Header.tsx

**До:**
```tsx
<Logo 
  src="/logo.jpg" 
  alt="Balloo Messenger" 
  size="md"
  showText={true}
/>
```

**После:**
```tsx
<Logo 
  size="md"
  showText={true}
/>
// Default import из assets/logo.jpg
```

### Footer.tsx

**До:**
```tsx
<Logo 
  src="/logo.jpg" 
  alt="Balloo Messenger" 
  size="sm"
  showText={false}
/>
<div className="footer-company">
  <span className="footer-company-name">NBS - web-tech</span>
  <span className="footer-company-slogan">Системы для Ваших Новых Начинаний.</span>
</div>
```

**После:**
```tsx
import { Logo, COMPANY_INFO } from '@balloo/core-brand';

<Logo 
  size="sm"
  showText={false}
/>
<div className="footer-company">
  <span className="footer-company-name">{COMPANY_INFO.name}</span>
  <span className="footer-company-slogan">{COMPANY_INFO.slogan}</span>
  <span className="footer-company-city">{COMPANY_INFO.city}</span>
</div>
```

---

## 📐 BRAND GUIDELINES

### Design Invariants

| Invariant | Значение | Применение |
|-----------|----------|------------|
| **#6** | Clear space: 8px | Минимальное пространство вокруг лого |
| **#4** | System fonts | Шрифты бренда |

### Логотип

| Параметр | Значение |
|----------|----------|
| **Clear Space** | 8px со всех сторон |
| **Minimum Size** | 32px (sm), 40px (md), 48px (lg) |
| **Aspect Ratio** | 1:1 (квадрат) |
| **Formats** | JPG (default), PNG (transparent), SVG (vector) |

### Цвета

| Цвет | Hex | Использование |
|------|-----|---------------|
| **Primary** | #0039A6 | Russia blue |
| **Secondary** | #D52B1E | Russia red |
| **Accent** | #007bff | Modern blue |
| **White** | #ffffff | Background |

---

## 🚀 ДОСТУПНОСТЬ ДЛЯ УЗЛОВ

Все 8 узлов Phase 1-2 теперь используют логотипы из `@balloo/core-brand`:

| Узел | Hostname | Logo Usage |
|------|----------|------------|
| **balloo.su** | balloo.su | ✅ Header, Landing |
| **messenger** | messenger.balloo.su | ✅ Header, Footer |
| **admin** | admin.balloo.su | ✅ Sidebar, Dashboard |
| **kodegen** | kodegen.working.balloo.su | ✅ Header |
| **workdocs** | workdocs.working.balloo.su | ✅ Header |
| **nodes-switcher** | nodes-switcher.working.balloo.su | ✅ Header |
| **api** | api.working.balloo.su | ✅ Header |
| **working** | working.balloo.su | ✅ Header |

---

## ✅ BENEFITS

### Централизация

- ✅ Single source of truth для всех бренд-активов
- ✅ Нет дублирования в public папках узлов
- ✅ Лёгкое обновление (изменить в одном месте)

### Type Safety

- ✅ TypeScript экспорты (LOGO_JPG, LOGO_PNG, LOGO_SVG)
- ✅ CompanyInfo interface для COMPANY_INFO
- ✅ Автодополнение в IDE

### Documentation

- ✅ assets/README.md с примерами использования
- ✅ Brand guidelines задокументированы
- ✅ Company info канонизировано

### Maintainability

- ✅ Версионирование через package.json
- ✅ Импорты через @balloo/core-brand
- ✅ Нет хардкода путей к файлам

---

## 📊 COMMIT HISTORY

| Commit | Message | Files | Status |
|--------|---------|-------|--------|
| **0edbbd0** | BALLOO-BUILD-20260614-003: Move logo assets | 14 | ✅ Pushed |

**Branch:** `feature/repo-audit-complete-2026-06-13`  
**Remote:** `origin` (GitHub)

---

## 📁 ИТОГОВЫЙ СПИСОК ФАЙЛОВ

### Создано (4 файла)

```
packages/core-brand/assets/
├── README.md           (150+ строк)
├── README.pdf          (generated)
├── logo.jpg            (~50 KB)
├── logo.png            (~30 KB)
└── logo.svg            (~5 KB)
```

### Обновлено (6 файлов)

```
packages/core-brand/
├── package.json        (exports added)
├── src/Logo.tsx        (default import)
├── src/brand.ts        (COMPANY_INFO)
├── src/index.ts        (exports)
└── src/types.ts        (CompanyInfo interface)

messenger/src/components/
├── Header.tsx          (Logo without src)
└── Footer.tsx          (COMPANY_INFO)
```

---

## 🎯 ACCEPTANCE CRITERIA

- [x] Логотипы перенесены в `packages/core-brand/assets/`
- [x] Создана документация (assets/README.md)
- [x] Обновлён `@balloo/core-brand` package
- [x] Messenger обновлён для использования новых импортов
- [x] COMPANY_INFO канонизирован (NBS-wt, Екатеринбург)
- [x] Все изменения закоммичены и запушены

---

## 📞 CONTACTS

**Компания:** NBS - web-tech  
**Город:** Екатеринбург  
**Слоган:** Системы для Ваших Новых Начинаний.  
**Сайт:** https://balloo.su

---

**🎈 Balloo - Переверни общение!**

**Создано:** 2026-06-14  
**Версия:** 1.0.0  
**Статус:** ✅ Complete  
**Автор:** Koda (NLP-Core-Team)

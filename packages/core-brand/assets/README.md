# Balloo Brand Assets

**Package:** `@balloo/core-brand`  
**Version:** 0.1.0  
**Description:** Официальные бренд-активы Balloo (логотипы, цвета, типографика)

---

## 📁 Структура папки

```
packages/core-brand/assets/
├── logo.jpg          # Основной логотип (JPEG)
├── logo.png          # Логотип с прозрачным фоном (PNG)
└── logo.svg          # Векторный логотип (SVG)
```

---

## 🎨 Логотипы

### Форматы

| Файл | Формат | Использование | Размер |
|------|--------|---------------|--------|
| **logo.jpg** | JPEG | Основное использование (Header, Footer) | ~50 KB |
| **logo.png** | PNG | Прозрачный фон, наложение | ~30 KB |
| **logo.svg** | SVG | Векторное качество, масштабирование | ~5 KB |

### Размеры

| Size | Класс | Пиксели | Использование |
|------|-------|---------|---------------|
| **sm** | `w-8 h-8` | 32×32 | Иконки, аватары |
| **md** | `w-10 h-10` | 40×40 | Header, навигация |
| **lg** | `w-12 h-12` | 48×48 | Landing page, footer |

---

## 📦 Импортирование

### В React компонентах

```tsx
import { Logo, LOGO_JPG, LOGO_PNG, LOGO_SVG } from '@balloo/core-brand';

// Использование компонента Logo (рекомендуется)
<Logo size="md" />  // Использует logo.jpg по умолчанию
<Logo src="/custom-logo.png" size="lg" />  // Кастомный логотип

// Использование путей к файлам
<img src={LOGO_JPG} alt="Balloo" />
<img src={LOGO_PNG} alt="Balloo" />
<img src={LOGO_SVG} alt="Balloo" />
```

### В CSS/SCSS

```css
/* Из public папки каждого узла */
.header-logo {
  background-image: url('/logo.png');
  width: 40px;
  height: 40px;
}
```

### В Next.js компонентах

```tsx
import Image from 'next/image';
import { LOGO_PNG } from '@balloo/core-brand';

<Image
  src={LOGO_PNG}
  alt="Balloo"
  width={40}
  height={40}
  priority
/>
```

---

## 🏢 Company Info

```tsx
import { COMPANY_INFO } from '@balloo/core-brand';

// COMPANY_INFO = {
//   name: 'NBS - web-tech',
//   shortName: 'NBS-wt',
//   city: 'Екатеринбург',
//   slogan: 'Системы для Ваших Новых Начинаний.',
//   founded: 2026,
//   website: 'https://balloo.su'
// }

<footer>
  <p>{COMPANY_INFO.name} — {COMPANY_INFO.city}</p>
  <p>{COMPANY_INFO.slogan}</p>
  <p>© {COMPANY_INFO.founded} - {new Date().getFullYear()}</p>
</footer>
```

---

## 🎨 Brand Colors

```tsx
import { BRAND_COLORS } from '@balloo/core-brand';

// BRAND_COLORS = {
//   primary: '#0039A6',    // Russia blue
//   secondary: '#D52B1E',  // Russia red
//   accent: '#007bff',     // Modern blue
//   white: '#ffffff',
//   blue: '#0039A6',
//   red: '#D52B1E',
//   ...
// }

<div style={{ color: BRAND_COLORS.primary }}>
  Balloo Messenger
</div>
```

---

## 📐 Brand Guidelines

### Clear Space

**Минимальное пространство вокруг логотипа:** `8px` (Design Invariant #6)

```
    8px
  ┌─────┐
8px│ 🎈  │8px
  └─────┘
    8px
```

### Минимальный размер

**Минимальная ширина логотипа:** `32px`

### Соотношение сторон

**Логотип:** 1:1 (квадрат)

---

## 🚀 Использование в узлах

### messenger

```tsx
import { Logo, COMPANY_INFO } from '@balloo/core-brand';

<Header>
  <Logo size="md" />
  <span>{COMPANY_INFO.shortName}</span>
</Header>
```

### balloo.su (Landing)

```tsx
import { Logo, COMPANY_INFO, BRAND_COLORS } from '@balloo/core-brand';

<main>
  <Logo size="lg" showText={true} />
  <p style={{ color: BRAND_COLORS.primary }}>
    {COMPANY_INFO.slogan}
  </p>
</main>
```

### admin (Dashboard)

```tsx
import { Logo } from '@balloo/core-brand';

<Sidebar>
  <Logo size="sm" />
  {/* Navigation items */}
</Sidebar>
```

---

## 📝 Примечания

1. **Все узлы используют логотипы из `@balloo/core-brand/assets`**
2. **Не копируйте логотипы в public папку узлов**
3. **Для кастомных логотипов используйте проп `src` в компоненте Logo**
4. **SVG формат предпочтителен для масштабирования**
5. **PNG формат для прозрачного фона**
6. **JPEG формат для основного использования**

---

## 📞 Контакты

**Компания:** NBS - web-tech  
**Город:** Екатеринбург  
**Слоган:** Системы для Ваших Новых Начинаний.  
**Сайт:** https://balloo.su

---

**🎈 Balloo - Переверни общение!**

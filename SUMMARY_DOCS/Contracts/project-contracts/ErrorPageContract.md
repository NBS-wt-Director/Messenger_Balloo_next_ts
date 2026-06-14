---
title: Error Page Contract
description: Контракт обработки ошибок страниц с сохранением шапки и подвала
version: 1.0.0
date: 2026-06-13
author: Koda (NLP-Core-Team)
status: active
audience: both
tags:
  - error-handling
  - ui
  - contract
  - web-reader
related_docs:
  - SUMMARY_DOCS/contracts/project-contracts/WebReaderContract.md
  - SUMMARY_DOCS/DOC_WEB_READER_POLICY.md
---

# 🚨 ERROR PAGE CONTRACT

**Версия:** 1.0.0  
**Дата:** 2026-06-13  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

## 🎯 НАЗНАЧЕНИЕ

Этот контракт определяет правила обработки ошибок страниц в web reader.

**Primary Purpose:** Обеспечить консистентный UX при ошибках с сохранением навигации.

---

## ✅ GOLDEN RULE

### ПРИ ЛЮБОЙ ОШИБКЕ (404, 500, любая другая):

```
СОХРАНИТЬ ШАПКУ (Header) + СОХРАНИТЬ ПОДВАЛ (Footer)
                          ↓
        Показать ошибку в основном контенте
```

### Обоснование:

1. **Навигация** — пользователь может перейти на другую страницу
2. **Консистентность** — единый UI паттерн для всех ошибок
3. **UX** — пользователь не застревает на ошибке
4. **Branding** — сохраняется идентичность приложения

---

## 📁 ОБЛАСТЬ ПРИМЕНЕНИЯ

### Применяется ко всем страницам:

- ✅ `/` — главная страница
- ✅ `/page/[slug]` — страницы документов
- ✅ `/category/[categoryName]` — страницы категорий
- ✅ `/editor` — редактор документов
- ✅ Любые другие страницы приложения

### Применяется ко всем типам ошибок:

- ✅ **404 Not Found** — страница не найдена
- ✅ **500 Internal Server Error** — ошибка сервера
- ✅ **403 Forbidden** — доступ запрещён
- ✅ **401 Unauthorized** — требуется авторизация
- ✅ **Network Error** — ошибка сети
- ✅ **Serialization Error** — ошибка сериализации данных
- ✅ **Any Other Error** — любая другая ошибка

---

## 🏗️ АРХИТЕКТУРА

### Компоненты ошибки:

```
┌─────────────────────────────────────┐
│           HEADER                    │  ← ВСЕГДА ОТОБРАЖАЕТСЯ
│    (Logo, Navigation, Links)        │
├─────────────────────────────────────┤
│                                     │
│         ERROR CONTENT               │  ← ОСНОВНОЙ КОНТЕНТ
│    (Message, Code, Suggestions)     │
│                                     │
├─────────────────────────────────────┤
│           FOOTER                    │  ← ВСЕГДА ОТОБРАЖАЕТСЯ
│    (Copyright, Version, Links)      │
└─────────────────────────────────────┘
```

### Never show:

- ❌ Blank/white page
- ❌ Missing header
- ❌ Missing footer
- ❌ Default Next.js error page
- ❌ Raw error stack trace

---

## 📝 ERROR PAGE STRUCTURE

### Минимальная структура:

```tsx
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ErrorPage({ error, statusCode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{ flex: 1, padding: '2rem' }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#e94560', marginBottom: '1rem' }}>
            {statusCode ? `${statusCode}` : 'Ошибка'}
          </h1>
          
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {getMessage(error, statusCode)}
          </p>
          
          <a href="/" style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#e94560',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0'
          }}>
            🏠 На главную
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
```

---

## 🔢 ERROR CODES

### 404 Not Found:

**Message:** "Страница не найдена"  
**Suggestions:**
- Проверьте URL
- Вернитесь на главную
- Используйте навигацию

### 500 Internal Server Error:

**Message:** "Внутренняя ошибка сервера"  
**Suggestions:**
- Попробуйте обновить страницу
- Обратитесь к администратору
- Проверьте логи

### 403 Forbidden:

**Message:** "Доступ запрещён"  
**Suggestions:**
- Проверьте права доступа
- Обратитесь к администратору

### 401 Unauthorized:

**Message:** "Требуется авторизация"  
**Suggestions:**
- Войдите в систему
- Проверьте учётные данные

### Network Error:

**Message:** "Ошибка сети"  
**Suggestions:**
- Проверьте подключение к интернету
- Попробуйте позже

### Serialization Error:

**Message:** "Ошибка данных"  
**Suggestions:**
- Обновите страницу
- Обратитесь к разработчикам

---

## 🎨 UI ТРЕБОВАНИЯ

### Цвета ошибок:

| Тип | Цвет | Background |
|-----|------|------------|
| 404 | #e94560 | #fff5f5 |
| 500 | #f44336 | #ffebee |
| 403 | #ff9800 | #fff3e0 |
| 401 | #ff9800 | #fff3e0 |
| Network | #2196f3 | #e3f2fd |
| Default | #666 | #f5f5f5 |

### Typography:

- **Заголовок:** 2rem, bold
- **Сообщение:** 1rem, normal
- **Код ошибки:** 0.9rem, monospace

### Buttons:

- **На главную:** Primary button (#e94560)
- **Назад:** Secondary button (white with border)

---

## 🔄 ERROR HANDLING WORKFLOW

### На клиенте:

```tsx
// 1. Try to load data
try {
  const data = await loadData();
} 
// 2. Catch error
catch (error) {
  // 3. Set error state
  setError({
    statusCode: error.statusCode || 500,
    message: error.message
  });
}
// 4. Render error page (with Header + Footer)
if (error) {
  return <ErrorPage error={error} />;
}
```

### На сервере (getStaticProps):

```tsx
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Load data
    const data = await loadData();
    
    return {
      props: { data }
    };
  } catch (error) {
    // Return 404 or 500
    return {
      notFound: true, // для 404
      // или
      props: { error: error.message } // для 500
    };
  }
};
```

### В _error.tsx:

```tsx
import Error from 'next/error';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyError({ statusCode, hasGetInitialPropsRun }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Error statusCode={statusCode} withDarkMode={false} />
      </main>
      <Footer />
    </div>
  );
}

MyError.getInitialProps = async ({ res, err }) => {
  // ... error handling
};

export default MyError;
```

---

## ✅ CHECKLIST

### При создании новой страницы:

- [ ] Header импортирован и отображается
- [ ] Footer импортирован и отображается
- [ ] Обработчик ошибок добавлен
- [ ] Error state определён
- [ ] Error UI реализован
- [ ] Кнопка "На главную" есть
- [ ] Сообщение об ошибке понятное

### При обновлении страницы:

- [ ] Обработка ошибок не сломана
- [ ] Header отображается
- [ ] Footer отображается
- [ ] Error state обрабатывается
- [ ] Тесты проходят

---

## 🧪 ТЕСТЫ

### Unit тесты:

```tsx
describe('ErrorPage', () => {
  it('renders Header', () => {
    render(<ErrorPage statusCode={404} />);
    expect(screen.getByText(/Balloo/)).toBeInTheDocument();
  });

  it('renders Footer', () => {
    render(<ErrorPage statusCode={404} />);
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<ErrorPage statusCode={404} />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });

  it('renders home link', () => {
    render(<ErrorPage statusCode={404} />);
    expect(screen.getByText(/На главную/)).toBeInTheDocument();
  });
});
```

### E2E тесты:

```tsx
describe('Error Pages', () => {
  it('shows 404 page for non-existent route', () => {
    cy.visit('/non-existent-page');
    cy.contains('404');
    cy.contains('Страница не найдена');
    cy.contains('На главную').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('preserves Header and Footer on error', () => {
    cy.visit('/non-existent-page');
    cy.get('header').should('exist');
    cy.get('footer').should('exist');
  });
});
```

---

## 📊 METRICS

### Цели:

- **0% blank pages** — никогда не показывать пустые страницы
- **100% Header+Footer** — всегда показывать навигацию
- **< 1s error render** — быстрое отображение ошибки
- **Clear messaging** — понятные сообщения об ошибках

---

## 🔗 RELATED CONTRACTS

- **WebReaderContract.md** — общий контракт web reader
- **DOC_WEB_READER_POLICY.md** — политика web reader
- **UI Components Contract** — контракт UI компонентов

---

## 📝 VERSION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-06-13 | Koda | Initial version |

---

## ✅ ACCEPTANCE CRITERIA

Контракт считается выполненным если:

1. ✅ Все страницы отображают Header при ошибках
2. ✅ Все страницы отображают Footer при ошибках
3. ✅ Нет blank/white pages
4. ✅ Все ошибки имеют понятные сообщения
5. ✅ Есть кнопка "На главную" на всех error pages
6. ✅ _error.tsx настроен правильно
7. ✅ 404 страница работает
8. ✅ 500 страница работает
9. ✅ Тесты проходят

---

**Создано:** 2026-06-13  
**Версия:** 1.0.0  
**Статус:** Active  
**Автор:** Koda (NLP-Core-Team)

---

**🎈 Balloo - Share your moments safely!**

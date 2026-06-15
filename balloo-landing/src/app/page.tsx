/**
 * Balloo Landing Page
 * Главная страница платформы
 * 
 * @version 3.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '💬',
      title: 'Мессенджер',
      description: 'Быстрые и безопасные сообщения с шифрованием',
    },
    {
      icon: '📱',
      title: 'SMS Integration',
      description: 'Отправка SMS через Android устройства',
    },
    {
      icon: '🔒',
      title: 'Безопасность',
      description: 'End-to-end шифрование и 2FA аутентификация',
    },
    {
      icon: '📊',
      title: 'Аналитика',
      description: 'Детальная статистика и мониторинг',
    },
    {
      icon: '🤖',
      title: 'AI Kodegen',
      description: 'Генерация кода с помощью искусственного интеллекта',
    },
    {
      icon: '🎨',
      title: 'Media Server',
      description: 'Обработка фото и видео в реальном времени',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0₽',
      period: 'навсегда',
      features: [
        'До 1000 сообщений/месяц',
        '5 ГБ хранилища',
        'Базовая поддержка',
        '1 устройство',
      ],
      cta: 'Начать бесплатно',
      popular: false,
    },
    {
      name: 'Pro',
      price: '299₽',
      period: 'в месяц',
      features: [
        'Безлимитные сообщения',
        '100 ГБ хранилища',
        'Приоритетная поддержка',
        '5 устройств',
        'AI Kodegen',
        'Расширенная аналитика',
      ],
      cta: 'Попробовать Pro',
      popular: true,
    },
    {
      name: 'Business',
      price: '999₽',
      period: 'в месяц',
      features: [
        'Всё из Pro',
        '1 ТБ хранилища',
        'Персональный менеджер',
        'Безлимит устройств',
        'API доступ',
        'SLA 99.9%',
        'White-label решение',
      ],
      cta: 'Связаться с нами',
      popular: false,
    },
  ];

  const stats = [
    { value: '10K+', label: 'Пользователей' },
    { value: '1M+', label: 'Сообщений в день' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50ms', label: 'Средний пинг' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎈</span>
              <span className="text-xl font-bold text-gray-900">Balloo</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Возможности
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                Тарифы
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                О нас
              </a>
              <Link
                href="http://localhost:3007"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Войти
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-blue-600">
                Возможности
              </a>
              <a href="#pricing" className="block text-gray-700 hover:text-blue-600">
                Тарифы
              </a>
              <a href="#about" className="block text-gray-700 hover:text-blue-600">
                О нас
              </a>
              <Link
                href="http://localhost:3007"
                className="block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg text-center"
              >
                Войти
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🎈</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Переверни общение
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Balloo — платформа нового поколения для коммуникации. 
              Мессенджер, SMS, AI и медиа в одном решении.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="http://localhost:3007"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Начать бесплатно
              </Link>
              <a
                href="#features"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl text-lg transition-colors border-2 border-gray-200"
              >
                Узнать больше
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Возможности платформы
            </h2>
            <p className="text-xl text-gray-600">
              Всё необходимое для современной коммуникации
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Простые тарифы
            </h2>
            <p className="text-xl text-gray-600">
              Выберите план, который подходит именно вам
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 border-2 ${
                  plan.popular
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
                    Популярный
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                О платформе Balloo
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Balloo — это современная платформа для коммуникации, объединяющая 
                мессенджер, SMS-шлюз, AI-генерацию кода и медиа-сервис в едином решении.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Мы создали экосистему из 20 взаимосвязанных узлов, каждый из которых 
                решает свою задачу, работая как единое целое.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Открытый исходный код</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">End-to-end шифрование</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Self-hosted решение</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">24/7 поддержка</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
              <div className="text-8xl mb-8">🎈</div>
              <h3 className="text-3xl font-bold mb-4">
                Присоединяйтесь к Balloo
              </h3>
              <p className="text-lg opacity-90 mb-8">
                Начните использовать платформу уже сегодня
              </p>
              <Link
                href="http://localhost:3007"
                className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Создать аккаунт
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎈</span>
                <span className="text-xl font-bold">Balloo</span>
              </div>
              <p className="text-gray-400">
                Переверни общение
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Возможности</a></li>
                <li><a href="#pricing" className="hover:text-white">Тарифы</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white">О нас</a></li>
                <li><a href="#" className="hover:text-white">Блог</a></li>
                <li><a href="#" className="hover:text-white">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Правовая информация</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Приватность</a></li>
                <li><a href="#" className="hover:text-white">Условия</a></li>
                <li><a href="#" className="hover:text-white">Лицензия</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 Balloo. Все права защищены.</p>
            <p className="mt-2">NBS-wt-Director | Оберюхтин Иван Анатольевич</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

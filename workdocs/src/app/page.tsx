/**
 * Balloo Workdocs
 * Портал документации платформы
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DocCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  docs: DocItem[];
}

interface DocItem {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
}

const categories: DocCategory[] = [
  {
    id: 'getting-started',
    name: 'Начало работы',
    icon: '🚀',
    description: 'Быстрый старт и основы платформы',
    docs: [
      { slug: 'quick-start', title: 'Быстрый старт', description: 'Запуск за 5 минут', updatedAt: '2026-06-14' },
      { slug: 'architecture', title: 'Архитектура', description: 'Обзор архитектуры платформы', updatedAt: '2026-06-14' },
      { slug: 'installation', title: 'Установка', description: 'Пошаговая установка', updatedAt: '2026-06-13' },
    ],
  },
  {
    id: 'api',
    name: 'API Документация',
    icon: '🔌',
    description: 'REST API и WebSocket',
    docs: [
      { slug: 'api-overview', title: 'Обзор API', description: 'Введение в API', updatedAt: '2026-06-14' },
      { slug: 'authentication', title: 'Аутентификация', description: 'JWT и OAuth', updatedAt: '2026-06-14' },
      { slug: 'endpoints', title: 'Эндпоинты', description: 'Полный список endpoints', updatedAt: '2026-06-14' },
      { slug: 'websocket', title: 'WebSocket', description: 'Real-time коммуникация', updatedAt: '2026-06-13' },
    ],
  },
  {
    id: 'nodes',
    name: 'Узлы Платформы',
    icon: '🎯',
    description: 'Документация по узлам',
    docs: [
      { slug: 'nodes-overview', title: 'Обзор узлов', description: 'Все 20 узлов платформы', updatedAt: '2026-06-14' },
      { slug: 'api-gateway', title: 'API Gateway', description: 'Центральный API', updatedAt: '2026-06-14' },
      { slug: 'messenger', title: 'Messenger', description: 'Мессенджер', updatedAt: '2026-06-13' },
      { slug: 'admin-portal', title: 'Admin Portal', description: 'Админ-панель', updatedAt: '2026-06-13' },
    ],
  },
  {
    id: 'deployment',
    name: 'Развёртывание',
    icon: '🐳',
    description: 'Docker и production',
    docs: [
      { slug: 'docker-compose', title: 'Docker Compose', description: 'Локальный запуск', updatedAt: '2026-06-14' },
      { slug: 'ubuntu-deploy', title: 'Ubuntu Deploy', description: 'Развёртывание на Ubuntu', updatedAt: '2026-06-14' },
      { slug: 'production', title: 'Production', description: 'Production настройка', updatedAt: '2026-06-13' },
    ],
  },
  {
    id: 'services',
    name: 'Сервисы',
    icon: '📦',
    description: 'SMS, Push, Yandex Disk',
    docs: [
      { slug: 'sms-service', title: 'SMS Service', description: 'Отправка SMS', updatedAt: '2026-06-14' },
      { slug: 'push-notifications', title: 'Push Notifications', description: 'Push уведомления', updatedAt: '2026-06-13' },
      { slug: 'yandex-disk', title: 'Yandex Disk', description: 'Интеграция с Диском', updatedAt: '2026-06-13' },
    ],
  },
  {
    id: 'packages',
    name: 'Пакеты',
    icon: '📚',
    description: 'Core пакеты',
    docs: [
      { slug: 'packages-overview', title: 'Обзор пакетов', description: '8 core пакетов', updatedAt: '2026-06-14' },
      { slug: 'core-ui', title: 'Core UI', description: 'UI компоненты', updatedAt: '2026-06-14' },
      { slug: 'core-types', title: 'Core Types', description: 'TypeScript типы', updatedAt: '2026-06-13' },
    ],
  },
];

export default function WorkdocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.map(category => ({
    ...category,
    docs: category.docs.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.docs.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📚 Balloo Workdocs
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Документация платформы Balloo
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск документации..."
                className="w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map(category => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              {/* Category Header */}
              <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h2>
                </div>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </div>

              {/* Docs List */}
              <div className="p-6">
                <ul className="space-y-3">
                  {category.docs.map(doc => (
                    <li key={doc.slug}>
                      <Link
                        href={`/docs/${doc.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {doc.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {doc.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                            {new Date(doc.updatedAt).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Документация не найдена
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Сбросить поиск
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              © 2026 Balloo Platform Documentation
            </div>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-gray-700">
                Главная
              </Link>
              <Link href="/api" className="hover:text-gray-700">
                API
              </Link>
              <a href="https://github.com/NBS-wt-Director/Messenger_Balloo_next_ts" className="hover:text-gray-700">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

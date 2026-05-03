'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle2, XCircle, Loader2, Server, Database, Clock } from 'lucide-react';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';

interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  responseTime: string;
  version: string;
  environment: string;
  checks: {
    database: {
      status: 'healthy' | 'unhealthy';
      tables: number;
    };
  };
}

export default function HealthPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              {translations.systemHealth || 'Состояние системы'}
            </h1>
            <p 
              className="text-lg"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {translations.systemHealthDesc || 'Мониторинг работоспособности сервисов'}
            </p>
          </div>

          {/* Загрузка */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--primary)' }} />
            </div>
          )}

          {/* Результат */}
          {health && !loading && (
            <div className="space-y-6">
              {/* Общий статус */}
              <div 
                className="rounded-lg p-6 flex items-center justify-between"
                style={{ 
                  background: health.status === 'healthy' 
                    ? 'var(--success)' + '15' 
                    : 'var(--destructive)' + '15',
                  border: `1px solid ${health.status === 'healthy' ? 'var(--success)' : 'var(--destructive)'}`
                }}
              >
                <div className="flex items-center gap-4">
                  {health.status === 'healthy' ? (
                    <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--success)' }} />
                  ) : (
                    <XCircle className="w-12 h-12" style={{ color: 'var(--destructive)' }} />
                  )}
                  <div>
                    <h2 
                      className="text-2xl font-bold"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {health.status === 'healthy' 
                        ? (translations.systemOperational || 'Система работоспособна')
                        : (translations.systemDown || 'Система неработоспособна')
                      }
                    </h2>
                    <p style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(health.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={checkHealth}
                  className="px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  {translations.refresh || 'Обновить'}
                </button>
              </div>

              {/* Детали */}
              <div 
                className="rounded-lg p-6"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <h3 
                  className="text-xl font-bold mb-6"
                  style={{ color: 'var(--foreground)' }}
                >
                  {translations.details || 'Детали'}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Response Time */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{ background: 'var(--background)' }}
                  >
                    <Clock className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {translations.responseTime || 'Время ответа'}
                      </p>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {health.responseTime}
                      </p>
                    </div>
                  </div>

                  {/* Environment */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{ background: 'var(--background)' }}
                  >
                    <Server className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {translations.environment || 'Окружение'}
                      </p>
                      <p 
                        className="text-2xl font-bold capitalize"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {health.environment}
                      </p>
                    </div>
                  </div>

                  {/* Version */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{ background: 'var(--background)' }}
                  >
                    <Database className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {translations.version || 'Версия'}
                      </p>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {health.version}
                      </p>
                    </div>
                  </div>

                  {/* Database Tables */}
                  <div 
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{ background: 'var(--background)' }}
                  >
                    <Database className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    <div>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {translations.databaseTables || 'Таблицы БД'}
                      </p>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {health.checks.database.tables}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Статус базы данных */}
                <div 
                  className="mt-6 p-4 rounded-lg"
                  style={{ 
                    background: health.checks.database.status === 'healthy' 
                      ? 'var(--success)' + '15' 
                      : 'var(--destructive)' + '15',
                    border: `1px solid ${health.checks.database.status === 'healthy' ? 'var(--success)' : 'var(--destructive)'}`
                  }}
                >
                  <div className="flex items-center gap-3">
                    {health.checks.database.status === 'healthy' ? (
                      <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--success)' }} />
                    ) : (
                      <XCircle className="w-6 h-6" style={{ color: 'var(--destructive)' }} />
                    )}
                    <div>
                      <p 
                        className="font-semibold"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {translations.databaseStatus || 'Статус базы данных'}
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {health.checks.database.status === 'healthy' 
                          ? (translations.databaseConnected || 'Подключена')
                          : (translations.databaseError || 'Ошибка подключения')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

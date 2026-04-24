'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { useAuthStore } from '@/stores/auth-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Heart, CreditCard, Copy, Check, Smartphone, QrCode } from 'lucide-react';
import { useAlert } from '@/hooks/useAlert';

interface PageSection {
  id: string;
  type: string;
  title: string;
  content: string;
  data: any;
}

interface PageData {
  id: string;
  title: string;
  content: string;
  sections: PageSection[];
  metadata: any;
}

export default function SupportPage() {
  const { language } = useSettingsStore();
  const { user } = useAuthStore();
  const { alert, AlertComponent } = useAlert();
  const translations = getTranslations(language);

  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedSbp, setCopiedSbp] = useState(false);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const response = await fetch('/api/pages?slug=support');
      if (response.ok) {
        const data = await response.json();
        setPageData(data.page);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Support] Error loading page:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSbp(true);
      setTimeout(() => setCopiedSbp(false), 2000);
      alert({ message, type: 'success' });
    } catch (error) {
      alert({ message: 'Не удалось скопировать', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  const sbpSection = pageData?.sections.find((s: PageSection) => s.type === 'payment' || s.id === 'sbp');
  const qrSection = pageData?.sections.find((s: PageSection) => s.type === 'qr' || s.id === 'qr');

  const sbpPhone = sbpSection?.data?.phone || '8 (912) 202-30-35';
  const sbpBank = sbpSection?.data?.bank || 'Сбербанк';
  const sbpRecipient = sbpSection?.data?.recipient || 'Иван Оберюхтин';
  const qrCodeUrl = qrSection?.data?.qrCodeUrl || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '40px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <Heart size={64} style={{ marginBottom: '20px', color: '#ef4444', margin: '0 auto 20px' }} />
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--foreground)' }}>
              {pageData?.title || 'Поддержать проект'}
            </h1>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'var(--muted-foreground)', maxWidth: '600px', margin: '0 auto' }}>
              {pageData?.content || 'Ваша поддержка помогает развивать Balloo Messenger. Спасибо за ваш вклад!'}
            </p>
          </div>

          {/* SBP Section */}
          <div style={{ 
            padding: '40px', 
            border: '2px solid var(--border)', 
            background: 'var(--card)',
            borderRadius: '16px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{ 
                padding: '12px', 
                background: '#2563eb', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Smartphone size={32} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--foreground)' }}>
                  СБП (Система Быстрых Платежей)
                </h2>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Мгновенный перевод по номеру телефона без комиссии
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '25px', 
              background: 'var(--background-secondary)', 
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  Получатель
                </p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)' }}>
                  {sbpRecipient}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  Банк получателя
                </p>
                <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--foreground)' }}>
                  {sbpBank}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '14px', color: 'var(--muted-foreground)', marginBottom: '8px' }}>
                  Номер телефона для СБП
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--foreground)', fontFamily: 'monospace' }}>
                    {sbpPhone}
                  </p>
                  <button
                    onClick={() => copyToClipboard(sbpPhone.replace(/\D/g, ''), 'Номер скопирован')}
                    style={{
                      padding: '10px 15px',
                      background: copiedSbp ? '#22c55e' : 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: '500'
                    }}
                  >
                    {copiedSbp ? <Check size={18} /> : <Copy size={18} />}
                    {copiedSbp ? 'Скопировано' : 'Копировать'}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '8px' }}>
                <p style={{ fontSize: '14px', color: '#2563eb' }}>
                  💡 <strong>Как оплатить:</strong> Откройте приложение вашего банка → Выберите «Перевод по СБП» → Введите номер телефона → Подтвердите перевод
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{ 
            padding: '40px', 
            border: '2px solid var(--border)', 
            background: 'var(--card)',
            borderRadius: '16px',
            marginBottom: '30px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <div style={{ 
                padding: '12px', 
                background: '#7c3aed', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={32} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--foreground)' }}>
                  {qrSection?.title || 'QR-код для оплаты'}
                </h2>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {qrSection?.content || 'Отсканируйте QR-код для быстрого перевода через СБП'}
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '30px', 
              background: 'white', 
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px'
            }}>
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR-код для поддержки" 
                  style={{ maxWidth: '250px', height: 'auto' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#666' }}>
                  <QrCode size={120} style={{ marginBottom: '20px', opacity: 0.3 }} />
                  <p style={{ fontSize: '16px', marginBottom: '10px' }}>QR-код для СБП</p>
                  <p style={{ fontSize: '14px' }}>Номер: <strong style={{ color: 'var(--foreground)' }}>{sbpPhone}</strong></p>
                  <p style={{ fontSize: '13px', marginTop: '15px', color: '#999' }}>Администратор может загрузить QR-код через админ-панель</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(124, 58, 237, 0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#7c3aed' }}>
                📱 <strong>Как оплатить:</strong> Откройте камеру или приложение банка → Наведите на QR-код → Подтвердите перевод
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{ padding: '30px', border: '2px solid var(--border)', background: 'var(--card)', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--foreground)' }}>
              Почему ваша поддержка важна?
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#2563eb', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CreditCard size={20} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px', color: 'var(--foreground)' }}>
                    Оплата серверов
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Хранение данных, резервное копирование и бесперебойная работа 24/7
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: '#7c3aed', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Heart size={20} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px', color: 'var(--foreground)' }}>
                    Развитие проекта
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Добавление новых функций, улучшение безопасности и производительности
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {AlertComponent}
    </div>
  );
}

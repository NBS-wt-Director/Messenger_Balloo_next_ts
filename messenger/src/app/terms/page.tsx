
'use client';

import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Scale, FileCheck, ShieldCheck, AlertTriangle, Shield, RefreshCw, HelpCircle, Lock } from 'lucide-react';

interface Section {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
  warning?: boolean;
}

export default function TermsPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  const sections: Section[] = [
    {
      icon: Scale,
      title: '1. Общие положения',
      content: (
        <p>
          Настоящие Правила сервиса (далее — «Правила») регулируют отношения между 
          пользователем и сервисом Secure Messenger в отношении использования мессенджера.
        </p>
      )
    },
    {
      icon: FileCheck,
      title: '2. Принятие условий',
      content: (
        <p>
          Используя сервис Secure Messenger, вы подтверждаете, что прочитали, поняли 
          и согласны с настоящими Правилами. Если вы не согласны с каким-либо пунктом 
          Правил, пожалуйста, не используйте сервис.
        </p>
      )
    },
    {
      icon: ShieldCheck,
      title: '3. Учетная запись',
      content: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Вы несете ответственность за безопасность вашей учетной записи</li>
          <li>Вы должны немедленно уведомить нас о любом несанкционированном использовании</li>
          <li>Вы несете ответственность за все действия под вашей учетной записью</li>
        </ul>
      )
    },
    {
      icon: FileCheck,
      title: '4. Контент пользователя',
      content: (
        <p>
          Вы сохраняете право собственности на контент, который вы отправляете через 
          сервис. Однако вы предоставляете нам право использовать этот контент для 
          предоставления услуг.
        </p>
      )
    },
    {
      icon: AlertTriangle,
      title: '5. Запрещенные действия',
      content: (
        <>
          <p className="mb-3">Запрещается:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Нарушать законы и нормативные акты</li>
            <li>Нарушать права третьих лиц</li>
            <li>Распространять вредоносное ПО или вирусы</li>
            <li>Осуществлять спам или фишинг</li>
            <li>Публиковать оскорбительный, угрожающий или клеветнический контент</li>
          </ul>
        </>
      ),
      warning: true
    },
    {
      icon: Lock,
      title: '6. Безопасность',
      content: (
        <p>
          Мы применяем E2E шифрование для защиты ваших сообщений. Однако никакая 
          система не может гарантировать 100% безопасность. Вы используете сервис на свой риск.
        </p>
      )
    },
    {
      icon: Shield,
      title: '7. Отказ от гарантий',
      content: (
        <p>
          Сервис предоставляется «как есть» без каких-либо гарантий. Мы не гарантируем 
          бесперебойную работу или отсутствие ошибок.
        </p>
      )
    },
    {
      icon: RefreshCw,
      title: '8. Изменения в Правилах',
      content: (
        <p>
          Мы оставляем за собой право изменять настоящие Правила в любое время. 
          Продолжая использовать сервис после изменений, вы соглашаетесь с новыми условиями.
        </p>
      )
    },
    {
      icon: HelpCircle,
      title: '9. Контакты',
      content: (
        <p>
          Если у вас есть вопросы о настоящих Правилах, пожалуйста, свяжитесь с нами 
          через службу поддержки.
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-8 safe-area-bottom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" 
                 style={{ background: 'var(--primary)', color: 'white' }}>
              <Scale size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
              {translations.termsOfService}
            </h1>
            <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div 
                key={index}
                className={`rounded-xl p-5 transition-all duration-200 hover:shadow-lg ${
                  section.warning ? 'border-l-4' : ''
                }`}
                style={{ 
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  ...(section.warning ? { 
                    borderLeftColor: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.05)'
                  } : {})
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    section.warning ? 'bg-red-500' : 'bg-[var(--primary)]'
                  }`} style={{ color: 'white' }}>
                    <section.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                      {section.title}
                    </h2>
                    <div className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notice */}
          <div className="mt-8 p-5 rounded-xl border" 
               style={{ 
                 background: 'var(--background-secondary)', 
                 borderColor: 'var(--border)'
               }}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <HelpCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                  Важная информация
                </h3>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                  Используя этот сервис, вы соглашаетесь с данными условиями. 
                  Пожалуйста, внимательно прочитайте все пункты перед началом использования.
                  Если у вас есть вопросы, свяжитесь со службой поддержки.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

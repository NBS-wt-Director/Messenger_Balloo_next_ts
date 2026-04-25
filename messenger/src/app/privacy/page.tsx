'use client';

import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, Lock, Database, Eye, FileText, Users, RefreshCw, HelpCircle } from 'lucide-react';

interface Section {
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

export default function PrivacyPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  const sections: Section[] = [
    {
      icon: FileText,
      title: '1. Введение',
      content: (
        <p>
          Настоящее Положение о неразглашении (далее — «Политика конфиденциальности») 
          объясняет, как мы собираем, используем, раскрываем и защищаем вашу личную 
          информацию при использовании сервиса Secure Messenger.
        </p>
      )
    },
    {
      icon: Database,
      title: '2. Сбор информации',
      content: (
        <>
          <p className="mb-3">Мы собираем следующую информацию:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Данные учетной записи (email, имя пользователя)</li>
            <li>Контактная информация (при использовании OAuth)</li>
            <li>Данные сообщений (зашифрованное содержимое)</li>
            <li>Данные о использовании сервиса</li>
            <li>Информация об устройстве</li>
          </ul>
        </>
      )
    },
    {
      icon: Users,
      title: '3. Использование информации',
      content: (
        <>
          <p className="mb-3">Мы используем собранную информацию для:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Предоставления и улучшения услуг</li>
            <li>Обеспечения безопасности</li>
            <li>Персонализации пользовательского опыта</li>
            <li>Связи с пользователями</li>
            <li>Соблюдения правовых обязательств</li>
          </ul>
        </>
      )
    },
    {
      icon: Lock,
      title: '4. Защита данных',
      content: (
        <>
          <p className="mb-3">Мы применяем комплексные меры для защиты ваших данных:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>E2E шифрование сообщений</li>
            <li>Шифрование данных при передаче (TLS)</li>
            <li>Безопасное хранение паролей (хеширование)</li>
            <li>Регулярные аудиты безопасности</li>
            <li>Ограничение доступа к данным</li>
          </ul>
        </>
      )
    },
    {
      icon: Database,
      title: '5. Хранение данных',
      content: (
        <p>
          Ваши данные хранятся локально на вашем устройстве с использованием RxDB 
          (IndexedDB). Мы не храним расшифрованные сообщения на сервере. 
          Вложения хранятся на вашем Яндекс.Диске.
        </p>
      )
    },
    {
      icon: Users,
      title: '6. Раскрытие третьим лицам',
      content: (
        <>
          <p className="mb-3">
            Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим 
            лицам, за исключением случаев:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>С вашего согласия</li>
            <li>Для предоставления услуг (Яндекс.Диск)</li>
            <li>По требованию закона</li>
            <li>Для защиты прав и безопасности</li>
          </ul>
        </>
      )
    },
    {
      icon: Shield,
      title: '7. Ваши права',
      content: (
        <>
          <p className="mb-3">Вы имеете право:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Получить доступ к вашим данным</li>
            <li>Исправить неточные данные</li>
            <li>Удалить ваши данные</li>
            <li>Экспортировать ваши данные</li>
            <li>Отозвать согласие на обработку</li>
          </ul>
        </>
      )
    },
    {
      icon: FileText,
      title: '8. Вложения и Яндекс.Диск',
      content: (
        <p>
          Файлы (фото, видео, документы) загружаются на ваш личный Яндекс.Диск. 
          Мы не имеем доступа к содержимому ваших файлов. Политика конфиденциальности 
          Яндекса применяется к хранению ваших файлов.
        </p>
      )
    },
    {
      icon: Users,
      title: '9. Несовершеннолетние',
      content: (
        <p>
          Наш сервис не предназначен для лиц младше 13 лет. Мы не сознательно 
          собираем информацию от детей.
        </p>
      )
    },
    {
      icon: RefreshCw,
      title: '10. Изменения в политике',
      content: (
        <p>
          Мы можем обновлять настоящую Политику конфиденциальности. Мы уведомим 
          вас о существенных изменениях путем размещения новой версии на этой странице.
        </p>
      )
    },
    {
      icon: HelpCircle,
      title: '11. Контакты',
      content: (
        <p>
          Если у вас есть вопросы о настоящей Политике конфиденциальности, 
          пожалуйста, свяжитесь с нами через службу поддержки.
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
              <Shield size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
              {translations.privacyPolicy}
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
                className="rounded-xl p-5 transition-all duration-200 hover:shadow-lg"
                style={{ 
                  background: 'var(--card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                       style={{ background: 'var(--primary)', color: 'white' }}>
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

          {/* Footer Note */}
          <div className="mt-8 p-4 rounded-lg text-center text-sm" 
               style={{ background: 'var(--background-secondary)', color: 'var(--muted-foreground)' }}>
            <p>
              Если у вас есть вопросы о настоящей Политике конфиденциальности, 
              пожалуйста, свяжитесь с нами через службу поддержки.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

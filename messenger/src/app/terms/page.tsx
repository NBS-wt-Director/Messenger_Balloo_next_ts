'use client';

import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-8 safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            {translations.termsOfService}
          </h1>
          
          <div className="space-y-6 text-sm" style={{ color: 'var(--foreground)' }}>
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Общие положения</h2>
              <p>
                Настоящие Правила сервиса (далее — «Правила») регулируют отношения между 
                пользователем и сервисом Secure Messenger в отношении использования мессенджера.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. Принятие условий</h2>
              <p>
                Используя сервис Secure Messenger, вы подтверждаете, что прочитали, поняли 
                и согласны с настоящими Правилами. Если вы не согласны с каким-либо пунктом 
                Правил, пожалуйста, не используйте сервис.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. Учетная запись</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Вы несете ответственность за безопасность вашей учетной записи</li>
                <li>Вы должны немедленно уведомить нас о любом несанкционированном использовании</li>
                <li>Вы несете ответственность за все действия под вашей учетной записью</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Контент пользователя</h2>
              <p>
                Вы сохраняете право собственности на контент, который вы отправляете через 
                сервис. Однако вы предоставляете нам право использовать этот контент для 
                предоставления услуг.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Запрещенные действия</h2>
              <p>Запрещается:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Нарушать законы и нормативные акты</li>
                <li>Нарушать права третьих лиц</li>
                <li>Распространять вредоносное ПО или вирусы</li>
                <li>Осуществлять спам или фишинг</li>
                <li>Публиковать оскорбительный, угрожающий или клеветнический контент</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">6. Безопасность</h2>
              <p>
                Мы применяем E2E шифрование для защиты ваших сообщений. Однако никакая 
                система не может гарантировать 100% безопасность. Вы используете сервис на свой риск.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">7. Отказ от гарантий</h2>
              <p>
                Сервис предоставляется «как есть» без каких-либо гарантий. Мы не гарантируем 
                бесперебойную работу или отсутствие ошибок.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">8. Изменения в Правилах</h2>
              <p>
                Мы оставляем за собой право изменять настоящие Правила в любое время. 
                Продолжая использовать сервис после изменений, вы соглашаетесь с новыми условиями.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">9. Контакты</h2>
              <p>
                Если у вас есть вопросы о настоящих Правилах, пожалуйста, свяжитесь с нами 
                через службу поддержки.
              </p>
            </section>

            <p className="text-sm pt-4" style={{ color: 'var(--muted-foreground)' }}>
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

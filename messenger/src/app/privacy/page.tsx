'use client';

import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
  const { language } = useSettingsStore();
  const translations = getTranslations(language);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      <Header />
      
      <main className="flex-1 px-4 py-8 safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            {translations.privacyPolicy}
          </h1>
          
          <div className="space-y-6 text-sm" style={{ color: 'var(--foreground)' }}>
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Введение</h2>
              <p>
                Настоящее Положение о неразглашении (далее — «Политика конфиденциальности») 
                объясняет, как мы собираем, используем, раскрываем и защищаем вашу личную 
                информацию при использовании сервиса Secure Messenger.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. Сбор информации</h2>
              <p>Мы собираем следующую информацию:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Данные учетной записи (email, имя пользователя)</li>
                <li>Контактная информация (при использовании OAuth)</li>
                <li>Данные сообщений (зашифрованное содержимое)</li>
                <li>Данные о использовании сервиса</li>
                <li>Информация об устройстве</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. Использование информации</h2>
              <p>Мы используем собранную информацию для:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Предоставления и улучшения услуг</li>
                <li>Обеспечения безопасности</li>
                <li>Персонализации пользовательского опыта</li>
                <li>Связи с пользователями</li>
                <li>Соблюдения правовых обязательств</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Защита данных</h2>
              <p>
                Мы применяем комплексные меры для защиты ваших данных:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>E2E шифрование сообщений</li>
                <li>Шифрование данных при передаче (TLS)</li>
                <li>Безопасное хранение паролей (хеширование)</li>
                <li>Регулярные аудиты безопасности</li>
                <li>Ограничение доступа к данным</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Хранение данных</h2>
              <p>
                Ваши данные хранятся локально на вашем устройстве с использованием RxDB 
                (IndexedDB). Мы не храним расшифрованные сообщения на сервере. 
                Вложения хранятся на вашем Яндекс.Диске.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">6. Раскрытие третьим лицам</h2>
              <p>
                Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим 
                лицам, за исключением случаев:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>С вашего согласия</li>
                <li>Для предоставления услуг (Яндекс.Диск)</li>
                <li>По требованию закона</li>
                <li>Для защиты прав и безопасности</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">7. Ваши права</h2>
              <p>Вы имеете право:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Получить доступ к вашим данным</li>
                <li>Исправить неточные данные</li>
                <li>Удалить ваши данные</li>
                <li>Экспортировать ваши данные</li>
                <li>Отозвать согласие на обработку</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">8. Вложения и Яндекс.Диск</h2>
              <p>
                Файлы (фото, видео, документы) загружаются на ваш личный Яндекс.Диск. 
                Мы не имеем доступа к содержимому ваших файлов. Политика конфиденциальности 
                Яндекса применяется к хранению ваших файлов.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">9. Несовершеннолетние</h2>
              <p>
                Наш сервис не предназначен для лиц младше 13 лет. Мы не сознательно 
                собираем информацию от детей.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">10. Изменения в политике</h2>
              <p>
                Мы можем обновлять настоящую Политику конфиденциальности. Мы уведомим 
                вас о существенных изменениях путем размещения новой версии на этой странице.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">11. Контакты</h2>
              <p>
                Если у вас есть вопросы о настоящей Политике конфиденциальности, 
                пожалуйста, свяжитесь с нами.
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

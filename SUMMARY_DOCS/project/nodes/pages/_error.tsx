import { NextPageContext } from 'next';
import Error from 'next/error';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ErrorPageProps {
  statusCode: number;
  hasGetInitialPropsRun?: boolean;
  errorMessage?: string;
}

export default function MyError({ statusCode, hasGetInitialPropsRun, errorMessage }: ErrorPageProps) {
  const title = getErrorTitle(statusCode);
  const message = getErrorMessage(statusCode, errorMessage);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#f5f5f5'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          textAlign: 'center',
          borderTop: '4px solid #e94560'
        }}>
          <h1 style={{ 
            fontSize: '4rem', 
            margin: '0 0 1rem 0', 
            color: '#e94560',
            fontWeight: 700
          }}>
            {statusCode}
          </h1>
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            margin: '0 0 1rem 0', 
            color: '#1a1a2e'
          }}>
            {title}
          </h2>
          
          <p style={{ 
            fontSize: '1rem', 
            color: '#666', 
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            {message}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: '#e94560',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '0',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#d63652';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#e94560';
              }}
            >
              🏠 На главную
            </a>
            
            <a
              href="/page/INDEX"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'white',
                color: '#e94560',
                border: '1px solid #e94560',
                textDecoration: 'none',
                borderRadius: '0',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              📚 Документация
            </a>
          </div>
          
          {process.env.NODE_ENV === 'development' && errorMessage && (
            <details style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f5f5f5',
              borderRadius: '0',
              textAlign: 'left'
            }}>
              <summary style={{
                fontWeight: 600,
                marginBottom: '0.5rem',
                cursor: 'pointer'
              }}>
                🔍 Technical Details (Development Only)
              </summary>
              <pre style={{
                fontSize: '0.8rem',
                color: '#666',
                overflow: 'auto',
                margin: 0,
                padding: '0.5rem',
                background: '#fafafa',
                border: '1px solid #ddd'
              }}>
                {errorMessage}
              </pre>
            </details>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

MyError.getInitialProps = async ({ res, err, asPath }: NextPageContext) => {
  const errorInitialProps = await Error.getInitialProps({ res, err } as NextPageContext);
  
  // Workaround for https://github.com/vercel/next.js/issues/8592
  // Mark that error was received
  errorInitialProps.hasGetInitialPropsRun = true;
  
  const statusCode = res ? res.statusCode : err ? err.statusCode || 500 : 404;
  
  // Get error message for development
  const errorMessage = err ? err.message : undefined;
  
  return {
    statusCode,
    hasGetInitialPropsRun: true,
    errorMessage,
  };
};

function getErrorTitle(statusCode: number): string {
  switch (statusCode) {
    case 404:
      return 'Страница не найдена';
    case 500:
      return 'Внутренняя ошибка сервера';
    case 403:
      return 'Доступ запрещён';
    case 401:
      return 'Требуется авторизация';
    default:
      return 'Произошла ошибка';
  }
}

function getErrorMessage(statusCode: number, customMessage?: string): string {
  if (customMessage) {
    return customMessage;
  }
  
  switch (statusCode) {
    case 404:
      return 'К сожалению, мы не смогли найти страницу, которую вы ищете. Возможно, она была перемещена или удалена.';
    case 500:
      return 'Произошла непредвиденная ошибка на нашем сервере. Пожалуйста, попробуйте обновить страницу или вернуться позже.';
    case 403:
      return 'У вас нет прав для доступа к этой странице. Пожалуйста, проверьте свои учётные данные.';
    case 401:
      return 'Для доступа к этой странице требуется авторизация. Пожалуйста, войдите в систему.';
    default:
      return 'Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте обновить страницу.';
  }
}

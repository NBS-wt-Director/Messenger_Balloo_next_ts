import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        marginTop: '80px'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          textAlign: 'center',
          borderTop: '5px solid #e94560'
        }}>
          <div style={{
            fontSize: '5rem', 
            marginBottom: '1rem',
            animation: 'bounce 2s infinite'
          }}>
            🔍
          </div>
          
          <h1 style={{ 
            fontSize: '4rem', 
            margin: '0 0 1rem 0', 
            color: '#e94560',
            fontWeight: 700,
            lineHeight: 1
          }}>
            404
          </h1>
          
          <h2 style={{ 
            fontSize: '1.5rem', 
            margin: '0 0 1rem 0', 
            color: '#1a1a2e'
          }}>
            Страница не найдена
          </h2>
          
          <p style={{ 
            fontSize: '1rem', 
            color: '#666', 
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            К сожалению, мы не смогли найти страницу, которую вы ищете. 
            Возможно, она была перемещена или удалена.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: '#e94560',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px rgba(233, 69, 96, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#d63652';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#e94560';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🏠 На главную
            </Link>
            
            <Link
              href="/page/INDEX"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'white',
                color: '#e94560',
                border: '2px solid #e94560',
                textDecoration: 'none',
                borderRadius: '4px',
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
              📚 Вся документация
            </Link>
            
            <Link
              href="/page/AI_ENTRYPOINTS"
              style={{
                display: 'inline-block',
                padding: '0.75rem 2rem',
                background: 'white',
                color: '#1976d2',
                border: '2px solid #1976d2',
                textDecoration: 'none',
                borderRadius: '4px',
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
              🤖 Для AI
            </Link>
          </div>
          
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#f0f8ff',
            borderRadius: '4px',
            border: '1px solid #b3d9ff'
          }}>
            <h3 style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '1rem',
              color: '#0066cc'
            }}>
              💡 Подсказка
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9rem',
              color: '#666',
              lineHeight: 1.5
            }}>
              Используйте <strong>INDEX.md</strong> для навигации по всей документации 
              или проверьте <strong>MANIFEST.json</strong> для полного списка документов.
            </p>
          </div>
          
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffc107'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.85rem',
              color: '#856404'
            }}>
              <strong>⚠️ Legacy URL?</strong> Если вы перешли по старой ссылке, 
              проверьте <strong>ROUTING.json</strong> для маппинга на новый canonical путь.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <style jsx global>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

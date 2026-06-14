export default function Footer() {
  const now = new Date();
  const version = '2.0.0';

  return (
    <footer style={{
      background: '#1a1a2e',
      color: 'white',
      padding: '2rem',
      borderTop: '3px solid #e94560',
      marginTop: '3rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
          🎈 Balloo - Переверни общение!
        </p>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          © 2026 Balloo Platform. All rights reserved.
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '0.85rem', 
          opacity: 0.7,
          fontFamily: 'monospace'
        }}>
          Documentation Hub v{version} | SUMMARY_DOCS | Updated: {now.toLocaleDateString('ru-RU')}
        </p>
        <p style={{ 
          margin: '0.5rem 0 0 0', 
          fontSize: '0.8rem', 
          opacity: 0.6 
        }}>
          Central Documentation Node • Canonical Source of Truth
        </p>
      </div>
    </footer>
  );
}

import Link from 'next/link';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Balloo Documentation' }: HeaderProps) {
  return (
    <header style={{
      background: '#1a1a2e',
      color: 'white',
      padding: '1rem 2rem',
      borderBottom: '3px solid #e94560'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
            🎈 Balloo Platform
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
            Documentation Hub
          </p>
        </div>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/" style={{
            color: 'white',
            padding: '0.5rem 1rem',
            background: '#e94560',
            borderRadius: '0',
            display: 'inline-block',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            🏠 Home
          </Link>
          <Link href="/editor" style={{
            color: 'white',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: '1px solid white',
            borderRadius: '0',
            display: 'inline-block',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            ✏️ Редактор
          </Link>
        </nav>
      </div>
    </header>
  );
}

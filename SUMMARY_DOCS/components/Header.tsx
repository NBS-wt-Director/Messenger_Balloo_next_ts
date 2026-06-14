import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Balloo Documentation' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: '🏠 Главная' },
    { href: '/page/INDEX', label: '📚 INDEX' },
    { href: '/page/AI_ENTRYPOINTS', label: '🤖 AI' },
    { href: '/page/codegen-playbook', label: '💻 Codegen' },
  ];

  return (
    <header style={{
      background: '#1a1a2e',
      color: 'white',
      padding: '0',
      borderBottom: '3px solid #e94560',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem'
      }}>
        <div>
          <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
              📚 Balloo SUMMARY_DOCS
            </h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
              Central Documentation Node
            </p>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: '0.5rem' }} className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: 'white',
                padding: '0.5rem 1rem',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '0',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = '#e94560';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '1.5rem',
            borderRadius: '0'
          }}
          className="hamburger-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav style={{
          background: 'rgba(26, 26, 46, 0.98)',
          padding: '1rem 2rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                color: 'white',
                padding: '0.75rem 0',
                textDecoration: 'none',
                fontWeight: 600,
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

export default function Header({ title = 'Balloo Documentation' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { href: '/', label: '🏠 Главная' },
    { href: '/page/INDEX', label: '📚 INDEX' },
    { href: '/page/ROOT_SUMMARY_DOCS', label: '🎯 Обзор' },
    { href: '/page/AI_ENTRYPOINTS', label: '🤖 AI' },
    { href: '/page/codegen-playbook', label: '💻 Codegen' },
  ];

  const categoryItems = [
    { href: '/category/policies', label: '📜 Policies' },
    { href: '/category/node-contracts', label: '📜 Node Contracts' },
    { href: '/category/summary', label: '📊 Summary' },
    { href: '/category/topology', label: '🗺️ Topology' },
    { href: '/category/state', label: '💾 State' },
    { href: '/category/playbooks', label: '📋 Playbooks' },
    { href: '/category/appendix', label: '📎 Appendix' },
  ];

  return (
    <header style={{
      background: '#1a1a2e',
      color: 'white',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      borderBottom: '3px solid #e94560'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem'
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem' }}>📚</span>
          <div>
            <h1 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>
              Balloo SUMMARY_DOCS
            </h1>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: '0.1rem 0 0 0' }}>
              Central Documentation Node
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: 'white',
                padding: '0.5rem 0.85rem',
                borderRadius: '0',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                background: 'transparent',
                borderBottom: '2px solid transparent'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(233, 69, 96, 0.2)';
                e.currentTarget.style.borderBottomColor = '#e94560';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              {item.label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button style={{
              color: 'white',
              padding: '0.5rem 0.85rem',
              borderRadius: '0',
              border: '1px solid white',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              📁 Категории
            </button>
            
            {menuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '0',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                minWidth: '250px',
                marginTop: '0.5rem',
                zIndex: 1001
              }}>
                {categoryItems.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      color: '#333',
                      textDecoration: 'none',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f5f5f5';
                      e.currentTarget.style.color = '#e94560';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#333';
                    }}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

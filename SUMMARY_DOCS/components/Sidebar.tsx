import Link from 'next/link';

interface SidebarProps {
  directories: string[];
  activeSlug?: string;
}

export default function Sidebar({ directories, activeSlug }: SidebarProps) {
  const mainDocs = [
    { slug: 'INDEX', title: '📚 Documentation Index' },
    { slug: 'Monorepo_readme', title: '📖 Monorepo README' },
    { slug: 'TZ', title: '📋 Technical Specification' },
    { slug: 'Featurys', title: '✨ Features' },
    { slug: 'Release_plan', title: '🎯 Release Plan' },
    { slug: 'Realease_calendare', title: '📅 Release Calendar' },
    { slug: 'To_clean', title: '🧹 To Clean' },
    { slug: 'Errors', title: '🐛 Errors' },
    { slug: 'Monorepo_structure', title: '📁 Structure' },
  ];

  const categories = [
    { name: 'Contracts', slug: 'Contracts', icon: '📜' },
    { name: 'Nodes', slug: 'Nodes', icon: '🖥️' },
    { name: 'Modules', slug: 'Modules', icon: '📦' },
    { name: 'Tree', slug: 'Tree', icon: '🌳' },
    { name: 'History Tickets', slug: 'history_tickets', icon: '🎫' },
  ];

  return (
    <aside style={{
      width: '280px',
      background: '#fff',
      padding: '1.5rem',
      borderRight: '1px solid #ddd',
      height: 'calc(100vh - 120px)',
      overflowY: 'auto',
      position: 'fixed',
      left: 0,
      top: '80px'
    }}>
      <h3 style={{ 
        fontSize: '1rem', 
        marginBottom: '1rem', 
        color: '#1a1a2e',
        borderBottom: '2px solid #e94560',
        paddingBottom: '0.5rem'
      }}>
        Main Documents
      </h3>
      <nav style={{ marginBottom: '2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {mainDocs.map((doc) => (
            <li key={doc.slug} style={{ marginBottom: '0.5rem' }}>
              <Link 
                href={`/page/${doc.slug}`}
                style={{
                  display: 'block',
                  padding: '0.5rem',
                  color: activeSlug === doc.slug ? '#e94560' : '#333',
                  background: activeSlug === doc.slug ? '#f0f0f0' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '0',
                  borderLeft: activeSlug === doc.slug ? '3px solid #e94560' : '3px solid transparent',
                  marginLeft: '-3px'
                }}
              >
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <h3 style={{ 
        fontSize: '1rem', 
        marginBottom: '1rem', 
        color: '#1a1a2e',
        borderBottom: '2px solid #e94560',
        paddingBottom: '0.5rem'
      }}>
        Categories
      </h3>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map((cat) => (
            <li key={cat.slug} style={{ marginBottom: '0.5rem' }}>
              <Link 
                href={`/category/${cat.slug}`}
                style={{
                  display: 'block',
                  padding: '0.5rem',
                  color: '#333',
                  background: 'transparent',
                  textDecoration: 'none',
                }}
              >
                {cat.icon} {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

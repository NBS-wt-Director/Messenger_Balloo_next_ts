import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  directories: string[];
  activeSlug?: string;
  manifest?: any;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ directories, activeSlug, manifest, collapsed = false, onToggle }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'node-contracts': true,
    'summary': true,
    'topology': true,
    'state': true,
    'modules': true
  });

  const mainDocs = [
    { slug: 'INDEX', title: '📚 Documentation Index' },
    { slug: 'ROOT_SUMMARY_DOCS', title: '🎯 ROOT SUMMARY DOCS' },
    { slug: 'MODULE_INDEX', title: '🧩 Module Layer' },
    { slug: 'AI_ENTRYPOINTS', title: '🤖 AI Entry Points' },
    { slug: 'codegen-playbook', title: '💻 Codegen Playbook' },
    { slug: 'DOC_SOURCE_POLICY', title: '📜 Source Policy' },
    { slug: 'DOC_GENERATION_POLICY', title: '🤖 Generation Policy' },
    { slug: 'DOC_CODEGEN_POLICY', title: '💻 Codegen Policy' },
    { slug: 'DOC_WEB_READER_POLICY', title: '🌐 Web Reader Policy' },
  ];

  const categories = manifest?.categories?.map((cat: any) => ({
    name: cat.name,
    slug: cat.id,
    icon: getIconForCategory(cat.id),
    description: cat.description
  })) || [
    { name: 'Modules', slug: 'modules', icon: '🧩', description: 'Module layer' },
    { name: 'Contracts', slug: 'contracts', icon: '📜', description: 'Контракты системы' },
    { name: 'Summary', slug: 'summary', icon: '📊', description: 'Сводные документы' },
    { name: 'Topology', slug: 'topology', icon: '🗺️', description: 'Карты и топология' },
    { name: 'State', slug: 'state', icon: '💾', description: 'State файлы' },
    { name: 'Playbooks', slug: 'playbooks', icon: '📋', description: 'Playbooks' },
    { name: 'Appendix', slug: 'appendix', icon: '📎', description: 'Приложения' },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (collapsed) {
    return null;
  }

  return (
    <aside style={{
      width: '280px',
      background: '#fff',
      padding: '1.5rem',
      borderRight: '1px solid #ddd',
      height: 'calc(100vh - 80px)',
      overflowY: 'auto',
      position: 'fixed',
      left: 0,
      top: '80px',
      zIndex: 999
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ 
          fontSize: '1rem', 
          margin: 0,
          color: '#1a1a2e',
          borderBottom: '2px solid #e94560',
          paddingBottom: '0.5rem'
        }}>
          🎯 Quick Access
        </h3>
        {onToggle && (
          <button
            onClick={onToggle}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: '#666',
              padding: '0.25rem'
            }}
            title="Свернуть меню"
          >
            ✕
          </button>
        )}
      </div>
      
      <nav style={{ marginBottom: '2rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
                  marginLeft: '-3px',
                  fontSize: '0.9rem'
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
        📁 Categories
      </h3>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {categories.map((cat: any) => (
            <li key={cat.slug} style={{ marginBottom: '0.5rem' }}>
              <div
                onClick={() => toggleCategory(cat.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  background: 'transparent',
                  borderRadius: '0'
                }}
              >
                <span style={{ textDecoration: 'none', color: '#333' }}>
                  {cat.icon} {cat.name}
                </span>
                <span style={{ fontSize: '0.8rem' }}>
                  {expandedCategories[cat.slug] ? '▼' : '▶'}
                </span>
              </div>
              {expandedCategories[cat.slug] && (
                <Link 
                  href={`/category/${cat.slug}`}
                  style={{
                    display: 'block',
                    padding: '0.25rem 0.5rem 0.25rem 2rem',
                    fontSize: '0.85rem',
                    color: '#666',
                    textDecoration: 'none'
                  }}
                >
                  → {cat.description || 'Перейти к категории'}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function getIconForCategory(categoryId: string): string {
  const icons: Record<string, string> = {
    'root': '🏠',
    'policies': '📜',
    'node-contracts': '📜',
    'project-contracts': '📜',
    'domain-contracts': '📜',
    'contracts': '📜',
    'modules': '🧩',
    'summary': '📊',
    'topology': '🗺️',
    'state': '💾',
    'architecture': '🏗️',
    'playbooks': '📋',
    'appendix': '📎',
    'migrations': '🔄',
    'audits': '🔍',
    'deprecated': '⚠️'
  };
  return icons[categoryId] || '📁';
}


import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

interface CategoryProps {
  categoryName: string;
  files: Array<{ name: string; title: string; description?: string; status?: string }>;
  manifest: any;
}

const categoryTitles: Record<string, string> = {
  'root': '🏠 Root Documents',
  'policies': '📜 Policies',
  'node-contracts': '📜 Node Contracts',
  'contracts': '📜 Contracts',
  'summary': '📊 Summary',
  'topology': '🗺️ Topology',
  'state': '💾 State',
  'architecture': '🏗️ Architecture',
  'playbooks': '📋 Playbooks',
  'appendix': '📎 Appendix',
  'migrations': '🔄 Migrations',
  'audits': '🔍 Audits',
  'deprecated': '⚠️ Deprecated',
  'Contracts': '📜 Contracts',
  'Nodes': '🖥️ Nodes',
  'Modules': '📦 Modules',
  'Tree': '🌳 Tree',
  'history_tickets': '🎫 History Tickets',
};

const categoryDescriptions: Record<string, string> = {
  'root': 'Корневые документы SUMMARY_DOCS',
  'policies': 'Политики и правила документации',
  'node-contracts': 'Контракты узлов системы',
  'contracts': 'Контракты и спецификации',
  'summary': 'Сводные документы по узлам и проекту',
  'topology': 'Карты и топология системы',
  'state': 'State файлы и конфигурация',
  'architecture': 'Архитектура системы',
  'playbooks': 'Playbooks и инструкции',
  'appendix': 'Приложения и справочные материалы',
  'migrations': 'Миграции и roadmap',
  'audits': 'Аудиты и отчёты',
  'deprecated': 'Устаревшие документы',
};

export default function CategoryPage({ categoryName, files, manifest }: CategoryProps) {
  const directories = manifest?.categories?.map((cat: any) => cat.id) || ['contracts', 'summary', 'topology', 'state', 'playbooks', 'appendix'];
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title={`${categoryTitles[categoryName] || categoryName}`} />
      
      <div style={{ display: 'flex', marginTop: '80px' }}>
        <Sidebar directories={directories} manifest={manifest} />
        
        <main style={{
          marginLeft: '280px',
          padding: '2rem',
          flex: 1,
          maxWidth: 'calc(100% - 280px)'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Link 
              href="/"
              style={{ 
                display: 'inline-block',
                marginBottom: '1.5rem',
                color: '#0066cc',
                textDecoration: 'none'
              }}
            >
              ← Назад на главную
            </Link>

            <h1 style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem', 
              color: '#1a1a2e',
              borderBottom: '3px solid #e94560',
              paddingBottom: '1rem'
            }}>
              {categoryTitles[categoryName] || categoryName}
            </h1>
            
            {categoryDescriptions[categoryName] && (
              <p style={{ 
                marginBottom: '1.5rem', 
                color: '#666',
                fontSize: '1rem'
              }}>
                {categoryDescriptions[categoryName]}
              </p>
            )}

            {files.length === 0 ? (
              <div style={{ 
                background: '#f5f5f5', 
                padding: '2rem', 
                textAlign: 'center',
                borderRadius: '0'
              }}>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>
                  📁 Документы в этой категории будут добавлены позже.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {files.map((file) => (
                  <Link
                    key={file.name}
                    href={`/page/${categoryName}--${file.name}`}
                    style={{
                      background: '#f9f9f9',
                      padding: '1.5rem',
                      border: '1px solid #ddd',
                      textDecoration: 'none',
                      color: '#333',
                      display: 'block',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#e94560';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#ddd';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                      {file.title}
                    </h3>
                    {file.description && (
                      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                        {file.description}
                      </p>
                    )}
                    {file.status && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        borderRadius: '0',
                        background: file.status === 'active' ? '#e8f5e9' : file.status === 'deprecated' ? '#fff3e0' : '#e3f2fd',
                        color: file.status === 'active' ? '#388e3c' : file.status === 'deprecated' ? '#f57c00' : '#1976d2',
                        border: '1px solid currentColor'
                      }}>
                        {file.status}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const directories = ['contracts', 'summary', 'topology', 'state', 'architecture', 'playbooks', 'appendix', 'migrations', 'audits', 'deprecated', 'policies', 'node-contracts'];
  const paths = directories.map((dir) => ({
    params: { categoryName: dir },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryName = params?.categoryName as string;
  
  let manifest: any = null;
  let files: Array<{ name: string; title: string; description?: string; status?: string }> = [];
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const matter = await import('gray-matter');
    const docsDir = process.cwd();
    
    // Load MANIFEST.json
    try {
      const manifestPath = path.join(docsDir, 'MANIFEST.json');
      const manifestContent = fs.readFileSync(manifestPath, 'utf8');
      manifest = JSON.parse(manifestContent);
    } catch (e) {
      console.log('MANIFEST.json not found');
    }
    
    // Try new SUMMARY_DOCS structure first
    let dirPath = path.join(docsDir, categoryName);
    
    // Handle nested categories like node-contracts
    if (categoryName === 'node-contracts') {
      dirPath = path.join(docsDir, 'contracts', 'node-contracts');
    } else if (categoryName === 'policies') {
      // Policies are in root
      dirPath = docsDir;
    }
    
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      files = items
        .filter((item: any) => {
          if (!item.isFile() || !item.name.endsWith('.md')) return false;
          // Filter to only include relevant files for policies
          if (categoryName === 'policies') {
            return item.name.startsWith('DOC_') && item.name.endsWith('_POLICY.md');
          }
          return true;
        })
        .map((item: any) => {
          const fullPath = path.join(dirPath, item.name);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter.default(fileContents);
          const dateValue = (matterResult.data as any).date;
          return {
            name: item.name.replace(/\.md$/, ''),
            title: (matterResult.data as any).title || item.name.replace(/\.md$/, ''),
            description: (matterResult.data as any).description,
            status: (matterResult.data as any).status || 'active',
            date: dateValue instanceof Date ? dateValue.toISOString() : (dateValue || new Date().toISOString()),
          };
        });
    }
  } catch (e) {
    console.error('Error loading category:', e);
  }

  return {
    props: {
      categoryName,
      files,
      manifest,
    },
    revalidate: 60,
  };
};

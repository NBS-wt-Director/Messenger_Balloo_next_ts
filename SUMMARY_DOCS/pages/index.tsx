 import { GetStaticProps } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';

interface HomePageProps {
  indexContent: string;
  manifest: any;
  allPosts: Array<{
    slug: string;
    title: string;
    date: string;
    status: string;
    category: string;
  }>;
  directories: string[];
}

export default function HomePage({ indexContent, manifest, allPosts, directories }: HomePageProps) {
  const [stats, setStats] = useState({ total: 0, active: 0, deprecated: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (manifest) {
      setStats({
        total: manifest.statistics?.total_docs || 0,
        active: manifest.statistics?.active_docs || 0,
        deprecated: manifest.statistics?.deprecated_docs || 0
      });
    }
  }, [manifest]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ display: 'flex', marginTop: '80px' }}>
        {/* Sidebar - можно скрыть/показать */}
        {sidebarOpen && (
          <Sidebar 
            directories={directories} 
            manifest={manifest}
            collapsed={!sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}
        
        <main style={{
          marginLeft: sidebarOpen ? '280px' : '0',
          padding: '2rem',
          flex: 1,
          maxWidth: sidebarOpen ? 'calc(100% - 280px)' : '100%',
          transition: 'all 0.3s'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1.5rem', 
              color: '#1a1a2e',
              borderBottom: '3px solid #e94560',
              paddingBottom: '1rem'
            }}>
              📚 Balloo Documentation Hub
            </h1>
            
            <div style={{ 
              background: '#f0f8ff', 
              padding: '1.5rem', 
              marginBottom: '2rem',
              borderLeft: '4px solid #0066cc'
            }}>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>
                <strong>Версия:</strong> 2.0.0 | <strong>Статус:</strong> ✅ Central Documentation Node | 
                <strong>Дата:</strong> 2026-06-13
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#e3f2fd',
                padding: '1.5rem',
                borderRadius: '0',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#1976d2' }}>{stats.total}</h3>
                <p style={{ margin: 0, color: '#666' }}>Всего документов</p>
              </div>
              <div style={{
                background: '#e8f5e9',
                padding: '1.5rem',
                borderRadius: '0',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#388e3c' }}>{stats.active}</h3>
                <p style={{ margin: 0, color: '#666' }}>Активные</p>
              </div>
              <div style={{
                background: '#fff3e0',
                padding: '1.5rem',
                borderRadius: '0',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: '#f57c00' }}>{stats.deprecated}</h3>
                <p style={{ margin: 0, color: '#666' }}>Устаревшие</p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📖 Быстрый доступ</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <a
                href="/page/INDEX"
                style={{
                  background: '#f9f9f9',
                  padding: '1.5rem',
                  border: '1px solid #ddd',
                  textDecoration: 'none',
                  color: '#333',
                  display: 'block',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  📚 INDEX.md — Главная навигация
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  Полный список всей документации
                </p>
              </a>
              <a
                href="/page/ROOT_SUMMARY_DOCS"
                style={{
                  background: '#f9f9f9',
                  padding: '1.5rem',
                  border: '1px solid #ddd',
                  textDecoration: 'none',
                  color: '#333',
                  display: 'block',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  🎯 ROOT_SUMMARY_DOCS.md — Обзор
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  Что такое SUMMARY_DOCS и как использовать
                </p>
              </a>
              <a
                href="/page/AI_ENTRYPOINTS"
                style={{
                  background: '#f9f9f9',
                  padding: '1.5rem',
                  border: '1px solid #ddd',
                  textDecoration: 'none',
                  color: '#333',
                  display: 'block',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  🤖 AI_ENTRYPOINTS.md — Для AI
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  Инструкции для AI-агентов
                </p>
              </a>
              <a
                href="/page/codegen-playbook"
                style={{
                  background: '#f9f9f9',
                  padding: '1.5rem',
                  border: '1px solid #ddd',
                  textDecoration: 'none',
                  color: '#333',
                  display: 'block',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                  💻 CODEGEN PLAYBOOK — Codegen
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                  Workflow кодогенерации
                </p>
              </a>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📁 Категории документации</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {manifest?.categories?.map((cat: any) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  style={{
                    background: '#fff5f5',
                    padding: '1.5rem',
                    border: '1px solid #ffd4d4',
                    textDecoration: 'none',
                    color: '#333',
                    display: 'block'
                  }}
                >
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                    📂 {cat.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                    {cat.description}
                  </p>
                </a>
              ))}
            </div>

            <div style={{ 
              background: '#e8f5e9', 
              padding: '1.5rem', 
              marginTop: '2rem',
              borderLeft: '4px solid #4caf50'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>✅ SUMMARY_DOCS — Central Documentation Node</h3>
              <p style={{ margin: 0 }}>
                Вся документация сведена в единый узел SUMMARY_DOCS. Legacy пути перемещены и имеют stubs.
              </p>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts: Array<{ slug: string; title: string; date: string; status: string; category: string }> = [];
  const directories = ['contracts', 'summary', 'topology', 'state', 'architecture', 'playbooks', 'appendix'];
  let manifest: any = null;
  let indexContent = '';
  
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
      console.log('MANIFEST.json not found or invalid');
    }
    
    // Load INDEX.md content
    try {
      const indexPath = path.join(docsDir, 'INDEX.md');
      const indexFile = fs.readFileSync(indexPath, 'utf8');
      const indexMatter = matter.default(indexFile);
      indexContent = indexMatter.content;
    } catch (e) {
      console.log('INDEX.md not found');
    }
    
    // Load documents from SUMMARY_DOCS structure
    const categories = ['contracts/node-contracts', 'summary', 'topology', 'state', 'playbooks', 'appendix'];
    
    categories.forEach((category) => {
      try {
        const categoryDir = path.join(docsDir, category);
        if (fs.existsSync(categoryDir)) {
          const fileNames = fs.readdirSync(categoryDir);
          fileNames
            .filter((fileName) => fileName.endsWith('.md'))
            .forEach((fileName) => {
              const fullPath = path.join(categoryDir, fileName);
              const fileContents = fs.readFileSync(fullPath, 'utf8');
              const matterResult = matter.default(fileContents);

              allPosts.push({
                slug: fileName.replace(/\.md$/, ''),
                title: (matterResult.data as any).title || fileName.replace(/\.md$/, ''),
                date: (matterResult.data as any).date instanceof Date 
                  ? (matterResult.data as any).date.toISOString() 
                  : (matterResult.data as any).date || new Date().toISOString(),
                status: (matterResult.data as any).status || 'active',
                category: category,
              });
            });
        }
      } catch (e) {
        // Ignore errors
      }
    });
    
    // Also load root level policies
    const rootFiles = ['DOC_SOURCE_POLICY.md', 'DOC_GENERATION_POLICY.md', 'DOC_CODEGEN_POLICY.md', 'DOC_WEB_READER_POLICY.md'];
    rootFiles.forEach((fileName) => {
      try {
        const fullPath = path.join(docsDir, fileName);
        if (fs.existsSync(fullPath)) {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter.default(fileContents);
          allPosts.push({
            slug: fileName.replace(/\.md$/, ''),
            title: (matterResult.data as any).title || fileName.replace(/\.md$/, ''),
            date: (matterResult.data as any).date instanceof Date 
              ? (matterResult.data as any).date.toISOString() 
              : (matterResult.data as any).date || new Date().toISOString(),
            status: (matterResult.data as any).status || 'active',
            category: 'policies',
          });
        }
      } catch (e) {
        // Ignore
      }
    });
    
  } catch (e) {
    console.error('Error loading docs:', e);
  }

  // Ensure all dates are strings for JSON serialization
  const serializedPosts = allPosts.map(post => ({
    ...post,
    date: post.date instanceof Date ? post.date.toISOString() : post.date
  }));

  return {
    props: {
      indexContent,
      manifest,
      allPosts: serializedPosts,
      directories,
    },
    revalidate: 60,
  };
};

 import { GetStaticProps } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

interface HomePageProps {
  allPosts: Array<{
    slug: string;
    title: string;
    date: string;
    status: string;
  }>;
  directories: string[];
}

export default function HomePage({ allPosts, directories }: HomePageProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <div style={{ display: 'flex', marginTop: '80px' }}>
        <Sidebar directories={directories} />
        
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
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginBottom: '1.5rem', 
              color: '#1a1a2e',
              borderBottom: '3px solid #e94560',
              paddingBottom: '1rem'
            }}>
              🎈 Balloo Platform Documentation
            </h1>
            
            <div style={{ 
              background: '#f0f8ff', 
              padding: '1.5rem', 
              marginBottom: '2rem',
              borderLeft: '4px solid #0066cc'
            }}>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>
                <strong>Версия:</strong> 2.0.0 | <strong>Статус:</strong> ✅ Production Ready | 
                <strong>Дата:</strong> 2026-06-12
              </p>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📚 Основные документы</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {allPosts.slice(0, 9).map((post) => (
                <a
                  key={post.slug}
                  href={`/page/${post.slug}`}
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
                    {post.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                    {post.status} • {new Date(post.date).toLocaleDateString('ru-RU')}
                  </p>
                </a>
              ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem' }}>📁 Категории</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {directories.map((dir) => (
                <a
                  key={dir}
                  href={`/category/${dir}`}
                  style={{
                    background: '#fff5f5',
                    padding: '1.5rem',
                    border: '1px solid #ffd4d4',
                    textDecoration: 'none',
                    color: '#333',
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>
                    📂 {dir}
                  </h3>
                </a>
              ))}
            </div>

            <div style={{ 
              background: '#e8f5e9', 
              padding: '1.5rem', 
              marginTop: '2rem',
              borderLeft: '4px solid #4caf50'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>✅ Миграция завершена!</h3>
              <p style={{ margin: 0 }}>
                Все 12 фаз миграции успешно выполнены. Платформа готова к production.
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
  const allPosts: Array<{ slug: string; title: string; date: string; status: string }> = [];
  const directories = ['Contracts', 'Nodes', 'Modules', 'Tree', 'history_tickets'];
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const matter = await import('gray-matter');
    const docsDir = process.cwd();
    
    // Root level MD files
    const fileNames = fs.readdirSync(docsDir);
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .forEach((fileName) => {
        const fullPath = path.join(docsDir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter.default(fileContents);

        allPosts.push({
          slug: fileName.replace(/\.md$/, ''),
          title: (matterResult.data as any).title || matterResult.content.split('\n')[0],
          date: (matterResult.data as any).date || new Date().toISOString(),
          status: (matterResult.data as any).status || 'Active',
        });
      });
  } catch (e) {
    // Ignore errors
  }

  return {
    props: {
      allPosts,
      directories,
    },
    revalidate: 60,
  };
};

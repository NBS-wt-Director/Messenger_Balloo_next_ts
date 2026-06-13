import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

interface CategoryProps {
  categoryName: string;
  files: Array<{ name: string; title: string }>;
}

export default function CategoryPage({ categoryName, files }: CategoryProps) {
  const categoryTitles: Record<string, string> = {
    Contracts: '📜 Контракты',
    Nodes: '🖥️ Узлы',
    Modules: '📦 Модули',
    Tree: '🌳 Ветки',
    history_tickets: '🎫 История тикетов',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title={`${categoryTitles[categoryName] || categoryName}`} />
      
      <div style={{ display: 'flex', marginTop: '80px' }}>
        <Sidebar directories={['Contracts', 'Nodes', 'Modules', 'Tree', 'history_tickets']} />
        
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
              marginBottom: '1.5rem', 
              color: '#1a1a2e',
              borderBottom: '3px solid #e94560',
              paddingBottom: '1rem'
            }}>
              {categoryTitles[categoryName] || categoryName}
            </h1>

            {files.length === 0 ? (
              <p style={{ color: '#666' }}>
                Документы в этой категории будут добавлены позже.
              </p>
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
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                      {file.title}
                    </h3>
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
  const directories = ['Contracts', 'Nodes', 'Modules', 'Tree', 'history_tickets'];
  const paths = directories.map((dir) => ({
    params: { categoryName: dir },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryName = params?.categoryName as string;
  
  let files: Array<{ name: string; title: string }> = [];
  try {
    const fs = await import('fs');
    const path = await import('path');
    const matter = await import('gray-matter');
    const docsDir = process.cwd();
    const dirPath = path.join(docsDir, categoryName);
    
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      files = items
        .filter((item: any) => item.isFile() && item.name.endsWith('.md'))
        .map((item: any) => {
          const fullPath = path.join(dirPath, item.name);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter.default(fileContents);
          return {
            name: item.name.replace(/\.md$/, ''),
            title: (matterResult.data as any).title || item.name.replace(/\.md$/, ''),
          };
        });
    }
  } catch (e) {
    // Ignore errors
  }

  return {
    props: {
      categoryName,
      files,
    },
    revalidate: 60,
  };
};

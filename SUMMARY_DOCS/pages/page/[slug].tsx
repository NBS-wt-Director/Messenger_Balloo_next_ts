import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';
import MarkdownRenderer from '../../components/MarkdownRenderer';

interface PageProps {
  content: string;
  data: any;
  slug: string;
  category?: string;
  directories: string[];
}

export default function Page({ content, data, slug, category, directories }: PageProps) {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title={data.title || slug} />
      
      <div style={{ display: 'flex', marginTop: '80px' }}>
        <Sidebar directories={directories} activeSlug={category ? `${category}/${slug}` : slug} />
        
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
            {data.title && (
              <h1 style={{ 
                fontSize: '2rem', 
                marginBottom: '1rem', 
                color: '#1a1a2e',
                borderBottom: '3px solid #e94560',
                paddingBottom: '1rem'
              }}>
                {data.title}
              </h1>
            )}
            
            {data.version && (
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#666', 
                marginBottom: '0.5rem',
                fontFamily: 'monospace'
              }}>
                <strong>Версия:</strong> {data.version}
              </p>
            )}
            
            {data.date && (
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#666', 
                marginBottom: '1.5rem',
                fontFamily: 'monospace'
              }}>
                <strong>Дата:</strong> {new Date(data.date).toLocaleDateString('ru-RU')}
              </p>
            )}
            
            {data.status && (
              <p style={{ 
                fontSize: '0.9rem', 
                color: data.status.includes('✅') || data.status.includes('Complete') ? '#4caf50' : '#ff9800',
                marginBottom: '2rem',
                fontFamily: 'monospace'
              }}>
                <strong>Статус:</strong> {data.status}
              </p>
            )}
            
            <MarkdownRenderer content={content} />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: Array<{ params: { slug: string } }> = [];
  const directories = ['Contracts', 'Nodes', 'Modules', 'Tree', 'history_tickets'];
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const docsDir = process.cwd();
    
    // Root level MD files
    const fileNames = fs.readdirSync(docsDir);
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .forEach((fileName) => {
        paths.push({
          params: { slug: fileName.replace(/\.md$/, '') },
        });
      });
    
    // Category MD files (encoded as category--slug)
    directories.forEach((dir) => {
      const dirPath = path.join(docsDir, dir);
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        items
          .filter((fileName) => fileName.endsWith('.md'))
          .forEach((fileName) => {
            paths.push({
              params: { slug: `${dir}--${fileName.replace(/\.md$/, '')}` },
            });
          });
      }
    });
  } catch (e) {
    // Ignore errors
  }

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const fullSlug = params?.slug as string;
  const directories = ['Contracts', 'Nodes', 'Modules', 'Tree', 'history_tickets'];
  
  let content = '';
  let data: any = {};
  let category: string | null = null;
  let slug: string;
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const matter = await import('gray-matter');
    const docsDir = process.cwd();
    
    // Check if it's a category slug (contains --)
    if (fullSlug.includes('--')) {
      const parts = fullSlug.split('--');
      category = parts[0];
      slug = parts.slice(1).join('--');
      const fullPath = path.join(docsDir, category, `${slug}.md`);
      
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter.default(fileContents);
        content = matterResult.content;
        data = matterResult.data;
      }
    } else {
      slug = fullSlug;
      const fullPath = path.join(docsDir, `${slug}.md`);
      
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter.default(fileContents);
        content = matterResult.content;
        data = matterResult.data;
      }
    }
  } catch (e) {
    // Ignore errors
  }

  if (!content) {
    return {
      notFound: true,
    };
  }

  // Convert Date objects to strings for JSON serialization
  const serializedData: any = {};
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Date) {
      serializedData[key] = data[key].toISOString();
    } else {
      serializedData[key] = data[key];
    }
  });

  return {
    props: {
      content,
      data: serializedData,
      slug,
      category,
      directories,
    },
    revalidate: 60,
  };
};

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
  manifest?: any;
}

export default function Page({ content, data, slug, category, directories, manifest }: PageProps) {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title={data.title || slug} />
      
      <div style={{ display: 'flex', marginTop: '80px' }}>
        <Sidebar directories={directories} activeSlug={category ? `${category}/${slug}` : slug} manifest={manifest} />
        
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
                marginBottom: '0.5rem',
                fontFamily: 'monospace'
              }}>
                <strong>Дата:</strong> {new Date(data.date).toLocaleDateString('ru-RU')}
              </p>
            )}
            
            {data.status && (
              <p style={{ 
                fontSize: '0.9rem', 
                color: data.status === 'active' ? '#4caf50' : data.status === 'deprecated' ? '#ff9800' : '#666',
                marginBottom: '2rem',
                fontFamily: 'monospace'
              }}>
                <strong>Статус:</strong> 
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0',
                  background: data.status === 'active' ? '#e8f5e9' : data.status === 'deprecated' ? '#fff3e0' : '#e3f2fd',
                  color: data.status === 'active' ? '#388e3c' : data.status === 'deprecated' ? '#f57c00' : '#1976d2',
                  border: '1px solid currentColor',
                  marginLeft: '0.5rem'
                }}>
                  {data.status}
                </span>
              </p>
            )}
            
            {data.description && (
              <div style={{
                background: '#f5f5f5',
                padding: '1rem',
                marginBottom: '1.5rem',
                borderLeft: '3px solid #0066cc'
              }}>
                <p style={{ margin: 0, fontStyle: 'italic' }}>
                  {data.description}
                </p>
              </div>
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
  const directories = ['contracts', 'summary', 'topology', 'state', 'architecture', 'playbooks', 'appendix', 'migrations', 'audits', 'deprecated', 'policies'];
  const nestedCategories = ['node-contracts', 'project-contracts', 'domain-contracts', 'architecture-contracts', 'generation-contracts'];
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    const docsDir = process.cwd();
    
    // Root level MD files (policies and key docs)
    const rootFiles = ['INDEX.md', 'README.md', 'ROOT_SUMMARY_DOCS.md', 'AI_ENTRYPOINTS.md', 'codegen-playbook.md'];
    const policyFiles = ['DOC_SOURCE_POLICY.md', 'DOC_GENERATION_POLICY.md', 'DOC_CODEGEN_POLICY.md', 'DOC_WEB_READER_POLICY.md'];
    const allRootFiles = [...rootFiles, ...policyFiles];
    
    allRootFiles.forEach((fileName) => {
      const fullPath = path.join(docsDir, fileName);
      if (fs.existsSync(fullPath)) {
        paths.push({
          params: { slug: fileName.replace(/\.md$/, '') },
        });
      }
    });
    
    // Category MD files
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
    
    // Nested categories (e.g., contracts/node-contracts)
    nestedCategories.forEach((nested) => {
      const nestedPath = path.join(docsDir, 'contracts', nested);
      if (fs.existsSync(nestedPath)) {
        const items = fs.readdirSync(nestedPath);
        items
          .filter((fileName) => fileName.endsWith('.md'))
          .forEach((fileName) => {
            paths.push({
              params: { slug: `${nested}--${fileName.replace(/\.md$/, '')}` },
            });
          });
      }
    });
    
    // Summary files
    const summaryPath = path.join(docsDir, 'summary');
    if (fs.existsSync(summaryPath)) {
      const items = fs.readdirSync(summaryPath);
      items
        .filter((fileName) => fileName.endsWith('.md'))
        .forEach((fileName) => {
          paths.push({
            params: { slug: `summary--${fileName.replace(/\.md$/, '')}` },
          });
        });
    }
    
    // Topology files
    const topologyPath = path.join(docsDir, 'topology');
    if (fs.existsSync(topologyPath)) {
      const items = fs.readdirSync(topologyPath);
      items
        .filter((fileName) => fileName.endsWith('.md'))
        .forEach((fileName) => {
          paths.push({
            params: { slug: `topology--${fileName.replace(/\.md$/, '')}` },
          });
        });
    }
    
    // State files (JSON)
    const statePath = path.join(docsDir, 'state');
    if (fs.existsSync(statePath)) {
      const items = fs.readdirSync(statePath);
      items
        .filter((fileName) => fileName.endsWith('.json'))
        .forEach((fileName) => {
          paths.push({
            params: { slug: `state--${fileName.replace(/\.json$/, '')}` },
          });
        });
    }
  } catch (e) {
    console.error('Error generating paths:', e);
  }

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const fullSlug = params?.slug as string;
  const directories = ['contracts', 'summary', 'topology', 'state', 'architecture', 'playbooks', 'appendix'];
  
  let content = '';
  let data: any = {};
  let category: string | null = null;
  let slug: string;
  let manifest: any = null;
  
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
    
    // Check if it's a JSON file (state files)
    if (fullSlug.startsWith('state--')) {
      slug = fullSlug.replace('state--', '');
      const fullPath = path.join(docsDir, 'state', `${slug}.json`);
      
      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        content = '```json\n' + fileContents + '\n```';
        data = {
          title: slug.replace(/-/g, ' ').toUpperCase(),
          version: '1.0.0',
          date: new Date().toISOString(),
          status: 'active',
          description: 'State file (JSON)'
        };
      }
    }
    // Check if it's a category slug (contains --)
    else if (fullSlug.includes('--')) {
      const parts = fullSlug.split('--');
      category = parts[0];
      slug = parts.slice(1).join('--');
      
      // Handle nested categories
      let fullPath;
      if (category === 'node-contracts' || category === 'project-contracts' || category === 'domain-contracts') {
        fullPath = path.join(docsDir, 'contracts', category, `${slug}.md`);
      } else {
        fullPath = path.join(docsDir, category, `${slug}.md`);
      }
      
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
    console.error('Error loading page:', e);
  }

  if (!content) {
    // Return 404 if content not found
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
      manifest,
    },
    revalidate: 60,
  };
};

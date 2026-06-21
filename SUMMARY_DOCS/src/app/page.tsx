import Link from 'next/link';
import { BookOpen, FileText, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            🎈 Balloo Documentation Hub
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Canonical application documentation viewer and editor for Balloo monorepo
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/docs/app-canonical"
              className="block p-6 border rounded-lg transition-all hover:shadow-lg hover:scale-105"
              style={{ 
                background: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <BookOpen size={32} className="mx-auto mb-3 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                App Docs Viewer
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Browse all canonical application documentation
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-blue-600 text-sm font-medium">
                Open Viewer <ArrowRight size={16} />
              </div>
            </Link>

            <Link
              href="/catalog"
              className="block p-6 border rounded-lg transition-all hover:shadow-lg hover:scale-105"
              style={{ 
                background: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <FileText size={32} className="mx-auto mb-3 text-green-600" />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Document Catalog
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Complete catalog of all documentation files
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-green-600 text-sm font-medium">
                View Catalog <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
        <p>Manifest: <code>SUMMARY_DOCS/MANIFEST.json</code></p>
        <p>Routing: <code>SUMMARY_DOCS/ROUTING.json</code></p>
      </div>
    </div>
  );
}

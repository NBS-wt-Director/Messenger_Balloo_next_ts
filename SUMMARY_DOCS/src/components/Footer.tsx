import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ 
      background: 'var(--card)',
      borderColor: 'var(--border)',
      color: 'var(--muted-foreground)'
    }}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © {new Date().getFullYear()} Balloo Monorepo — SUMMARYDOCS
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="/docs/app-canonical/working/messenger" className="hover:text-blue-600 transition-colors">
              Messenger Docs
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/catalog" className="hover:text-blue-600 transition-colors">
              Document Catalog
            </Link>
            <span className="text-gray-300">|</span>
            <a
              href="https://github.com/balloo/monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t text-xs" style={{ borderColor: 'var(--border)' }}>
          <p>
            All canonical documentation is stored under <code>docs/app-canonical/</code>.
            Legacy documentation is preserved and immutable.
          </p>
        </div>
      </div>
    </footer>
  );
}

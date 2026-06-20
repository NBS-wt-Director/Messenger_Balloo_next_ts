import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} Balloo Monorepo — SUMMARYDOCS
          </div>

          <div className="flex gap-4 text-sm">
            <Link href="/docs/app-canonical/working/messenger" className="text-gray-600 hover:text-gray-900">
              Messenger Docs
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/catalog" className="text-gray-600 hover:text-gray-900">
              Document Catalog
            </Link>
            <span className="text-gray-300">|</span>
            <a
              href="https://github.com/balloo/monorepo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-400">
          <p>
            All canonical documentation is stored under <code>docs/app-canonical/</code>.
            Legacy documentation is preserved and immutable.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900">About</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Balloo Platform
        </h1>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600">
              Balloo is a secure messenger platform with end-to-end encryption, 
              built on modern web technologies and scalable infrastructure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tech Stack</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Next.js 14 (App Router) - Frontend framework</li>
              <li>React 18 - UI library</li>
              <li>TypeScript 5 - Type safety</li>
              <li>Tailwind CSS - Styling</li>
              <li>Node.js - Backend runtime</li>
              <li>PostgreSQL / SQLite - Database</li>
              <li>Redis - Caching & sessions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>End-to-end encryption</li>
              <li>Real-time messaging</li>
              <li>Group chats</li>
              <li>File sharing</li>
              <li>Push notifications</li>
              <li>Multi-platform support</li>
              <li>Admin portal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resources</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><Link href="/docs" className="text-primary-600 hover:underline">Documentation</Link></li>
              <li><Link href="/api" className="text-primary-600 hover:underline">API Contracts</Link></li>
              <li><Link href="/migration" className="text-primary-600 hover:underline">Migration Guides</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

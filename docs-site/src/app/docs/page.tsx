import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li className="text-gray-900">Documentation</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Documentation
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            href="/docs/architecture"
            className="block p-6 border rounded-lg hover:border-primary-500 hover:shadow transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Architecture
            </h2>
            <p className="text-gray-600">
              System architecture and design patterns
            </p>
          </Link>

          <Link 
            href="/docs/api"
            className="block p-6 border rounded-lg hover:border-primary-500 hover:shadow transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              API Reference
            </h2>
            <p className="text-gray-600">
              Complete API documentation
            </p>
          </Link>

          <Link 
            href="/docs/guides"
            className="block p-6 border rounded-lg hover:border-primary-500 hover:shadow transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Guides
            </h2>
            <p className="text-gray-600">
              Step-by-step tutorials
            </p>
          </Link>

          <Link 
            href="/docs/concepts"
            className="block p-6 border rounded-lg hover:border-primary-500 hover:shadow transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Concepts
            </h2>
            <p className="text-gray-600">
              Core concepts and principles
            </p>
          </Link>

          <Link 
            href="/docs/deployment"
            className="block p-6 border rounded-lg hover:border-primary-500 hover:shadow transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Deployment
            </h2>
            <p className="text-gray-600">
              Deployment guides and configurations
            </p>
          </Link>

          <Link 
            href="/docs/testing"
            className="block p-6 border rounded-lg hover:border-primary-500 hover:shadow transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Testing
            </h2>
            <p className="text-gray-600">
              Testing strategies and practices
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

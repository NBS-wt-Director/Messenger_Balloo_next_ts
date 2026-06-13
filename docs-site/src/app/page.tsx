import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Balloo Platform Documentation
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Official documentation for the Balloo messenger platform.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link 
            href="/docs"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Documentation
            </h2>
            <p className="text-gray-600">
              User guides, API reference, and concepts
            </p>
          </Link>

          <Link 
            href="/api"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              API Contracts
            </h2>
            <p className="text-gray-600">
              OpenAPI specifications and schemas
            </p>
          </Link>

          <Link 
            href="/migration"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Migration Guides
            </h2>
            <p className="text-gray-600">
              Step-by-step migration instructions
            </p>
          </Link>

          <Link 
            href="/about"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              About
            </h2>
            <p className="text-gray-600">
              Platform overview and tech stack
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 — Not Found</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors inline-block"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

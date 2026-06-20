import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">SUMMARYDOCS — Balloo Documentation Hub</h1>
      <nav className="space-y-2">
        <Link href="/docs/app-canonical/working/messenger" className="block text-blue-600 underline">
          Canonical App Docs → working/messenger
        </Link>
        <Link href="/appdocs" className="block text-blue-600 underline">
          App Docs Viewer
        </Link>
      </nav>
      <div className="mt-8 text-sm text-gray-500">
        <p>Manifest: <code>SUMMARY_DOCS/MANIFEST.json</code></p>
        <p>Routing: <code>SUMMARY_DOCS/ROUTING.json</code></p>
      </div>
    </div>
  );
}

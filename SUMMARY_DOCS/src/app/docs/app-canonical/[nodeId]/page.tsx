'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface NodePageProps {
  params: { nodeId: string };
}

export default function NodePage({ params }: NodePageProps) {
  const { nodeId } = params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Node: {nodeId}</h1>
      <p className="text-gray-600 mb-6">Select an application to view its documentation</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/docs/app-canonical/${nodeId}/messenger`}
          className="block p-4 border rounded-lg hover:shadow-md transition-all"
        >
          <div className="font-semibold mb-2">Messenger</div>
          <div className="text-sm text-gray-600">Web messaging application</div>
        </Link>
        
        <Link
          href={`/docs/app-canonical/${nodeId}/api`}
          className="block p-4 border rounded-lg hover:shadow-md transition-all"
        >
          <div className="font-semibold mb-2">API</div>
          <div className="text-sm text-gray-600">Backend API server</div>
        </Link>
      </div>
    </div>
  );
}

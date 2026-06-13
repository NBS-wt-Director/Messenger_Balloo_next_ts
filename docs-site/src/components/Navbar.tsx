'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Balloo Docs
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/docs" className="text-gray-600 hover:text-gray-900">
              Documentation
            </Link>
            <Link href="/api" className="text-gray-600 hover:text-gray-900">
              API
            </Link>
            <Link href="/migration" className="text-gray-600 hover:text-gray-900">
              Migration
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Documentation
              </Link>
              <Link href="/api" className="text-gray-600 hover:text-gray-900">
                API
              </Link>
              <Link href="/migration" className="text-gray-600 hover:text-gray-900">
                Migration
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

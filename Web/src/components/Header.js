'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              formcarry
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/examples" className="text-gray-600 hover:text-gray-900">
                Exemples
              </Link>
              <Link href="/generator" className="text-gray-600 hover:text-gray-900">
                Générateur
              </Link>
              <Link href="/integrations" className="text-gray-600 hover:text-gray-900">
                Intégrations
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Documentation
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Connexion
            </Link>
            <Link 
              href="/signup" 
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Inscription
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-4">
              <Link href="/examples" className="text-gray-600 hover:text-gray-900">
                Exemples
              </Link>
              <Link href="/generator" className="text-gray-600 hover:text-gray-900">
                Générateur
              </Link>
              <Link href="/integrations" className="text-gray-600 hover:text-gray-900">
                Intégrations
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Documentation
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Connexion
              </Link>
              <Link 
                href="/signup" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
              >
                Inscription
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 
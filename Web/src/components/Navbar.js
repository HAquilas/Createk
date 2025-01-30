'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="FormCarry Logo" 
                width={130} 
                height={32} 
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/examples" className="text-sm text-gray-600 hover:text-gray-900">
              Examples
            </Link>
            <Link href="/boutique" className="text-sm text-gray-600 hover:text-gray-900">
              Boutique
            </Link>
            {session ? (
              <>
                <Link href="/panier" className="text-sm text-gray-600 hover:text-gray-900">
                  Panier
                </Link>
                <Link href="/commandes" className="text-sm text-gray-600 hover:text-gray-900">
                  Mes commandes
                </Link>
                <Link 
                  href={session.user.role === 'vendeur' ? '/dashboard/vendeur' : '/dashboard/client'}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 
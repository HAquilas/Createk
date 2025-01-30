'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-green-950 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Frip.png" 
                alt="FormCarry Logo" 
                width={130} 
                height={50} 
                className="h-15 w-auto"
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-white">
            <Link href="/examples" className="text-sm hover:text-gray-400">
              Examples
            </Link>
            <Link href="/boutique" className="text-sm hover:text-gray-400">
              Boutique
            </Link>
            {session ? (
              <>
                <Link href="/panier" className="text-sm hover:text-gray-400">
                  Panier
                </Link>
                <Link href="/commandes" className="text-sm hover:text-gray-400">
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
                <Link href="/login" className="text-sm hover:text-gray-400">
                  Connexion
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
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
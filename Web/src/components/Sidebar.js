'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  Users,
  Package,
  Bell
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const clientLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard/client',
      icon: LayoutDashboard
    },
    {
      name: 'Mes commandes',
      href: '/dashboard/client/orders',
      icon: ShoppingBag
    },
    {
      name: 'Notifications',
      href: '/dashboard/client/notifications',
      icon: Bell
    }
  ]

  const vendeurLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard/vendeur',
      icon: LayoutDashboard
    },
    {
      name: 'Produits',
      href: '/dashboard/vendeur/produits',
      icon: Package
    },
    {
      name: 'Commandes',
      href: '/dashboard/vendeur/orders',
      icon: ShoppingBag
    },
    {
      name: 'Clients',
      href: '/dashboard/vendeur/customers',
      icon: Users
    }
  ]

  const links = session?.user?.role === 'vendeur' ? vendeurLinks : clientLinks

  const commonLinks = [
    {
      name: 'Paramètres',
      href: '/dashboard/vendeur/settings',
      icon: Settings
    }
  ]

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        <Menu size={24} />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ 
          x: 0,
          width: isCollapsed ? 80 : 280
        }}
        className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">FormCarry</span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:block hidden"
            >
              <ChevronLeft
                size={20}
                className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon size={20} />
                      {!isCollapsed && <span>{link.name}</span>}
                    </Link>
                  </li>
                )
              })}

              <div className="my-4 border-t border-gray-200" />

              {commonLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon size={20} />
                      {!isCollapsed && <span>{link.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 w-full p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Déconnexion</span>}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
} 
'use client'

import { useSession } from 'next-auth/react'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:pl-[280px] pt-16 lg:pt-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
} 
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import DashboardLayout from '../../../components/DashboardLayout'

export default function VendeurDashboardLayout({ children }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  if (!session || session.user.role !== 'vendeur') {
    redirect('/')
  }

  return <DashboardLayout>{children}</DashboardLayout>
} 
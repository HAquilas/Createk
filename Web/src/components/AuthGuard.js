'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children, allowedRoles = [] }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
      // Rediriger vers le dashboard approprié
      const redirectPath = session.user.role === 'vendeur'
        ? '/dashboard/vendeur'
        : '/dashboard/client'
      router.push(redirectPath)
    }
  }, [session, status, router, pathname, allowedRoles])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role))) {
    return null
  }

  return children
} 
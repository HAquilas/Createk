import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(request) {
    // Protection des routes selon le rôle
    if (request.nextUrl.pathname.startsWith('/dashboard/client') && request.nextauth.token?.role !== 'client') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/dashboard/vendeur') && request.nextauth.token?.role !== 'vendeur') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/commandes/:path*', '/panier/:path*']
} 
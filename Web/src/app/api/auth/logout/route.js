import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json(
    { message: 'Déconnexion réussie' },
    { status: 200 }
  )

  // Suppression du cookie d'authentification
  response.cookies.delete('auth_token')

  return response
} 
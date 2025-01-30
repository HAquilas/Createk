import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function withAuth(handler, options = {}) {
  return async function authHandler(request) {
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token) {
        return NextResponse.json(
          { message: 'Non autorisé' },
          { status: 401 }
        )
      }

      // Vérification du rôle si spécifié
      if (options.role && token.role !== options.role) {
        return NextResponse.json(
          { message: 'Accès non autorisé' },
          { status: 403 }
        )
      }

      // Ajouter le token à la requête pour l'utiliser dans le handler
      request.token = token

      return handler(request)
    } catch (error) {
      console.error('Erreur d\'authentification:', error)
      return NextResponse.json(
        { message: 'Erreur d\'authentification' },
        { status: 500 }
      )
    }
  }
} 
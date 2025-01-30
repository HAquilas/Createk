import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_temporaire'

export async function POST(request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Recherche de l'utilisateur
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Vérification du mot de passe
    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Création du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Configuration du cookie
    const response = NextResponse.json(
      { 
        message: 'Connexion réussie',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        }
      },
      { status: 200 }
    )

    // Ajout du cookie avec le token
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 heures
    })

    return response
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
} 
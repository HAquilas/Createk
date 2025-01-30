import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'

export async function POST(request) {
  try {
    await connectDB()

    const { email, password, role, kkiapayId } = await request.json()

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 400 }
      )
    }

    // Validation du rôle et de l'ID Kkiapay
    if (role === 'vendeur' && !kkiapayId) {
      return NextResponse.json(
        { message: 'L\'ID Kkiapay est requis pour les vendeurs' },
        { status: 400 }
      )
    }

    // Création du nouvel utilisateur
    const user = new User({
      email,
      password,
      role,
      ...(role === 'vendeur' && { kkiapayId }),
    })

    await user.save()

    // On ne renvoie pas le mot de passe
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      { message: 'Inscription réussie', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { message: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
} 
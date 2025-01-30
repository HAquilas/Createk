import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { uploadImage } from '@/lib/upload'

export async function PUT(request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const formData = await request.formData()
    const updates = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address')
    }

    // Gérer l'upload de l'avatar si présent
    const avatar = formData.get('avatar')
    if (avatar && avatar.size > 0) {
      const avatarUrl = await uploadImage(avatar, 'avatars')
      updates.avatar = avatarUrl
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      token.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar
      }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
} 
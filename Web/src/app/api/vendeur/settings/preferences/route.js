import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Settings from '@/models/Settings'

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

    const updates = await request.json()

    // Mettre à jour ou créer les préférences
    const settings = await Settings.findOneAndUpdate(
      { user: token.userId },
      {
        $set: {
          emailNotifications: updates.emailNotifications,
          orderUpdates: updates.orderUpdates,
          marketingEmails: updates.marketingEmails,
          language: updates.language,
          currency: updates.currency,
          timezone: updates.timezone,
          user: token.userId
        }
      },
      { new: true, upsert: true, runValidators: true }
    )

    return NextResponse.json({
      message: 'Préférences mises à jour avec succès',
      preferences: {
        emailNotifications: settings.emailNotifications,
        orderUpdates: settings.orderUpdates,
        marketingEmails: settings.marketingEmails,
        language: settings.language,
        currency: settings.currency,
        timezone: settings.timezone
      }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour des préférences' },
      { status: 500 }
    )
  }
} 
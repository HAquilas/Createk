import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import User from '../../../../models/User'
import Shop from '../../../../models/Shop'
import Settings from '../../../../models/Settings'

export async function GET(request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    // Récupérer les informations du vendeur
    const user = await User.findById(token.userId).select('-password')
    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer ou créer la boutique
    let shop = await Shop.findOne({ owner: token.userId })
    if (!shop) {
      shop = await Shop.create({
        owner: token.userId,
        name: `Boutique de ${user.name}`,
        contact: {
          email: user.email
        }
      })
    }

    // Récupérer ou créer les préférences
    let settings = await Settings.findOne({ user: token.userId })
    if (!settings) {
      settings = await Settings.create({
        user: token.userId,
        emailNotifications: true,
        orderUpdates: true,
        marketingEmails: false,
        language: 'fr',
        currency: 'XOF',
        timezone: 'Africa/Porto-Novo'
      })
    }

    return NextResponse.json({
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar
      },
      shop: {
        name: shop.name,
        description: shop.description,
        logo: shop.logo,
        banner: shop.banner,
        categories: shop.categories,
        openingHours: shop.openingHours,
        address: shop.address,
        contact: shop.contact,
        status: shop.status,
        settings: shop.settings,
        metrics: shop.metrics,
        rating: shop.rating
      },
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
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    )
  }
} 
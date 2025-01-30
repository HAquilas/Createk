import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Shop from '@/models/Shop'
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
      name: formData.get('shopName'),
      description: formData.get('description'),
      openingHours: JSON.parse(formData.get('openingHours') || '{}')
    }

    // Gérer l'upload du logo si présent
    const logo = formData.get('logo')
    if (logo && logo.size > 0) {
      const logoUrl = await uploadImage(logo, 'shops/logos')
      updates.logo = logoUrl
    }

    // Gérer l'upload de la bannière si présente
    const banner = formData.get('banner')
    if (banner && banner.size > 0) {
      const bannerUrl = await uploadImage(banner, 'shops/banners')
      updates.banner = bannerUrl
    }

    // Mettre à jour la boutique
    const shop = await Shop.findOneAndUpdate(
      { owner: token.userId },
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!shop) {
      return NextResponse.json(
        { message: 'Boutique non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Boutique mise à jour avec succès',
      shop: {
        name: shop.name,
        description: shop.description,
        logo: shop.logo,
        banner: shop.banner,
        categories: shop.categories,
        openingHours: shop.openingHours
      }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la boutique:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la boutique' },
      { status: 500 }
    )
  }
} 
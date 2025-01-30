import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import Product from '../../../../models/Product'

// Récupérer tous les produits du vendeur
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

    const products = await Product.find({ seller: token.userId })
      .sort({ createdAt: -1 })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

// Créer un nouveau produit
export async function POST(request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    // Extraire les données du formulaire
    const name = formData.get('name')
    const description = formData.get('description')
    const price = parseFloat(formData.get('price'))
    const stock = parseInt(formData.get('stock'))
    const category = formData.get('category')
    
    // Gérer les images
    const images = formData.getAll('images')
    const imageUrls = []
    
    // Pour le moment, on stocke juste les noms des fichiers
    // TODO: Implémenter l'upload des images vers un service de stockage
    for (const image of images) {
      imageUrls.push(image.name)
    }

    await connectDB()

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      imageUrls,
      seller: token.userId,
    })

    await product.save()

    return NextResponse.json(
      { message: 'Produit créé avec succès', product },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
} 
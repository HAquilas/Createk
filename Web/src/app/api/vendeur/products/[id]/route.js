import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../../lib/mongodb'
import Product from '../../../../../models/Product'

// Récupérer un produit spécifique
export async function GET(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const product = await Product.findOne({
      _id: params.id,
      seller: token.userId
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}

// Mettre à jour un produit
export async function PUT(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const updates = await request.json()

    await connectDB()

    const product = await Product.findOne({
      _id: params.id,
      seller: token.userId
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour les champs modifiés
    Object.keys(updates).forEach(key => {
      product[key] = updates[key]
    })

    await product.save()

    return NextResponse.json({
      message: 'Produit mis à jour avec succès',
      product
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

// Supprimer un produit
export async function DELETE(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    // Vérifier que le produit existe et appartient au vendeur
    const product = await Product.findOne({
      _id: params.id,
      seller: token.userId
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le produit
    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({
      message: 'Produit supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
} 
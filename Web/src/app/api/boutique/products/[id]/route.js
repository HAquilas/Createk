import { NextResponse } from 'next/server'
import connectDB from '../../../../../lib/mongodb'
import Product from '../../../../../models/Product'

export async function GET(request, { params }) {
  try {
    await connectDB()

    const product = await Product.findById(params.id)
      .populate('seller', 'email')

    if (!product) {
      return NextResponse.json(
        { message: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      product: {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
        seller: {
          email: product.seller.email
        },
        createdAt: product.createdAt
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import Product from '../../../../models/Product'

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const sort = searchParams.get('sort')

    // Construction de la requête
    let query = {}
    if (category && category !== 'Tous') {
      query.category = category
    }

    // Construction du tri
    let sortQuery = {}
    switch (sort) {
      case 'price_asc':
        sortQuery.price = 1
        break
      case 'price_desc':
        sortQuery.price = -1
        break
      default:
        sortQuery.createdAt = -1
    }

    const products = await Product.find(query)
      .sort(sortQuery)
      .populate('seller', 'email')

    return NextResponse.json({
      products: products.map(product => ({
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
      }))
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    )
  }
} 
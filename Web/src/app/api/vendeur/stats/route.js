import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import Order from '../../../../models/Order'
import Product from '../../../../models/Product'

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

    // Récupérer les commandes du vendeur
    const orders = await Order.find({ seller: token.userId })
    const products = await Product.find({ seller: token.userId })

    const stats = {
      totalVentes: orders.reduce((sum, order) => sum + order.total, 0),
      nombreCommandes: orders.length,
      nombreProduits: products.length,
      produitsEnRupture: products.filter(p => p.stock === 0).length
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
} 
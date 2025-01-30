import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../../lib/mongodb'
import Order from '../../../../../models/Order'

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

    // Récupérer les 5 dernières commandes du vendeur
    const recentOrders = await Order.find({ seller: token.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')

    return NextResponse.json({ orders: recentOrders })
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes récentes:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des commandes récentes' },
      { status: 500 }
    )
  }
} 
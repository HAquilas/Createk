import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import Order from '../../../../models/Order'

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

    // Récupérer toutes les commandes où le vendeur est le vendeur actuel
    const orders = await Order.find({ seller: token.userId })
      .populate('user', 'name email')
      .populate('items.product', 'name price imageUrl')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      orders: orders.map(order => ({
        _id: order._id,
        user: {
          name: order.user.name,
          email: order.user.email
        },
        items: order.items.map(item => ({
          product: {
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.imageUrl
          },
          quantity: item.quantity,
          price: item.price
        })),
        shippingDetails: order.shippingDetails,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }))
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
} 
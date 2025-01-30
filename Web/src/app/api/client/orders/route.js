import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import Order from '../../../../models/Order'

export async function GET(request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'client') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const orders = await Order.find({ user: token.userId })
      .sort({ createdAt: -1 })
      .populate('seller', 'email name')
      .populate('items.product', 'name imageUrl price')

    return NextResponse.json({
      orders: orders.map(order => ({
        _id: order._id,
        totalAmount: order.total,
        status: order.status,
        createdAt: order.createdAt,
        seller: {
          email: order.seller.email,
          name: order.seller.name
        },
        items: order.items.map(item => ({
          product: {
            name: item.product.name,
            imageUrl: item.product.imageUrl,
            price: item.product.price
          },
          quantity: item.quantity,
          price: item.price
        }))
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
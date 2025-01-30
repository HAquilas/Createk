import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import { withAuth } from '../../../lib/apiAuth'

async function handler(request) {
  try {
    await connectDB()

    const orders = await Order.find({ user: request.token.userId })
      .populate('items.product')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      orders: orders.map(order => ({
        _id: order._id,
        items: order.items.map(item => ({
          _id: item._id,
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: item.price,
            imageUrl: item.product.imageUrl
          },
          quantity: item.quantity,
          price: item.price
        })),
        shippingDetails: order.shippingDetails,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
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

export const GET = withAuth(handler) 
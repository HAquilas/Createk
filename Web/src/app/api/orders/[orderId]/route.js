import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const order = await Order.findById(params.orderId)
      .populate('items.product')

    if (!order) {
      return NextResponse.json(
        { message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est autorisé à voir cette commande
    if (order.user.toString() !== token.userId) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      order: {
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
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de la commande' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function POST(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { transactionId, status } = await request.json()

    await connectDB()

    const order = await Order.findById(params.orderId)
    if (!order) {
      return NextResponse.json(
        { message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est autorisé à mettre à jour cette commande
    if (order.user.toString() !== token.userId) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      )
    }

    // Mettre à jour le statut du paiement
    order.paymentId = transactionId
    order.paymentStatus = status
    if (status === 'completed') {
      order.status = 'paid'
    }

    await order.save()

    return NextResponse.json({
      message: 'Statut du paiement mis à jour avec succès',
      order: {
        _id: order._id,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du paiement' },
      { status: 500 }
    )
  }
} 
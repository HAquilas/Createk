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

    const { action, reason } = await request.json()

    await connectDB()

    const order = await Order.findById(params.orderId)
    if (!order) {
      return NextResponse.json(
        { message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est autorisé
    if (order.user.toString() !== token.userId) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      )
    }

    let message = ''

    switch (action) {
      case 'cancel':
        // Vérifier si la commande peut être annulée
        if (!['pending', 'paid'].includes(order.status)) {
          return NextResponse.json(
            { message: 'Cette commande ne peut plus être annulée' },
            { status: 400 }
          )
        }
        order.status = 'cancelled'
        order.cancellationReason = reason
        message = 'Commande annulée avec succès'
        break

      case 'confirm_reception':
        // Vérifier si la commande peut être marquée comme reçue
        if (order.status !== 'shipped') {
          return NextResponse.json(
            { message: 'Cette commande ne peut pas être marquée comme reçue' },
            { status: 400 }
          )
        }
        order.status = 'delivered'
        message = 'Réception confirmée avec succès'
        break

      case 'request_return':
        // Vérifier si un retour peut être demandé
        if (order.status !== 'delivered' || order.returnRequest) {
          return NextResponse.json(
            { message: 'Un retour ne peut pas être demandé pour cette commande' },
            { status: 400 }
          )
        }
        order.returnRequest = {
          status: 'pending',
          reason,
          requestedAt: new Date()
        }
        message = 'Demande de retour enregistrée avec succès'
        break

      default:
        return NextResponse.json(
          { message: 'Action non valide' },
          { status: 400 }
        )
    }

    // Ajouter l'historique des actions
    order.history.push({
      action,
      date: new Date(),
      status: order.status,
      reason,
      userId: token.userId
    })

    await order.save()

    return NextResponse.json({
      message,
      order: {
        _id: order._id,
        status: order.status,
        returnRequest: order.returnRequest,
        history: order.history
      }
    })
  } catch (error) {
    console.error('Erreur lors de l\'action sur la commande:', error)
    return NextResponse.json(
      { message: 'Erreur lors de l\'action sur la commande' },
      { status: 500 }
    )
  }
} 
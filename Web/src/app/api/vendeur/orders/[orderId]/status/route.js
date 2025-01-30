import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function PUT(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    await connectDB()

    // Vérifier que la commande existe et appartient au vendeur
    const order = await Order.findOne({
      _id: params.orderId,
      seller: token.userId
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que le nouveau statut est valide
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut
    order.status = status

    // Ajouter l'entrée dans l'historique
    order.history.push({
      action: 'status_update',
      status,
      date: new Date(),
      userId: token.userId
    })

    // Si le statut est "shipped", calculer la date de livraison estimée
    if (status === 'shipped' && !order.estimatedDeliveryDate) {
      order.estimatedDeliveryDate = order.calculateEstimatedDelivery()
    }

    await order.save()

    return NextResponse.json({
      message: 'Statut mis à jour avec succès',
      order: {
        _id: order._id,
        status: order.status,
        estimatedDeliveryDate: order.estimatedDeliveryDate,
        history: order.history
      }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    )
  }
} 
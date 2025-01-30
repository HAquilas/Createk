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

    // Si la commande n'a pas encore d'informations de suivi
    if (!order.tracking) {
      return NextResponse.json({
        tracking: null,
        estimatedDeliveryDate: order.estimatedDeliveryDate
      })
    }

    // Simuler une mise à jour du suivi en temps réel
    // Dans un cas réel, on interrogerait l'API du transporteur
    const currentDate = new Date()
    let lastUpdate = null

    if (order.status === 'processing') {
      lastUpdate = {
        status: 'processing',
        location: 'Centre de traitement',
        timestamp: currentDate,
        description: 'Commande en cours de préparation'
      }
    } else if (order.status === 'shipped') {
      lastUpdate = {
        status: 'in_transit',
        location: 'En transit',
        timestamp: currentDate,
        description: 'Colis en cours d\'acheminement'
      }
    } else if (order.status === 'delivered') {
      lastUpdate = {
        status: 'delivered',
        location: order.shippingDetails.city,
        timestamp: currentDate,
        description: 'Colis livré'
      }
    }

    if (lastUpdate && (!order.tracking.updates || !order.tracking.updates.length)) {
      order.tracking.updates = [lastUpdate]
      await order.save()
    }

    return NextResponse.json({
      tracking: order.tracking,
      estimatedDeliveryDate: order.estimatedDeliveryDate
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du suivi:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du suivi' },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { carrier, trackingNumber } = await request.json()

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

    // Mettre à jour les informations de suivi
    order.tracking = {
      carrier,
      trackingNumber,
      estimatedDeliveryDate: order.calculateEstimatedDelivery(),
      updates: [{
        status: 'processing',
        location: 'Centre de traitement',
        timestamp: new Date(),
        description: 'Commande prise en charge'
      }]
    }

    order.estimatedDeliveryDate = order.tracking.estimatedDeliveryDate
    await order.save()

    return NextResponse.json({
      message: 'Informations de suivi mises à jour avec succès',
      tracking: order.tracking,
      estimatedDeliveryDate: order.estimatedDeliveryDate
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du suivi:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du suivi' },
      { status: 500 }
    )
  }
} 
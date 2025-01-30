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

    const { rating, comment } = await request.json()

    if (!rating || !comment) {
      return NextResponse.json(
        { message: 'La note et le commentaire sont requis' },
        { status: 400 }
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

    // Vérifier que la commande est livrée
    if (order.status !== 'delivered') {
      return NextResponse.json(
        { message: 'Seules les commandes livrées peuvent être notées' },
        { status: 400 }
      )
    }

    // Vérifier si un avis existe déjà
    if (order.review) {
      return NextResponse.json(
        { message: 'Un avis a déjà été donné pour cette commande' },
        { status: 400 }
      )
    }

    // Ajouter l'avis
    order.review = {
      rating,
      comment,
      createdAt: new Date()
    }

    // Ajouter l'action à l'historique
    order.history.push({
      action: 'add_review',
      date: new Date(),
      userId: token.userId,
      note: `Note : ${rating}/5`
    })

    await order.save()

    return NextResponse.json({
      message: 'Avis ajouté avec succès',
      review: order.review
    })
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'avis:', error)
    return NextResponse.json(
      { message: 'Erreur lors de l\'ajout de l\'avis' },
      { status: 500 }
    )
  }
}

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

    return NextResponse.json({
      review: order.review || null
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'avis:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération de l\'avis' },
      { status: 500 }
    )
  }
} 
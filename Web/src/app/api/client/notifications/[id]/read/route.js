import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../../../lib/mongodb'
import Notification from '../../../../../../models/Notification'

export async function PUT(request, { params }) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'client') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: params.id,
        user: token.userId
      },
      { $set: { read: true } },
      { new: true }
    )

    if (!notification) {
      return NextResponse.json(
        { message: 'Notification non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error)
    return NextResponse.json(
      { message: 'Erreur lors du marquage de la notification' },
      { status: 500 }
    )
  }
} 
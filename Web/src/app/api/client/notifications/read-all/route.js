import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../../lib/mongodb'
import Notification from '../../../../../models/Notification'

export async function PUT(request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'client') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    await Notification.updateMany(
      { 
        user: token.userId,
        read: false
      },
      { $set: { read: true } }
    )

    return NextResponse.json({ 
      message: 'Toutes les notifications ont été marquées comme lues' 
    })
  } catch (error) {
    console.error('Erreur lors du marquage des notifications:', error)
    return NextResponse.json(
      { message: 'Erreur lors du marquage des notifications' },
      { status: 500 }
    )
  }
} 
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import Notification from '../../../../models/Notification'

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

    const notifications = await Notification.find({ 
      user: token.userId 
    })
    .sort({ createdAt: -1 })
    .limit(50)

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    )
  }
} 
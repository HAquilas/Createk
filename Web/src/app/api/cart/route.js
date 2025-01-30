import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'

export async function GET(request) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    let cart = await Cart.findOne({ user: token.userId })
      .populate('items.product')

    if (!cart) {
      cart = new Cart({ user: token.userId, items: [] })
      await cart.save()
    }

    const total = await cart.calculateTotal()

    return NextResponse.json({
      items: cart.items.map(item => ({
        _id: item._id,
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
          stock: item.product.stock
        },
        quantity: item.quantity
      })),
      total
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du panier' },
      { status: 500 }
    )
  }
} 
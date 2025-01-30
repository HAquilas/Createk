import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'

export async function DELETE(request) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { itemId } = await request.json()

    await connectDB()

    const cart = await Cart.findOne({ user: token.userId })
    if (!cart) {
      return NextResponse.json(
        { message: 'Panier non trouvé' },
        { status: 404 }
      )
    }

    const cartItem = cart.items.id(itemId)
    if (!cartItem) {
      return NextResponse.json(
        { message: 'Article non trouvé dans le panier' },
        { status: 404 }
      )
    }

    cartItem.remove()
    await cart.save()
    await cart.populate('items.product')
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
    console.error('Erreur lors de la suppression de l\'article:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
} 
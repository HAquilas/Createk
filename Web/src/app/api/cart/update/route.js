import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'
import Product from '@/models/Product'

export async function PUT(request) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { itemId, quantity } = await request.json()

    if (quantity < 1) {
      return NextResponse.json(
        { message: 'La quantité doit être supérieure à 0' },
        { status: 400 }
      )
    }

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

    // Vérifier le stock disponible
    const product = await Product.findById(cartItem.product)
    if (!product) {
      return NextResponse.json(
        { message: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        { message: 'Stock insuffisant' },
        { status: 400 }
      )
    }

    cartItem.quantity = quantity
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
    console.error('Erreur lors de la mise à jour du panier:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour du panier' },
      { status: 500 }
    )
  }
} 
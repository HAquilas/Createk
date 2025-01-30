import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import Cart from '../../../../models/Cart'
import Product from '../../../../models/Product'

export async function POST(request) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { productId, quantity } = await request.json()

    await connectDB()

    // Vérifier si le produit existe et s'il y a assez de stock
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { message: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { message: 'Stock insuffisant' },
        { status: 400 }
      )
    }

    // Récupérer ou créer le panier
    let cart = await Cart.findOne({ user: token.userId })
    if (!cart) {
      cart = new Cart({ user: token.userId, items: [] })
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    )

    if (existingItem) {
      // Mettre à jour la quantité
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > product.stock) {
        return NextResponse.json(
          { message: 'Stock insuffisant' },
          { status: 400 }
        )
      }
      existingItem.quantity = newQuantity
    } else {
      // Ajouter le nouveau produit
      cart.items.push({
        product: productId,
        quantity
      })
    }

    await cart.save()
    await cart.populate('items.product')
    const total = await cart.calculateTotal()

    return NextResponse.json({
      message: 'Produit ajouté au panier',
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
    console.error('Erreur lors de l\'ajout au panier:', error)
    return NextResponse.json(
      { message: 'Erreur lors de l\'ajout au panier' },
      { status: 500 }
    )
  }
} 
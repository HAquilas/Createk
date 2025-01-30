import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import Cart from '@/models/Cart'
import Product from '@/models/Product'

export async function POST(request) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { shippingDetails, items, total } = await request.json()

    await connectDB()

    // Vérifier le stock pour chaque produit
    for (const item of items) {
      const product = await Product.findById(item.product._id)
      if (!product) {
        return NextResponse.json(
          { message: `Produit ${item.product.name} non trouvé` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Stock insuffisant pour ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Récupérer le vendeur du premier produit (supposant que tous les produits sont du même vendeur)
    const firstProduct = await Product.findById(items[0].product._id)
    if (!firstProduct) {
      return NextResponse.json(
        { message: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Créer la commande avec le vendeur
    const order = new Order({
      user: token.userId,
      seller: firstProduct.seller,
      items: items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      shippingDetails,
      total
    })

    await order.save()

    // Mettre à jour le stock des produits
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      )
    }

    // Vider le panier
    await Cart.findOneAndUpdate(
      { user: token.userId },
      { $set: { items: [] } }
    )

    return NextResponse.json({
      message: 'Commande créée avec succès',
      orderId: order._id
    })
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
} 
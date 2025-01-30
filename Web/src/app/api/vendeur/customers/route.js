import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import connectDB from '../../../../lib/mongodb'
import Order from '../../../../models/Order'
import User from '../../../../models/User'

export async function GET(request) {
  try {
    const token = await getToken({ req: request })
    if (!token || token.role !== 'vendeur') {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      )
    }

    await connectDB()

    // Récupérer toutes les commandes du vendeur
    const orders = await Order.find({ seller: token.userId })
      .populate('user', 'name email phone createdAt')
      .sort({ createdAt: -1 })

    // Créer un Map pour regrouper les informations par client
    const customerMap = new Map()

    orders.forEach(order => {
      const userId = order.user._id.toString()
      
      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          _id: userId,
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone,
          createdAt: order.user.createdAt,
          firstOrderDate: order.createdAt,
          totalOrders: 0,
          completedOrders: 0,
          totalSpent: 0
        })
      }

      const customerData = customerMap.get(userId)
      customerData.totalOrders++
      customerData.totalSpent += order.total

      if (order.status === 'delivered') {
        customerData.completedOrders++
      }

      // Mettre à jour la date de première commande si celle-ci est plus ancienne
      if (new Date(order.createdAt) < new Date(customerData.firstOrderDate)) {
        customerData.firstOrderDate = order.createdAt
      }
    })

    // Calculer les statistiques globales
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const stats = {
      totalCustomers: customerMap.size,
      newCustomers: Array.from(customerMap.values()).filter(
        customer => new Date(customer.createdAt) > thirtyDaysAgo
      ).length,
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0
        ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length
        : 0
    }

    return NextResponse.json({
      customers: Array.from(customerMap.values()),
      stats
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    )
  }
} 
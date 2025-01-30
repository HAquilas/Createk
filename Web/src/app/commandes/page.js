'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

const STATUS_LABELS = {
  pending: 'En attente',
  paid: 'Payée',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée'
}

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setOrders(data.orders)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    )
  }

  if (orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Aucune commande
            </h1>
            <p className="text-gray-500 mb-8">
              Vous n'avez pas encore passé de commande.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
            >
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Mes commandes
          </h1>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <ul role="list" className="divide-y divide-gray-200">
              {orders.map((order) => (
                <li key={order._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            Commande #{order._id}
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                          <Link
                            href={`/commandes/${order._id}/confirmation`}
                            className="text-primary hover:text-blue-700 text-sm font-medium"
                          >
                            Voir les détails →
                          </Link>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex space-x-6 overflow-x-auto">
                          {order.items.map((item) => (
                            <div key={item._id} className="flex-shrink-0">
                              <div className="flex items-center">
                                <div className="w-20 h-20 relative">
                                  <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <h3 className="text-sm font-medium text-gray-900">
                                    {item.product.name}
                                  </h3>
                                  <p className="mt-1 text-sm text-gray-500">
                                    Quantité: {item.quantity}
                                  </p>
                                  <p className="mt-1 text-sm font-medium text-gray-900">
                                    {(item.price * item.quantity).toLocaleString('fr-FR', {
                                      style: 'currency',
                                      currency: 'XOF'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          Total: {order.total.toLocaleString('fr-FR', {
                            style: 'currency',
                            currency: 'XOF'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
} 
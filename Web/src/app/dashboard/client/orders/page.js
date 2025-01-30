'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const statusTranslations = {
  'pending': { text: 'En attente', class: 'bg-yellow-100 text-yellow-800' },
  'paid': { text: 'Payée', class: 'bg-blue-100 text-blue-800' },
  'processing': { text: 'En traitement', class: 'bg-purple-100 text-purple-800' },
  'shipped': { text: 'Expédiée', class: 'bg-indigo-100 text-indigo-800' },
  'delivered': { text: 'Livrée', class: 'bg-green-100 text-green-800' },
  'cancelled': { text: 'Annulée', class: 'bg-red-100 text-red-800' }
}

export default function ClientOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/client/orders')
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

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
        <p className="mt-2 text-sm text-gray-700">
          Suivez l'état de vos commandes et accédez à leur historique
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vous n'avez pas encore passé de commande.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* En-tête de la commande */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Commande passée le {format(new Date(order.createdAt), 'PPP', { locale: fr })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      N° {order._id}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-primary">
                      {order.totalAmount.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'XOF'
                      })}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusTranslations[order.status].class}`}>
                      {statusTranslations[order.status].text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Détails de la commande */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Produits */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Articles commandés</h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <h5 className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </h5>
                            <p className="text-sm text-gray-500">
                              Quantité : {item.quantity}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {item.price.toLocaleString('fr-FR', {
                                style: 'currency',
                                currency: 'XOF'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informations de livraison */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Détails de livraison</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Nom :</span> {order.shippingDetails.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Adresse :</span> {order.shippingDetails.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Ville :</span> {order.shippingDetails.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Téléphone :</span> {order.shippingDetails.phone}
                        </p>
                      </div>
                      {order.tracking && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            Suivi de livraison
                          </p>
                          <p className="text-sm text-gray-600">
                            N° de suivi : {order.tracking.trackingNumber}
                          </p>
                          {order.estimatedDeliveryDate && (
                            <p className="text-sm text-gray-600 mt-1">
                              Livraison estimée : {format(new Date(order.estimatedDeliveryDate), 'PPP', { locale: fr })}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pied de la commande */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Vendu par : {order.seller.name}
                  </div>
                  {order.status === 'delivered' && !order.review && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Laisser un avis
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
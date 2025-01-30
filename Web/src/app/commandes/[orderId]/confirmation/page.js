'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function OrderConfirmationPage({ params }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [params.orderId])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setOrder(data.order)
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

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="text-center py-12">
          <p className="text-red-500">Commande non trouvée</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 pt-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg">
            {/* En-tête */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 text-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Merci pour votre commande !
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Votre commande a été confirmée et sera bientôt traitée.
                  </p>
                </div>
              </div>
            </div>

            {/* Détails de la commande */}
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Détails de la commande
                </h2>
                <div className="text-sm text-gray-500">
                  <p>Numéro de commande: {order._id}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                  <p>Statut: {order.status === 'paid' ? 'Payée' : 'En attente'}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Adresse de livraison
                </h2>
                <div className="text-sm text-gray-500">
                  <p>{order.shippingDetails.fullName}</p>
                  <p>{order.shippingDetails.address}</p>
                  <p>{order.shippingDetails.city}</p>
                  <p>{order.shippingDetails.phone}</p>
                  <p>{order.shippingDetails.email}</p>
                  {order.shippingDetails.additionalInfo && (
                    <p className="mt-2">
                      Instructions: {order.shippingDetails.additionalInfo}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Articles commandés
                </h2>
                <ul role="list" className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item._id} className="py-4 flex">
                      <div className="flex-shrink-0 w-24 h-24 relative">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Quantité: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'XOF'
                            })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>
                      {order.total.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'XOF'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between">
                <Link
                  href="/boutique"
                  className="text-primary hover:text-blue-700"
                >
                  ← Retour à la boutique
                </Link>
                <Link
                  href="/commandes"
                  className="text-primary hover:text-blue-700"
                >
                  Voir mes commandes →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
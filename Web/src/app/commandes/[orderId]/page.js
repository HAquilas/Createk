'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function OrderDetailPage({ params }) {
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    fetchOrder()
    fetchTracking()
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

  const fetchTracking = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}/tracking`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setTracking(data.tracking)
    } catch (err) {
      console.error('Erreur lors de la récupération du suivi:', err)
    }
  }

  const handleAction = async (action) => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, reason }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setShowCancelModal(false)
      setShowReturnModal(false)
      setReason('')
      fetchOrder()
    } catch (error) {
      console.error('Erreur:', error)
      setError(error.message)
    }
  }

  const handleConfirmReception = async () => {
    await handleAction('confirm_reception')
  }

  const handleAddReview = async () => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setShowReviewModal(false)
      setRating(5)
      setComment('')
      fetchOrder()
    } catch (error) {
      console.error('Erreur:', error)
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Commande non trouvée</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Commande #{order._id}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Suivi de commande */}
          {order.status !== 'cancelled' && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Suivi de la commande
              </h2>
              
              {tracking ? (
                <div className="space-y-4">
                  {tracking.carrier && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Transporteur</span>
                      <span className="font-medium">{tracking.carrier}</span>
                    </div>
                  )}
                  {tracking.trackingNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Numéro de suivi</span>
                      <span className="font-medium">{tracking.trackingNumber}</span>
                    </div>
                  )}
                  {tracking.estimatedDeliveryDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Livraison estimée</span>
                      <span className="font-medium">
                        {new Date(tracking.estimatedDeliveryDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  
                  {tracking.updates && tracking.updates.length > 0 && (
                    <div className="mt-6">
                      <div className="flow-root">
                        <ul role="list" className="-mb-8">
                          {tracking.updates.map((update, idx) => (
                            <li key={idx}>
                              <div className="relative pb-8">
                                {idx !== tracking.updates.length - 1 && (
                                  <span
                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                  />
                                )}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                      <svg
                                        className="h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {update.status}
                                      </div>
                                      <p className="mt-0.5 text-sm text-gray-500">
                                        {update.location}
                                      </p>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                      <p>{update.description}</p>
                                      <p className="mt-1">
                                        {new Date(update.timestamp).toLocaleString('fr-FR')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Aucune information de suivi disponible pour le moment.
                </p>
              )}
            </div>
          )}

          {/* Articles commandés */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Articles commandés
            </h2>
            <ul role="list" className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item._id} className="py-6 flex">
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
          </div>

          {/* Informations de livraison */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Informations de livraison
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

          {/* Résumé de la commande */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Résumé
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sous-total</span>
                <span className="font-medium">
                  {order.total.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Frais de livraison</span>
                <span className="font-medium">Gratuit</span>
              </div>
              <div className="pt-4 flex justify-between text-base font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {order.total.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'XOF'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6">
            <div className="flex justify-between">
              <div className="space-x-4">
                {order.status === 'shipped' && (
                  <button
                    onClick={handleConfirmReception}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Confirmer la réception
                  </button>
                )}
                {['pending', 'paid'].includes(order.status) && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Annuler la commande
                  </button>
                )}
                {order.status === 'delivered' && !order.returnRequest && (
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Demander un retour
                  </button>
                )}
              </div>
              <Link
                href="/commandes"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Retour aux commandes
              </Link>
            </div>
          </div>

          {/* Avis */}
          {order.status === 'delivered' && (
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Avis sur la commande
              </h2>
              
              {order.review ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${
                            star <= order.review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-6.327 3.323 1.209-7.037L.172 7.332l7.046-1.024L10 0l2.782 6.308 7.046 1.024-4.71 4.539 1.209 7.037z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(order.review.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-700">{order.review.comment}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-4">
                    Vous n'avez pas encore donné votre avis sur cette commande.
                  </p>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
                  >
                    Donner mon avis
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal d'annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Annuler la commande
            </h3>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Raison de l'annulation
              </label>
              <textarea
                id="reason"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction('cancel')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de retour */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Demander un retour
            </h3>
            <div className="mb-4">
              <label htmlFor="return-reason" className="block text-sm font-medium text-gray-700">
                Raison du retour
              </label>
              <textarea
                id="return-reason"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowReturnModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction('request_return')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'avis */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Donner votre avis
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <svg
                      className={`h-8 w-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 15.585l-6.327 3.323 1.209-7.037L.172 7.332l7.046-1.024L10 0l2.782 6.308 7.046 1.024-4.71 4.539 1.209 7.037z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Commentaire
              </label>
              <textarea
                id="comment"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddReview}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
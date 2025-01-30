'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import Navbar from '@/components/Navbar'

export default function PaymentPage({ params }) {
  const router = useRouter()
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

  const handlePaymentSuccess = async (response) => {
    try {
      const res = await fetch(`/api/orders/${params.orderId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: response.transactionId,
          status: 'completed'
        }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du paiement')
      }

      router.push(`/commandes/${params.orderId}/confirmation`)
    } catch (error) {
      console.error('Erreur:', error)
      setError(error.message)
    }
  }

  const handlePaymentFailed = async (error) => {
    console.error('Erreur de paiement:', error)
    setError('Le paiement a échoué. Veuillez réessayer.')
  }

  useEffect(() => {
    if (order) {
      // Configuration de KkiaPay
      window.kkiapayButton = document.querySelector('.kkiapay-button')
      if (window.kkiapayButton) {
        window.kkiapayButton.addEventListener('success', handlePaymentSuccess)
        window.kkiapayButton.addEventListener('failed', handlePaymentFailed)
      }

      return () => {
        if (window.kkiapayButton) {
          window.kkiapayButton.removeEventListener('success', handlePaymentSuccess)
          window.kkiapayButton.removeEventListener('failed', handlePaymentFailed)
        }
      }
    }
  }, [order])

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
      <Script
        src="https://cdn.kkiapay.me/k.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gray-50 py-12 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Paiement de la commande
            </h1>

            <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Récapitulatif
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de commande</span>
                  <span className="font-medium">{order._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total à payer</span>
                  <span className="font-medium">
                    {order.total.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'XOF'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <kkiapay-widget
                amount={order.total}
                key="VOTRE_CLE_PUBLIQUE_KKIAPAY"
                sandbox="true"
                data={order._id}
                callback="handlePaymentSuccess"
                theme="#1A56DB"
                className="kkiapay-button"
              >
                <button className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700">
                  Payer maintenant
                </button>
              </kkiapay-widget>

              <p className="mt-4 text-sm text-gray-500">
                Paiement sécurisé par KkiaPay
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 
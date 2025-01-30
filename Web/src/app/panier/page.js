'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart')
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setCart(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour de la quantité')
      }

      fetchCart()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la mise à jour de la quantité')
    }
  }

  const removeItem = async (itemId) => {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression de l\'article')
      }

      fetchCart()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression de l\'article')
    }
  }

  const proceedToCheckout = () => {
    router.push('/commande')
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

  if (cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Votre panier est vide
            </h1>
            <p className="text-gray-500 mb-8">
              Découvrez nos produits et commencez vos achats !
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
            >
              Continuer mes achats
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
            Mon Panier
          </h1>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <ul role="list" className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item._id} className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-24 h-24 relative">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            <Link href={`/boutique/produits/${item.product._id}`}>
                              {item.product.name}
                            </Link>
                          </h2>
                          <p className="mt-1 text-sm text-gray-500">
                            Prix unitaire: {item.product.price.toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'XOF'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                              className="w-16 text-center border-gray-300 rounded-md mx-2"
                            />
                            <button
                              onClick={() => updateQuantity(item._id, Math.min(item.product.stock, item.quantity + 1))}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-900">
                        Sous-total: {(item.product.price * item.quantity).toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'XOF'
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>{cart.total.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'XOF'
                })}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link
              href="/boutique"
              className="text-primary hover:text-blue-700"
            >
              ← Continuer mes achats
            </Link>
            <button
              onClick={proceedToCheckout}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Passer la commande
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 
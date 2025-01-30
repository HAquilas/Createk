'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'

// Composant pour les étoiles de notation
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// Composant pour le dialogue d'erreur
const ErrorDialog = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 transform transition-all">
        <div className="flex items-center justify-center mb-4 text-red-500">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Connexion requise
        </h3>
        <p className="text-gray-500 text-center mb-6">
          {message}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/connexion')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductPage({ params }) {
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  // Données mockées pour les avis (à remplacer par des vraies données)
  const reviews = [
    {
      id: 1,
      author: "Jean Dupont",
      rating: 5,
      date: "2024-01-15",
      comment: "Excellent produit, je recommande vivement !",
      avatar: "/avatars/user1.jpg"
    },
    {
      id: 2,
      author: "Marie Martin",
      rating: 4,
      date: "2024-01-10",
      comment: "Très satisfaite de mon achat, livraison rapide.",
      avatar: "/avatars/user2.jpg"
    }
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check')
        const data = await res.json()
        setIsAuthenticated(data.isAuthenticated)
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'authentification:', err)
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/boutique/products/${params.id}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Une erreur est survenue')
        }

        setProduct(data.product)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0 && value <= product.stock) {
      setQuantity(value)
    }
  }

  const addToCart = async () => {
    if (!isAuthenticated) {
      setShowErrorDialog(true)
      return
    }

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de l\'ajout au panier')
      }

      router.push('/panier')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'ajout au panier')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Produit non trouvé
            </h1>
            <p className="text-gray-500 mb-8">{error || 'Ce produit n\'existe pas'}</p>
            <button
              onClick={() => router.push('/boutique')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-700"
            >
              Retour à la boutique
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        {/* Bouton retour */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
              {/* Galerie d'images */}
              <div className="p-6 lg:p-8">
                <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={800}
                    height={600}
                    className="w-full h-full object-center object-cover"
                    priority
                  />
                </div>
                {/* Miniatures (à implémenter avec plusieurs images) */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {[product.imageUrl].map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Vue ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-center object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Informations produit */}
              <div className="p-6 lg:p-8">
                <div className="flex flex-col h-full">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                      <p className="text-3xl font-bold text-primary">
                        {product.price.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'XOF'
                        })}
                      </p>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <div className="flex items-center">
                          {product.stock > 0 ? (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              En stock ({product.stock})
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Rupture de stock
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-lg text-gray-500 mb-8">
                      {product.description}
                    </div>

                    <div className="space-y-6">
                      {/* Sélection quantité */}
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                          Quantité
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <button
                              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <input
                              type="number"
                              id="quantity"
                              name="quantity"
                              min="1"
                              max={product.stock}
                              value={quantity}
                              onChange={handleQuantityChange}
                              className="w-32 pl-8 pr-8 py-2 rounded-lg border-2 border-gray-100 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 text-center"
                            />
                            <button
                              onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          <button
                            onClick={addToCart}
                            disabled={product.stock === 0}
                            className={`flex-1 bg-primary text-white rounded-lg py-3 px-8 flex items-center justify-center gap-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ${
                              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Ajouter au panier
                          </button>
                        </div>
                      </div>

                      {/* Informations vendeur */}
                      <div className="border-t border-gray-100 pt-6">
                        <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Détails du vendeur
                        </h2>
                        <p className="text-gray-500 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {product.seller.email}
                        </p>
                      </div>

                      {/* Catégorie */}
                      <div className="border-t border-gray-100 pt-6">
                        <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          Catégorie
                        </h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section des avis */}
            <div className="border-t border-gray-100">
              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Avis des clients
                </h2>

                {/* Note moyenne */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center">
                    <StarRating rating={4} />
                    <span className="ml-2 text-gray-600">4.0/5</span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{reviews.length} avis</span>
                </div>

                {/* Liste des avis */}
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                          <Image
                            src={review.avatar}
                            alt={review.author}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{review.author}</h3>
                            <StarRating rating={review.rating} />
                          </div>
                          <time className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</time>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ErrorDialog
        isOpen={showErrorDialog}
        message="Veuillez vous connecter pour ajouter des articles à votre panier."
        onClose={() => setShowErrorDialog(false)}
      />
      
      <Footer />
    </div>
  )
} 
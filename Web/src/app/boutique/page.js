'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const categories = [
  'Tous',
  'Électronique',
  'Mode',
  'Maison',
  'Sports',
  'Beauté',
  'Alimentation',
  'Autres'
]

export default function BoutiquePage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, sortBy])

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (selectedCategory !== 'Tous') {
        queryParams.append('category', selectedCategory)
      }
      queryParams.append('sort', sortBy)

      const res = await fetch(`/api/boutique/products?${queryParams.toString()}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Une erreur est survenue')
      }

      setProducts(data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setProducts(filteredProducts)
  }

  const handlePriceFilter = () => {
    const filteredProducts = products.filter(product => {
      const price = product.price
      const min = priceRange.min === '' ? 0 : parseFloat(priceRange.min)
      const max = priceRange.max === '' ? Infinity : parseFloat(priceRange.max)
      return price >= min && price <= max
    })
    setProducts(filteredProducts)
  }

  const addToCart = async (productId) => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: 1 }),
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section avec fond dégradé */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Découvrez notre</span>
              <span className="block text-primary">Collection Unique</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Des produits soigneusement sélectionnés pour vous offrir une expérience shopping exceptionnelle.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Nouvelle section des filtres */}
          <div className="bg-white rounded-2xl shadow-sm mb-8">
            <div className="p-6">
              {/* Barre de recherche principale */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-gray-100 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Filtres avancés */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Catégories - 5 colonnes */}
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégories</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-primary text-white shadow-md transform scale-105'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre de prix - 4 colonnes */}
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      placeholder="Min"
                      className="w-full rounded-xl border-2 border-gray-100 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      placeholder="Max"
                      className="w-full rounded-xl border-2 border-gray-100 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                    />
                    <button
                      onClick={handlePriceFilter}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    >
                      Filtrer
                    </button>
                  </div>
                </div>

                {/* Tri - 3 colonnes */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-100 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-20"
                  >
                    <option value="recent">Plus récents</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des produits */}
          {products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="mt-4 text-gray-500">Aucun produit trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link 
                  href={`/boutique/produits/${product._id}`}
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-w-4 aspect-h-3 rounded-t-2xl overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors duration-200">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-lg font-bold text-primary">
                        {product.price.toLocaleString('fr-FR', {
                          style: 'currency',
                          currency: 'XOF'
                        })}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
} 
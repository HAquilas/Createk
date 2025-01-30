'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VendeurDashboard() {
  const [stats, setStats] = useState({
    totalVentes: 0,
    nombreCommandes: 0,
    nombreProduits: 0,
    produitsEnRupture: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupérer les statistiques
        const statsRes = await fetch('/api/vendeur/stats')
        const statsData = await statsRes.json()

        if (!statsRes.ok) throw new Error(statsData.message)

        // Récupérer les commandes récentes
        const ordersRes = await fetch('/api/vendeur/orders/recent')
        const ordersData = await ordersRes.json()

        if (!ordersRes.ok) throw new Error(ordersData.message)

        setStats(statsData)
        setRecentOrders(ordersData.orders)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tableau de bord</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total des ventes */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total des ventes
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalVentes.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'XOF'
              })}
            </dd>
          </div>
        </div>

        {/* Nombre de commandes */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Commandes
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.nombreCommandes}
            </dd>
          </div>
        </div>

        {/* Nombre de produits */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Produits
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.nombreProduits}
            </dd>
          </div>
        </div>

        {/* Produits en rupture */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Produits en rupture
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.produitsEnRupture}
            </dd>
          </div>
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Commandes récentes</h2>
          <Link 
            href="/dashboard/vendeur/orders"
            className="text-sm font-medium text-primary hover:text-primary-dark"
          >
            Voir tout
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'XOF'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 
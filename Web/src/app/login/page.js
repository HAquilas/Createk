'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import LoginForm from '../../components/LoginForm'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl p-4 text-sm shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Colonne de gauche - Illustration et texte */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative h-[500px]">
              <Image
                src="/images/login-illustration.svg"
                alt="Illustration de connexion"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-8 space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Bienvenue sur notre plateforme
              </h1>
              <p className="text-lg text-gray-600">
                Connectez-vous pour accéder à votre espace personnel et gérer vos commandes en toute simplicité.
              </p>
            </div>
          </motion.div>

          {/* Colonne de droite - Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 lg:p-12"
          >
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Bienvenue
              </h1>
              <p className="text-gray-600">
                Connectez-vous pour accéder à votre espace personnel
              </p>
            </div>
            <LoginForm />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
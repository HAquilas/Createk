'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import LoginForm from '../../components/LoginForm'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 flex items-center justify-center px-4">
      <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center shadow-lg rounded-3xl bg-white p-8 lg:p-12">
        {/* Illustration and Text */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative h-[400px] flex items-center justify-center">
            <Image
              src='/images/login-illustration.svg'
              alt='Illustration de connexion'
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="mt-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Bienvenue</h1>
            <p className="text-lg text-gray-600">Connectez-vous pour accéder à votre espace personnel.</p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl p-4 text-sm shadow-sm mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Votre compte a été connecté avec succès.
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Connexion</h2>
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

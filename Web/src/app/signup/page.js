'use client'

import Image from 'next/image'
import SignupForm from '../../components/SignupForm'
import { motion } from 'framer-motion'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="container mx-auto px-4 py-8 lg:py-12">
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
                src="/images/signup-illustration.svg"
                alt="Illustration d'inscription"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-8 space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Rejoignez notre communauté
              </h1>
              <p className="text-lg text-gray-600">
                Créez votre compte pour profiter de tous nos services et découvrir nos produits exceptionnels.
              </p>
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Avantages de l'inscription :
                </h3>
                <ul className="space-y-3">
                  {[
                    'Suivez vos commandes en temps réel',
                    'Accédez à des offres exclusives',
                    'Gérez vos informations personnelles',
                    'Recevez des notifications personnalisées'
                  ].map((avantage, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {avantage}
                    </motion.li>
                  ))}
                </ul>
              </div>
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
                Créez votre compte
              </h1>
              <p className="text-gray-600">
                Rejoignez-nous pour une expérience exceptionnelle
              </p>
            </div>
            <SignupForm />
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
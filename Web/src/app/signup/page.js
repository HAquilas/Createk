'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import SignupForm from '../../components/SignupForm'
import { motion } from 'framer-motion'

export default function SignupPage() {
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
              src='/images/signup-illustration.svg'
              alt='Illustration d'inscription'
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="mt-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Rejoignez-nous</h1>
            <p className="text-lg text-gray-600">Créez un compte et profitez de tous nos services.</p>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Inscription</h2>
            <SignupForm />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

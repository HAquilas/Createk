 'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const features = [
  {
    id: 'upload',
    icon: '/upload-icon.svg',
    name: 'Upload Files',
    description: 'Add file upload functionality to your forms without any configuration. Display those files in your dashboard.',
    link: '/docs/upload-files'
  },
  {
    id: 'notifications',
    icon: '/notification-icon.svg',
    name: 'Email Notifications',
    description: 'Get instant notifications when someone submits your form. Never miss an important submission.',
    link: '/docs/notifications'
  },
  {
    id: 'validation',
    icon: '/shield-icon.svg',
    name: 'Field Validations',
    description: 'Validate form fields server-side to ensure data quality and prevent spam submissions.',
    link: '/docs/validations'
  },
  {
    id: 'autoresponder',
    icon: '/mail-icon.svg',
    name: 'Auto Responses',
    description: 'Send automatic response emails to users who submit your form. Perfect for confirmations.',
    link: '/docs/auto-responses'
  }
]

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0F29] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="inline-block bg-yellow-400/10 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium text-yellow-400">SAVIOR, YEAH TIME-SAVIOR</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-6"
              >
                Features that
                <br />
                you 👋 need.
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-400"
              >
                Use features that normally take days to code, in minutes.
                <br />
                Integration with your CRM in 2 minutes. Set auto-responses
                <br />
                in 2 minutes. Field validations in 2 minutes. You get the idea.
              </motion.p>
            </div>

            <div className="flex flex-wrap gap-3">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center bg-white/5 rounded-full px-4 py-2 space-x-2"
                >
                  <Image 
                    src={feature.icon}
                    alt={feature.name}
                    width={20}
                    height={20}
                  />
                  <span className="text-sm">{feature.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">Upload files easy-peasy</h3>
                <p className="text-gray-400">
                  Add file upload functionality to your forms without any
                  <br />
                  configuration. Display those files in your dashboard.
                  <br />
                  Perfect for order forms, job applications, and more.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
              >
                <span>See Documentation</span>
                <Image 
                  src="/arrow-right.svg"
                  alt="Arrow"
                  width={20}
                  height={20}
                />
              </motion.button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Image 
                    src="/form-icon.svg"
                    alt="Form"
                    width={24}
                    height={24}
                  />
                  <h4 className="text-gray-900 font-medium">Contact Form</h4>
                  <span className="text-sm text-gray-500">54 Views</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="mail@website.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Upload Media</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image 
                      src="/upload-cloud.svg"
                      alt="Upload"
                      width={40}
                      height={40}
                      className="mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-500">
                      Supports: JPG, JPEG, PNG, etc...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-12 right-8">
            <Image 
              src="/mascot-2.png"
              alt="Mascot"
              width={180}
              height={180}
              className="pointer-events-none"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
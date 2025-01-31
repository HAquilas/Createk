// 'use client'

// import { useState } from "react"
// import { motion } from 'framer-motion'
// import Image from 'next/image'
// import { Button } from "../components/ui/button"
// import { Card } from "../components/ui/card"
// import { Copy } from 'lucide-react'

// export default function Hero() {

//     const [copied, setCopied] = useState(false)

//     const copyToClipboard = () => {
//       navigator.clipboard.writeText("https://formcarry.com/s/XXXXXXX")
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     }

//   return (
//     <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
//       <div className="absolute inset-0 z-0">
//         <svg
//           className="absolute bottom-0 left-0 right-0 w-full"
//           viewBox="0 0 1440 320"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           preserveAspectRatio="none"
//         >
//           <path
//             d="M0 224L60 208C120 192 240 160 360 160C480 160 600 192 720 197.3C840 203 960 181 1080 181.3C1200 181 1320 203 1380 213.3L1440 224V320H1380C1320 320 1200 320 1080 320C960 320 840 320 720 320C600 320 480 320 360 320C240 320 120 320 60 320H0V224Z"
//             fill="#EEF2FF"
//           />
//         </svg>
//       </div>
      
//       <div className="max-w-7xl mx-auto relative z-10">
//         <div className="text-center mb-16">
//           <div className="inline-block bg-green-50 rounded-full px-4 py-2 mb-4">
//             <span className="text-sm font-medium text-green-600">FORM API</span>
//           </div>
          
//           <motion.h1 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-5xl md:text-6xl font-bold text-[#1E1E1E] mb-6 leading-tight"
//           >
//             Receive emails{' '}
//             <Image 
//               src="/lightning.svg" 
//               alt="lightning" 
//               width={52} 
//               height={52} 
//               className="inline-block mx-2 -mt-2"
//             />{' '}
//             instantly
//             <br />
//             from your website{' '}
//             <Image 
//               src="/form.svg" 
//               alt="form" 
//               width={52} 
//               height={52} 
//               className="inline-block mx-2 -mt-2"
//             />{' '}
//             form
//           </motion.h1>
          
//           <motion.p 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
//           >
//             Never worry about the backend of your form again. Create your HTML form,
//             <br />
//             connect to our API, get email notifications, block spam, and use
//             <br />
//             over 3000 integrations.
//           </motion.p>

//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className="flex justify-center mb-16"
//           >
//             <div className="flex items-center max-w-lg w-full bg-white rounded-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
//               <div className="flex-1 relative">
//                 <div className="absolute left-6 top-1/2 -translate-y-1/2">
//                   <Image 
//                     src="/mail-icon.svg" 
//                     alt="Email" 
//                     width={20} 
//                     height={20}
//                     className="text-gray-400"
//                   />
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="Your email address"
//                   className="w-full pl-14 pr-4 py-4 border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
//                 />
//               </div>
//               <div className="px-3 py-2">
//                 <button className="bg-[#0E54FF] text-white px-8 py-3 rounded-[20px] hover:bg-green-700 transition-colors font-medium text-base shadow-sm">
//                   Get Started
//                 </button>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.6 }}
//         className="relative max-w-4xl mx-auto w-full"
//         style={{
//           perspective: "1000px",
//           transformStyle: "preserve-3d",
//         }}
//       >
//         <Card className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
//           {/* Window Controls */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center space-x-2">
//               <div className="flex space-x-1.5">
//                 <div className="w-3 h-3 rounded-full bg-[#FF6464]" />
//                 <div className="w-3 h-3 rounded-full bg-[#FFB347]" />
//                 <div className="w-3 h-3 rounded-full bg-[#2AC670]" />
//               </div>
//               <span className="text-sm text-[#94A3B8] ml-3">formcarry.com</span>
//             </div>
//           </div>

//           {/* Form Info */}
//           <div className="flex items-center space-x-4 mb-6">
//             <div className="bg-[#FEF3C7] rounded-full p-2 flex-shrink-0">
             
//             </div>
//             <div className="min-w-0">
//               <h3 className="font-semibold text-[#1E293B] text-base">My Sweet Form</h3>
//               <p className="text-sm text-[#94A3B8]">128 Submissions</p>
//             </div>
//             <Button
//               className="ml-auto bg-[#0A0F29] hover:bg-[#0A0F29]/90 text-white px-6 py-2.5 h-auto rounded-lg font-normal"
//             >
//               <span className="mr-2">Click to See Magic</span>
//               <span className="text-lg">✨</span>
//             </Button>
//           </div>

//           {/* API Endpoint */}
//           <div>
//             <p className="text-sm text-[#475569] mb-2">Your form API endpoint</p>
//             <div className="flex items-center space-x-3 bg-[#F8FAFC] p-4 rounded-xl">
//               <code className="flex-1 font-mono text-sm text-[#334155] overflow-hidden text-ellipsis">
//                 https://formcarry.com/s/XXXXXXX
//               </code>
//               <Button
//                 variant="ghost"
//                 className="text-[#0E54FF] hover:text-[#0E54FF]/90 hover:bg-transparent p-2 h-auto font-normal"
//                 onClick={copyToClipboard}
//               >
//                 <Copy className="h-5 w-5 mr-2" />
//                 <span>{copied ? "Copied!" : "Copy"}</span>
//               </Button>
//             </div>
//           </div>
//         </Card>

//         {/* Background Card Effect */}
//         <div
//           className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white rounded-2xl transform -rotate-2 scale-[1.02] -z-10"
//           style={{
//             transformOrigin: "center center -40px",
//           }}
//         />
//       </motion.div>
//         </div>
//       </div>
//     </section>
//   )
// } 

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Recycle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Search } from "lucide-react"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="pt-14 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-yellow-50">
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 224L60 208C120 192 240 160 360 160C480 160 600 192 720 197.3C840 203 960 181 1080 181.3C1200 181 1320 203 1380 213.3L1440 224V320H1380C1320 320 1200 320 1080 320C960 320 840 320 720 320C600 320 480 320 360 320C240 320 120 320 60 320H0V224Z"
            fill="#E6EFE6"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          {/* <div className="inline-block bg-green-100 rounded-full px-4 py-2 mb-4">
            <span className="text-sm font-medium text-green-600">MISSEBO EN LIGNE</span>
          </div> */}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight"
          >
            C'est les kargo ? On a tous ici chef, commande ton truc seulement.
            {/* <Recycle className="inline-block mx-2 -mt-2 text-green-800" size={70} /> */}
            <br/>
            {/* <Image
              src="/placeholder.svg?height=52&width=52"
              alt="recycle"
              width={52}
              height={52}
              className="inline-block mx-2 -mt-2"
            /> */}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-green-700 mb-12 max-w-2xl mx-auto"
          >
            Découvrez toute la collection unique de vêtements missebo depuis <span className="text-green-600 font-bold">Frip</span>. Payez vos articles depuis le confort de votre maison.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-16"
          >
            <div className="flex items-center max-w-lg w-full bg-white rounded-[28px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="flex-1 relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <Search className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un vêtement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-base"
                />
              </div>
              <div className="px-3 py-2">
                <button className="bg-yellow-500 text-black px-8 py-3 rounded-[20px] hover:bg-yellow-600 transition-colors font-medium text-base shadow-sm">
                  Rechercher
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative max-w-4xl mx-auto w-full"
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <Card className="bg-yellow-50 rounded-2xl shadow-xl p-6 relative z-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Image
                    src="/t-shirt.jpg"
                    alt="T-shirt"
                    width={120}
                    height={120}
                    className="mx-auto rounded-lg mb-7 mt-6"
                  />
                  <p className="text-green-800 font-semibold">T-shirts</p>
                </div>
                <div className="text-center">
                  <Image
                    src="/jeans.jpg"
                    alt="Jeans"
                    width={120}
                    height={120}
                    className="mx-auto rounded-lg mb-2 mt-4"
                  />
                  <p className="text-green-800 font-semibold">Jeans</p>
                </div>
                <div className="text-center">
                  <Image
                    src="/robe.jpg"
                    alt="Robes"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg mb-2 mt-4"
                  />
                  <p className="text-green-800 font-semibold">Robes</p>
                </div>
              </div>
              <Button className="mt-6 w-full bg-green-950 hover:bg-green-700 text-white px-6 py-2.5 h-auto rounded-lg font-normal">
                Voir toutes les catégories
              </Button>
            </Card>

            {/* Background Card Effect */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-green-100/50 to-white rounded-2xl transform -rotate-2 scale-[1.02] -z-10"
              style={{
                transformOrigin: "center center -40px",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}


// "use client"

// import { Button } from "../components/ui/button"
// import { motion } from "framer-motion"

// export default function PromoBar() {
//   return (
//     <div className="w-full bg-[#FDF4F0] h-[500px]">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between px-4 py-6 md:px-8">
//           <div className="max-w-lg">
//             <motion.h2
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-2xl md:text-3xl font-bold text-green-900 mb-4"
//             >
//               Jusqu&apos;à -50% sur notre
//               <br />
//               Collection d&apos;Été
//             </motion.h2>
//             <Button className="bg-green-900 hover:bg-green-800 text-white">Voir les offres</Button>
//           </div>
//           <div className="hidden md:block relative w-1/2 h-[300px]">
//             <img
//               src="salopette.jpg"
//               alt="Promotion Banner"
//               className="absolute right-0 top-0 h-full w-auto object-cover"
//             //   style={{
//             //     clipPath: "polygon(10% 0, 100% 0%, 100% 100%, 0% 100%)",
//             //   }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"
import { Button } from "../components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function PromoBar() {
  const images = [
      "brandPhoto1.png",
      "brandPhoto2.png",
      "brandPhoto3.png",
      "brandPhoto4.png"
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center w-full p-4 mt-20 bg-yellow-50">
      <div className="w-4/5 bg-orange-100 rounded-xl overflow-hidden shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2">
            {/* Left column - Text content */}
            <div className="flex items-center p-8 md:p-12">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-900 mb-6"
                >
                  Trouvez des tenues stylées avec seulement 2 500 fcfa
                </motion.h2>
                <Button className="bg-black hover:bg-gray-700 text-white">
                  Voir les offres
                </Button>
              </div>
            </div>

            {/* Right column - Image Carousel */}
            <div className="h-[400px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt="Promotion Banner"
                  className="h-full w-full object-contain scale-150"
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ 
                    type: "tween",
                    duration: 0.5
                  }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
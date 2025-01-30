"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../lib/utils"

const frameworks = [
  {
    id: "html",
    name: "HTML",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ssx.PNG-UtVoQILSPxXeMiCfjOukGSvQfiH7NU.png",
    code: `<form action="https://formcarry.com/s/{Your Form ID}"
  method="POST" enctype="multipart/form-data">
  <input type="email" name="email" />
  <textarea name="message"></textarea>
  <button type="submit">Submit</button>
</form>`,
  },
  {
    id: "jquery",
    name: "jQuery",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ssx.PNG-UtVoQILSPxXeMiCfjOukGSvQfiH7NU.png",
    code: `$.ajax({
  url: 'https://formcarry.com/s/{Your Form ID}',
  type: 'POST',
  data: {
    email: 'john@doe.com',
    message: 'Hello World'
  },
  success: function(response){
    // Handle success
  }
});`,
  },
  {
    id: "react",
    name: "React",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ssx.PNG-UtVoQILSPxXeMiCfjOukGSvQfiH7NU.png",
    code: `const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch(
    'https://formcarry.com/s/{Your Form ID}',
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, message 
      })
    }
  );
};`,
  },
  {
    id: "vue",
    name: "Vue",
    icon: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ssx.PNG-UtVoQILSPxXeMiCfjOukGSvQfiH7NU.png",
    code: `methods: {
  async submitForm() {
    try {
      await fetch(
        'https://formcarry.com/s/{Your Form ID}',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}`,
  },
]

export default function Features() {
  const [activeFramework, setActiveFramework] = useState(frameworks[0])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 space-y-6"
        >
          <span className="inline-block text-sm font-medium text-purple-600 bg-purple-100 px-4 py-1.5 rounded-full">
            SETUP, EASY-PEASY!
          </span>

          <AnimatePresence mode="wait">
            <motion.h1
              key={activeFramework.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-4xl md:text-5xl font-bold text-[#0A0F29]"
            >
              Easiest way to setup
              <br />
              your {activeFramework.name} form.
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-3xl mx-auto"
          >
            Don't worry about emails, spam checking, integrations and form issues ever,
            <br />
            code your front-end, add your unique formcarry URL, and we'll handle the rest.
            <br />
            Within literally just 3 minutes, you can have a fully functional form for any platform
          </motion.p>

          <div className="flex items-center justify-center gap-3 mt-8">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setActiveFramework(framework)}
                className={cn(
                  "px-4 py-2 rounded-full flex items-center gap-2 transition-all",
                  activeFramework.id === framework.id
                    ? "bg-white shadow-lg shadow-purple-100"
                    : "hover:bg-white/50"
                )}
              >
                <img
                  src={framework.icon}
                  alt={framework.name}
                  className="w-5 h-5"
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    activeFramework.id === framework.id
                      ? "text-purple-600"
                      : "text-gray-600"
                  )}
                >
                  {framework.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100">
              <div className="w-3 h-3 rounded-full bg-[#FF6464]" />
              <div className="w-3 h-3 rounded-full bg-[#FFB347]" />
              <div className="w-3 h-3 rounded-full bg-[#2AC670]" />
            </div>
            
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeFramework.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-left overflow-x-auto"
                >
                  <code className="text-sm font-mono text-gray-800">
                    {activeFramework.code}
                  </code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>

          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ssx.PNG-UtVoQILSPxXeMiCfjOukGSvQfiH7NU.png"
            alt="Mascot"
            width={180}
            height={180}
            className="absolute -bottom-20 right-8 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
      </div>
    </div>
  )
}


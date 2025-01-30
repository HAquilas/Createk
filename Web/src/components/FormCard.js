"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Copy } from 'lucide-react'
import Image from "next/image"

export default function FormCard() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText("https://formcarry.com/s/XXXXXXX")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8 flex items-center justify-center">
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
        <Card className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
          {/* Window Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF6464]" />
                <div className="w-3 h-3 rounded-full bg-[#FFB347]" />
                <div className="w-3 h-3 rounded-full bg-[#2AC670]" />
              </div>
              <span className="text-sm text-[#94A3B8] ml-3">formcarry.com</span>
            </div>
          </div>

          {/* Form Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-[#FEF3C7] rounded-full p-2 flex-shrink-0">
             
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[#1E293B] text-base">My Sweet Form</h3>
              <p className="text-sm text-[#94A3B8]">128 Submissions</p>
            </div>
            <Button
              className="ml-auto bg-[#0A0F29] hover:bg-[#0A0F29]/90 text-white px-6 py-2.5 h-auto rounded-lg font-normal"
            >
              <span className="mr-2">Click to See Magic</span>
              <span className="text-lg">✨</span>
            </Button>
          </div>

          {/* API Endpoint */}
          <div>
            <p className="text-sm text-[#475569] mb-2">Your form API endpoint</p>
            <div className="flex items-center space-x-3 bg-[#F8FAFC] p-4 rounded-xl">
              <code className="flex-1 font-mono text-sm text-[#334155] overflow-hidden text-ellipsis">
                https://formcarry.com/s/XXXXXXX
              </code>
              <Button
                variant="ghost"
                className="text-[#0E54FF] hover:text-[#0E54FF]/90 hover:bg-transparent p-2 h-auto font-normal"
                onClick={copyToClipboard}
              >
                <Copy className="h-5 w-5 mr-2" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Background Card Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white rounded-2xl transform -rotate-2 scale-[1.02] -z-10"
          style={{
            transformOrigin: "center center -40px",
          }}
        />
      </motion.div>
    </div>
  )
}


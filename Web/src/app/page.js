'use client'

import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Setup from '../components/Setup'
import Features from '../components/Features'
import Footer from '../components/Footer'
import PromoBar from "../components/promo-bar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <PromoBar/>
        <Hero />
        <Setup />
        <Features />
      </main>
      <Footer/>
    </div>
  )
} 
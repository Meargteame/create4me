import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Hero from '../components/Hero'
import TrustSection from '../components/TrustSection'
import FeatureSection from '../components/FeatureSection'
import StatsSection from '../components/StatsSection'
import CreatorPreview from '../components/CreatorPreview'
import HowItWorks from '../components/HowItWorks'
import PricingCards from '../components/PricingCards'
import Footer from '../components/Footer'

export default function HomePage() {
  const location = useLocation()

  // Open login modal if redirected from protected route
  useEffect(() => {
    const state = location.state as { showLogin?: boolean; from?: string }
    if (state?.showLogin) {
      // Trigger login modal from Header
      const event = new CustomEvent('openLoginModal')
      window.dispatchEvent(event)
    }
  }, [location])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-16" />
      <div id="home">
        <Hero />
      </div>
      <div id="features">
        <FeatureSection />
      </div>
      <div id="trust">
        <TrustSection />
      </div>
      <div id="creators">
        <CreatorPreview />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="stats">
        <StatsSection />
      </div>
      <div id="pricing">
        <PricingCards />
      </div>
      <Footer />
    </div>
  )
}
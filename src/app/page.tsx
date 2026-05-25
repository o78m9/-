import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { PricingSection } from '@/components/landing/pricing'
import { FAQSection } from '@/components/landing/faq'
import { FinalCTA } from '@/components/landing/cta'
import { LandingFooter } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}

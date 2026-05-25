import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { ComparisonSection } from '@/components/landing/comparison'
import { TestimonialsSection } from '@/components/landing/testimonials'
import { PricingSection } from '@/components/landing/pricing'
import { FAQSection } from '@/components/landing/faq'
import { FinalCTA } from '@/components/landing/cta'
import { LandingFooter } from '@/components/landing/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <LandingHeader />
      <main id="main">
        <HeroSection />
        <HowItWorksSection />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
      <WhatsAppButton />
    </div>
  )
}

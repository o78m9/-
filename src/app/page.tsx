import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero'
import { StatementSection } from '@/components/landing/statement'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { LiveSystem } from '@/components/landing/live-system'
import { ResultsSection } from '@/components/landing/results'
import { PricingSection } from '@/components/landing/pricing'
import { FAQSection } from '@/components/landing/faq'
import { FinalCTA } from '@/components/landing/cta'
import { LandingFooter } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      <LandingHeader />
      <main id="main">
        <HeroSection />
        <StatementSection />
        <HowItWorksSection />
        <LiveSystem />
        <ResultsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  )
}

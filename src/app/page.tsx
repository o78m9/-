import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero'
import { StatementSection } from '@/components/landing/statement'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { DashboardPreviewWrapper } from '@/components/landing/dashboard-preview-wrapper'
import { ResultsSection } from '@/components/landing/results'
import { MetricBar } from '@/components/landing/metric-bar'
import { TestimonialsSection } from '@/components/landing/testimonials'
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
        <DashboardPreviewWrapper />
        <ResultsSection />
        <MetricBar />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  )
}

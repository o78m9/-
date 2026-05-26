import { FadeIn } from '@/components/ui/fade-in'

export function ProblemSolution() {
  return (
    <section className="py-28 px-6 bg-[#FAFAF7]" aria-labelledby="problem-heading">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Problem */}
          <FadeIn>
            <div className="lg:border-e border-[#E8E6E0] lg:pe-24">
              <p
                className="font-bold text-[#0A0A0A]"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.015em',
                }}
              >
                العميل اللي ما رجع لـ 6 أشهر = خسارة{' '}
                <span className="text-[#B8761A] font-metric">1,800</span> ر.س في المتوسط.
              </p>
            </div>
          </FadeIn>

          {/* Solution */}
          <FadeIn delay={120}>
            <p
              className="font-bold text-[#0F4C44]"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                lineHeight: 1.3,
                letterSpacing: '-0.015em',
              }}
            >
              عَودة بيرجّعه قبل ما تنساه أصلاً.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

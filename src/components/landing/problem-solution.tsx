import { FadeIn } from '@/components/ui/fade-in'

export function ProblemSolution() {
  return (
    <section
      className="py-20 px-6"
      style={{ background: '#142B27' }}
      aria-labelledby="problem-heading"
    >
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Problem */}
          <FadeIn>
            <div className="lg:border-e lg:pe-24" style={{ borderColor: 'rgba(127,181,168,0.15)' }}>
              <p
                className="font-bold"
                style={{
                  color: '#F5EFE6',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.015em',
                }}
              >
                العميل اللي ما رجع لـ 6 أشهر = خسارة{' '}
                <span className="font-metric" style={{ color: '#D4A574' }}>
                  1,800
                </span>{' '}
                ر.س في المتوسط.
              </p>
            </div>
          </FadeIn>

          {/* Solution */}
          <FadeIn delay={120}>
            <p
              className="font-bold"
              style={{
                color: '#7FB5A8',
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

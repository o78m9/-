export function StatementSection() {
  return (
    <section className="py-24 px-6 bg-paper" aria-labelledby="statement-heading">
      <div className="max-w-content mx-auto">
        <p
          id="statement-heading"
          className="font-sans font-[700] text-ink leading-[1.25]"
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            letterSpacing: '-0.025em',
            maxWidth: '28ch',
          }}
        >
          كل عميل ما رجع لـ{' '}
          <span
            className="font-fraunces font-[600] text-copper"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            9
          </span>{' '}
          أشهر، خسارة{' '}
          <span
            className="font-fraunces font-[600] text-copper"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            1,800
          </span>{' '}
          ر.س. اضرب هذا بـ{' '}
          <span
            className="font-fraunces font-[600] text-copper"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            100
          </span>{' '}
          عميل. هذا اللي نحن نرجّعه.
        </p>

        <p className="mt-6 text-[14px] text-mute" style={{ letterSpacing: '0.01em' }}>
          مبني خصيصاً لعيادات الأسنان في السعودية والأردن والإمارات
        </p>
      </div>
    </section>
  )
}

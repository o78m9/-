import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main
      dir="rtl"
      lang="ar"
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{
        background: 'linear-gradient(170deg, #0A1F1C 0%, #142B27 50%, #0E2420 100%)',
      }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,165,116,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 404 number */}
      <p
        aria-hidden="true"
        style={{
          fontSize: 'clamp(6rem, 18vw, 14rem)',
          fontFamily: 'var(--font-tajawal)',
          fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: '2px rgba(212,165,116,0.15)',
          lineHeight: 1,
          letterSpacing: '-0.05em',
          marginBottom: '1rem',
          userSelect: 'none',
        }}
      >
        ٤٠٤
      </p>

      {/* Message */}
      <h1
        className="text-center font-black mb-4"
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          color: '#F5EFE6',
          fontFamily: 'var(--font-tajawal)',
          letterSpacing: '-0.025em',
        }}
      >
        هذه الصفحة غير موجودة
      </h1>
      <p className="text-center max-w-sm mb-10" style={{ color: '#8A9B95', lineHeight: 1.75 }}>
        ربما نقلنا هذه الصفحة أو حذفناها. جرّب الرجوع للرئيسية.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full font-semibold text-[0.9375rem] transition-all"
          style={{
            background: 'linear-gradient(135deg, #D4A574, #C08840)',
            color: '#0A1F1C',
          }}
        >
          الرئيسية
        </Link>
        <Link
          href="/#pricing"
          className="inline-flex items-center justify-center h-12 px-6 rounded-full font-medium text-[0.9375rem] transition-all"
          style={{
            border: '1px solid rgba(127,181,168,0.25)',
            color: '#7FB5A8',
            background: 'rgba(127,181,168,0.06)',
          }}
        >
          الأسعار
        </Link>
      </div>

      {/* Divider */}
      <div className="mt-16 flex items-center gap-3" aria-hidden="true">
        <div style={{ width: 40, height: 1, background: 'rgba(127,181,168,0.2)' }} />
        <div
          style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(212,165,116,0.3)' }}
        />
        <div style={{ width: 40, height: 1, background: 'rgba(127,181,168,0.2)' }} />
      </div>
    </main>
  )
}

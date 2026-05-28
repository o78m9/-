'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // In production, send to error tracking (e.g., Sentry)
    console.error('[Error Boundary]', error.message, error.digest)
  }, [error])

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'linear-gradient(170deg, #0A1F1C 0%, #142B27 50%, #0E2420 100%)',
          fontFamily: 'system-ui, sans-serif',
          direction: 'rtl',
        }}
      >
        {/* Decorative */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,116,61,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <p
          aria-hidden="true"
          style={{
            fontSize: 'clamp(5rem, 14vw, 10rem)',
            fontWeight: 900,
            color: 'transparent',
            WebkitTextStroke: '2px rgba(184,116,61,0.15)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            marginBottom: '0.75rem',
            userSelect: 'none',
          }}
        >
          ٥٠٠
        </p>

        <h1
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
            fontWeight: 900,
            color: '#F5EFE6',
            textAlign: 'center',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          حدث خطأ غير متوقع
        </h1>
        <p
          style={{
            color: '#8A9B95',
            textAlign: 'center',
            lineHeight: 1.75,
            maxWidth: 360,
            marginBottom: '2rem',
          }}
        >
          نعتذر عن هذا الخطأ. فريقنا تم إخطاره تلقائياً. حاول مرة أخرى أو تواصل معنا.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              padding: '0 32px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #D4A574, #C08840)',
              color: '#0A1F1C',
              fontWeight: 600,
              fontSize: '0.9375rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            حاول مرة أخرى
          </button>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              padding: '0 24px',
              borderRadius: 9999,
              border: '1px solid rgba(127,181,168,0.25)',
              color: '#7FB5A8',
              fontWeight: 500,
              fontSize: '0.9375rem',
              background: 'rgba(127,181,168,0.06)',
              textDecoration: 'none',
            }}
          >
            الرئيسية
          </a>
        </div>
      </body>
    </html>
  )
}

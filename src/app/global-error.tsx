'use client'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          background: '#0A1F1C',
          color: '#F5EFE6',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: 13, color: '#8A9B95', marginBottom: 8 }}>حدث خطأ غير متوقع</p>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: '#F5EFE6', marginBottom: 16 }}>
            نواجه مشكلة مؤقتة
          </h2>
          <button
            onClick={reset}
            style={{
              background: '#D4A574',
              color: '#0A1F1C',
              border: 'none',
              borderRadius: 9999,
              padding: '10px 28px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            حاول مجدداً
          </button>
        </div>
      </body>
    </html>
  )
}

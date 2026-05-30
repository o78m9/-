import { ImageResponse } from 'next/og'
import { NextResponse, type NextRequest } from 'next/server'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { OgImageQuerySchema } from '@/lib/schemas'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const limited = await rateLimit(req, LIMITS.api)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const parsed = OgImageQuerySchema.safeParse({
    title: searchParams.get('title') ?? '',
    sub: searchParams.get('sub') ?? '',
  })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const title = parsed.data.title || 'عَودة | نظام تنشيط العملاء بالذكاء الاصطناعي'
  const subtitle = parsed.data.sub || 'ادفع فقط من الإيراد الذي نسترجعه'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d1a16 0%, #1f3d36 50%, #0a1f1c 100%)',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(42,107,92,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Logo mark */}
      <div
        style={{
          fontSize: 96,
          color: '#278070',
          marginBottom: 16,
          fontWeight: 700,
          direction: 'rtl',
        }}
      >
        عَودة
      </div>
      <div
        style={{
          fontSize: 36,
          color: '#e8e2d5',
          textAlign: 'center',
          maxWidth: 800,
          direction: 'rtl',
          lineHeight: 1.4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 24,
          color: '#8a9e96',
          marginTop: 16,
          direction: 'rtl',
        }}
      >
        {subtitle}
      </div>
      {/* Brand badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 40,
          fontSize: 18,
          color: '#4A9689',
          fontWeight: 600,
        }}
      >
        awdah.io
      </div>
    </div>,
    { width: 1200, height: 630 },
  )
}

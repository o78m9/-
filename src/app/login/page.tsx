'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

/** Only allow redirects to same-origin relative paths to prevent open redirect attacks */
function sanitizeNextParam(next: string | null): string {
  if (!next) return '/dashboard'
  // Must start with / and not with // (protocol-relative URLs like //evil.com)
  if (next.startsWith('/') && !next.startsWith('//')) {
    // Reject any path containing a protocol or host indicator
    try {
      // new URL with a dummy base — if it resolves to a different origin, reject it
      const resolved = new URL(next, 'https://placeholder.invalid')
      if (resolved.origin === 'https://placeholder.invalid') return next
    } catch {
      // URL parsing failed — path is likely safe relative path
      return next
    }
  }
  return '/dashboard'
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Sanitize the `next` param to prevent open redirect (e.g. ?next=https://evil.com)
  const next = sanitizeNextParam(searchParams.get('next'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-[13px] font-medium text-ink mb-1.5">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-line bg-paper text-ink text-[14px] placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
          placeholder="doctor@clinic.com"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-[13px] font-medium text-ink mb-1.5">
          كلمة المرور
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-line bg-paper text-ink text-[14px] placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
          placeholder="••••••••"
          dir="ltr"
        />
      </div>

      {error && (
        <p className="text-[13px] text-rust bg-rust/5 border border-rust/20 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-forest text-cream text-[14px] font-medium hover:bg-forest/90 disabled:opacity-60 transition-colors"
      >
        {loading ? 'جارٍ الدخول...' : 'دخول'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-copper" />
            <span className="font-sans font-[700] text-ink text-[22px] tracking-[-0.03em]">
              عَودة
            </span>
          </Link>
          <h1 className="font-sans font-[700] text-ink text-[24px] tracking-[-0.02em]">
            مرحباً بعودتك
          </h1>
          <p className="text-mute text-[14px] mt-1.5">سجّل دخولك للوحة التحكم</p>
        </div>

        {/* Card */}
        <div
          className="bg-paper rounded-2xl p-8"
          style={{
            border: '1px solid var(--line)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-[13px] text-mute">
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="text-forest font-medium hover:underline">
              سجّل مجاناً
            </Link>
          </p>
          <p className="text-[12px] text-mute/70">
            أو{' '}
            <button
              onClick={async () => {
                // RTA-001: cookie is HMAC-signed server-side via the toggle
                // endpoint. The client cannot mint a value that satisfies the
                // middleware verifier.
                localStorage.setItem('awdah-demo-mode', 'true')
                try {
                  await fetch('/api/demo/toggle', { method: 'POST' })
                } catch {
                  // If the toggle fails, the demo route is still public.
                }
                window.location.href = '/dashboard/demo'
              }}
              className="text-copper hover:underline"
            >
              جرّب العرض التجريبي
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

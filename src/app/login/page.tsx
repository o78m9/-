'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

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
            <span className="font-sans font-[700] text-ink text-[22px] tracking-[-0.03em]">عَودة</span>
          </Link>
          <h1 className="font-sans font-[700] text-ink text-[24px] tracking-[-0.02em]">
            مرحباً بعودتك
          </h1>
          <p className="text-mute text-[14px] mt-1.5">سجّل دخولك للوحة التحكم</p>
        </div>

        {/* Card */}
        <div
          className="bg-paper rounded-2xl p-8"
          style={{ border: '1px solid var(--line)', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)' }}
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
              onClick={() => {
                document.cookie = 'awdah-demo-mode=true; path=/; max-age=86400; SameSite=Lax'
                localStorage.setItem('awdah-demo-mode', 'true')
                window.location.href = '/dashboard'
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

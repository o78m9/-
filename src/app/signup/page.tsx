'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { track } from '@/lib/posthog'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    track('signup_started', { has_clinic_name: clinicName.length > 0 })

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { clinic_name: clinicName },
      },
    })

    if (authError) {
      setError(
        authError.message === 'User already registered'
          ? 'هذا البريد مسجّل مسبقاً. حاول تسجيل الدخول.'
          : 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.',
      )
      setLoading(false)
      return
    }

    track('signup_completed')
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] text-center">
          <div className="w-14 h-14 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#1F3D36"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="font-sans font-[700] text-ink text-[22px] tracking-[-0.02em] mb-3">
            تحقق من بريدك
          </h2>
          <p className="text-mute text-[14px] leading-relaxed mb-6">
            أرسلنا رسالة تأكيد إلى <strong className="text-ink">{email}</strong>. افتحها وانقر
            الرابط لتفعيل حسابك.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-11 px-8 rounded-xl bg-forest text-cream text-[14px] font-medium hover:bg-forest/90 transition-colors"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    )
  }

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
            ابدأ مجاناً
          </h1>
          <p className="text-mute text-[14px] mt-1.5">لا بطاقة ائتمانية. لا التزامات.</p>
        </div>

        {/* Card */}
        <div
          className="bg-paper rounded-2xl p-8"
          style={{
            border: '1px solid var(--line)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="clinic" className="block text-[13px] font-medium text-ink mb-1.5">
                اسم العيادة
              </label>
              <input
                id="clinic"
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-line bg-paper text-ink text-[14px] placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                placeholder="عيادة الابتسامة"
              />
            </div>

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
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-line bg-paper text-ink text-[14px] placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
                placeholder="٨ أحرف على الأقل"
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
              {loading ? 'جارٍ التسجيل...' : 'إنشاء حساب'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-mute mt-6">
          لديك حساب؟{' '}
          <Link href="/login" className="text-forest font-medium hover:underline">
            سجّل دخولك
          </Link>
        </p>
      </div>
    </div>
  )
}

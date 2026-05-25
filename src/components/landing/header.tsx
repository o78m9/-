'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 h-16 bg-white transition-shadow duration-200',
        scrolled ? 'shadow-card border-b border-stone-200' : 'border-b border-stone-200'
      )}
    >
      <div className="max-w-content mx-auto px-8 h-full flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-teal-700 group-hover:scale-110 transition-transform" />
          <span className="text-[22px] font-bold text-stone-950 tracking-tight">عَودة</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'كيف يعمل', href: '#how' },
            { label: 'الأسعار', href: '#pricing' },
            { label: 'عن عودة', href: '#faq' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium text-stone-600 hover:text-stone-950 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-[14px] font-medium text-stone-600 hover:text-stone-950 transition-colors"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center h-9 px-4 rounded-lg bg-teal-700 text-white text-[14px] font-medium hover:bg-teal-800 transition-colors"
          >
            ابدأ تجريباً
          </Link>
        </div>
      </div>
    </header>
  )
}

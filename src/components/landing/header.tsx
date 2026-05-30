'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookingButton } from '@/components/BookingButton'

const NAV = [
  { href: '#how', label: 'كيف يعمل' },
  { href: '#pricing', label: 'الأسعار' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
  { href: '/about', label: 'عن عَودة' },
  { href: '/dashboard/demo', label: 'الدخول' },
]

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-content mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="عَودة — الصفحة الرئيسية"
        >
          <span
            className="w-[5px] h-[5px] rounded-full bg-copper transition-transform duration-200 group-hover:scale-125"
            aria-hidden="true"
          />
          <span
            className={`font-sans font-[700] text-[20px] tracking-[-0.03em] transition-colors duration-300 ${scrolled ? 'text-ink' : 'text-[#F5EFE6]'}`}
          >
            عَودة
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="التنقل الرئيسي">
          {NAV.slice(0, 4).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[14px] font-[500] transition-colors duration-150 ${scrolled ? 'text-mute hover:text-ink' : 'text-[#F5EFE6]/70 hover:text-[#D4A574]'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard/demo"
            className={`inline-flex items-center gap-1.5 text-[14px] font-[500] transition-colors duration-150 ${scrolled ? 'text-mute hover:text-ink' : 'text-[#F5EFE6]/70 hover:text-[#D4A574]'}`}
            style={{
              textDecoration: 'underline',
              textDecorationColor: 'transparent',
              textUnderlineOffset: '4px',
              textDecorationThickness: '1px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecorationColor = '#B8743D')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecorationColor = 'transparent')}
          >
            الدخول
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-[700] tracking-wide bg-amber-100 text-amber-700 leading-none">
              DEMO
            </span>
          </Link>
          <BookingButton
            source="header"
            className={`inline-flex items-center h-11 px-5 rounded-full text-[14px] font-[500] transition-all duration-150 active:translate-y-0 ${
              scrolled
                ? 'border border-forest bg-forest text-cream hover:-translate-y-[2px] hover:shadow-e2'
                : 'border border-[#7FB5A8]/30 bg-[#7FB5A8]/5 hover:bg-[#7FB5A8]/12 text-[#7FB5A8] hover:text-[#F5EFE6] hover:-translate-y-[2px]'
            }`}
          >
            أحجز عرضاً
          </BookingButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-mute hover:bg-line/50 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            {open ? (
              <>
                <line
                  x1="3"
                  y1="3"
                  x2="15"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <line
                  x1="15"
                  y1="3"
                  x2="3"
                  y2="15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <line
                  x1="2"
                  y1="5"
                  x2="16"
                  y2="5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <line
                  x1="2"
                  y1="9"
                  x2="16"
                  y2="9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <line
                  x1="2"
                  y1="13"
                  x2="16"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-16 inset-x-0 bg-paper border-b border-line px-6 py-6 flex flex-col gap-4 shadow-editorial"
        >
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[16px] font-[500] text-ink py-1"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-line">
            <BookingButton
              source="mobile-menu"
              className="w-full inline-flex items-center justify-center h-12 px-6 rounded-full bg-forest text-cream text-[15px] font-[500]"
            >
              أحجز عرضاً توضيحياً
            </BookingButton>
          </div>
        </div>
      )}
    </header>
  )
}

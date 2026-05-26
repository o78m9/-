'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookingButton } from '@/components/BookingButton'

const NAV = [
  { href: '#how', label: 'كيف يعمل' },
  { href: '#pricing', label: 'الأسعار' },
  { href: '#faq', label: 'الأسئلة الشائعة' },
  { href: '/about', label: 'عن عَودة' },
  { href: '/dashboard', label: 'الدخول' },
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
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
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
          <span className="font-sans font-[700] text-[20px] text-ink tracking-[-0.03em]">
            عَودة
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="التنقل الرئيسي">
          {NAV.slice(0, 4).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[14px] font-[500] text-mute hover:text-ink transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-[14px] font-[500] text-mute hover:text-ink transition-colors duration-150"
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
          </Link>
          <BookingButton
            source="header"
            className="inline-flex items-center h-11 px-5 rounded-full border border-forest bg-forest text-cream text-[14px] font-[500] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(31,61,54,0.3)] transition-all duration-150 active:translate-y-0"
          >
            احجز عرض
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
              احجز عرض توضيحي
            </BookingButton>
          </div>
        </div>
      )}
    </header>
  )
}

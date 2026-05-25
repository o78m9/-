'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BookingModal } from '@/components/BookingModal'

const NAV_LINKS = [
  { label: 'كيف يعمل', href: '#how' },
  { label: 'الأسعار', href: '#pricing' },
  { label: 'الأسئلة الشائعة', href: '#faq' },
  { label: 'عن عَودة', href: '/about' },
]

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [drawerOpen])

  function closeDrawer() {
    setDrawerOpen(false)
    setTimeout(() => menuBtnRef.current?.focus(), 50)
  }

  function openBookingFromDrawer() {
    closeDrawer()
    setTimeout(() => setBookingOpen(true), 80)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 h-16 bg-white transition-shadow duration-200',
          scrolled ? 'shadow-card border-b border-stone-200' : 'border-b border-stone-200'
        )}
      >
        <div className="max-w-content mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-teal-700 group-hover:scale-110 transition-transform" />
            <span className="text-[22px] font-bold text-stone-950 tracking-tight">عَودة</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14px] font-medium text-stone-600 hover:text-stone-950 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="text-[14px] font-medium text-stone-600 hover:text-stone-950 transition-colors">
              تسجيل الدخول
            </Link>
            <Link href="/dashboard" className="inline-flex items-center h-9 px-4 rounded-lg bg-teal-700 text-white text-[14px] font-medium hover:bg-teal-800 transition-colors">
              ابدأ تجريباً
            </Link>
          </div>

          <button
            ref={menuBtnRef}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="فتح القائمة"
            aria-expanded={drawerOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="قائمة التنقل"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <div className="absolute top-0 end-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-700" />
                <span className="text-[20px] font-bold text-stone-950 tracking-tight">عَودة</span>
              </div>
              <button
                onClick={closeDrawer}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1" aria-label="قائمة الجوال">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className="flex items-center px-4 py-3 rounded-lg text-[17px] font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="px-4 pb-6 pt-4 border-t border-stone-100 space-y-2">
              <button
                onClick={openBookingFromDrawer}
                className="w-full h-12 rounded-lg bg-teal-700 text-white text-[16px] font-semibold hover:bg-teal-800 transition-colors"
              >
                احجز عرض توضيحي
              </button>
              <Link
                href="/dashboard"
                onClick={closeDrawer}
                className="flex items-center justify-center w-full h-11 rounded-lg border border-stone-200 text-stone-700 text-[15px] font-medium hover:bg-stone-50 transition-colors"
              >
                ابدأ تجريباً
              </Link>
            </div>
          </div>
        </div>
      )}

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} source="hero" />
    </>
  )
}

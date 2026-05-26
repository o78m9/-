'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Send, Upload, QrCode, HelpCircle, FlaskConical, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { label: 'لوحة التحكم', href: '/dashboard', icon: LayoutDashboard },
  { label: 'العملاء', href: '/capture', icon: Users },
  { label: 'الحملات', href: '/campaigns', icon: Send },
  { label: 'استيراد', href: '/import', icon: Upload },
  { label: 'رمز QR', href: '/qr', icon: QrCode },
]

interface DashboardSidebarProps {
  isDemoMode: boolean
  onToggleDemo: () => void
  isAuthenticated?: boolean
}

export function DashboardSidebar({ isDemoMode, onToggleDemo, isAuthenticated = false }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="w-[240px] flex-shrink-0 h-full bg-stone-950 flex flex-col border-r border-stone-800">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-teal-500" />
          <span className="text-[18px] font-bold text-white tracking-tight">عَودة</span>
        </div>
        <p className="text-[11px] text-stone-500">نظام تنشيط العملاء</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors',
                active
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              )}
            >
              <item.icon
                size={16}
                className={active ? 'text-teal-400' : 'text-stone-500'}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-stone-800 space-y-0.5">
        <button
          onClick={onToggleDemo}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-right',
            isDemoMode
              ? 'text-amber-400 bg-amber-950/40 hover:bg-amber-950/60'
              : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900'
          )}
        >
          <FlaskConical size={15} className={isDemoMode ? 'text-amber-400' : 'text-stone-600'} />
          {isDemoMode ? 'وضع تجريبي — إيقاف' : 'تشغيل العرض التجريبي'}
        </button>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-stone-500 hover:text-stone-300 transition-colors"
        >
          <HelpCircle size={15} className="text-stone-600" />
          مساعدة وتواصل
        </Link>
        {isAuthenticated && (
          <button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              router.push('/login')
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-stone-500 hover:text-red-400 hover:bg-red-950/20 transition-colors text-right"
          >
            <LogOut size={15} className="text-stone-600" />
            خروج
          </button>
        )}
      </div>
    </aside>
  )
}

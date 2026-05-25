'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Megaphone, MessageSquare, BarChart2, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface HeaderProps {
  isDemoMode: boolean
  onToggleDemo: () => void
}

const NAV = [
  { label: 'لوحة التحكم', href: '/',          icon: LayoutDashboard, soon: false },
  { label: 'الحملات',     href: '/campaigns',  icon: Megaphone,       soon: false },
  { label: 'صندوق الوارد',href: '/inbox',      icon: MessageSquare,   soon: true },
  { label: 'الإحصائيات', href: '/analytics',   icon: BarChart2,       soon: true },
]

export function Header({ isDemoMode, onToggleDemo }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 glass">
      <div className="max-w-content mx-auto px-6 lg:px-10 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-brand-700 flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
            <span className="text-white font-bold text-sm font-metric">ع</span>
          </div>
          <div className="leading-none">
            <span className="font-bold text-brand-700 text-lg tracking-tight leading-none block">عَودة</span>
            <span className="text-[10px] text-slate-400 font-metric tracking-widest uppercase leading-none">نظام تنشيط</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150',
                  active
                    ? 'bg-teal-50 text-brand-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
                  item.soon && 'pointer-events-none opacity-50'
                )}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
                {item.soon && (
                  <Badge variant="soon" className="text-[10px] px-1.5 py-0">
                    قريباً
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDemo}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
              isDemoMode
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-600'
            )}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full transition-colors', isDemoMode ? 'bg-white animate-pulse' : 'bg-slate-300')} />
            <span className="font-metric tracking-wide">Demo</span>
          </button>

          <Link
            href="/settings"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Settings size={15} />
          </Link>
        </div>
      </div>
    </header>
  )
}

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
  { label: 'لوحة التحكم', href: '/', icon: LayoutDashboard, soon: false },
  { label: 'الحملات', href: '/campaigns', icon: Megaphone, soon: false },
  { label: 'صندوق الوارد', href: '/inbox', icon: MessageSquare, soon: true },
  { label: 'الإحصائيات', href: '/analytics', icon: BarChart2, soon: true },
]

export function Header({ isDemoMode, onToggleDemo }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 glass">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm font-metric">ع</span>
          </div>
          <span className="font-bold text-teal-700 text-lg leading-none">عَودة</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100',
                  item.soon && 'pointer-events-none opacity-60'
                )}
              >
                <item.icon size={15} />
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

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Demo Mode Toggle */}
          <button
            onClick={onToggleDemo}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200',
              isDemoMode
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-gray-500 border-slate-200 hover:border-amber-300 hover:text-amber-600'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors',
                isDemoMode ? 'bg-white' : 'bg-gray-300'
              )}
            />
            {isDemoMode ? 'Demo Mode' : 'Demo'}
          </button>

          <Link
            href="/settings"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-slate-100 transition-colors"
          >
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </header>
  )
}

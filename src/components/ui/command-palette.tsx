'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Home, BarChart2, Users, Settings, HelpCircle, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

const COMMANDS = [
  { id: 'home', label: 'الرئيسية', icon: Home, href: '/', group: 'تنقل' },
  { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart2, href: '/dashboard', group: 'تنقل' },
  { id: 'customers', label: 'المرضى', icon: Users, href: '/dashboard/customers', group: 'تنقل' },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: Settings,
    href: '/dashboard/settings',
    group: 'تنقل',
  },
  { id: 'pricing', label: 'الأسعار', icon: BarChart2, href: '/#pricing', group: 'اكتشاف' },
  { id: 'contact', label: 'تواصل معنا', icon: Phone, href: '/#cta', group: 'اكتشاف' },
  { id: 'help', label: 'المساعدة والدعم', icon: HelpCircle, href: '/help', group: 'مساعدة' },
]

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)

  // Focus trap: keep Tab/Shift+Tab inside the dialog
  useEffect(() => {
    if (!open || !panelRef.current) return
    const panel = panelRef.current
    const FOCUSABLE = 'input, button, a[href], [tabindex]:not([tabindex="-1"])'

    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const els = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (!first || !last) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    panel.addEventListener('keydown', trap)
    return () => panel.removeEventListener('keydown', trap)
  }, [open])

  const run = useCallback(
    (href: string) => {
      onClose()
      router.push(href)
    },
    [onClose, router],
  )

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const groups = [...new Set(COMMANDS.map((c) => c.group))]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9990,
              background: 'rgba(7, 24, 16, 0.7)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="لوحة الأوامر"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '15vh',
              insetInlineStart: '50%',
              translate: '-50% 0',
              width: 'min(90vw, 560px)',
              zIndex: 9991,
              background: '#0D2A24',
              border: '1px solid rgba(212, 165, 116, 0.2)',
              borderRadius: 16,
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)',
              overflow: 'hidden',
            }}
          >
            <Command dir="rtl" shouldFilter>
              {/* Search */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(212,165,116,0.12)',
                }}
              >
                <Search className="w-4 h-4 text-sage-500 shrink-0" aria-hidden="true" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="ابحث عن أي شيء..."
                  autoFocus
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    color: '#F5EFE6',
                    fontFamily: 'var(--font-arabic)',
                    direction: 'rtl',
                  }}
                />
                <kbd
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 6px',
                    background: 'rgba(127,181,168,0.12)',
                    border: '1px solid rgba(127,181,168,0.2)',
                    borderRadius: 6,
                    color: '#7FB5A8',
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  ESC
                </kbd>
              </div>

              <Command.List style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
                <Command.Empty
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: '#8A9B95',
                    fontSize: '0.875rem',
                  }}
                >
                  لا توجد نتائج
                </Command.Empty>

                {groups.map((group) => (
                  <Command.Group
                    key={group}
                    heading={group}
                    style={{ '--cmdk-group-heading-color': '#8A9B95' } as React.CSSProperties}
                  >
                    {COMMANDS.filter((c) => c.group === group).map((cmd) => {
                      const Icon = cmd.icon
                      return (
                        <Command.Item
                          key={cmd.id}
                          value={cmd.label}
                          onSelect={() => run(cmd.href)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '10px 12px',
                            borderRadius: 10,
                            cursor: 'pointer',
                            color: '#F5EFE6',
                            fontSize: '0.9375rem',
                            transition: 'background 150ms',
                          }}
                          className="cmdk-item"
                        >
                          <Icon className="w-4 h-4 text-sage-400 shrink-0" aria-hidden="true" />
                          {cmd.label}
                        </Command.Item>
                      )
                    })}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

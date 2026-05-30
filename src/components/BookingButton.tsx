'use client'
import { useState } from 'react'
import { BookingModal } from '@/components/BookingModal'
import { track } from '@/lib/posthog'

type Source =
  | 'hero'
  | 'header'
  | 'mobile-menu'
  | 'pricing-pro'
  | 'pricing-revenue'
  | 'pricing-subscription'
  | 'final-cta'
  | 'final-cta-secondary'

interface BookingButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'type'
> {
  source: Source
  children: React.ReactNode
}

export function BookingButton({ source, children, ...props }: BookingButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => {
          // Tracking is a no-op when the user opted out or PostHog isn't configured.
          track('cta_click', { source, label: typeof children === 'string' ? children : null })
          setOpen(true)
        }}
        type="button"
        {...props}
      >
        {children}
      </button>
      <BookingModal open={open} onClose={() => setOpen(false)} source={source} />
    </>
  )
}

'use client'
import { useState } from 'react'
import { BookingModal } from '@/components/BookingModal'

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
      <button onClick={() => setOpen(true)} type="button" {...props}>
        {children}
      </button>
      <BookingModal open={open} onClose={() => setOpen(false)} source={source} />
    </>
  )
}

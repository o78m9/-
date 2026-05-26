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

interface BookingButtonProps {
  source: Source
  children: React.ReactNode
  className?: string
}

export function BookingButton({ source, children, className }: BookingButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} className={className} type="button">
        {children}
      </button>
      <BookingModal open={open} onClose={() => setOpen(false)} source={source} />
    </>
  )
}

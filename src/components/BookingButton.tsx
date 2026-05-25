'use client'
import { useState } from 'react'
import { BookingModal } from '@/components/BookingModal'

type Source = 'hero' | 'pricing-pro' | 'final-cta'

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

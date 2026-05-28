'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonState = 'idle' | 'loading' | 'success'

interface Button3StateProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClickAsync?: () => Promise<void>
  successDuration?: number
  loadingLabel?: string
  successLabel?: string
  successAriaLabel?: string
  variant?: 'gold' | 'sage' | 'ghost'
}

export function Button3State({
  children,
  onClickAsync,
  onClick,
  successDuration = 1800,
  loadingLabel,
  successLabel,
  successAriaLabel,
  variant = 'gold',
  className,
  disabled,
  ...props
}: Button3StateProps) {
  const [state, setState] = useState<ButtonState>('idle')

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (state !== 'idle') return
      if (onClick) onClick(e)
      if (!onClickAsync) return

      setState('loading')
      try {
        await onClickAsync()
        setState('success')
      } catch {
        setState('idle')
        return
      }
    },
    [state, onClick, onClickAsync],
  )

  useEffect(() => {
    if (state !== 'success') return
    const timer = setTimeout(() => setState('idle'), successDuration)
    return () => clearTimeout(timer)
  }, [state, successDuration])

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all select-none focus-visible:outline-2 focus-visible:outline-offset-2'

  const variants = {
    gold: 'bg-gold-500 text-forest-950 hover:bg-gold-600 focus-visible:outline-gold-500 disabled:opacity-60',
    sage: 'bg-sage-400 text-forest-950 hover:bg-sage-500 focus-visible:outline-sage-400',
    ghost:
      'border border-sage-400/30 text-sage-400 hover:bg-sage-400/10 focus-visible:outline-sage-400',
  }

  const stateStyles = {
    idle: '',
    loading: 'opacity-80 cursor-wait',
    success: 'bg-sage-500 text-white scale-[1.02]',
  }

  const label =
    state === 'loading'
      ? (loadingLabel ?? children)
      : state === 'success'
        ? (successLabel ?? children)
        : children

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      aria-busy={state === 'loading'}
      aria-label={state === 'success' ? (successAriaLabel ?? undefined) : undefined}
      className={cn(
        base,
        variants[variant],
        stateStyles[state],
        'px-6 py-3 text-[0.9375rem]',
        className,
      )}
    >
      {state === 'loading' && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {state === 'success' && <Check className="w-4 h-4" aria-hidden="true" />}
      {label}
    </button>
  )
}

'use client'

import { useId, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FloatInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const FloatInput = forwardRef<HTMLInputElement, FloatInputProps>(
  ({ label, error, hint, className, id: externalId, ...props }, ref) => {
    const internalId = useId()
    const id = externalId ?? internalId
    const hintId = hint ? `${id}-hint` : undefined
    const errorId = error ? `${id}-error` : undefined
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          placeholder=" "
          className={cn(
            'peer block w-full rounded-xl border bg-transparent px-4 pb-3 pt-6',
            'text-[0.9375rem] text-ink dark:text-cream',
            'border-line dark:border-sage-800',
            'focus:outline-none focus:border-gold-500 dark:focus:border-gold-500',
            'transition-colors duration-200',
            error && 'border-copper focus:border-copper',
            className,
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute start-4 top-4',
            'text-[0.9375rem] text-mute dark:text-sage-600',
            'transform-gpu transition-all duration-200',
            'peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.9375rem]',
            'peer-focus:top-2 peer-focus:text-[0.6875rem] peer-focus:text-gold-600',
            'peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-[0.6875rem]',
            error && 'peer-focus:text-copper',
          )}
        >
          {label}
        </label>
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-copper ps-1">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-mute ps-1">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

FloatInput.displayName = 'FloatInput'

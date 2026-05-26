import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn()', () => {
  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })

  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })

  it('flattens conditional object syntax', () => {
    expect(cn({ 'font-bold': true, 'text-red-500': false })).toBe('font-bold')
  })
})

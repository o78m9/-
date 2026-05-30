'use client'

import { useEffect, useState, createContext, useContext, useCallback } from 'react'
import { track } from '@/lib/posthog'

interface CommandPaletteContextType {
  open: boolean
  setOpen: (v: boolean) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(null)

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpenState] = useState(false)

  const setOpen = useCallback((next: boolean) => {
    setOpenState((prev) => {
      // Only track on the false → true transition so toggling closed doesn't spam events.
      if (next && !prev) track('command_palette_open', { trigger: 'api' })
      return next
    })
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpenState((prev) => {
          if (!prev) track('command_palette_open', { trigger: 'keyboard' })
          return !prev
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext)
  if (!ctx) throw new Error('useCommandPalette must be inside CommandPaletteProvider')
  return ctx
}

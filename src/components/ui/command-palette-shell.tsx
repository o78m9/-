'use client'

import { CommandPaletteProvider, useCommandPalette } from '@/hooks/use-command-palette'
import { CommandPalette } from './command-palette'

function PaletteRenderer() {
  const { open, setOpen } = useCommandPalette()
  return <CommandPalette open={open} onClose={() => setOpen(false)} />
}

export function CommandPaletteShell({ children }: { children: React.ReactNode }) {
  return (
    <CommandPaletteProvider>
      {children}
      <PaletteRenderer />
    </CommandPaletteProvider>
  )
}

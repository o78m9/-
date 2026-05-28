#!/usr/bin/env node
/**
 * Forbidden color guard — blocks commits that introduce light-theme violations
 * in dark-branded app pages.
 *
 * Exempt files: legal-layout, BookingModal, dashboard.tsx, dashboard-sidebar,
 * customer-list, segment-grid, step-segment (intentionally light-themed components).
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

const FORBIDDEN = [
  /\bstone-[1-9]/,   // light stone backgrounds/text
  /\bslate-[1-9]/,   // light slate backgrounds/text
  /\bbg-white(?!\/)/, // solid white bg (bg-white/N opacity variants are ok)
  /#FAFAF[0-9A-Fa-f]/, // near-white hex
]

const EXEMPT_PATTERNS = [
  /legal-layout/,
  /BookingModal/,
  /\/dashboard\.tsx$/,
  /dashboard-sidebar/,
  /customer-list/,
  /segment-grid/,
  /step-segment/,
  /\/legal\//,
  /prose-stone/,
]

const files = process.argv.slice(2)
let failed = false

for (const file of files) {
  const abs = resolve(file)

  if (EXEMPT_PATTERNS.some((p) => p.test(abs))) continue

  let content
  try {
    content = readFileSync(abs, 'utf-8')
  } catch {
    continue
  }

  const lines = content.split('\n')
  const violations = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Skip comment lines
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue

    for (const pattern of FORBIDDEN) {
      if (pattern.test(line)) {
        // Skip if it's a prose-stone class (intentional typography)
        if (/prose-stone/.test(line)) continue
        violations.push({ line: i + 1, text: line.trim() })
        break
      }
    }
  }

  if (violations.length > 0) {
    console.error(`\n🚫 BRAND VIOLATION in ${file}:`)
    for (const v of violations) {
      console.error(`  Line ${v.line}: ${v.text.substring(0, 120)}`)
    }
    failed = true
  }
}

if (failed) {
  console.error(
    '\n❌ Forbidden colors detected. Use brand tokens: #0A1F1C, #142B27, #D4A574, #7FB5A8, #F5EFE6, #8A9B95\n'
  )
  process.exit(1)
}

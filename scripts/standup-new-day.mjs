#!/usr/bin/env node
/**
 * standup-new-day.mjs
 *
 * Appends a new daily standup section to docs/standup.md for "today" (KSA local date).
 * Idempotent: if a section for today's date already exists, exits 0 with no change.
 *
 * Usage (from repo root):
 *   node scripts/standup-new-day.mjs
 *
 * Or pass an explicit ISO date (mostly for testing / catching up missed days):
 *   node scripts/standup-new-day.mjs 2026-07-01
 *
 * Behaviors:
 * - If the target date is a Friday in KSA → writes the "rest day" stub.
 * - If it's any other day → writes the standard template.
 * - If it's a Thursday → includes the weekly-retro slot.
 * - If the date section already exists in standup.md → exit 0, silent.
 *
 * Why a node script and not bash: cross-platform (the founder runs Windows; CI may run Linux),
 * and ISO date handling is simpler in JS without extra deps.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STANDUP_PATH = path.resolve(__dirname, '..', 'docs', 'standup.md')

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function getKsaDate(arg) {
  if (arg) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
      throw new Error(`Invalid date arg: "${arg}". Expected YYYY-MM-DD.`)
    }
    return arg
  }
  // KSA = UTC+3. Compute today's ISO date as it appears in Riyadh.
  const now = new Date()
  const ksaMs = now.getTime() + 3 * 60 * 60 * 1000
  return new Date(ksaMs).toISOString().slice(0, 10)
}

function dayOfWeekFromIso(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return DAY_NAMES[dt.getUTCDay()]
}

function buildSection(iso) {
  const day = dayOfWeekFromIso(iso)

  if (day === 'Friday') {
    return [
      `### ${iso} — Friday (rest day)`,
      '',
      '_KSA rest day. No customer touchpoints. Skip this entry entirely. Take the day._',
      '',
      '---',
      '',
    ].join('\n')
  }

  const lines = [
    `### ${iso} — ${day}`,
    '',
    '**Yesterday:**',
    '- ',
    '- ',
    '- ',
    '',
    '**Today:**',
    '- ',
    '- ',
    '- ',
    '',
    '**Blocker:** ',
    '',
    '**Metrics:** contacts: __ / meetings: __ / LOIs: __ / signed: __',
    '',
    '**Mood (1-10):** ',
    '',
  ]

  if (day === 'Thursday') {
    lines.push(
      '**Weekly retro (Thursday slot — 30 min):**',
      '- What worked:',
      '- What to cut next week:',
      '- One thing to keep:',
      '',
    )
  }

  lines.push('---', '')
  return lines.join('\n')
}

async function main() {
  const arg = process.argv[2]
  const iso = getKsaDate(arg)

  let existing
  try {
    existing = await fs.readFile(STANDUP_PATH, 'utf8')
  } catch (err) {
    console.error(`standup.md not found at ${STANDUP_PATH}. Aborting.`)
    process.exit(1)
  }

  const marker = `### ${iso} `
  if (existing.includes(marker)) {
    console.log(`standup-new-day: section for ${iso} already exists — no change.`)
    return
  }

  const section = buildSection(iso)
  // Append with a leading blank line if the file does not already end with one.
  const sep = existing.endsWith('\n\n') ? '' : existing.endsWith('\n') ? '\n' : '\n\n'
  await fs.writeFile(STANDUP_PATH, existing + sep + section, 'utf8')
  console.log(`standup-new-day: appended section for ${iso} (${dayOfWeekFromIso(iso)}).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

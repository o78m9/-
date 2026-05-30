#!/usr/bin/env node
/**
 * Apply a .sql migration file against $DATABASE_URL via Neon SDK.
 * Usage: node scripts/apply-migration.mjs supabase/migrations/002_audit_log.sql
 */
import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'node:fs'

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/apply-migration.mjs <path-to-sql>')
  process.exit(1)
}

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL not set')
  process.exit(1)
}

const sql = neon(url)
const raw = readFileSync(file, 'utf8')

// Strip line comments before splitting, otherwise a leading -- comment will
// be glued to the first statement and the filter will drop the whole block.
const ddl = raw
  .split('\n')
  .filter((l) => !l.trim().startsWith('--'))
  .join('\n')

const stmts = ddl
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0)

console.log(`Applying ${stmts.length} statements from ${file}`)
for (const s of stmts) {
  const head = s.split('\n')[0].slice(0, 80)
  process.stdout.write(`  ${head}... `)
  await sql(s)
  console.log('OK')
}
console.log('✅ Migration applied')

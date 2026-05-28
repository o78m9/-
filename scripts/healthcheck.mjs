#!/usr/bin/env node
/**
 * Post-deploy smoke test.
 * Usage: node scripts/healthcheck.mjs https://your-prod-url.vercel.app
 */

const BASE = process.argv[2] || 'http://localhost:3000'
const CHECKS = [
  { path: '/', expectStatus: 200, rejectString: 'حدث خطأ غير متوقع', label: 'Homepage' },
  { path: '/api/health', expectStatus: 200, expectJson: 'ok', label: 'Health API' },
  { path: '/dashboard', expectStatus: 200, rejectString: '__next_error__', label: 'Dashboard' },
  {
    path: '/dashboard/demo',
    expectStatus: 200,
    rejectString: '__next_error__',
    label: 'Demo dashboard',
  },
]

let failed = 0

for (const check of CHECKS) {
  const url = `${BASE}${check.path}`
  try {
    const res = await fetch(url, { redirect: 'follow' })
    const body = await res.text()

    if (res.status !== check.expectStatus) {
      console.error(`❌ ${check.label}: expected ${check.expectStatus}, got ${res.status}`)
      failed++
      continue
    }
    if (check.rejectString && body.includes(check.rejectString)) {
      console.error(`❌ ${check.label}: response contains "${check.rejectString}"`)
      failed++
      continue
    }
    if (check.expectJson) {
      try {
        const json = JSON.parse(body)
        if (json.status !== check.expectJson) {
          console.error(`❌ ${check.label}: json.status expected "${check.expectJson}", got "${json.status}"`)
          failed++
          continue
        }
      } catch {
        console.error(`❌ ${check.label}: response is not valid JSON`)
        failed++
        continue
      }
    }
    console.log(`✅ ${check.label}: ${res.status} OK`)
  } catch (err) {
    console.error(`❌ ${check.label}: fetch failed — ${err.message}`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n💥 ${failed} check(s) failed. Deploy blocked.`)
  process.exit(1)
} else {
  console.log('\n✅ All smoke tests passed.')
}

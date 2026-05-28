import { test, expect } from '@playwright/test'

/**
 * Smoke tests — run post-deploy against prod or local.
 * Critical: any failure here means the deploy is broken.
 */
test.describe('Smoke tests', () => {
  test('homepage loads without error page', async ({ page }) => {
    await page.goto('/')
    await expect(page).not.toHaveURL(/error/)
    // Must NOT show the Arabic error string
    await expect(page.getByText('حدث خطأ غير متوقع')).not.toBeVisible()
    // Must NOT have __next_error__ in DOM
    const errorEl = await page.$('#__next_error__')
    expect(errorEl).toBeNull()
  })

  test('homepage returns 200 and has content', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    // Hero heading visible
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('dashboard loads without 500', async ({ page }) => {
    const response = await page.goto('/dashboard')
    expect(response?.status()).not.toBe(500)
    await expect(page.getByText('حدث خطأ غير متوقع')).not.toBeVisible()
  })

  test('api/health returns 200 with ok status', async ({ page }) => {
    const response = await page.request.get('/api/health')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.status).toBe('ok')
  })

  test('no __next_error__ on homepage', async ({ page }) => {
    await page.goto('/')
    const html = await page.content()
    expect(html).not.toContain('__next_error__')
  })
})

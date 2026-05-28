import { test, expect } from '@playwright/test'

test.describe('Dashboard demo', () => {
  test('demo page loads without auth', async ({ page }) => {
    const response = await page.goto('/dashboard/demo')
    expect(response?.status()).toBeLessThan(500)
    await expect(page).not.toHaveURL(/error|500/)
  })

  test('demo page shows Arabic dashboard UI', async ({ page }) => {
    await page.goto('/dashboard/demo')
    // Should have some Arabic text indicating the dashboard content
    await expect(page.getByText(/عملاء|حملة|إيراد|لوحة/)).toBeVisible()
  })

  test('dashboard redirects unauthenticated users gracefully', async ({ page }) => {
    // /dashboard without auth should not crash (try/catch in server component)
    const response = await page.goto('/dashboard')
    expect(response?.status()).not.toBe(500)
  })

  test('demo page has dark brand background', async ({ page }) => {
    await page.goto('/dashboard/demo')
    const body = page.locator('body')
    // Should not have white/light background (brand is dark)
    const bg = await body.evaluate((el) => window.getComputedStyle(el).backgroundColor)
    // rgb(255, 255, 255) = pure white — not allowed
    expect(bg).not.toBe('rgb(255, 255, 255)')
  })
})

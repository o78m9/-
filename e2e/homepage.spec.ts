import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads with dark background and Arabic hero text', async ({ page }) => {
    await expect(page).toHaveTitle(/عودة|Awdah/i)

    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()

    // Arabic headline present
    await expect(page.getByText(/عملاءك/)).toBeVisible()
  })

  test('header renders logo and CTA', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByText(/عَودة/)).toBeVisible()
    await expect(header.getByRole('button', { name: /احجز/ })).toBeVisible()
  })

  test('pricing section visible and has plan cards', async ({ page }) => {
    await page.locator('#pricing').scrollIntoViewIfNeeded()
    await expect(page.locator('#pricing')).toBeVisible()
    // At least one pricing card with a CTA
    await expect(page.locator('#pricing').getByRole('button').first()).toBeVisible()
  })

  test('health API returns ok', async ({ page }) => {
    const response = await page.request.get('/api/health')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.status).toBe('ok')
    expect(body.timestamp).toBeTruthy()
  })

  test('navigation links resolve without 404', async ({ page }) => {
    const links = ['/about', '/campaigns', '/login', '/signup']
    for (const href of links) {
      const res = await page.request.get(href)
      expect(res.status(), `${href} returned ${res.status()}`).toBeLessThan(500)
    }
  })
})

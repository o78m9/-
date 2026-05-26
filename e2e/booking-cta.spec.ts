import { test, expect } from '@playwright/test'

test.describe('Booking CTA flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('hero CTA opens booking modal', async ({ page }) => {
    // Hero section has the primary "احجز عرض" button
    const heroBtn = page.getByRole('button', { name: /احجز/ }).first()
    await heroBtn.click()

    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(modal.getByRole('heading', { name: /احجز عرضك/ })).toBeVisible()
  })

  test('modal closes on Escape key', async ({ page }) => {
    await page.getByRole('button', { name: /احجز/ }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })

  test('modal closes on backdrop click', async ({ page }) => {
    await page.getByRole('button', { name: /احجز/ }).first().click()
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()

    // Click outside the modal panel (the backdrop)
    await page.mouse.click(10, 10)
    await expect(modal).not.toBeVisible()
  })

  test('header CTA opens booking modal', async ({ page }) => {
    const headerBtn = page.locator('header').getByRole('button', { name: /احجز/ })
    await headerBtn.click()

    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('pricing CTA opens booking modal', async ({ page }) => {
    // Scroll to pricing section and click its CTA
    await page.locator('#pricing').scrollIntoViewIfNeeded()
    const pricingBtn = page.locator('#pricing').getByRole('button', { name: /احجز|ابدأ/ }).first()
    await pricingBtn.click()

    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('final CTA section opens booking modal', async ({ page }) => {
    // Scroll to the final CTA section
    const ctaSection = page.locator('section').filter({ hasText: /احجز عرضك/ }).last()
    await ctaSection.scrollIntoViewIfNeeded()
    const ctaBtn = ctaSection.getByRole('button', { name: /احجز/ }).first()
    await ctaBtn.click()

    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('booking form validates required fields', async ({ page }) => {
    await page.getByRole('button', { name: /احجز/ }).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()

    // Submit empty form
    await page.getByRole('button', { name: /احجز عرضي/ }).click()

    // Validation errors should appear
    await expect(page.getByText('الاسم مطلوب')).toBeVisible()
    await expect(page.getByText('اسم العيادة مطلوب')).toBeVisible()
  })
})

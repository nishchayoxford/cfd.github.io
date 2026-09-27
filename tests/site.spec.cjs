const { test, expect } = require('@playwright/test');

test('research identity and publications remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nishchay Tiwari');
  await expect(page.locator('#research')).toBeVisible();
  await expect(page.locator('#research')).toContainText('Multiphase Numerical Modelling of Scour Processes in Wave-Current Environments');
  await expect(page.locator('a[href="https://doi.org/10.1680/jmaen.26.00007"]').first()).toBeVisible();
  await expect(page.locator('.publication:visible')).toHaveCount(7);
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await expect(page.locator('#experience')).toContainText('PhD');
  await context.close();
});

test('publication filters show matching records and announce accurate totals', async ({ page }) => {
  await page.goto('/');
  const records = page.locator('.publication:visible');
  await expect(records).toHaveCount(7);
  await page.getByRole('button', { name: 'Journal articles', exact: true }).click();
  await expect(records).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Journal articles', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('status')).toHaveText('3 journal articles');
  await page.getByRole('button', { name: 'Conferences', exact: true }).click();
  await expect(records).toHaveCount(3);
  await expect(page.getByRole('status')).toHaveText('3 conference contributions');
  await page.getByRole('button', { name: 'Thesis', exact: true }).click();
  await expect(records).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveText('1 thesis');
  await page.getByRole('button', { name: 'All work', exact: true }).click();
  await expect(records).toHaveCount(7);
  await expect(page.getByRole('status')).toHaveText('7 selected works');
});

test('mobile navigation opens by keyboard, closes on Escape and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).not.toBeVisible();
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(navigation).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(navigation).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await navigation.getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page).toHaveURL(/#research$/);
  await expect(navigation).not.toBeVisible();
});

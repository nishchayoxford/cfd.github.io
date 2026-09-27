const { test, expect } = require('@playwright/test');

test('the supplied design presents Nishchay and his computational work', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Nishchay Tiwari', exact: true })).toBeVisible();
  await expect(page.getByText('Modelling physics.')).toBeVisible();
  await expect(page.getByText('Learning from data.')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Erwin Lejeune');
  await expect(page.locator('body')).not.toContainText('Robot Autonomy');
  const style = await page.locator('body').evaluate(el => ({background:getComputedStyle(el).backgroundColor, font:getComputedStyle(el).fontFamily}));
  expect(style.background).toBe('rgb(18, 20, 27)');
  expect(style.font).toContain('Inter');
});

test('background and the full career record are readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('./');
  await expect(page.locator('#about')).toContainText('Python');
  await expect(page.locator('#experience')).toContainText('HR Wallingford');
  await expect(page.locator('#experience')).toContainText('Kamstrup');
  await expect(page.locator('#experience')).toContainText('von Karman');
  await expect(page.locator('#education')).toContainText('Politecnico di Milano');
  await expect(page.locator('#contact a[href^="mailto:"]').first()).toBeVisible();
  await context.close();
});

test('the career timeline supports keyboard selection and keeps roles aligned', async ({ page }) => {
  await page.goto('./');
  const first = page.getByRole('tab', { name: 'Research Scientist at HR Wallingford', exact: true });
  await expect(first).toBeVisible();
  await first.focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Fluid Dynamics Research Intern at Kamstrup', exact: true })).toBeFocused();
  await expect(page.locator('#role-panel-4')).toBeVisible();
  await expect(page.locator('#role-panel-0')).toBeHidden();
  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
  await expect(page.locator('#role-panel-0')).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#role-panel-1')).toBeVisible();
});

test('published research links to verified DOI records', async ({ page }) => {
  await page.goto('./');
  const pubs = page.locator('#publications');
  await expect(pubs.locator('.publication')).toHaveCount(4);
  await expect(pubs.getByRole('link', { name: /Numerical prediction of local scour/ })).toHaveAttribute('href', 'https://doi.org/10.1680/jmaen.26.00007');
  await expect(pubs).toContainText('Proceedings chapter');
  await expect(pubs).toContainText('Journal article');
  await expect(pubs).toContainText('2026');
});

test('the public résumé contains evidence and prints without navigation', async ({ page }) => {
  await page.goto('resume/');
  await expect(page.getByRole('heading', { name: 'Nishchay Tiwari', exact: true })).toBeVisible();
  await expect(page.locator('.resume-document')).toContainText('PhD research');
  await expect(page.locator('.resume-document')).toContainText('Black-box optimisation');
  await expect(page.locator('body')).not.toContainText(/quantitative finance|quant researcher|\+44/i);
  await expect(page.getByRole('button', { name: 'Print / save PDF' })).toBeVisible();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Print / save PDF' })).toBeHidden();
  await expect(page.locator('.resume-document')).toBeVisible();
});

test('selected work opens a complete optimisation case study', async ({ page }) => {
  await page.goto('./');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Black-box optimisation', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Read the optimisation case study' }).click();
  await expect(page).toHaveURL(/\/cfd.github.io\/work\/black-box-optimisation\/$/);
  await expect(page.getByRole('heading', { name: 'Learning where to look next.', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'A policy that evolved with the evidence' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore the capstone repository' })).toHaveAttribute('href', 'https://github.com/nishchayoxford/bbo-capstone-imperial');
});

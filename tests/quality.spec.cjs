const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');

test('social preview is a real 1200 by 630 local image with canonical metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://nishchayoxford.github.io/cfd.github.io/');
  const image = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(image).toBe('https://nishchayoxford.github.io/cfd.github.io/assets/social-preview.png');
  const response = await page.request.get('/assets/social-preview.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const dimensions = await page.evaluate(async () => {
    const image = new Image();
    image.src = 'assets/social-preview.png';
    await image.decode();
    return [image.naturalWidth, image.naturalHeight];
  });
  expect(dimensions).toEqual([1200, 630]);
  const person = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(person.name).toBe('Nishchay Tiwari');
  expect(person.jobTitle).toContain('candidate');
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

for (const width of [390, 1440]) {
  test(`automated WCAG 2.2 AA checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(audit.violations).toEqual([]);
  });
}

test('all internal anchors and local assets resolve without browser errors or third-party requests', async ({ page }) => {
  const errors = [];
  const failedResources = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failedResources.push(response.url()); });
  page.on('request', request => {
    if (new URL(request.url()).hostname !== '127.0.0.1') externalRequests.push(request.url());
  });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute('href')).filter(href => !document.getElementById(href.slice(1))));
  expect(invalidAnchors).toEqual([]);
  const invalidAssets = await page.locator('link[rel="stylesheet"], link[rel="icon"], link[rel="preload"], script[src], img[src]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href') || node.getAttribute('src')).filter(url => url.startsWith('/') || url.includes('://')));
  expect(invalidAssets).toEqual([]);
  expect(errors).toEqual([]);
  expect(failedResources).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('keyboard skip link focuses the main content and reduced motion is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});

test('each selected publication has a unique real source link and no private source material is embedded', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('.publication h3 a').evaluateAll(nodes => nodes.map(node => node.href));
  expect(links.length).toBe(7);
  expect(new Set(links).size).toBe(7);
  expect(links.filter(link => link.startsWith('https://doi.org/')).length).toBe(4);
  for (const file of ['index.html', 'script.js', 'style.css']) {
    const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    expect(source).not.toMatch(/\/home\/|file:\/\/|\+44[ ()\d-]{8,}|api[_-]?key|<canvas|Math\.random/);
  }
});

test('mobile navigation resets when changing to desktop and back', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole('button', { name: 'Menu', exact: true, includeHidden: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).not.toBeVisible();
});

test('contact information retains accessible contrast in print', async ({ page }) => {
  await page.emulateMedia({ media: 'print' });
  await page.goto('/');
  const audit = await new AxeBuilder({ page }).include('#contact').withTags(['wcag2aa']).analyze();
  expect(audit.violations).toEqual([]);
});

test('printing restores every publication after filtering', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Thesis', exact: true }).click();
  await expect(page.locator('.publication:visible')).toHaveCount(1);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.publication:visible')).toHaveCount(7);
  await expect(page.getByRole('status')).not.toBeVisible();
});

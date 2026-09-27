const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

for (const route of ['', 'work/black-box-optimisation/', 'work/flow-lab/', 'resume/']) {
  test(`accessible production page: ${route || 'home'}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route || './');
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}

for (const width of [320, 390, 768, 1280, 1920]) {
  test(`responsive content at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('./');
    const overflow = await page.evaluate(() => ({width:innerWidth,document:document.documentElement.scrollWidth}));
    expect(overflow.document).toBeLessThanOrEqual(width);
    await expect(page.getByRole('heading',{name:'Nishchay Tiwari',exact:true})).toBeVisible();
    const oversized = await page.locator('main h1, main h2, main h3, main p, main video').evaluateAll(elements => elements.filter(el=>el.getBoundingClientRect().right>innerWidth+1).map(el=>el.textContent?.slice(0,80)));
    expect(oversized).toEqual([]);
  });
}

test('the social sharing image is served at the project base', async ({request}) => {
  const response=await request.get('social-preview.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
});

test('mobile navigation works by keyboard and returns focus on Escape', async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('./');
  const summary=page.locator('#mobile-nav summary');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(summary).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#mobile-links')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-links a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(summary).toBeFocused();
  await expect(summary).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#mobile-links')).toBeHidden();
  await summary.click(); await page.locator('#mobile-links a').filter({hasText:'publications'}).click();
  await expect(summary).toHaveAttribute('aria-expanded','false');
  await expect(page).toHaveURL(/#publications$/);
});

test('mobile navigation and content work without JavaScript', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto('./');
  await page.locator('#mobile-nav summary').click();
  await expect(page.locator('#mobile-links')).toBeVisible();
  await expect(page.locator('.role-panel')).toHaveCount(5);
  for (const panel of await page.locator('.role-panel').all()) await expect(panel).toBeVisible();
  await context.close();
});

test('all local navigation is scoped to the project base', async ({page}) => {
  await page.goto('./');
  const localLinks=await page.locator('a[href]').evaluateAll(links => links.map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')));
  expect(localLinks.length).toBeGreaterThan(10);
  expect(localLinks.every(h=>h.startsWith('/cfd.github.io/'))).toBe(true);
  const canonical=await page.locator('link[rel=canonical]').getAttribute('href');
  expect(canonical).toBe('https://nishchayoxford.github.io/cfd.github.io/');
});

test('the printed résumé retains readable text contrast', async ({page}) => {
  await page.goto('resume/');
  await page.emulateMedia({media:'print',reducedMotion:'reduce'});
  const result=await new AxeBuilder({page}).include('.resume-document').withTags(['wcag2aa']).analyze();
  expect(result.violations).toEqual([]);
});

test('print keeps every research appointment available', async ({page}) => {
  await page.goto('./');
  await page.emulateMedia({media:'print',reducedMotion:'reduce'});
  for(const panel of await page.locator('.role-panel').all()) await expect(panel).toBeVisible();
  await expect(page.locator('.site-header')).toBeHidden();
});

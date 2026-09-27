const { test, expect } = require('@playwright/test');

test('the capstone explorer uses real returns and keeps the setback visible', async ({page}) => {
  await page.goto('work/black-box-optimisation/');
  const explorer = page.locator('#outcome-explorer');
  await expect(explorer).toBeVisible();
  await expect(explorer.locator('[data-return]')).toHaveText('910.48');
  await page.getByLabel('Recorded round').fill('7');
  await expect(explorer.locator('[data-return]')).toHaveText('283.76');
  await expect(explorer.locator('[data-best]')).toHaveText('365.66');
  await page.getByLabel('Objective function').selectOption('F2');
  await expect(explorer.locator('[data-dimensions]')).toHaveText('2 dimensions');
  await expect(explorer.locator('tbody tr')).toHaveCount(13);
  await expect(explorer.locator('svg')).toHaveAttribute('aria-label', /F2.*round 7/);
});

test('project films play on demand with the real encoded duration', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  const film=page.locator('.film').first();
  const video=film.locator('video');
  await expect(film.getByRole('button',{name:/Play Black-box optimisation/})).toBeVisible();
  await film.getByRole('button',{name:/Play Black-box optimisation/}).click();
  await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate(v=>v.duration)).toBe(30);
  expect(await video.evaluate(v=>v.videoWidth)).toBe(1920);
  expect(await video.evaluate(v=>v.controls)).toBe(true);
  expect(await video.evaluate(v=>v.error)).toBeNull();
});

test('the hero keeps motion opt-in for reduced motion and can be played and paused', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  const video=page.locator('#hero-flow');
  await expect(video).toHaveCount(1);
  expect(await video.getAttribute('src')).toBeNull();
  await page.getByRole('button',{name:'Play motion',exact:true}).click();
  await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Pause motion',exact:true}).click();
  expect(await video.evaluate(v=>v.paused)).toBe(true);
});

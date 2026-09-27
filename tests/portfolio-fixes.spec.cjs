const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const semver = require('semver');

test('documented Node minimum satisfies the locked dependency graph', () => {
  const manifest = require('../package.json');
  const lock = require('../package-lock.json');
  const minimum = semver.minVersion(manifest.engines.node).version;
  const supports = (allowed, value) => !allowed || (!allowed.includes(`!${value}`) && (allowed.includes(value) || allowed.every(item => item.startsWith('!'))));
  const incompatible = Object.entries(lock.packages).filter(([name, pkg]) => name && pkg.engines?.node
    && (!pkg.optional || (supports(pkg.os, process.platform) && supports(pkg.cpu, process.arch))))
    .filter(([, pkg]) => !semver.satisfies(minimum, pkg.engines.node))
    .map(([name, pkg]) => `${name}@${pkg.version}: ${pkg.engines.node}`);
  expect(incompatible).toEqual([]);
  expect(lock.packages[''].engines).toEqual(manifest.engines);
  expect(fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8')).toContain(`Node.js ${minimum}`);
});

for (const [route, name] of [['black-box-optimisation', 'optimisation'], ['flow-lab', 'flow']]) {
  test(`${name} film exposes recovery after a source MP4 returns 404`, async ({ page }) => {
    let unavailable = true;
    await page.route(`**/media/${name}-film.mp4`, route => unavailable
      ? route.fulfill({ status: 404, contentType: 'text/plain', body: 'Unavailable' })
      : route.continue());
    await page.goto(`work/${route}/`);
    const film = page.locator('.film');
    const video = film.locator('video');
    const failed = page.waitForResponse(response => response.url().endsWith(`${name}-film.mp4`) && response.status() === 404);
    await film.getByRole('button', { name: /^Play / }).click();
    await failed;
    await expect(film.getByRole('status')).toBeVisible();
    await expect(film.getByRole('status')).toContainText('Playback is unavailable');
    await expect(film.getByRole('link', { name: /Open the MP4 directly/ })).toHaveAttribute('href', new RegExp(`/media/${name}-film\\.mp4$`));
    const retry = film.getByRole('button', { name: /^Retry / });
    await expect(retry).toBeVisible();
    unavailable = false;
    await retry.click();
    await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(0);
    expect(await video.evaluate(v => ({ paused: v.paused, width: v.videoWidth, error: v.error }))).toEqual({ paused: false, width: 1920, error: null });
    await expect(film.getByRole('status')).toBeHidden();
    await expect(retry).toBeHidden();
  });
}

for (const width of [1440, 390]) {
  for (const [route, name] of [['black-box-optimisation', 'optimisation'], ['flow-lab', 'flow']]) {
    test(`${name} captions use the safe upper band at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`work/${route}/`);
      const film = page.locator('.film');
      const video = film.locator('video');
      await film.getByRole('button', { name: /^Play / }).click();
      await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(0);
      await video.evaluate(v => { v.pause(); v.textTracks[0].mode = 'showing'; v.currentTime = 16.2; });
      await expect.poll(() => video.evaluate(v => v.textTracks[0].activeCues?.length || 0)).toBeGreaterThan(0);
      await expect.poll(() => video.evaluate(v => v.seeking)).toBe(false);
      const cues = await video.evaluate(v => Array.from(v.textTracks[0].cues).map(cue => ({ line: cue.line, text: cue.text })));
      expect(cues.length).toBe(name === 'flow' ? 3 : 4);
      for (const cue of cues) {
        expect(cue.line).toBe(0);
        expect(cue.text.length).toBeGreaterThan(40);
      }
      await film.evaluate(el => scrollTo({ top: scrollY + el.getBoundingClientRect().top - 90, behavior: 'instant' }));
      // Check native cue glyph bounds too: percentage lines can disable Chrome's wrapping.
      const client = await page.context().newCDPSession(page);
      const { root } = await client.send('DOM.getDocument', { depth: -1, pierce: true });
      const nodes = [];
      const visit = node => { nodes.push(node); [...node.children || [], ...node.shadowRoots || []].forEach(visit); };
      visit(root);
      const nativeCues = nodes.filter(node => node.attributes?.some((value, i, attrs) => value === 'pseudo' && attrs[i+1] === 'cue'));
      expect(nativeCues.length).toBeGreaterThan(0);
      const box = await video.boundingBox();
      for (const cue of nativeCues) {
        const { object } = await client.send('DOM.resolveNode', { backendNodeId: cue.backendNodeId });
        // Chromium 153 reports an inline cue rect beyond its native visible line box.
        // The native display block has stable bounds in both 153 and 154. Keep horizontal
        // bounds to catch truncated long cues, and use the display block for vertical safety.
        const { result } = await client.send('Runtime.callFunctionOn', { objectId: object.objectId, functionDeclaration: 'function() { const b=this.getBoundingClientRect(), line=this.parentElement.getBoundingClientRect(); return {left:b.left,right:b.right,top:line.top,bottom:line.bottom,container:this.parentElement.getAttribute("pseudo")}; }', returnByValue: true });
        expect(result.value.container).toBe('-webkit-media-text-track-display');
        expect(result.value.left).toBeGreaterThanOrEqual(box.x);
        expect(result.value.right).toBeLessThanOrEqual(box.x + box.width);
        expect(result.value.top).toBeGreaterThanOrEqual(box.y);
        expect(result.value.bottom).toBeLessThanOrEqual(box.y + box.height * .15);
      }
      await client.detach();
      const screenshot = testInfo.outputPath(`${name}-captions-${width}.png`);
      await page.screenshot({ path: screenshot });
      await testInfo.attach('captioned-film', { path: screenshot, contentType: 'image/png' });
    });
  }
}

for (const javaScriptEnabled of [true, false]) {
  test(`explorer intro identifies its worked F5 example with JavaScript ${javaScriptEnabled}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ baseURL, javaScriptEnabled });
    const page = await context.newPage();
    await page.goto('work/black-box-optimisation/');
    if (javaScriptEnabled) await page.getByLabel('Objective function').selectOption('F1');
    await expect(page.locator('.outcome-intro')).toContainText('Worked example: F5.');
    await expect(page.locator('.outcome-intro')).toBeVisible();
    if (!javaScriptEnabled) {
      await page.getByText('Read the values as a table', { exact: true }).click();
      await expect(page.locator('.outcome-table tbody tr')).toHaveCount(13);
    }
    await context.close();
  });
}

for (const width of [1440, 390]) {
  for (const [route, name] of [['./', 'optimisation'], ['./', 'flow'], ['work/black-box-optimisation/', 'optimisation'], ['work/flow-lab/', 'flow']]) {
    test(`${name} film pauses offscreen without resuming: ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route);
      const film = page.locator(`.film:has(source[src$="/${name}-film.mp4"])`);
      const video = film.locator('video');
      expect(await video.evaluate(v => v.paused && v.currentTime === 0)).toBe(true);
      await film.getByRole('button', { name: /^Play / }).click();
      await expect.poll(() => video.evaluate(v => v.currentTime)).toBeGreaterThan(0.2);
      expect(await video.evaluate(v => !v.paused && v.videoWidth === 1920)).toBe(true);
      await page.locator('.site-footer').scrollIntoViewIfNeeded();
      expect(await video.evaluate(v => v.getBoundingClientRect().bottom)).toBeLessThan(0);
      await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
      const pausedAt = await video.evaluate(v => v.currentTime);
      await page.waitForTimeout(350); // Compare two real playback-clock samples offscreen.
      expect(await video.evaluate(v => v.currentTime)).toBe(pausedAt);
      await video.scrollIntoViewIfNeeded();
      await page.waitForTimeout(350); // Returning into view must not restart a user-controlled film.
      expect(await video.evaluate(v => ({ paused: v.paused, time: v.currentTime }))).toEqual({ paused: true, time: pausedAt });
      await expect(film.locator('.film-error')).toBeHidden();
    });
  }
}

for (const width of [1440, 768, 390, 320]) {
  test(`chart ticks stay readable and unclipped at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('work/black-box-optimisation/');
    await page.evaluate(() => document.fonts.ready);
    const chart = page.locator('.outcome-chart');
    for (const objective of ['F1', 'F5']) {
      await page.getByLabel('Objective function').selectOption(objective);
      for (const round of ['1', '7', '13']) {
        await page.getByLabel('Recorded round').fill(round);
        const layout = await chart.evaluate(svg => {
          const bounds = svg.getBoundingClientRect();
          const labels = Array.from(svg.querySelectorAll('text')).filter(text => getComputedStyle(text).display !== 'none').map(text => {
            const box = text.getBoundingClientRect();
            const transform = text.getScreenCTM();
            return { text: text.textContent, left: box.left - bounds.left, right: box.right - bounds.left, top: box.top - bounds.top, bottom: box.bottom - bounds.top, size: parseFloat(getComputedStyle(text).fontSize) * Math.hypot(transform.a, transform.b) };
          });
          return { width: bounds.width, height: bounds.height, labels };
        });
        for (const label of layout.labels) {
          expect(label.size, `${objective} ${label.text} font size`).toBeGreaterThanOrEqual(12);
          expect(label.left, `${objective} ${label.text} leading digits/sign`).toBeGreaterThanOrEqual(0);
          expect(label.right).toBeLessThanOrEqual(layout.width);
          expect(label.top).toBeGreaterThanOrEqual(0);
          expect(label.bottom).toBeLessThanOrEqual(layout.height);
        }
        expect(layout.height).toBeGreaterThanOrEqual(260);
        for (let i = 0; i < layout.labels.length; i++) {
          for (const other of layout.labels.slice(i + 1)) {
            const label = layout.labels[i];
            expect(label.right <= other.left || other.right <= label.left || label.bottom <= other.top || other.bottom <= label.top, `${label.text} overlaps ${other.text}`).toBe(true);
          }
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    }
  });
}

test('responsive chart preserves archived coordinates and raw scales on resize', async ({ page }) => {
  const archive = require('../src/data/capstone.json');
  const score = value => value !== 0 && (Math.abs(value) < .001 || Math.abs(value) >= 1e6) ? value.toExponential(2) : value.toFixed(2);
  await page.goto('work/black-box-optimisation/');
  const chart = page.locator('.outcome-chart');
  for (const width of [1440, 390, 320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => chart.evaluate(svg => Math.abs(svg.viewBox.baseVal.width - svg.getBoundingClientRect().width))).toBeLessThan(.1);
    for (const series of archive.functions) {
      await page.getByLabel('Objective function').selectOption(series.id);
      const min = Math.min(...series.observed), max = Math.max(...series.observed);
      const range = max - min || Math.abs(max) || 1;
      const low = min - range * .1, high = max + range * .1;
      const plotted = await chart.evaluate(svg => ({
        height: svg.viewBox.baseVal.height,
        dots: Array.from(svg.querySelectorAll('circle')).map(dot => ({ y: Number(dot.getAttribute('cy')), title: dot.textContent })),
        ticks: Array.from(svg.querySelectorAll('.chart-y-tick text')).map(tick => tick.textContent),
      }));
      expect(plotted.ticks).toEqual([0, .25, .5, .75, 1].map(fraction => score(low + (high - low) * fraction)));
      expect(plotted.dots).toHaveLength(13);
      for (const [i, dot] of plotted.dots.entries()) {
        expect(dot.title).toBe(`Round ${i+1}: ${score(series.observed[i])}`);
        expect((plotted.height - 46 - dot.y) / (plotted.height - 70)).toBeCloseTo((series.observed[i] - low) / (high - low), 12);
      }
    }
  }
});

test('printing unscrolled home reveals every section without motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  await expect(page.locator('html')).toHaveClass(/reveal-ready/);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect(await page.locator('[data-reveal]:not(.is-visible)').count()).toBeGreaterThan(0);
  await page.emulateMedia({ media: 'print' });
  const hidden = await page.locator('[data-reveal]').evaluateAll(elements => elements.filter(el => {
    const style = getComputedStyle(el);
    return style.opacity !== '1' || style.transform !== 'none' || style.transitionDuration !== '0s';
  }).map(el => el.textContent.trim().slice(0,80)));
  expect(hidden).toEqual([]);
});

test('print omits film play controls alongside the videos', async ({ page }) => {
  await page.goto('./');
  await page.emulateMedia({ media: 'print', reducedMotion: 'no-preference' });
  for (const film of await page.locator('.film').all()) {
    await expect(film.locator('video')).toBeHidden();
    await expect(film.locator('.film-play')).toBeHidden();
    await expect(film.locator('figcaption')).toBeVisible();
  }
});

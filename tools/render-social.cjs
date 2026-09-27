const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const root = path.resolve(__dirname, '..');
  const serif = (await fs.readFile(path.join(root, 'assets/fonts/InstrumentSerif-Regular.ttf'))).toString('base64');
  const sans = (await fs.readFile(path.join(root, 'assets/fonts/Manrope.ttf'))).toString('base64');
  const home = await fs.readFile(path.join(root, 'index.html'), 'utf8');
  const art = home.match(/<svg class="flow-art"[\s\S]*?<\/svg>/)?.[0];
  if (!art) throw new Error('The homepage flow illustration was not found.');
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
    : {});
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html lang="en"><head><meta charset="UTF-8"><style>
      @font-face { font-family: Serif; src: url(data:font/ttf;base64,${serif}); }
      @font-face { font-family: Sans; src: url(data:font/ttf;base64,${sans}); }
      * { box-sizing: border-box; } body { margin: 0; background: #f7f6f1; color: #19383a; font-family: Sans, sans-serif; }
      main { display: grid; grid-template-columns: 1.2fr 1fr; gap: 55px; padding: 62px; height: 630px; }
      .eyebrow { font-size: 12px; letter-spacing: 2px; margin: 0 0 35px; }
      h1 { font: 116px/.92 Serif, serif; letter-spacing: -4px; margin: 0 0 32px; }
      .description { font-size: 23px; line-height: 1.5; margin: 0; }
      .footer { font-size: 12px; margin-top: 35px; color: #566565; }
      .visual { background: #123e43; display: flex; align-items: center; } svg { width: 100%; }
    </style></head><body><main><div><p class="eyebrow">COMPUTATIONAL FLUID DYNAMICS</p><h1>Nishchay<br>Tiwari</h1><p class="description">Coastal scour. Multiphase flow.<br>From the airfoil to the seabed.</p><p class="footer">HR Wallingford · The Open University</p></div><div class="visual">${art}</div></main></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const output = path.join(root, 'assets/social-preview.png');
    await page.screenshot({ path: output });
    console.log(`Rendered ${output} (1200 × 630)`);
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

const {chromium} = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const encoded = file => fs.readFileSync(path.join(root,file)).toString('base64');
(async()=>{
 const browser = await chromium.launch({headless:true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
 try {
  const page = await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await page.setContent(`<!doctype html><html><head><meta charset="UTF-8"><style>
  @font-face{font-family:Inter;src:url(data:font/woff2;base64,${encoded('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')})} @font-face{font-family:Space;src:url(data:font/woff2;base64,${encoded('node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2')})}
  *{box-sizing:border-box}body{margin:0;background:#12141b;color:#e8eaf0;font-family:Inter;padding:50px 58px;width:1200px;height:630px}.top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #2c3040;padding-bottom:24px;font-size:14px;color:#aeb3c2}.monogram{font-family:Space;font-size:34px;font-weight:600;color:#e8eaf0}.monogram em{font-style:normal;color:#a0a9ff}.content{display:grid;grid-template-columns:1fr 440px;gap:40px;align-items:center;margin-top:54px}h1{font-family:Space;font-size:57px;letter-spacing:-2px;margin:0 0 20px;line-height:1.1}h2{font-size:30px;font-weight:500;line-height:1.4;margin:0}h2 span{color:#a0a9ff}.work{font-size:17px;color:#aeb3c2;margin-top:25px}img{width:440px;height:247.5px;object-fit:contain;border:1px solid #2c3040}.bottom{position:absolute;bottom:42px;font-size:14px;color:#aeb3c2;letter-spacing:2px}
  </style></head><body><div class="top"><span class="monogram">n<em>.</em>t</span><span>nishchayoxford.github.io/cfd.github.io</span></div><div class="content"><div><h1>Nishchay Tiwari</h1><h2>Modelling physics.<br><span>Learning from data.</span></h2><p class="work">Computational science · Python · AI / ML</p></div><img src="data:image/webp;base64,${encoded('public/media/hero-poster.webp')}" alt="Computed cylinder wake"></div><div class="bottom">RESEARCH & COMPUTATIONAL EXPERIMENTS</div></body></html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('img').evaluate(image=>image.decode());
  await page.screenshot({path:path.join(root,'public/social-preview.png')});
  console.log('Created public/social-preview.png (1200 × 630)');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const source = require('../src/data/capstone.json');

test('all objective tables match the recorded archive', async ({page})=>{
 await page.goto('work/black-box-optimisation/');
 await page.getByText('Read the values as a table',{exact:true}).click();
 const fmt = value => value!==0 && (Math.abs(value)<.001 || Math.abs(value)>=1e6) ? value.toExponential(2) : value.toFixed(2);
 for(const series of source.functions){
  await page.getByLabel('Objective function').selectOption(series.id);
  const rows=await page.locator('.outcome-table tbody tr').evaluateAll(rows=>rows.map(r=>Array.from(r.querySelectorAll('td')).map(c=>c.textContent)));
  expect(rows).toEqual(series.observed.map((v,i)=>[fmt(v),fmt(series.best_so_far[i])]));
 }
});

test('case study charts and controls stay within a narrow viewport',async({page})=>{
 await page.setViewportSize({width:320,height:750});
 await page.goto('work/black-box-optimisation/');
 await page.getByText('Read the values as a table',{exact:true}).click();
 await page.getByLabel('Objective function').selectOption('F1');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('the outcome table and native video controls work without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});
 const page=await context.newPage();
 await page.goto('work/black-box-optimisation/');
 await expect(page).toHaveURL(new URL('work/black-box-optimisation/',baseURL).href);
 await page.getByText('Read the values as a table',{exact:true}).click();
 await expect(page.locator('.outcome-table tbody tr')).toHaveCount(13);
 await expect(page.getByLabel('Objective function')).toBeHidden();
 expect(await page.locator('.film video').evaluate(v=>v.controls)).toBe(true);
 await context.close();
});

test('both reproduction downloads are real ZIP archives',async({request})=>{
 for(const name of ['flow-study.zip','optimisation-study.zip']){
  const response=await request.get(`downloads/${name}`);
  expect(response.status()).toBe(200);
  const bytes=await response.body();
  expect(bytes.subarray(0,4).toString('hex')).toBe('504b0304');
  expect(bytes.length).toBeGreaterThan(10000);
 }
});

test('every internal page, poster, film, track and download resolves',async({page,request})=>{
 const references=new Set();
 for(const route of ['./','work/black-box-optimisation/','work/flow-lab/','resume/']){
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(route);
  const urls=await page.evaluate(()=>{
   const nodes=Array.from(document.querySelectorAll('[href],[src],[poster],[data-src]'));
   return nodes.flatMap(node=>['href','src','poster','data-src'].map(attr=>node.getAttribute(attr)).filter(Boolean).map(value=>new URL(value,location.href)).filter(url=>url.origin===location.origin).map(url=>url.origin+url.pathname));
  });
  for(const url of urls) references.add(url);
 }
 for(const url of references){ const response=await request.get(url); expect(response.status(),url).toBe(200); }
});

test('published build excludes private source documents and local paths',async()=>{
 const root=path.join(__dirname,'../dist');
 const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
 const files=walk(root);
 const privateNames=files.filter(name=>/v4-master|bbo-capstone-imperial-main|Nishchay_Tiwari_GR|Full CV|\.docx$/i.test(name));
 expect(privateNames).toEqual([]);
 const content=files.filter(name=>/\.(?:html|js|json|css|txt|vtt)$/.test(name)).map(name=>fs.readFileSync(name,'utf8')).join('\n');
 expect(content).not.toMatch(/\/home\/nish|file:\/\/|\+44[ ()\d-]{8,}/);
});

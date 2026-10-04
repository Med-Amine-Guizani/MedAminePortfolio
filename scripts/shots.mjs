// Screenshot walkthrough for visual QA: node scripts/shots.mjs [url] [outDir] [desktop|mobile] [stops]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'shots';
const mode = process.argv[4] ?? 'desktop';
const stops = Number(process.argv[5] ?? 18);
mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars', '--enable-gpu-rasterization'],
});
const page = await browser.newPage();
if (mode === 'mobile') await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
else await page.setViewport({ width: 1440, height: 900 });
if (mode === 'reduced') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 4200)); // preloader + intro
await page.screenshot({ path: `${out}/${mode}-00.png` });

const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
console.log('scroll height', max);
for (let i = 1; i <= stops; i++) {
  const y = Math.round((max * i) / stops);
  // step in small increments so scrubbed timelines and once-triggers fire naturally
  await page.evaluate(async (target) => {
    const start = scrollY;
    const steps = 12;
    for (let s = 1; s <= steps; s++) {
      scrollTo(0, start + ((target - start) * s) / steps);
      await new Promise((r) => setTimeout(r, 40));
    }
  }, y);
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: `${out}/${mode}-${String(i).padStart(2, '0')}.png` });
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();

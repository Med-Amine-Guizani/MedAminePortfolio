// Screenshot walkthrough for visual QA:
//   node scripts/shots.mjs [url] [outDir] [mode] [stops]
// modes: phone (390×844), phone360, phone430, tablet, desktop, reduced (390 phone with reduced motion)
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'shots';
const mode = process.argv[4] ?? 'phone';
const stops = Number(process.argv[5] ?? 24);
mkdirSync(out, { recursive: true });

const phone = (width, height) => ({ width, height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const VIEWPORTS = {
  phone: phone(390, 844),
  phone360: phone(360, 740),
  phone430: phone(430, 932),
  reduced: phone(390, 844),
  tablet: { width: 768, height: 1024, deviceScaleFactor: 1 },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
};

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport(VIEWPORTS[mode] ?? VIEWPORTS.phone);
if (mode === 'reduced') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2200)); // hero intro + staged chapters
await page.screenshot({ path: `${out}/${mode}-00.png` });

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
console.log('scroll height', max, '| horizontal overflow', overflow);
for (let i = 1; i <= stops; i++) {
  const y = Math.round((max * i) / stops);
  await page.evaluate(async (target) => {
    const start = scrollY;
    for (let s = 1; s <= 12; s++) {
      scrollTo(0, start + ((target - start) * s) / 12);
      await new Promise((r) => setTimeout(r, 40));
    }
  }, y);
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${out}/${mode}-${String(i).padStart(2, '0')}.png` });
}
console.log('errors:', errors.length ? errors : 'none');
await browser.close();

// Renders the 1200×630 Open Graph card with headless Chrome, using the site's own fonts.
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';

const file = (p) => readFileSync(new URL(p, import.meta.url)).toString('base64');
const photo = file('../public/portrait-480.webp');
const serif = file('../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2');
const serifItalic = file('../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2');
const sans = file('../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');

const html = `<!doctype html><html><head><style>
  @font-face{font-family:S;src:url(data:font/woff2;base64,${serif})}
  @font-face{font-family:S;font-style:italic;src:url(data:font/woff2;base64,${serifItalic})}
  @font-face{font-family:M;font-weight:200 800;src:url(data:font/woff2;base64,${sans})}
  body{margin:0;width:1200px;height:630px;overflow:hidden;position:relative;font-family:M;color:#0e1730;
       background:radial-gradient(60% 80% at 85% 20%,rgba(127,178,255,.45),transparent),radial-gradient(50% 60% at 0% 100%,rgba(220,231,251,.9),transparent),#fff}
  .pill{position:absolute;left:72px;top:72px;display:flex;align-items:center;gap:12px;padding:10px 18px;border-radius:999px;background:#fff;border:1px solid #dce7fb;font-weight:700;font-size:20px;color:#0a1a3f}
  .pill i{width:12px;height:12px;border-radius:50%;background:#2563eb}
  h1{position:absolute;left:66px;top:140px;margin:0;font-family:S;font-weight:400;font-size:150px;line-height:.9;color:#0a1a3f}
  h1 em{display:block;color:#2563eb}
  p{position:absolute;left:72px;top:450px;margin:0;width:560px;font-size:30px;line-height:1.3;font-weight:600}
  .path{position:absolute;left:0;top:0}
  .disc{position:absolute;right:86px;top:96px;width:430px;height:430px;border-radius:50%;background:linear-gradient(145deg,#7fb2ff,#2563eb 60%,#1d3fbf);box-shadow:0 40px 80px -30px rgba(37,99,235,.7)}
  img{position:absolute;right:86px;top:96px;width:430px;height:430px;border-radius:50%}
  .ring{position:absolute;right:70px;top:80px;width:458px;height:458px;border-radius:50%;border:2px dashed rgba(37,99,235,.45)}
</style></head><body>
<svg class="path" width="1200" height="630"><path d="M600 640 C 600 560, 760 560, 760 470" stroke="#2563eb" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="760" cy="470" r="9" fill="#2563eb"/></svg>
<div class="pill"><i></i>Full-Stack &amp; AI Engineer · AVOCarbon Group</div>
<h1>Amine<em>Guizani</em></h1>
<p>I build software people actually use, and AI helps me ship it faster.</p>
<div class="ring"></div><div class="disc"></div><img src="data:image/webp;base64,${photo}">
</body></html>`;

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('../public/og.png', import.meta.url).pathname.replace(/^\/(\w:)/, '$1') });
await browser.close();
console.log('og.png done');

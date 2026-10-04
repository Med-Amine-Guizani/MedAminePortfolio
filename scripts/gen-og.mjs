// Renders the 1200×630 Open Graph card with headless Chrome.
import puppeteer from 'puppeteer-core';
import { readFileSync } from 'node:fs';

const photo = readFileSync(new URL('../public/portrait-480.webp', import.meta.url)).toString('base64');
const html = `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Geist+Mono&display=swap" rel="stylesheet">
<style>
  body{margin:0;width:1200px;height:630px;background:radial-gradient(70% 90% at 85% 40%,#2a130a,#0b0a0c 65%);color:#f2ede6;font-family:'Bricolage Grotesque';overflow:hidden;position:relative}
  .k{position:absolute;left:72px;top:70px;font:18px 'Geist Mono';color:#ff6a2b;letter-spacing:.04em}
  h1{position:absolute;left:66px;top:118px;margin:0;font-size:150px;line-height:.84;letter-spacing:-.055em;font-weight:780}
  h1 span{display:block;color:transparent;-webkit-text-stroke:2.5px #f2ede6}
  .r{position:absolute;left:72px;top:410px;font:30px 'Geist Mono'}
  .r b{color:#ff6a2b;font-weight:400}
  .s{position:absolute;left:72px;bottom:62px;display:flex;gap:12px;align-items:center;font:20px 'Geist Mono';color:#9a948c}
  .d{width:12px;height:12px;border-radius:50%;background:#3ee08f;box-shadow:0 0 16px #3ee08f}
  img{position:absolute;right:70px;top:95px;width:440px;height:440px;border-radius:50%;filter:saturate(.9) contrast(1.05)}
  .ring{position:absolute;right:48px;top:73px;width:484px;height:484px;border-radius:50%;border:1.5px dashed rgba(255,106,43,.45)}
</style></head><body>
<div class="k">Signal in. Production out.</div>
<h1>Amine<span>Guizani</span></h1>
<div class="r"><b>&gt;</b> Full-Stack AI Engineer</div>
<div class="s"><span class="d"></span>Shipping at AVOCarbon · ENICarthage '26</div>
<div class="ring"></div><img src="data:image/webp;base64,${photo}">
</body></html>`;

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: new URL('../public/og.png', import.meta.url).pathname.replace(/^\/(\w:)/, '$1') });
await browser.close();
console.log('og.png done');

// Minimal static server that mirrors GitHub Pages: dist/ served under /MedAminePortfolio/.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const base = '/MedAminePortfolio/';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
};
const port = Number(process.argv[2] ?? 4174);

createServer(async (req, res) => {
  const path = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (!path.startsWith(base)) {
    res.writeHead(302, { Location: base }).end();
    return;
  }
  let rel = path.slice(base.length);
  if (!rel || rel.endsWith('/')) rel += 'index.html';
  rel = normalize(rel).replace(/^(\.\.[/\\])+/, '');
  try {
    const body = await readFile(join(root, rel));
    const type = types[extname(rel)] ?? 'application/octet-stream';
    // GitHub Pages gzips text assets; do the same so audits see realistic transfer sizes.
    if (/text|javascript|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
      res.writeHead(200, { 'Content-Type': type, 'Content-Encoding': 'gzip', 'Cache-Control': 'max-age=600' }).end(gzipSync(body));
    } else if (/^bytes=\d*-\d*$/.test(req.headers.range ?? '')) {
      // Range requests, like Pages: video elements (Safari above all) seek with them.
      const [a, b] = req.headers.range.slice(6).split('-');
      const start = a ? Number(a) : Math.max(0, body.length - Number(b));
      const end = a && b ? Math.min(Number(b), body.length - 1) : body.length - 1;
      res
        .writeHead(206, {
          'Content-Type': type,
          'Content-Range': `bytes ${start}-${end}/${body.length}`,
          'Content-Length': end - start + 1,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'max-age=600',
        })
        .end(body.subarray(start, end + 1));
    } else res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Cache-Control': 'max-age=600' }).end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': types['.html'] }).end(await readFile(join(root, '404.html')));
  }
}).listen(port, () => console.log(`http://localhost:${port}${base}`));

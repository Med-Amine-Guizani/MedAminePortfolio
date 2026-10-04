// Stitches screenshot QA frames into one contact sheet: node scripts/montage.mjs <dir> <prefix> [cols] [width]
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const [dir, prefix, colsArg, widthArg] = process.argv.slice(2);
const cols = Number(colsArg ?? 6);
const w = Number(widthArg ?? 260);
const files = readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith('.png')).sort();
const first = await sharp(join(dir, files[0])).metadata();
const h = Math.round((first.height / first.width) * w);
const rows = Math.ceil(files.length / cols);
const tiles = await Promise.all(
  files.map(async (f, i) => ({
    input: await sharp(join(dir, f)).resize(w, h).png().toBuffer(),
    left: (i % cols) * (w + 8),
    top: Math.floor(i / cols) * (h + 8),
  })),
);
await sharp({ create: { width: cols * (w + 8), height: rows * (h + 8), channels: 3, background: '#888' } })
  .composite(tiles)
  .png()
  .toFile(join(dir, `${prefix}-sheet.png`));
console.log(`${files.length} frames → ${prefix}-sheet.png`);

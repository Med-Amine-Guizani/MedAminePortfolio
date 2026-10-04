// Builds optimized portrait variants and the favicon from the source photo.
import sharp from 'sharp';

const src = new URL('../assets/portrait-src.png', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const out = (name) => new URL(`../public/${name}`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

for (const size of [480, 864]) {
  await sharp(src).resize(size).webp({ quality: 82 }).toFile(out(`portrait-${size}.webp`));
  await sharp(src).resize(size).avif({ quality: 55 }).toFile(out(`portrait-${size}.avif`));
}
// Small image used by the particle sampler (keeps alpha, decodes fast).
await sharp(src).resize(320).webp({ quality: 90, alphaQuality: 100 }).toFile(out('portrait-sample.webp'));
// Favicon / touch icon.
await sharp(src).resize(180).png().toFile(out('apple-touch-icon.png'));
console.log('images done');

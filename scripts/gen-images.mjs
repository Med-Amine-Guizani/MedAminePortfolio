// Builds optimized portrait variants and the favicon from the source photo.
import sharp from 'sharp';

const src = new URL('../assets/portrait-src.png', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const out = (name) => new URL(`../public/${name}`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

for (const size of [480, 864]) {
  await sharp(src).resize(size).webp({ quality: 82 }).toFile(out(`portrait-${size}.webp`));
  await sharp(src).resize(size).avif({ quality: 55 }).toFile(out(`portrait-${size}.avif`));
}
// Favicon / touch icon.
await sharp(src).resize(180).png().toFile(out('apple-touch-icon.png'));

// Ben Salem Automation mark, as supplied by Amine (200x200 JPEG on white): trim the margin, keep native size.
const bsSrc = new URL('../assets/ben-salem-automation-src.jpg', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
const bs = await sharp(bsSrc).trim({ background: '#ffffff', threshold: 24 }).webp({ quality: 90 }).toFile(out('logos/ben-salem-automation.webp'));
console.log(`ben-salem-automation.webp ${bs.width}x${bs.height}`);
console.log('images done');

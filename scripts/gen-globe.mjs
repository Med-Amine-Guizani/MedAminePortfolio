// Precomputes a dotted land mask for the canvas globe, so the browser never
// ships topojson or runs point-in-polygon tests.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

const STEP = 2.1; // degrees of latitude between rows
const dots = [];
for (let lat = -58; lat <= 80; lat += STEP) {
  const ring = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / STEP));
  for (let i = 0; i < ring; i++) {
    const lon = -180 + (i * 360) / ring;
    if (geoContains(land, [lon, lat])) dots.push(+lat.toFixed(2), +lon.toFixed(2));
  }
}

writeFileSync(new URL('../src/data/landDots.json', import.meta.url), JSON.stringify(dots));
console.log(`land dots: ${dots.length / 2}`);

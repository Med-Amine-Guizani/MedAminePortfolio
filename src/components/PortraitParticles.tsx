import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reduced, coarse } from '../lib/motion';

const BASE = import.meta.env.BASE_URL;
const EMBER = [255, 106, 43];

type Field = {
  n: number;
  hx: Float32Array; // home
  hy: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
  delay: Float32Array; // seconds before a particle starts homing
  seed: Float32Array;
};

/** Samples the portrait and returns foreground pixel positions/colors, with the studio background flood-filled away. */
function sample(img: HTMLImageElement, grid: number) {
  const c = document.createElement('canvas');
  c.width = c.height = grid;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, grid, grid);
  const d = ctx.getImageData(0, 0, grid, grid).data;
  const bg = new Uint8Array(grid * grid);
  const isBgLike = (i: number) => {
    const r = d[i * 4],
      g = d[i * 4 + 1],
      b = d[i * 4 + 2],
      a = d[i * 4 + 3];
    if (a < 20) return true;
    const avg = (r + g + b) / 3;
    return Math.max(r, g, b) - Math.min(r, g, b) < 14 && avg > 188 && avg < 236;
  };
  const queue: number[] = [];
  for (let i = 0; i < grid * grid; i++) {
    if (d[i * 4 + 3] < 20) {
      bg[i] = 1;
      queue.push(i);
    }
  }
  while (queue.length) {
    const i = queue.pop()!;
    const x = i % grid,
      y = (i / grid) | 0;
    for (const [nx, ny] of [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= grid || ny >= grid) continue;
      const j = ny * grid + nx;
      if (!bg[j] && isBgLike(j)) {
        bg[j] = 1;
        queue.push(j);
      }
    }
  }
  const pts: number[] = [];
  for (let i = 0; i < grid * grid; i++) {
    if (bg[i]) continue;
    pts.push(i % grid, (i / grid) | 0, d[i * 4], d[i * 4 + 1], d[i * 4 + 2]);
  }
  return pts;
}

export default function PortraitParticles({ start, alt }: { start: boolean; alt: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<Field | null>(null);
  const startedAt = useRef<number | null>(null);
  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    if (reduced) return;
    const cv = canvas.current!;
    const ctx = cv.getContext('2d')!;
    const grid = coarse || window.innerWidth < 820 ? 110 : 150;
    let W = 0;
    let cell = 0;
    let image: ImageData | null = null;
    let buf: Uint32Array | null = null;
    let raf = 0;
    let visible = true;
    let scatter = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      const size = wrap.current!.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.round(size * dpr);
      cv.width = cv.height = W;
      cell = W / grid;
      image = ctx.createImageData(W, W);
      buf = new Uint32Array(image.data.buffer);
      // particle homes live in grid units, so nothing else needs rescaling
    };

    const build = (pts: number[]) => {
      const n = pts.length / 5;
      const f: Field = {
        n,
        hx: new Float32Array(n),
        hy: new Float32Array(n),
        x: new Float32Array(n),
        y: new Float32Array(n),
        vx: new Float32Array(n),
        vy: new Float32Array(n),
        r: new Uint8Array(n),
        g: new Uint8Array(n),
        b: new Uint8Array(n),
        delay: new Float32Array(n),
        seed: new Float32Array(n),
      };
      for (let i = 0; i < n; i++) {
        const gx = pts[i * 5],
          gy = pts[i * 5 + 1];
        // homes are stored in grid units; converted to device px at draw time
        f.hx[i] = gx;
        f.hy[i] = gy;
        // start as a flat "signal" line across the canvas, scattered in noise
        f.x[i] = Math.random() * grid;
        f.y[i] = grid * 0.5 + (Math.random() - 0.5) * grid * 0.06 + Math.sin(f.x[i] * 0.2) * 3;
        f.r[i] = pts[i * 5 + 2];
        f.g[i] = pts[i * 5 + 3];
        f.b[i] = pts[i * 5 + 4];
        f.delay[i] = (gy / grid) * 0.9 + Math.random() * 0.5;
        f.seed[i] = Math.random() * Math.PI * 2;
      }
      field.current = f;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const f = field.current;
      if (!f || !buf || !image || !visible) return;
      const now = performance.now() / 1000;
      if (startRef.current && startedAt.current === null) startedAt.current = now;
      const t = startedAt.current === null ? -1 : now - startedAt.current;
      buf.fill(0);
      const size = Math.max(1, Math.round(cell * 0.62));
      const mx = mouse.x / cell,
        my = mouse.y / cell;
      const R = grid * 0.11;
      const R2 = R * R;
      for (let i = 0; i < f.n; i++) {
        let tx = f.hx[i],
          ty = f.hy[i];
        if (t < f.delay[i]) {
          // waiting: drift along the signal line
          tx = f.x[i] + 0.15;
          ty = f.y[i] + Math.sin(now * 3 + f.seed[i]) * 0.15;
          if (tx > grid) tx = 0;
          f.x[i] = tx;
          f.y[i] = ty;
        } else {
          // breathing + scroll scatter
          tx += Math.sin(now * 1.3 + f.seed[i]) * 0.12;
          if (scatter > 0) {
            ty -= scatter * (20 + 60 * ((f.seed[i] * 7) % 1)) * (1 - f.hy[i] / grid + 0.3);
            tx += scatter * Math.cos(f.seed[i] * 3) * 30;
          }
          let ax = (tx - f.x[i]) * 0.06,
            ay = (ty - f.y[i]) * 0.06;
          if (mouse.active) {
            const dx = f.x[i] - mx,
              dy = f.y[i] - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const force = (1 - d2 / R2) * 1.6;
              const inv = 1 / Math.sqrt(d2 + 0.01);
              ax += dx * inv * force;
              ay += dy * inv * force;
            }
          }
          f.vx[i] = (f.vx[i] + ax) * 0.82;
          f.vy[i] = (f.vy[i] + ay) * 0.82;
          f.x[i] += f.vx[i];
          f.y[i] += f.vy[i];
        }
        // color: speed heats particles toward ember
        const sp = Math.min(1, (Math.abs(f.vx[i]) + Math.abs(f.vy[i])) * 0.35 + (t < f.delay[i] ? 1 : 0));
        const r = f.r[i] + (EMBER[0] - f.r[i]) * sp;
        const g = f.g[i] + (EMBER[1] - f.g[i]) * sp;
        const b = f.b[i] + (EMBER[2] - f.b[i]) * sp;
        const col = (255 << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0);
        const px = Math.round(f.x[i] * cell),
          py = Math.round(f.y[i] * cell);
        if (px < 0 || py < 0 || px + size >= W || py + size >= W) continue;
        for (let yy = 0; yy < size; yy++) {
          const row = (py + yy) * W + px;
          for (let xx = 0; xx < size; xx++) buf[row + xx] = col;
        }
      }
      ctx.putImageData(image, 0, 0);
    };

    const img = new Image();
    img.decoding = 'async';
    img.src = `${BASE}portrait-sample.webp`;
    img.onload = () => {
      resize();
      build(sample(img, grid));
      tick();
    };

    const ro = new ResizeObserver(() => field.current && resize());
    ro.observe(wrap.current!);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap.current!);

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const s = cv.width / r.width;
      mouse.x = (e.clientX - r.left) * s;
      mouse.y = (e.clientY - r.top) * s;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);

    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => (scatter = gsap.parseEase('power2.in')(self.progress)),
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      st.kill();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="portrait" ref={wrap} role="img" aria-label={alt}>
      {reduced ? (
        <picture>
          <source srcSet={`${BASE}portrait-480.avif`} type="image/avif" />
          <img src={`${BASE}portrait-480.webp`} alt="" width={480} height={480} />
        </picture>
      ) : (
        <canvas ref={canvas} data-cursor="touch" />
      )}
      <div className="portrait-ring" aria-hidden="true" />
    </div>
  );
}

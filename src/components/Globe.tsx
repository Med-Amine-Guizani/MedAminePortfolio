import { useEffect, useRef } from 'react';
import { reduced } from '../lib/motion';

const D = Math.PI / 180;
const HOME: [number, number] = [36.8, 10.2]; // Tunis
// Illustrative destinations only: unlabeled, not a map of plant locations.
const TARGETS: [number, number][] = [
  [48.5, 2.5],
  [51, 9],
  [45.5, 15],
  [40.5, -3.7],
  [31, 118],
  [37, 127],
  [21, 78],
  [41, -84],
  [21, -101],
];

type V3 = [number, number, number];
const toV = (lat: number, lon: number): V3 => [Math.cos(lat * D) * Math.cos(lon * D), Math.sin(lat * D), Math.cos(lat * D) * Math.sin(lon * D)];

function slerp(a: V3, b: V3, t: number): V3 {
  const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const om = Math.acos(dot);
  if (om < 1e-4) return a;
  const s = Math.sin(om);
  const k1 = Math.sin((1 - t) * om) / s,
    k2 = Math.sin(t * om) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
}

/**
 * Dotted orthographic globe on a 2D canvas. `progress.current` (0..1) drives
 * the arc launches from Tunis, so the parent can scrub it with scroll.
 */
export default function Globe({ progress }: { progress: React.MutableRefObject<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext('2d')!;
    // Land dots load lazily (kept out of the main bundle); the globe draws its outline until then.
    let n = 0;
    let vecs = new Float32Array(0);
    let cancelled = false;
    import('../data/landDots.json').then(({ default: pts }) => {
      if (cancelled) return;
      n = pts.length / 2;
      vecs = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) vecs.set(toV(pts[i * 2], pts[i * 2 + 1]), i * 3);
      if (reduced) draw();
    });
    const home = toV(...HOME);
    const arcs = TARGETS.map((t) => {
      const b = toV(...t);
      return Array.from({ length: 48 }, (_, k) => {
        const s = k / 47;
        const v = slerp(home, b, s);
        const lift = 1 + 0.22 * Math.sin(Math.PI * s);
        return [v[0] * lift, v[1] * lift, v[2] * lift] as V3;
      });
    });

    let W = 0,
      R = 0,
      raf = 0,
      visible = false;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = cv.clientWidth;
      W = Math.round(size * dpr);
      cv.width = cv.height = W;
      R = W * 0.42;
    };
    resize();

    // The facing longitude is 90° - rot, and the tilt brings latitude ~30°N to the centre.
    const tilt = 30 * D;
    const ct = Math.cos(tilt),
      st = Math.sin(tilt);
    let rot = 72 * D; // start with Tunisia (and Europe) facing the camera
    let last = performance.now();

    // Rotate around Y by `rot`, tilt around X, then project orthographically.
    const project = (x: number, y: number, z: number) => {
      const cr = Math.cos(rot),
        sr = Math.sin(rot);
      const x1 = x * cr - z * sr;
      const z1 = x * sr + z * cr;
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      return [W / 2 - x1 * R, W / 2 - y2 * R, z2] as const;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, W);
      // atmosphere
      const g = ctx.createRadialGradient(W / 2, W / 2, R * 0.85, W / 2, W / 2, R * 1.25);
      g.addColorStop(0, 'rgba(127,178,255,0.16)');
      g.addColorStop(1, 'rgba(127,178,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, W);
      ctx.beginPath();
      ctx.arc(W / 2, W / 2, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(169,189,230,0.16)';
      ctx.lineWidth = W / 700;
      ctx.stroke();

      const ds = Math.max(1.5, W / 420);
      for (let i = 0; i < n; i++) {
        const [px, py, z] = project(vecs[i * 3], vecs[i * 3 + 1], vecs[i * 3 + 2]);
        if (z < 0) continue;
        ctx.fillStyle = `rgba(169,199,255,${(0.14 + z * 0.6).toFixed(3)})`;
        ctx.fillRect(px - ds / 2, py - ds / 2, ds, ds);
      }

      // arcs
      const p = progress.current;
      const [hx, hy, hz] = project(...home);
      if (hz > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx, hy, W / 160, 0, Math.PI * 2);
        ctx.fill();
        const pulse = (performance.now() / 1400) % 1;
        ctx.strokeStyle = `rgba(255,255,255,${1 - pulse})`;
        ctx.lineWidth = W / 500;
        ctx.beginPath();
        ctx.arc(hx, hy, W / 160 + pulse * W / 30, 0, Math.PI * 2);
        ctx.stroke();
      }
      arcs.forEach((arc, a) => {
        const local = Math.min(1, Math.max(0, p * 1.6 - (a / arcs.length) * 0.6));
        if (local <= 0) return;
        const upto = Math.floor(local * (arc.length - 1));
        ctx.lineWidth = W / 420;
        ctx.lineCap = 'round';
        for (let k = 1; k <= upto; k++) {
          const [x0, y0, z0] = project(...arc[k - 1]);
          const [x1, y1, z1] = project(...arc[k]);
          if (z0 < -0.15 || z1 < -0.15) continue;
          ctx.strokeStyle = `rgba(${127 + ((k * 2.6) | 0)},${178 + k},255,${(0.4 + 0.6 * (k / upto)).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
        const [tx, ty, tz] = project(...arc[upto]);
        if (tz > -0.15) {
          ctx.fillStyle = local >= 1 ? '#ffffff' : '#7fb2ff';
          ctx.beginPath();
          ctx.arc(tx, ty, W / (local >= 1 ? 220 : 180), 0, Math.PI * 2);
          ctx.fill();
          if (local >= 1) {
            const q = ((performance.now() / 1800 + a * 0.13) % 1);
            ctx.strokeStyle = `rgba(127,178,255,${0.7 * (1 - q)})`;
            ctx.lineWidth = W / 700;
            ctx.beginPath();
            ctx.arc(tx, ty, W / 220 + q * W / 50, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) rot += dt * 0.12;
      draw();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
      if (reduced && visible) draw();
    });
    io.observe(cv);
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    if (reduced) {
      progress.current = 1;
      draw();
    } else raf = requestAnimationFrame(loop);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [progress]);

  return <canvas className="globe" ref={canvas} aria-hidden="true" />;
}

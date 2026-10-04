import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { onScrollFrame, reduced, ScrollTrigger } from '../lib/motion';

const LINE_DAY = '#2563eb';
const LINE_NIGHT = '#7fb2ff';
const TIP = 0.6; // the drawn tip rides at 60% of the viewport height

type Range = [number, number];

type Hole = { x: number; y: number; w: number; h: number; r: number };

/**
 * "The Path": one blue line that runs through the whole story. Anchors are
 * elements marked `data-path` (start / center / end pass through the element's
 * centre; rail runs down the left margin). The line is drawn on a single fixed,
 * viewport-sized canvas above the content, so scrolling only ever repaints one
 * screen's worth. Elements marked `data-path-hole` (logos, seals, labels) and
 * pinned scenes are cut out of the drawing, so the line seems to pass behind them.
 *
 * The same scroll pass keeps the phone's browser-bar colour in step with the
 * day (white) and night (navy) chapters.
 */
export default function Path() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const head = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext('2d')!;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    let xs = new Float32Array(0);
    let ys = new Float32Array(0);
    let nights: Range[] = [];
    let holes: Hole[] = [];
    let dpr = 1;
    let wasNight = false;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(window.innerWidth * dpr);
      cv.height = Math.round(window.innerHeight * dpr);

      const sy = window.scrollY;
      const wrap = document.querySelector<HTMLElement>('.wrap');
      const railOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rail')) || 22;
      const railX = (wrap ? wrap.getBoundingClientRect().left : 0) + railOffset;

      const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-path]'))
        .map((el) => {
          const r = el.getBoundingClientRect();
          if (!r.height && !r.width) return null;
          const kind = el.dataset.path;
          return { x: kind === 'rail' ? railX : r.left + r.width / 2, y: r.top + sy + r.height / 2 };
        })
        .filter((a): a is { x: number; y: number } => !!a)
        .sort((a, b) => a.y - b.y);

      // Smooth S-curves between anchors, sampled every few pixels.
      const px: number[] = [];
      const py: number[] = [];
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i];
        const b = anchors[i + 1];
        const dy = b.y - a.y;
        const steps = Math.max(8, Math.ceil(Math.hypot(b.x - a.x, dy) / 6));
        for (let s = i === 0 ? 0 : 1; s <= steps; s++) {
          const t = s / steps;
          const u = 1 - t;
          // cubic bezier with vertical tangents at both ends
          const x = u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x;
          const y = u * u * u * a.y + 3 * u * u * t * (a.y + dy * 0.5) + 3 * u * t * t * (b.y - dy * 0.5) + t * t * t * b.y;
          px.push(x);
          py.push(y);
        }
      }
      xs = Float32Array.from(px);
      ys = Float32Array.from(py);

      nights = Array.from(document.querySelectorAll<HTMLElement>('[data-theme="night"]')).map((el) => {
        const r = el.getBoundingClientRect();
        return [r.top + sy, r.bottom + sy] as Range;
      });

      holes = Array.from(document.querySelectorAll<HTMLElement>('[data-path-hole]')).map((el) => {
        const r = el.getBoundingClientRect();
        const round = el.dataset.pathHole === 'round';
        const pad = 6;
        return { x: r.left - pad, y: r.top + sy - pad, w: r.width + pad * 2, h: r.height + pad * 2, r: round ? r.width / 2 + pad : 22 };
      });
      // A pinned scene holds still while the page scrolls under it; keep the line out of its whole run.
      document.querySelectorAll<HTMLElement>('.pin-spacer').forEach((el) => {
        const r = el.getBoundingClientRect();
        holes.push({ x: 0, y: r.top + sy, w: window.innerWidth, h: r.height, r: 0 });
      });
      draw();
    };

    // First index whose y is >= v (ys is non-decreasing).
    const lower = (v: number) => {
      let lo = 0;
      let hi = ys.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < v) lo = mid + 1;
        else hi = mid;
      }
      return lo;
    };
    const isNight = (y: number) => nights.some(([t, b]) => y >= t && y <= b);

    const draw = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;

      // Browser-bar colour follows whichever chapter is under the middle of the screen.
      const night = isNight(sy + vh * 0.5);
      if (night !== wasNight) {
        wasNight = night;
        document.documentElement.classList.toggle('is-night', night);
        meta?.setAttribute('content', night ? '#0a1a3f' : '#ffffff');
      }

      // The line.
      ctx.setTransform(dpr, 0, 0, dpr, 0, -sy * dpr);
      ctx.clearRect(0, sy, window.innerWidth, vh);
      if (ys.length < 2) return;
      const tip = reduced ? Infinity : sy + vh * TIP;
      const i0 = Math.max(0, lower(sy - 40) - 1);
      const i1 = Math.min(ys.length - 1, lower(sy + vh + 40));
      const iTip = Math.min(i1, Math.max(i0, lower(tip)));
      const phone = window.innerWidth < 820;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Cut out the holes that are on screen.
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, sy, window.innerWidth, vh);
      for (const hl of holes) {
        if (hl.y + hl.h < sy || hl.y > sy + vh) continue;
        if (ctx.roundRect) ctx.roundRect(hl.x, hl.y, hl.w, hl.h, hl.r);
        else ctx.rect(hl.x, hl.y, hl.w, hl.h); // Safari < 16
      }
      ctx.clip('evenodd');

      // the road ahead, faint and dotted
      if (iTip < i1) {
        ctx.setLineDash([1, 9]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.28)';
        ctx.beginPath();
        ctx.moveTo(xs[iTip], ys[iTip]);
        for (let i = iTip + 1; i <= i1; i++) ctx.lineTo(xs[i], ys[i]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // the travelled road, in runs of day/night colour
      ctx.lineWidth = phone ? 2.5 : 3;
      let i = i0;
      while (i < iTip) {
        const n = isNight(ys[i]);
        ctx.strokeStyle = n ? LINE_NIGHT : LINE_DAY;
        ctx.beginPath();
        ctx.moveTo(xs[i], ys[i]);
        while (i < iTip && isNight(ys[i + 1]) === n) ctx.lineTo(xs[++i], ys[i]);
        if (i < iTip) ctx.lineTo(xs[++i], ys[i]);
        ctx.stroke();
      }
      ctx.restore();

      // the glowing head
      const h = head.current!;
      const inHole = holes.some((hl) => hl.r === 0 && tip >= hl.y && tip <= hl.y + hl.h);
      if (!reduced && !inHole && tip > ys[0] && tip < ys[ys.length - 1]) {
        const j = lower(tip);
        const a = Math.max(0, j - 1);
        const f = ys[j] === ys[a] ? 0 : (tip - ys[a]) / (ys[j] - ys[a]);
        const x = xs[a] + (xs[j] - xs[a]) * f;
        h.style.opacity = '1';
        h.style.transform = `translate3d(${x.toFixed(1)}px, ${(vh * TIP).toFixed(1)}px, 0)`;
        h.classList.toggle('is-night', isNight(tip));
      } else h.style.opacity = '0';
    };

    let t = 0;
    const rebuild = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 60);
    };
    const offScroll = onScrollFrame(draw);
    ScrollTrigger.addEventListener('refresh', rebuild);
    const ro = new ResizeObserver(rebuild);
    ro.observe(document.querySelector('main') ?? document.body);
    document.fonts?.ready.then(rebuild);
    build();
    return () => {
      offScroll();
      ScrollTrigger.removeEventListener('refresh', rebuild);
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // Rendered on <body>, just above <main> (see base.css).
  return createPortal(
    <>
      <canvas className="path" ref={canvas} aria-hidden="true" />
      <div className="path-head" ref={head} aria-hidden="true" />
    </>,
    document.body,
  );
}

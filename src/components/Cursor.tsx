import { useEffect, useRef } from 'react';
import { gsap, reduced, coarse } from '../lib/motion';

/**
 * Two-part cursor: a precise dot and a lagging ring that morphs over anything
 * carrying `data-cursor="label"` (links get "open" by default).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (coarse || reduced) return;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      document.documentElement.classList.add('cursor-on');
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button, [role="button"], input');
      const r = ring.current!;
      if (!t) {
        r.classList.remove('is-hover', 'is-label', 'is-text');
        return;
      }
      if (t.tagName === 'INPUT') {
        r.classList.add('is-text');
        return;
      }
      const text = t.dataset.cursor ?? (t.tagName === 'A' ? 'open' : '');
      r.classList.add('is-hover');
      r.classList.toggle('is-label', !!text);
      label.current!.textContent = text;
    };
    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' });

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      document.documentElement.classList.remove('has-cursor', 'cursor-on');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, []);

  if (coarse || reduced) return null;
  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span ref={label} className="cursor-label" />
      </div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  );
}

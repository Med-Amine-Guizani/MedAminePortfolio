import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setNavHandler } from './nav';

gsap.registerPlugin(ScrollTrigger);
// The iOS address bar resizes the viewport on scroll; don't recompute every trigger when it does.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

/** Motion tokens, mirrored from tokens.css. */
export const ease = {
  out: 'expo.out',
  inOut: 'power3.inOut',
  spring: 'back.out(1.7)',
};

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
export const isPhone = () => window.innerWidth < 820;

let lenis: Lenis | null = null;

/**
 * Smooth scrolling on desktop only. Phones keep native touch scrolling, which
 * is faster and feels right under a thumb.
 */
export function initScroll() {
  setNavHandler((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });
  if (reduced || coarse || lenis) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Calls `cb` once per animation frame while the page scrolls (and once immediately). */
export function onScrollFrame(cb: () => void) {
  let queued = false;
  const run = () => {
    queued = false;
    cb();
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
  return () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  };
}

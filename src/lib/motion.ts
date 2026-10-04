import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Motion tokens, mirrored from tokens.css. */
export const ease = {
  outExpo: 'expo.out',
  inOutQuint: 'power4.inOut',
  spring: 'back.out(1.6)',
};
export const dur = { micro: 0.15, ui: 0.3, reveal: 0.8, cinematic: 1.4 };
export const stagger = { letters: 0.045, items: 0.08 };

export const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
export const isMobile = () => window.innerWidth < 820;

/** Live, smoothed scroll velocity (px/frame), read by velocity-reactive effects. */
export const scrollState = { velocity: 0, smooth: 0 };

let lenis: Lenis | null = null;

export function initScroll() {
  if (reduced || lenis) return;
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis.on('scroll', (l: Lenis) => {
    scrollState.velocity = l.velocity;
    ScrollTrigger.update();
  });
  // One RAF loop for everything: GSAP's ticker drives Lenis.
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smooth the velocity once per tick and push it into skew targets.
  // `.vskew` leans vertically, `.hskew` (cards in the horizontal journey) leans sideways.
  const grab = () => ({
    v: document.querySelectorAll<HTMLElement>('.vskew'),
    h: document.querySelectorAll<HTMLElement>('.hskew'),
  });
  let els = grab();
  ScrollTrigger.addEventListener('refresh', () => (els = grab()));
  let last = 1;
  gsap.ticker.add(() => {
    scrollState.velocity *= 0.9; // decays when Lenis stops emitting
    scrollState.smooth += (scrollState.velocity - scrollState.smooth) * 0.12;
    const skew = gsap.utils.clamp(-5, 5, scrollState.smooth * 0.16);
    if (Math.abs(skew) < 0.01 && Math.abs(last) < 0.01) return;
    last = skew;
    const s = skew.toFixed(3);
    for (const el of els.v) el.style.transform = `skewY(${s}deg)`;
    for (const el of els.h) el.style.transform = `skewX(${-skew * 0.8}deg)`;
  });
}

export function stopScroll(stop: boolean) {
  if (!lenis) return;
  if (stop) lenis.stop();
  else lenis.start();
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -60, duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Scrambles an element's text into `to`, decoding left to right. */
export function scrambleTo(el: HTMLElement, to: string, duration = 0.9) {
  if (reduced) {
    el.textContent = to;
    return gsap.to({}, { duration: 0 });
  }
  const from = el.textContent ?? '';
  const len = Math.max(from.length, to.length);
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate() {
      let out = '';
      for (let i = 0; i < len; i++) {
        const settle = i / len;
        if (state.p > settle + 0.25 || state.p === 1) out += to[i] ?? '';
        else if (state.p > settle) out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else out += from[i] ?? '';
      }
      el.textContent = out;
    },
  });
}

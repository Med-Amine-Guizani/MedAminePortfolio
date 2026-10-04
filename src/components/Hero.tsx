import { useEffect, useRef } from 'react';
import { person } from '../data/profile';
import { goTo } from '../lib/nav';

const BASE = import.meta.env.BASE_URL;

/**
 * The opening frame. Its intro runs on CSS alone (no GSAP) so it paints and
 * animates before the rest of the story has even downloaded.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // Gentle scroll-out: the photo drifts up and the copy fades as the story begins.
  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const photo = el.querySelector<HTMLElement>('.hero-photo')!;
    const copy = el.querySelector<HTMLElement>('.hero-copy')!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight));
      photo.style.transform = `translate3d(0, ${(-p * 60).toFixed(1)}px, 0) scale(${(1 - p * 0.12).toFixed(3)})`;
      copy.style.opacity = String(1 - p * 1.1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="hero" id="top" ref={root}>
      <div className="aurora" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero-inner wrap">
        <div className="hero-photo">
          <span className="hero-disc" aria-hidden="true" />
          <picture className="hero-pic">
            <source srcSet={`${BASE}portrait-480.avif 480w, ${BASE}portrait-864.avif 864w`} type="image/avif" sizes="(min-width: 820px) 420px, 240px" />
            <img
              src={`${BASE}portrait-480.webp`}
              srcSet={`${BASE}portrait-480.webp 480w, ${BASE}portrait-864.webp 864w`}
              sizes="(min-width: 820px) 420px, 240px"
              alt="Portrait of Mohamed Amine Guizani"
              width={480}
              height={480}
              fetchPriority="high"
            />
          </picture>
          <span className="hero-ring" aria-hidden="true" />
        </div>

        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span className="live-dot" aria-hidden="true" />
            {person.role} · {person.company}
          </p>
          <h1 className="hero-name">
            <span className="line">
              <span>{person.first}</span>
            </span>
            <span className="line">
              <em>{person.last}</em>
            </span>
          </h1>
          <p className="hero-tagline">I build software people actually use, and AI helps me ship it faster.</p>
          <p className="hero-small">
            ENICarthage, Class of 2026. Today, my work runs in AVOCarbon's plants around the world.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => goTo('contact')}>
              Get in touch
            </button>
            <a className="btn btn-ghost" href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-cue" data-path="start">
        <span>Follow the path</span>
        <span className="hero-cue-dot" aria-hidden="true" />
      </div>
    </header>
  );
}

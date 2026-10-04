import { useEffect, useRef, useState } from 'react';
import { person } from '../data/profile';
import { gsap, ScrollTrigger, reduced } from '../lib/motion';
import { Kicker, Magnetic, Split } from './ui';

/** The graph's terminal node: it detonates into light, then resolves into the contact call. */
export default function Finale() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo('.terminal-node', { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })
        .to('.terminal-node', { scale: 40, opacity: 0, duration: 1.1, ease: 'expo.in' }, '+=0.2')
        .add(() => explode(canvas.current!), '-=0.25')
        .from('.finale-title .ch', { yPercent: 120, rotate: 6, duration: 1.2, stagger: 0.03, ease: 'expo.out' }, '-=0.1')
        .from('.finale-mail', { y: 60, opacity: 0, filter: 'blur(14px)', duration: 1.2, ease: 'expo.out' }, '-=0.9')
        .from('.finale-row > *', { y: 20, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out' }, '-=0.8');
      ScrollTrigger.create({ trigger: root.current, start: 'top 55%', once: true, onEnter: () => tl.play() });
    }, root);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section className="chapter finale" id="contact" ref={root} aria-labelledby="finale-title">
      <canvas className="finale-burst" ref={canvas} aria-hidden="true" />
      <span className="terminal-node" aria-hidden="true" />
      <Kicker index="08">Terminal node</Kicker>
      <h2 className="finale-title display-xxl" id="finale-title">
        <Split text="Let's build" />
        <br />
        <Split text="what's next." className="ember" />
      </h2>

      <Magnetic strength={0.18} className="finale-mail-wrap">
        <a className="finale-mail" href={`mailto:${person.email}`} data-cursor="write">
          {person.email}
        </a>
      </Magnetic>

      <div className="finale-row">
        <button className="btn btn-ghost" onClick={copy} data-cursor="copy" aria-live="polite">
          {copied ? '✓ Copied to clipboard' : 'Copy email'}
        </button>
        <Magnetic>
          <a className="btn btn-ghost" href={person.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        </Magnetic>
        <Magnetic>
          <a className="btn btn-ghost" href={person.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </Magnetic>
        <a className="btn btn-ghost" href={person.phoneHref}>
          {person.phone}
        </a>
      </div>

      <p className="finale-langs mono dim">
        {person.languages.map(([l, lvl]) => (
          <span key={l}>
            {l} <span className="dim2">· {lvl}</span>
          </span>
        ))}
      </p>

      <footer className="footer">
        <span>© 2026 {person.fullName} · {person.location}</span>
        <span className="footer-colophon">
          Designed and engineered by Amine, with AI as co-pilot. The agent on this page runs entirely in your browser.
        </span>
      </footer>
    </section>
  );
}

function explode(cv: HTMLCanvasElement) {
  const ctx = cv.getContext('2d')!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = (cv.width = cv.clientWidth * dpr);
  const H = (cv.height = cv.clientHeight * dpr);
  const node = cv.parentElement!.querySelector('.terminal-node')!.getBoundingClientRect();
  const host = cv.getBoundingClientRect();
  const cx = (node.left + node.width / 2 - host.left) * dpr;
  const cy = (node.top + node.height / 2 - host.top) * dpr;
  const parts = Array.from({ length: 220 }, () => {
    const a = Math.random() * Math.PI * 2;
    const s = (2 + Math.random() * 14) * dpr;
    return { x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, hot: Math.random() < 0.6 };
  });
  let frame = 0;
  const step = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    for (const p of parts) {
      if (p.life <= 0) continue;
      alive++;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.955;
      p.vy = p.vy * 0.955 + 0.04 * dpr;
      p.life -= 0.011;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.hot ? '#ff6a2b' : '#f2ede6';
      ctx.fillRect(p.x, p.y, 2.2 * dpr, 2.2 * dpr);
    }
    // a flash ring
    if (frame < 40) {
      ctx.globalAlpha = 1 - frame / 40;
      ctx.strokeStyle = '#ff6a2b';
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy, frame * 18 * dpr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    frame++;
    if (alive) requestAnimationFrame(step);
  };
  step();
}

import { useEffect, useRef } from 'react';
import { lab } from '../data/profile';
import { gsap, reduced, coarse } from '../lib/motion';
import { Kicker, Split, useSplitReveal } from './ui';

function useTilt() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || coarse) return;
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3' });
    gsap.set(el, { transformPerspective: 1000 });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 8);
      ry(px * 10);
      el.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
      el.style.setProperty('--my', `${(py + 0.5) * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);
  return ref;
}

function WatchWisePreview() {
  return (
    <div className="lab-preview ww" aria-hidden="true">
      {Array.from({ length: 15 }).map((_, i) => (
        <span key={i} className={`ww-poster ${[3, 7, 11].includes(i) ? 'is-rec' : ''}`} style={{ animationDelay: `${(i % 5) * 0.15}s` }} />
      ))}
      <span className="ww-label mono">recommended for you</span>
    </div>
  );
}

function CityPreview() {
  const nodes = [
    [50, 50, 'REST'],
    [190, 40, 'GraphQL'],
    [70, 150, 'SOAP'],
    [210, 145, 'gRPC'],
  ] as const;
  return (
    <div className="lab-preview city" aria-hidden="true">
      <svg viewBox="0 0 260 190">
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <line x1="130" y1="95" x2={x} y2={y} className="city-edge" />
            <line x1="130" y1="95" x2={x} y2={y} className="city-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
          </g>
        ))}
        <rect x="104" y="80" width="52" height="30" rx="6" className="city-gw" />
        <text x="130" y="99" textAnchor="middle" className="city-gw-t">
          gateway
        </text>
        {nodes.map(([x, y, l], i) => (
          <g key={l} transform={`translate(${x} ${y})`}>
            <circle r="16" className="city-node" style={{ animationDelay: `${i * 0.4}s` }} />
            <text y="32" textAnchor="middle" className="city-t">
              {l}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function LabCard({ p, i }: { p: (typeof lab)[number]; i: number }) {
  const ref = useTilt();
  return (
    <article className="lab-card" ref={ref as React.RefObject<HTMLElement>} data-cursor={p.links.length ? 'explore' : 'look'}>
      <div className="lab-glare" aria-hidden="true" />
      {p.id === 'watchwise' ? <WatchWisePreview /> : <CityPreview />}
      <div className="lab-info">
        <span className="mono dim">
          {String(i + 1).padStart(2, '0')} · {p.kind}
        </span>
        <h3 className="display-m">{p.name}</h3>
        <p className="muted">{p.summary}</p>
        <ul className="tags">
          {p.stack.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {p.links.length > 0 && (
          <div className="lab-links">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link-arrow">
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Lab() {
  const root = useRef<HTMLElement>(null);
  useSplitReveal(root);
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.from('.lab-card', {
        y: 120,
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.18,
        scrollTrigger: { trigger: '.lab-grid', start: 'top 85%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section className="chapter lab" id="lab" ref={root} aria-labelledby="lab-title">
      <Kicker index="06">Lab</Kicker>
      <h2 className="display-xl vskew" id="lab-title">
        <span data-split-reveal="">
          <Split text="Built after hours," />
        </span>
        <br />
        <span data-split-reveal="">
          <Split text="for the joy of it." className="outline" />
        </span>
      </h2>
      <div className="lab-grid">
        {lab.map((p, i) => (
          <LabCard p={p} i={i} key={p.id} />
        ))}
      </div>
    </section>
  );
}

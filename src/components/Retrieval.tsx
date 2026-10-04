import { useEffect, useMemo, useRef } from 'react';
import { gsap, reduced, ease } from '../lib/motion';
import { Kicker, Split } from './ui';

const STEPS = [
  ['embed', 'The question becomes a vector.'],
  ['search', 'Its neighbourhood is scanned.'],
  ['retrieve', 'The closest knowledge lights up.'],
  ['ground', 'The model reads only what was retrieved.'],
  ['act', 'It answers or calls a tool, and a human approves.'],
] as const;

const Q = { x: 360, y: 190 };
const DOCS = ['promo rules', 'tenant schema', 'pricing window', 'store groups'];

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export default function Retrieval() {
  const root = useRef<HTMLElement>(null);

  const { points, nearest } = useMemo(() => {
    const pts = Array.from({ length: 84 }, (_, i) => ({
      x: 40 + rand(i + 1) * 560,
      y: 30 + rand(i + 101) * 330,
      r: 2 + rand(i + 201) * 2.5,
    }));
    const order = pts
      .map((p, i) => ({ i, d: Math.hypot(p.x - Q.x, p.y - Q.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 4)
      .map((o) => o.i);
    return { points: pts, nearest: order };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.rag-step');
      const on = (i: number) => () => steps.forEach((s, j) => s.classList.toggle('is-on', j === i));
      // Desktop pins the whole chapter; on phones the copy and stage stack, so scrub against the stage instead.
      const mobile = window.innerWidth < 820;
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: mobile
          ? { trigger: '.rag-stage', start: 'top 85%', end: 'bottom 35%', scrub: 1 }
          : { trigger: root.current, pin: true, start: 'top top', end: '+=260%', scrub: 1 },
      });
      tl.from('.rag-dot', { scale: 0, transformOrigin: 'center', stagger: { each: 0.01, from: 'random' }, duration: 0.6 })
        // 01 embed
        .add(on(0))
        .fromTo('.rag-query', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 })
        .to('.rag-query', { x: Q.x - 120, y: Q.y - 40, scale: 0.2, opacity: 0, duration: 1 })
        .fromTo('.rag-q', { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, '-=0.3')
        // 02 search
        .add(on(1))
        .fromTo('.rag-ring', { scale: 0, opacity: 0.9, transformOrigin: 'center' }, { scale: 1, opacity: 0, duration: 1.2, stagger: 0.25 })
        .to('.rag-dot:not(.is-near)', { opacity: 0.18, duration: 0.6 }, '<0.4')
        // 03 retrieve
        .add(on(2))
        .fromTo('.rag-edge', { strokeDashoffset: 200 }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.12 })
        .to('.rag-dot.is-near', { fill: 'var(--ember)', scale: 2.2, transformOrigin: 'center', duration: 0.4, stagger: 0.1 }, '<')
        // 04 ground
        .add(on(3))
        .from('.rag-chip', { x: -30, opacity: 0, stagger: 0.12, duration: 0.6, ease: ease.outExpo })
        .to('.rag-edge', { opacity: 0.25, duration: 0.4 }, '<')
        // 05 act
        .add(on(4))
        .from('.rag-answer', { y: 20, opacity: 0, duration: 0.6 })
        .from('.rag-answer-line', { scaleX: 0, transformOrigin: 'left', stagger: 0.12, duration: 0.5 })
        .from('.rag-approve', { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2)' })
        .to({}, { duration: 0.6 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="chapter retrieval" id="retrieval" ref={root} aria-labelledby="rag-title">
      <div className="rag-copy">
        <Kicker index="04">Interlude · retrieval</Kicker>
        <h2 className="display-l" id="rag-title">
          <Split text="RAG," className="ember" /> <Split text="made visible." />
        </h2>
        <p className="muted">
          At Cognira I wired retrieval and tool calling into a NestJS backend, so an agent could work on live
          configuration. At Capgemini, semantic vector search caught duplicate projects. Under the hood, it works like
          this:
        </p>
        <ol className="rag-steps">
          {STEPS.map(([k, d], i) => (
            <li className={`rag-step ${reduced ? 'is-on' : ''}`} key={k}>
              <span className="mono ember">{String(i + 1).padStart(2, '0')}</span>
              <span className="mono">{k}</span>
              <span className="muted">{d}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rag-stage" aria-hidden="true">
        <div className="rag-query mono">"raise the discount for tenant A?"</div>
        <svg viewBox="0 0 640 400">
          {nearest.map((i, k) => (
            <line
              key={k}
              className="rag-edge"
              x1={Q.x}
              y1={Q.y}
              x2={points[i].x}
              y2={points[i].y}
              strokeDasharray="200"
            />
          ))}
          {points.map((p, i) => (
            <circle
              key={i}
              className={`rag-dot ${nearest.includes(i) ? 'is-near' : ''}`}
              cx={p.x}
              cy={p.y}
              r={p.r}
            />
          ))}
          <circle className="rag-ring" cx={Q.x} cy={Q.y} r="90" />
          <circle className="rag-ring" cx={Q.x} cy={Q.y} r="90" />
          <g className="rag-q">
            <circle cx={Q.x} cy={Q.y} r="9" />
            <circle cx={Q.x} cy={Q.y} r="16" className="rag-q-halo" />
          </g>
        </svg>
        <div className="rag-context">
          {DOCS.map((d) => (
            <span className="rag-chip mono" key={d}>
              ◆ {d}
            </span>
          ))}
        </div>
        <div className="rag-answer">
          <span className="mono dim">grounded answer</span>
          <span className="rag-answer-line" />
          <span className="rag-answer-line" />
          <span className="rag-answer-line short" />
          <span className="rag-approve mono">tool call → awaiting approval ✓</span>
        </div>
      </div>
    </section>
  );
}

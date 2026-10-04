import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reduced, scrambleTo, ease } from '../lib/motion';
import { Kicker, Split, useSplitReveal } from './ui';

const SEAL = 'ENICARTHAGE · SOFTWARE ENGINEERING · CLASS OF 2026 · ';

export default function Origin() {
  const root = useRef<HTMLElement>(null);
  const eq = useRef<HTMLSpanElement>(null);
  const burst = useRef<HTMLDivElement>(null);
  useSplitReveal(root);

  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      // Physics becomes code.
      const forms = ['F = m · a', 'Σ forces → motion', 'f(signal) → system', 'ship(x) ⇒ production'];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.origin-eq', start: 'top 80%', end: 'bottom 20%', scrub: 0.6 },
      });
      forms.forEach((f, i) => {
        tl.add(() => eq.current && scrambleTo(eq.current, f, 0.6), i);
        tl.to({}, { duration: 1 });
      });

      gsap.from('.origin-step', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: ease.outExpo,
        stagger: 0.15,
        scrollTrigger: { trigger: '.origin-steps', start: 'top 80%' },
      });
      gsap.from('.origin-wire path', {
        strokeDashoffset: 600,
        ease: 'none',
        scrollTrigger: { trigger: '.origin-steps', start: 'top 85%', end: 'bottom 50%', scrub: true },
      });

      // Graduation seal: rotate forever, stamp in once.
      gsap.to('.seal-ring', { rotate: 360, duration: 24, repeat: -1, ease: 'none' });
      ScrollTrigger.create({
        trigger: '.origin-grad',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap
            .timeline()
            .fromTo(
              '.seal',
              { scale: 2.6, opacity: 0, rotate: -25 },
              { scale: 1, opacity: 1, rotate: 0, duration: 0.55, ease: 'power4.in' },
            )
            .to('.origin-grad', { x: 6, duration: 0.05, yoyo: true, repeat: 5 })
            .add(() => fireBurst(burst.current!), 0.5)
            .from('.grad-copy > *', { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: ease.outExpo }, 0.6);
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="chapter origin" id="origin" ref={root} aria-labelledby="origin-title">
      <Kicker index="02">Origin</Kicker>
      <h2 className="display-xl" id="origin-title">
        <span data-split-reveal="">
          <Split text="Before the code," />
        </span>
        <br />
        <span data-split-reveal="">
          <Split text="there was physics." className="ember" />
        </span>
      </h2>

      <p className="origin-eq mono" aria-hidden="true">
        <span ref={eq}>F = m · a</span>
      </p>

      <div className="origin-steps">
        <svg className="origin-wire" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 20 H600" strokeDasharray="600" />
        </svg>
        <article className="origin-step">
          <span className="mono dim">2021 — 2023</span>
          <h3>Nabeul Preparatory Engineering Institute</h3>
          <p>Physics &amp; Technology. Two years of maths and physics that taught me to model a system before touching it.</p>
        </article>
        <article className="origin-step">
          <span className="mono dim">2023 — 2026</span>
          <h3>National School of Engineering of Carthage</h3>
          <p>National engineering degree in Software Engineering: systems, distributed architecture, databases and DevOps, with a lot of shipping along the way.</p>
        </article>
      </div>

      <div className="origin-grad">
        <div className="seal" aria-hidden="true">
          <svg className="seal-ring" viewBox="0 0 200 200">
            <defs>
              <path id="seal-path" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text>
              <textPath href="#seal-path">{SEAL}</textPath>
            </text>
          </svg>
          <span className="seal-core">2026</span>
          <div className="burst" ref={burst} />
        </div>
        <div className="grad-copy">
          <span className="mono ember">Graduated · July 2026</span>
          <h3 className="display-m">ENICarthage, Software Engineering.</h3>
          <p className="muted">
            A month later, I was building software for factories around the world.
          </p>
        </div>
      </div>
    </section>
  );
}

function fireBurst(host: HTMLElement) {
  const n = 28;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'burst-p';
    host.appendChild(s);
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.3;
    const d = 90 + Math.random() * 120;
    gsap.fromTo(
      s,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: Math.cos(a) * d,
        y: Math.sin(a) * d,
        scale: 0,
        opacity: 0,
        duration: 1 + Math.random() * 0.6,
        ease: 'expo.out',
        onComplete: () => s.remove(),
      },
    );
  }
}

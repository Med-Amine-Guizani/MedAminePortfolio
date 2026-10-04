import { useEffect, useRef } from 'react';
import { person } from '../data/profile';
import { gsap, reduced, scrambleTo, scrollState, ease } from '../lib/motion';
import PortraitParticles from './PortraitParticles';
import { Split, Magnetic } from './ui';

const ROLES = ['Full-Stack AI Engineer', 'LangGraph agent builder', 'RAG + tool calling', 'Shipping to production'];

export default function Hero({ booted, onAsk }: { booted: boolean; onAsk: () => void }) {
  const root = useRef<HTMLElement>(null);
  const role = useRef<HTMLSpanElement>(null);

  // Intro choreography: name rises, role decodes, details stagger in.
  useEffect(() => {
    if (!booted || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: ease.outExpo } });
      tl.from('.hero-name .ch', { yPercent: 120, rotate: 8, duration: 1.4, stagger: 0.045 })
        .from('.hero-kicker', { opacity: 0, y: 12, duration: 0.8 }, 0.3)
        .add(() => role.current && scrambleTo(role.current, ROLES[0], 1.1), 0.5)
        .from('.hero-lede', { opacity: 0, y: 24, filter: 'blur(10px)', duration: 1.1 }, 0.7)
        .from('.hero-actions > *', { opacity: 0, y: 20, duration: 0.9, stagger: 0.08 }, 0.85)
        .from('.hero-cue', { opacity: 0, duration: 1 }, 1.2)
        .from('.hero-grid-line', { scaleX: 0, duration: 1.6, stagger: 0.1, ease: ease.inOutQuint }, 0);
    }, root);
    return () => ctx.revert();
  }, [booted]);

  // Cycle the role line through a decode effect.
  useEffect(() => {
    if (!booted) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % ROLES.length;
      if (role.current) scrambleTo(role.current, ROLES[i], 0.9);
    }, 3200);
    return () => window.clearInterval(id);
  }, [booted]);

  // Kinetic type: the name thins and stretches with scroll velocity, and the whole block drifts out.
  useEffect(() => {
    if (reduced) return;
    const name = root.current!.querySelector<HTMLElement>('.hero-name')!;
    let w = 760;
    const tick = () => {
      const target = 760 - Math.min(520, Math.abs(scrollState.smooth) * 14);
      w += (target - w) * 0.15;
      name.style.fontWeight = String(Math.round(w));
    };
    gsap.ticker.add(tick);
    const ctx = gsap.context(() => {
      gsap.to('.hero-copy', {
        yPercent: -18,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={root} aria-label="Introduction">
      <div className="hero-grid" aria-hidden="true">
        <span className="hero-grid-line" />
        <span className="hero-grid-line" />
        <span className="hero-grid-line" />
      </div>

      <div className="hero-copy">
        <p className="hero-kicker">
          <span className="mono">Signal in. Production out.</span>
          <span className="hero-kicker-sep" />
          <span className="mono dim">Tunis · ENICarthage, Class of 2026</span>
        </p>

        <h1 className="hero-name">
          <Split text="Amine" className="hero-name-line" />
          <Split text="Guizani" className="hero-name-line hero-name-outline" />
        </h1>

        <p className="hero-role mono" aria-live="off">
          <span className="hero-role-prompt">&gt;</span>
          <span ref={role}>{reduced ? ROLES[0] : ' '}</span>
          <span className="caret" />
        </p>
        <span className="sr-only">{person.title}</span>

        <p className="hero-lede">
          I build AI that leaves the notebook and runs in production: <em>LangGraph agents</em>,{' '}
          <em>RAG and tool calling</em>, and the full-stack platforms around them.
        </p>

        <div className="hero-actions">
          <span className="status-pill">
            <span className="status-dot" />
            Currently: {person.current}
          </span>
          <Magnetic>
            <button className="btn btn-ember" onClick={onAsk} data-cursor="ask">
              Ask my agent <kbd>Ctrl K</kbd>
            </button>
          </Magnetic>
        </div>
      </div>

      <div className="hero-visual">
        <PortraitParticles
          start={booted}
          alt="Portrait of Mohamed Amine Guizani, assembled from particles"
        />
      </div>

      <div className="hero-cue mono" aria-hidden="true">
        <span>scroll to execute</span>
        <span className="hero-cue-line" />
      </div>
    </section>
  );
}

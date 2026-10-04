import { useEffect, useRef } from 'react';
import { journey, type Stint } from '../data/profile';
import { gsap, reduced } from '../lib/motion';
import { EnergyPulse, KanbanScore, PatchStudio, RobotArm } from './JourneyVisuals';
import { Kicker, Split } from './ui';

const VISUALS: Record<string, () => React.ReactElement> = {
  'bs-automation': RobotArm,
  capgemini: KanbanScore,
  cognira: PatchStudio,
  auveillese: EnergyPulse,
};

function Metric({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const n = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = n.current!;
    if (reduced) return;
    el.textContent = '0';
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const o = { v: 0 };
        gsap.to(o, {
          v: value,
          duration: 2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div className="metric">
      <span className="metric-n">
        <span ref={n}>{value}</span>
        <span className="metric-suffix">{suffix}</span>
      </span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

function StintCard({ s, i }: { s: Stint; i: number }) {
  const Visual = VISUALS[s.id];
  return (
    <article className={`stint hskew ${s.metrics ? 'stint-feature' : ''}`} id={`stint-${s.id}`} data-stint={s.id}>
      <div className="stint-copy">
        <div className="stint-meta mono">
          <span className="ember">{String(i + 1).padStart(2, '0')}</span>
          <span>{s.when}</span>
          <span className="dim">{s.where}</span>
        </div>
        <h3 className="stint-company">{s.company}</h3>
        <p className="stint-role mono">{s.role}</p>
        <p className="stint-blurb">{s.blurb}</p>
        {s.metrics && (
          <div className="metrics">
            {s.metrics.map((m) => (
              <Metric key={m.label} {...m} />
            ))}
          </div>
        )}
        <ul className="stint-points">
          {s.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <ul className="tags" aria-label="Technologies">
          {s.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="stint-visual">
        <Visual />
      </div>
    </article>
  );
}

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 820px) and (prefers-reduced-motion: no-preference)', () => {
      const t = track.current!;
      const distance = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });
      // Depth: each visual travels slower than its card, the title layer faster.
      gsap.utils.toArray<HTMLElement>('.stint', t).forEach((card) => {
        gsap.fromTo(
          card.querySelector('.stint-visual'),
          { xPercent: 18 },
          {
            xPercent: -8,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        );
        gsap.from(card.querySelector('.stint-company'), {
          xPercent: 30,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 45%', scrub: true },
        });
      });
      gsap.to('.journey-progress-fill', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      });
    });
    mm.add('(max-width: 819px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.stint', track.current).forEach((card) => {
        gsap.from(card, { y: 80, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="journey" id="journey" ref={root} aria-labelledby="journey-title">
      <div className="journey-track" ref={track}>
        <header className="journey-intro">
          <Kicker index="03">The journey</Kicker>
          <h2 className="display-xl" id="journey-title">
            <Split text="Four rooms." />
            <br />
            <Split text="Four stacks." className="ember" />
            <br />
            <Split text="One habit:" />
            <br />
            <Split text="ship it." className="outline" />
          </h2>
          <p className="muted journey-hint mono">keep scrolling →</p>
        </header>
        {journey.map((s, i) => (
          <StintCard s={s} i={i} key={s.id} />
        ))}
      </div>
      <div className="journey-progress" aria-hidden="true">
        <span className="journey-progress-fill" />
      </div>
    </section>
  );
}

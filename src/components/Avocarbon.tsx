import { useEffect, useRef, useState } from 'react';
import { avocarbon, logos } from '../data/profile';
import { gsap, isPhone, reduced } from '../lib/motion';
import Globe from './Globe';
import { Milestone, Status, Title, useReveal, Words } from './ui';

/** Listen → Build with AI → Deploy → Watch & fix, told as a living cycle. */
function Loop() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const steps = avocarbon.loop;

  useEffect(() => {
    const el = ref.current!;
    if (reduced) return;
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ repeat: -1, paused: true });
      steps.forEach((_, i) => {
        t.call(() => setActive(i))
          .to('.loop-orbit', { rotate: i * 90, duration: i === 0 ? 0.01 : 1.1, ease: 'power3.inOut', svgOrigin: '150 150' })
          .to({}, { duration: i === steps.length - 1 ? 3.6 : 2.4 });
      });
      t.to('.loop-orbit', { rotate: 360, duration: 1.1, ease: 'power3.inOut', svgOrigin: '150 150' }).set('.loop-orbit', { rotate: 0 });
      tl.current = t;
    }, el);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.current?.play() : tl.current?.pause()), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, [steps]);

  // Tapping a step jumps the cycle there.
  const pick = (i: number) => {
    setActive(i);
    const t = tl.current;
    if (!t) return;
    const label = t.getChildren(false, false, true)[i * 3];
    if (label) t.seek(label.startTime() + 0.02);
  };

  const angle = (i: number) => (i * Math.PI) / 2 - Math.PI / 2;

  return (
    <div className="loop" ref={ref}>
      <svg className="loop-ring" viewBox="0 0 300 300" aria-hidden="true">
        <circle className="loop-track" cx="150" cy="150" r="112" />
        <g className="loop-orbit">
          <path className="loop-comet" d="M150 38 A112 112 0 0 1 229.2 70.8" />
          <circle className="loop-dot" cx="150" cy="38" r="7" />
        </g>
        {steps.map((s, i) => (
          <g key={s.step} className={`loop-node ${active === i ? 'is-on' : ''}`} transform={`translate(${150 + Math.cos(angle(i)) * 112} ${150 + Math.sin(angle(i)) * 112})`}>
            <circle r="17" />
            <text dy="5" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        ))}
        <text className="loop-center" x="150" y="146" textAnchor="middle">
          {steps[active].step}
        </text>
        <text className="loop-center-sub" x="150" y="170" textAnchor="middle">
          step {active + 1} of 4
        </text>
      </svg>

      <ol className="loop-steps">
        {steps.map((s, i) => (
          <li key={s.step} className={active === i ? 'is-on' : ''}>
            <button onClick={() => pick(i)} aria-pressed={active === i}>
              <span className="loop-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="loop-step">{s.step}</span>
            </button>
            <p>{s.text}</p>
            {i === 3 ? (
              <div className={`logscene ${active === 3 ? 'is-play' : ''}`} aria-hidden="true">
                <span className="log log-warn">Unusual error on an approval step</span>
                <span className="log log-fix">Fix shipped</span>
                <span className="log log-ok">Nobody had to report it</span>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Avocarbon() {
  const ref = useRef<HTMLElement>(null);
  const arcs = useRef(reduced ? 1 : 0);
  useReveal(ref);

  // The climax: silence, two lines, then the world lights up from Tunis.
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: '.climax',
          pin: true,
          start: 'top top',
          end: () => (isPhone() ? '+=200%' : '+=240%'),
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.from('.climax-l1 .w > span', { yPercent: 110, stagger: 0.12, duration: 0.6 })
        .from('.climax-l2', { autoAlpha: 0, y: 30, duration: 0.6 }, '>-0.1')
        .to({}, { duration: 0.4 })
        .to('.climax-lines', { yPercent: -70, scale: 0.62, autoAlpha: 0.55, duration: 0.9, ease: 'power2.inOut' })
        .fromTo('.climax-globe', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1 }, '<0.15')
        .to(arcs, { current: 1, duration: 2, ease: 'power1.inOut' })
        .from('.climax-head .w > span', { yPercent: 110, stagger: 0.04, duration: 0.6 }, '<0.7')
        .from('.climax-cap', { autoAlpha: 0, duration: 0.4 }, '>-0.1')
        .to({}, { duration: 0.6 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="chapter night avocarbon" id="avocarbon" ref={ref} data-theme="night" aria-labelledby="climax-title">
      <div className="wrap">
        <Milestone logo={logos.avocarbon} name="AVOCarbon Group" when={`${avocarbon.since} → today`} label={avocarbon.role} />
      </div>

      <div className="climax">
        <div className="climax-lines">
          <p className="climax-l1">
            <Words text="August 2026." />
          </p>
          <p className="climax-l2">
            <em>My first job.</em>
          </p>
        </div>
        <div className="climax-globe">
          <Globe progress={arcs} />
        </div>
        <div className="climax-bottom">
          <h2 className="climax-head" id="climax-title">
            <Words text="Software in production, used across" /> <em><Words text="AVOCarbon's plants" start={5} /></em>{' '}
            <Words text="worldwide." start={7} />
          </h2>
          <p className="climax-cap">Illustrative arcs, not a map of plant locations.</p>
        </div>
      </div>

      <div className="wrap how">
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
        <p className="kicker rv">
          {avocarbon.platform} <Status kind="live">Live in production</Status>
        </p>
        <Title plain="How I work:" em="listen, build, ship, watch." className="title-l" />
        <Loop />
        <div className="facts rv">
          <ul>
            {avocarbon.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="facts-stack">{avocarbon.stack.join(' · ')}</p>
        </div>

        <article className="next rv">
          <Status kind="dev">In development</Status>
          <h3>{avocarbon.next.title}</h3>
          <p>{avocarbon.next.text}</p>
        </article>
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { cogniraMetrics, internships, logos, type Internship } from '../data/profile';
import { gsap, reduced, ScrollTrigger } from '../lib/motion';
import AdVideo from './AdVideo';
import { Counter, Lessons, LogoBadge, Station, Title, useReveal } from './ui';

/** Builds a looping timeline that only plays while its element is on screen. */
function useLoop(build: (el: HTMLElement) => gsap.core.Timeline) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      tl = build(el).pause();
    }, el);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl?.play() : tl?.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
    // build is static per component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/** Ben Salem Automation: a cobot arm runs its setup steps while a sprint loop closes around it. */
function RobotSprint() {
  const ref = useLoop(() => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power3.inOut', duration: 1 } });
    const poses = [
      [-28, 46, -36],
      [12, -24, 54],
      [-50, 66, 8],
      [0, 0, 0],
    ];
    poses.forEach((p, i) => {
      const at = i * 1.25;
      tl.to('.arm-a', { rotate: p[0], svgOrigin: '100 182' }, at)
        .to('.arm-b', { rotate: p[1], svgOrigin: '100 118' }, at)
        .to('.arm-c', { rotate: p[2], svgOrigin: '100 70' }, at)
        .to('.sprint-arc', { strokeDashoffset: 1 - (i + 1) / poses.length, duration: 1.1, ease: 'power2.out' }, at);
    });
    tl.set('.sprint-arc', { strokeDashoffset: 1 });
    return tl;
  });
  return (
    <div className="viz viz-robot" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <circle className="sprint-track" cx="100" cy="110" r="84" />
        <circle className="sprint-arc" cx="100" cy="110" r="84" pathLength={1} strokeDasharray="1" strokeDashoffset="1" transform="rotate(-90 100 110)" />
        <rect className="arm-base" x="78" y="182" width="44" height="10" rx="5" />
        <g className="arm-a">
          <line x1="100" y1="182" x2="100" y2="118" />
          <g className="arm-b">
            <line x1="100" y1="118" x2="100" y2="70" />
            <g className="arm-c">
              <line x1="100" y1="70" x2="128" y2="58" />
              <path d="M128 58 l10 -8 M128 58 l11 4" />
              <circle cx="100" cy="70" r="5" />
            </g>
            <circle cx="100" cy="118" r="6" />
          </g>
          <circle cx="100" cy="182" r="7" />
        </g>
      </svg>
      <span className="viz-label">One sprint, one step at a time</span>
    </div>
  );
}

function Metrics() {
  return (
    <div className="viz viz-metrics">
      {cogniraMetrics.map((m) => (
        <div className="metric" key={m.label}>
          <span className="metric-n">
            <Counter to={m.value} />
            <span className="metric-suffix">{m.suffix}</span>
          </span>
          <span className="metric-label">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Illustrations beside the copy. Capgemini's card shows its film instead; Cognira's keeps its metrics under the film. */
const VISUALS: Partial<Record<Internship['id'], () => React.JSX.Element>> = { bs: RobotSprint, cognira: Metrics };

/** `covered`: the next card has slid over this card's film, so the film pauses. */
function Card({ s, i, covered }: { s: Internship; i: number; covered: boolean }) {
  const Visual = VISUALS[s.id];
  return (
    <article className={`card card-${s.id}`} style={{ '--i': i } as React.CSSProperties} aria-labelledby={`card-${s.id}`}>
      <div className="card-inner">
        <div className="card-top">
          <header className="card-head">
            <LogoBadge logo={logos[s.id]} name={s.company} size="sm" />
            <p className="card-when">
              {s.when} · {s.kind}
            </p>
          </header>
          <h3 className="card-title" id={`card-${s.id}`}>
            {s.title[0]} <em>{s.title[1]}</em>
          </h3>
        </div>
        <div className="card-body">
          <Lessons items={s.lessons} />
          {s.note ? <p className="card-note">{s.note}</p> : null}
        </div>
        {/* phones: the film sits under the title (seen while reading, before the next card arrives); desktop: right column */}
        <div className="card-visual">
          {s.video ? <AdVideo film={s.video} blocked={covered} /> : null}
          {Visual ? <Visual /> : null}
        </div>
        <span className="card-dim" aria-hidden="true" />
      </div>
    </article>
  );
}

export default function Internships() {
  const ref = useRef<HTMLElement>(null);
  const covered = useRef(internships.map(() => false));
  const [coveredState, setCovered] = useState(covered.current);
  useReveal(ref);

  // Stacked cards: each one sticks, then sinks back and dims as the next slides over it.
  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add('(min-height: 640px)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.card', ref.current);
      // A card taller than the screen sticks once its bottom is in view, so nothing gets cut off.
      const topOf = (i: number) => {
        const h = cards[i].querySelector<HTMLElement>('.card-inner')!.offsetHeight;
        return Math.min(28 + i * 14, window.innerHeight - h - 16);
      };
      const setTops = () => cards.forEach((c, i) => (c.style.top = `${topOf(i)}px`));
      setTops();
      ScrollTrigger.addEventListener('refreshInit', setTops);
      cards.slice(0, -1).forEach((card, i) => {
        const next = cards[i + 1];
        gsap
          .timeline({
            // ends when the next card reaches its own sticky top
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: () => `top ${topOf(i + 1)}px`,
              scrub: true,
              invalidateOnRefresh: true,
              // the film counts as covered once the next card's edge passes its middle;
              // re-render only when that flips, not on every scroll frame
              onUpdate: () => {
                const film = card.querySelector<HTMLElement>('.film');
                if (!film) return;
                const r = film.getBoundingClientRect();
                const c = next.getBoundingClientRect().top < r.top + r.height / 2;
                if (c === covered.current[i]) return;
                covered.current = covered.current.map((x, k) => (k === i ? c : x));
                setCovered(covered.current);
              },
            },
          })
          .to(card.querySelector('.card-inner'), { scale: 0.9, y: -8, ease: 'none' }, 0)
          .to(card.querySelector('.card-dim'), { opacity: 0.55, ease: 'none' }, 0);
      });
      // logos arrive on the path one after another
      gsap.from('.trio .logo-badge', {
        scale: 0.4,
        autoAlpha: 0,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.trio', start: 'top 85%', end: 'top 45%', scrub: 0.6 },
      });
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', setTops);
        cards.forEach((c) => (c.style.top = ''));
        covered.current = covered.current.map(() => false);
        setCovered(covered.current);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="chapter internships" id="internships" ref={ref} aria-labelledby="intern-title">
      <div className="wrap">
        <p className="kicker rv">Then, the real world</p>
        <Title id="intern-title" plain="Three internships." em="Three lessons I still use." className="title-l" />
        <Station>
          <div className="trio" data-path="center">
            {internships.map((s) => (
              <figure key={s.id} className="trio-item" data-path-hole="">
                <LogoBadge logo={logos[s.id]} name={s.company} size="md" />
                <figcaption>{s.when.split(' ').pop()}</figcaption>
              </figure>
            ))}
          </div>
        </Station>
        <div className="stack">
          {internships.map((s, i) => (
            <Card s={s} i={i} key={s.id} covered={coveredState[i]} />
          ))}
        </div>
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
      </div>
    </section>
  );
}

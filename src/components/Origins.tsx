import { useEffect, useRef } from 'react';
import { logos, prepa } from '../data/profile';
import { gsap, reduced } from '../lib/motion';
import { Counter, Lessons, Milestone, Seal, Station, Title, useReveal } from './ui';

// Hand-written in Caveat; Latin-only glyphs so the handwriting font covers every character.
const SKETCHES: { t: string; x: number; y: number; r: number; s: number }[] = [
  { t: 'F = m·a', x: 22, y: 52, r: -6, s: 34 },
  { t: 'E = mc²', x: 218, y: 40, r: 5, s: 30 },
  { t: 'sin²x + cos²x = 1', x: 30, y: 118, r: -2, s: 26 },
  { t: 'PV = nRT', x: 236, y: 112, r: 7, s: 28 },
  { t: "f'(x) = 2x + 1", x: 54, y: 186, r: 3, s: 27 },
  { t: 'a² + b² = c²', x: 210, y: 196, r: -5, s: 27 },
  { t: 'ax² + bx + c = 0', x: 40, y: 262, r: -3, s: 28 },
];

function Sketches() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 35%', scrub: 0.8 } });
      tl.fromTo('.sk', { strokeDashoffset: 420, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1, stagger: 0.18, ease: 'none' })
        .to('.sk', { fillOpacity: 0.95, duration: 0.4, stagger: 0.1 }, 0.6)
        .fromTo('.sk-circle', { strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 0.6 }, 0.9)
        .fromTo('.sk-arrow', { strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 0.4 }, 1.3);
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <svg className="sketches" ref={ref} viewBox="0 0 400 300" aria-hidden="true">
      {SKETCHES.map((s, i) => (
        <text key={i} className="sk" x={s.x} y={s.y} fontSize={s.s} transform={`rotate(${s.r} ${s.x} ${s.y})`}>
          {s.t}
        </text>
      ))}
      <ellipse className="sk-line sk-circle" cx="290" cy="105" rx="78" ry="30" transform="rotate(7 290 105)" />
      <path className="sk-line sk-arrow" d="M150 230 C 190 240, 230 236, 262 214 M248 212 L264 213 L258 228" />
    </svg>
  );
}

export function Bac() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="chapter bac" id="origins" ref={ref} aria-labelledby="bac-title">
      <div className="wrap">
        <span data-path="rail" className="path-anchor" aria-hidden="true" />
        <p className="kicker rv">Where it started</p>
        <Title id="bac-title" plain="Baccalaureate in Technical Sciences," em="with highest honours." className="title-m" />
        <Station>
          <Seal text="BACCALAUREATE · TECHNICAL SCIENCES · MENTION TRÈS BIEN · " className="seal-bac">
            <span className="seal-small">Mention</span>
            <em>Très Bien</em>
          </Seal>
        </Station>
      </div>
    </section>
  );
}

export function Prepa() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="chapter night prepa" id="prepa" ref={ref} data-theme="night" aria-labelledby="prepa-title">
      <div className="wrap">
        <Milestone logo={logos.ipein} name="IPEIN" when={prepa.when} label={`Preparatory school · ${prepa.track}`} />
        <Title id="prepa-title" plain="Two years of learning how to" em="think." className="title-l" />
        <Sketches />
        <Lessons items={prepa.lessons} className="lessons-xl" />

        <div className="rank rv">
          <p className="rank-num">
            <span className="rank-value">
              <Counter from={prepa.rank.of} to={prepa.rank.value} duration={2200} />
            </span>
            <span className="rank-of">/ {prepa.rank.of}</span>
          </p>
          <p className="rank-text">
            My rank in the national engineering entrance exam, out of {prepa.rank.of} candidates. It opened the door to
            ENICarthage.
          </p>
        </div>
      </div>
    </section>
  );
}

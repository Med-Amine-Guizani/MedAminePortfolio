import { useEffect, useMemo, useRef } from 'react';
import { enicarthage, logos } from '../data/profile';
import { gsap, reduced } from '../lib/motion';
import { Lessons, Milestone, Seal, Station, Title, useReveal } from './ui';

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/** Abstract dots joining into a network as you scroll: the people met along the way. */
function Network() {
  const ref = useRef<SVGSVGElement>(null);
  const { nodes, edges } = useMemo(() => {
    const ns = [{ x: 200, y: 150, r: 9 }];
    const rings = [
      { n: 7, rad: 62 },
      { n: 11, rad: 108 },
      { n: 14, rad: 150 },
    ];
    let k = 1;
    for (const ring of rings) {
      for (let i = 0; i < ring.n; i++) {
        const a = (i / ring.n) * Math.PI * 2 + rand(k) * 0.5;
        const rr = ring.rad * (0.85 + rand(k + 50) * 0.3);
        ns.push({ x: 200 + Math.cos(a) * rr * 1.25, y: 150 + Math.sin(a) * rr * 0.85, r: 3 + rand(k + 99) * 3 });
        k++;
      }
    }
    // each node links to its nearest node closer to the centre, plus a few neighbours
    const es: [number, number][] = [];
    const dist = (a: number, b: number) => Math.hypot(ns[a].x - ns[b].x, ns[a].y - ns[b].y);
    const dc = (a: number) => dist(a, 0);
    for (let i = 1; i < ns.length; i++) {
      let best = 0;
      let bd = Infinity;
      for (let j = 0; j < ns.length; j++) {
        if (j === i || dc(j) >= dc(i)) continue;
        const d = dist(i, j);
        if (d < bd) {
          bd = d;
          best = j;
        }
      }
      es.push([best, i]);
      if (rand(i + 7) > 0.55) {
        let n2 = -1;
        let d2 = Infinity;
        for (let j = 1; j < ns.length; j++) {
          if (j === i || j === best) continue;
          const d = dist(i, j);
          if (d < d2) {
            d2 = d;
            n2 = j;
          }
        }
        if (n2 > 0) es.push([i, n2]);
      }
    }
    return { nodes: ns, edges: es };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.7 } });
      tl.from('.nw-me', { scale: 0, transformOrigin: '200px 150px', duration: 0.3, ease: 'back.out(3)' })
        .from('.nw-node', { scale: 0, stagger: 0.03, duration: 0.25 }, 0.1)
        .fromTo('.nw-edge', { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.025, duration: 0.3 }, 0.15);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <svg className="network" ref={ref} viewBox="0 0 400 300" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          className="nw-edge"
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          pathLength={1}
          strokeDasharray="1"
        />
      ))}
      {nodes.slice(1).map((n, i) => (
        <circle key={i} className="nw-node" cx={n.x} cy={n.y} r={n.r} />
      ))}
      <g className="nw-me">
        <circle cx="200" cy="150" r="22" className="nw-me-halo" />
        <circle cx="200" cy="150" r="10" className="nw-me-core" />
      </g>
    </svg>
  );
}

export default function School() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section className="chapter school" id="enicarthage" ref={ref} aria-labelledby="school-title">
      <div className="wrap">
        <Milestone logo={logos.enicarthage} name="ENICarthage" when={enicarthage.when} label="Engineering school · Software Engineering" />
        <Title id="school-title" plain="The fundamentals," em="and the people." className="title-l" />
        <Lessons items={enicarthage.lessons} className="lessons-xl" />
        <figure className="network-wrap rv">
          <Network />
          <figcaption>Every dot is someone I learned something from.</figcaption>
        </figure>
        <div className="grad">
          <p className="grad-text rv">
            Graduated in {enicarthage.graduated}.
            <br />
            <span className="muted">{enicarthage.degree}.</span>
          </p>
          <Station>
            <Seal text="SOFTWARE ENGINEERING · CLASS OF 2026 · ENICARTHAGE · " className="seal-grad">
              <span className="seal-small">Class of</span>
              <em>2026</em>
            </Seal>
          </Station>
        </div>
      </div>
    </section>
  );
}

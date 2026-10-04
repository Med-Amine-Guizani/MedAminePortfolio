import { useEffect, useRef, useState } from 'react';
import { gsap, reduced } from '../lib/motion';

const STAGES = ['request', 'approval · L1', 'approval · L2', 'resolved'];

/** A request travels the two-level approval workflow while notifications fire. */
export function DerogationFlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let tl: gsap.core.Timeline;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true });
      const stops = gsap.utils.toArray<HTMLElement>('.df-stop');
      tl.set('.df-token-wrap', { xPercent: 0 }).set(stops, { className: 'df-stop' }).set(stops[0], { className: 'df-stop is-done' });
      for (let i = 1; i < stops.length; i++) {
        tl.to('.df-token-wrap', { xPercent: (i / (stops.length - 1)) * 100, duration: 0.9, ease: 'power3.inOut' })
          .set(stops[i], { className: 'df-stop is-done' })
          .fromTo(
            stops[i].querySelector('.df-ping'),
            { scale: 0.4, opacity: 1 },
            { scale: 2.6, opacity: 0, duration: 0.8, ease: 'expo.out' },
            '<',
          )
          .fromTo('.df-notify', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, '<')
          .to('.df-notify', { opacity: 0, duration: 0.3, delay: 0.4 });
      }
      // responsibility matrix: cells flicker on per plant column
      tl.fromTo(
        '.df-cell.on',
        { opacity: 0.15 },
        { opacity: 1, duration: 0.25, stagger: { each: 0.03, from: 'random' } },
        0,
      );
    }, el);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()), { threshold: 0.3 });
    io.observe(el);
    return () => {
      io.disconnect();
      ctx.revert();
    };
  }, []);

  // Fixed pseudo-random matrix so it renders the same on every load.
  const cells = Array.from({ length: 4 * 6 }, (_, i) => (i * 7 + 3) % 5 < 2);

  return (
    <div className="viz df" ref={ref} aria-hidden="true">
      <div className="df-track">
        <span className="df-rail" />
        <span className="df-token-wrap"><span className="df-token" /></span>
        {STAGES.map((s, i) => (
          <span className={`df-stop ${i === 0 ? 'is-done' : ''}`} key={s} style={{ left: `${(i / 3) * 100}%` }}>
            <span className="df-ping" />
            <span className="df-check">✓</span>
            <span className="df-label mono">{s}</span>
          </span>
        ))}
      </div>
      <div className="df-notify mono">🔔 notification sent · configurable</div>
      <div className="df-matrix">
        <span className="mono dim df-matrix-title">responsibility matrix · per plant</span>
        <div className="df-grid">
          {cells.map((on, i) => (
            <span key={i} className={`df-cell ${on ? 'on' : ''}`} />
          ))}
        </div>
        <div className="df-axis mono dim">
          <span>4 roles ↓</span>
          <span>plants →</span>
        </div>
      </div>
    </div>
  );
}

/** LangGraph-style flow: several sources → correlate → reason → one memo per role. */
export function AgentGraph() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to('.ag-pulse', { strokeDashoffset: -240, duration: 2.4, ease: 'none', repeat: -1, stagger: 0.25 });
      gsap.to('.ag-node-core', {
        opacity: 0.5,
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.2, from: 'start' },
      });
    }, el);
    return () => ctx.revert();
  }, []);
  const edges = [
    'M70 50 C 150 50, 150 130, 230 130',
    'M70 130 L 230 130',
    'M70 210 C 150 210, 150 130, 230 130',
    'M290 130 L 390 130',
    'M450 130 C 520 130, 520 50, 590 50',
    'M450 130 L 590 130',
    'M450 130 C 520 130, 520 210, 590 210',
  ];
  return (
    <div className="viz ag" ref={ref} aria-hidden="true">
      <svg viewBox="-10 0 720 260">
        {edges.map((d, i) => (
          <g key={i}>
            <path d={d} className="ag-edge" />
            <path d={d} className="ag-pulse" strokeDasharray="10 230" />
          </g>
        ))}
        {[
          [40, 50, 'app'],
          [40, 130, 'app'],
          [40, 210, 'db'],
          [260, 130, 'correlate'],
          [420, 130, 'reason'],
          [620, 50, 'memo · role A'],
          [620, 130, 'memo · role B'],
          [620, 210, 'memo · role C'],
        ].map(([x, y, label], i) => (
          <g key={i} className="ag-node" transform={`translate(${x} ${y})`}>
            <circle r={i === 3 || i === 4 ? 22 : 14} className="ag-node-ring" />
            <circle r={i === 3 || i === 4 ? 8 : 5} className="ag-node-core" />
            <text y={i === 3 || i === 4 ? 42 : 32} textAnchor="middle" className="ag-label">
              {label}
            </text>
          </g>
        ))}
      </svg>
      <div className="ag-reasons mono">
        <span>what changed</span>
        <span>what's stagnating</span>
        <span>what's blocked</span>
        <span>risk · opportunity</span>
        <span>who must act</span>
      </div>
    </div>
  );
}

const SECTIONS = ['What changed', "What's stagnating", "What's blocked", 'Risk & opportunity', 'Who must act'];
const ROLES: Record<string, number[]> = {
  'Plant manager': [0, 1, 2, 4],
  Sales: [0, 3, 4],
  Executive: [0, 1, 2, 3, 4],
};

/** One memo, three readers: access control decides which sections each role may see. */
export function RbacMemo() {
  const [role, setRole] = useState('Plant manager');
  const memo = useRef<HTMLDivElement>(null);
  const allowed = ROLES[role];

  const pick = (r: string) => {
    if (r === role) return;
    if (!reduced && memo.current) {
      gsap.fromTo(memo.current, { rotateX: 8, opacity: 0.4 }, { rotateX: 0, opacity: 1, duration: 0.7, ease: 'expo.out' });
    }
    setRole(r);
  };

  return (
    <div className="rbac">
      <div className="rbac-roles" role="radiogroup" aria-label="View the memo as">
        <span className="mono dim">view as</span>
        {Object.keys(ROLES).map((r) => (
          <button
            key={r}
            role="radio"
            aria-checked={r === role}
            className={`chip ${r === role ? 'is-on' : ''}`}
            onClick={() => pick(r)}
            data-cursor="switch"
          >
            {r}
          </button>
        ))}
      </div>
      <div className="memo" ref={memo}>
        <div className="memo-head">
          <span className="mono">weekly memo · {role.toLowerCase()}</span>
          <span className="mono dim">illustrative · no real data</span>
        </div>
        {SECTIONS.map((s, i) => {
          const ok = allowed.includes(i);
          return (
            <div className={`memo-sec ${ok ? '' : 'is-redacted'}`} key={s}>
              <span className="memo-title">{s}</span>
              <span className="memo-body" aria-hidden="true">
                <i />
                <i className="short" />
              </span>
              <span className="memo-lock mono">restricted for this role</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

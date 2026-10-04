import { useEffect, useRef, useState } from 'react';
import { gsap, reduced } from '../lib/motion';

/** Runs `play` while the element is on screen, pausing the returned timeline otherwise. */
function useVisibleTimeline(build: (el: HTMLElement) => gsap.core.Timeline | null) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let tl: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      tl = build(el);
      tl?.pause();
    }, el);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl?.play() : tl?.pause()), {
      threshold: 0.25,
    });
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

export function RobotArm() {
  const ref = useVisibleTimeline(() => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power3.inOut', duration: 1.1 } });
    const steps = gsap.utils.toArray<HTMLElement>('.arm-step');
    const poses = [
      [-30, 50, -40],
      [10, -20, 60],
      [-55, 70, 10],
      [0, 0, 0],
    ];
    poses.forEach((p, i) => {
      tl.to('.arm-a', { rotate: p[0], svgOrigin: '60 200' }, i * 1.3)
        .to('.arm-b', { rotate: p[1], svgOrigin: '60 120' }, i * 1.3)
        .to('.arm-c', { rotate: p[2], svgOrigin: '60 60' }, i * 1.3)
        .set(steps, { className: 'arm-step' }, i * 1.3)
        .set(steps[i], { className: 'arm-step is-on' }, i * 1.3);
    });
    return tl;
  });
  return (
    <div className="viz viz-arm" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 220 230">
        <g className="arm-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={i * 30} y1="0" x2={i * 30} y2="230" />
          ))}
        </g>
        <rect x="35" y="200" width="50" height="14" rx="3" className="arm-base" />
        <g className="arm-a">
          <line x1="60" y1="200" x2="60" y2="120" />
          <circle cx="60" cy="200" r="7" />
          <g className="arm-b">
            <line x1="60" y1="120" x2="60" y2="60" />
            <circle cx="60" cy="120" r="6" />
            <g className="arm-c">
              <line x1="60" y1="60" x2="95" y2="45" />
              <circle cx="60" cy="60" r="5" />
              <path d="M95 45 l12 -8 M95 45 l12 6" />
            </g>
          </g>
        </g>
      </svg>
      <ol className="arm-steps mono">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className={`arm-step ${n === 1 ? 'is-on' : ''}`}>
            step {String(n).padStart(2, '0')}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function KanbanScore() {
  const ref = useVisibleTimeline(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    const cards = gsap.utils.toArray<HTMLElement>('.kb-card');
    cards.forEach((c, i) => {
      const at = i * 1.4;
      tl.fromTo(c, { x: 0, y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, at)
        .to(c, { x: '111%', duration: 0.7, ease: 'power3.inOut' }, at + 0.7)
        .fromTo(
          '.kb-json',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3 },
          at + 1.0,
        )
        .fromTo('.kb-json .fit i', { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power2.out' }, at + 1.0)
        .to(c, { x: '222%', duration: 0.7, ease: 'power3.inOut' }, at + 2.1)
        .to('.kb-json', { opacity: 0, duration: 0.3 }, at + 2.2)
        .to(c, { opacity: 0, duration: 0.3 }, at + 3.4);
    });
    return tl;
  });
  return (
    <div className="viz viz-kb" ref={ref} aria-hidden="true">
      <div className="kb-cols mono">
        <span>inbox</span>
        <span>llm · scored</span>
        <span>interview</span>
      </div>
      <div className="kb-lane">
        {[0, 1, 2].map((i) => (
          <div className="kb-card" key={i}>
            <span className="kb-avatar" />
            <span className="kb-lines">
              <i />
              <i />
            </span>
          </div>
        ))}
      </div>
      <pre className="kb-json mono">
        {'{\n  "school": "…",\n  "background": "…",\n  '}
        <span className="fit">
          "fit": <i />
        </span>
        {'\n}'}
      </pre>
    </div>
  );
}

type Phase = 'idle' | 'asking' | 'proposed' | 'applied';

/** Human-in-the-loop demo: the agent proposes a JSON patch and the visitor approves it. */
export function PatchStudio() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>(reduced ? 'proposed' : 'idle');
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        setPhase('asking');
        window.setTimeout(() => setPhase('proposed'), 1700);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const q = gsap.utils.selector(ref.current);
    if (phase === 'asking') gsap.from(q('.ps-msg'), { y: 14, opacity: 0, stagger: 0.5, duration: 0.6, ease: 'expo.out' });
    if (phase === 'proposed') gsap.from(q('.ps-diff'), { height: 0, opacity: 0, duration: 0.7, ease: 'expo.out' });
    if (phase === 'applied')
      gsap.fromTo(q('.ps-applied'), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
  }, [phase]);

  const replay = () => {
    setPhase('asking');
    window.setTimeout(() => setPhase('proposed'), 1700);
  };

  return (
    <div className="viz viz-patch" ref={ref}>
      <div className="ps-head mono">
        <span>configuration-studio · agent</span>
        <span className="dim">illustrative</span>
      </div>
      {phase !== 'idle' && (
        <div className="ps-chat">
          <p className="ps-msg ps-user">Raise the max discount for this tenant to 40.</p>
          <p className="ps-msg ps-tool mono">
            propose_patch({'{'} op: "replace", path: "/promo/max_discount", value: 40 {'}'})
          </p>
        </div>
      )}
      <pre className="ps-code mono">
        <span>{'{'}</span>
        <span>{'  "tenant": "retail-tenant-a",'}</span>
        <span>{'  "promo": {'}</span>
        {phase === 'proposed' ? (
          <span className="ps-diff">
            <span className="del">{'-    "max_discount": 30,'}</span>
            <span className="add">{'+    "max_discount": 40,'}</span>
          </span>
        ) : (
          <span className={phase === 'applied' ? 'ps-hit' : ''}>
            {`    "max_discount": ${phase === 'applied' ? 40 : 30},`}
          </span>
        )}
        <span>{'    "window": "weekly"'}</span>
        <span>{'  }'}</span>
        <span>{'}'}</span>
      </pre>
      <div className="ps-actions">
        {phase === 'proposed' && (
          <>
            <button className="btn btn-prod btn-sm" onClick={() => setPhase('applied')} data-cursor="approve">
              ✓ Approve
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setPhase('idle')} data-cursor="reject">
              Reject
            </button>
            <span className="mono dim ps-hint">← you're the human in the loop</span>
          </>
        )}
        {phase === 'applied' && (
          <>
            <span className="ps-applied mono">✓ patch applied · UI synced · tenant validated</span>
            <button className="btn btn-ghost btn-sm" onClick={replay} data-cursor="replay">
              Replay
            </button>
          </>
        )}
        {phase === 'idle' && started.current && (
          <button className="btn btn-ghost btn-sm" onClick={replay} data-cursor="replay">
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

export function EnergyPulse() {
  const ref = useVisibleTimeline(() => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.fromTo('.en-line', { strokeDashoffset: 520 }, { strokeDashoffset: 0, duration: 2.6, ease: 'power1.inOut' })
      .fromTo('.en-area', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.4)
      .to('.en-line, .en-area', { opacity: 0, duration: 0.6, delay: 0.8 })
      .set('.en-line, .en-area', { opacity: 1 });
    gsap.to('.en-dot', { scale: 1.8, opacity: 0, duration: 1.2, repeat: -1, transformOrigin: 'center' });
    return tl;
  });
  const d = 'M0 90 C 30 80, 50 40, 80 55 S 130 100, 160 70 S 210 20, 240 45 S 290 85, 320 60';
  return (
    <div className="viz viz-energy" ref={ref} aria-hidden="true">
      <div className="en-head mono">
        <span>reservations</span>
        <span className="ember">energy</span>
      </div>
      <svg viewBox="0 0 320 120" preserveAspectRatio="none">
        {[30, 60, 90].map((y) => (
          <line key={y} x1="0" x2="320" y1={y} y2={y} className="en-grid" />
        ))}
        <path className="en-area" d={`${d} L320 120 L0 120 Z`} />
        <path className="en-line" d={d} strokeDasharray="520" />
        <circle className="en-dot" cx="320" cy="60" r="4" />
        <circle className="en-dot-core" cx="320" cy="60" r="3" />
      </svg>
      <div className="en-rooms">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ animationDelay: `${(i * 0.37) % 2}s` }} />
        ))}
      </div>
    </div>
  );
}

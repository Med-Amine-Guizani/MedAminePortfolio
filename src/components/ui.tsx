import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, ScrollTrigger, reduced, coarse, scrambleTo, ease } from '../lib/motion';

/** Text split into masked words and characters; screen readers get the plain string. */
export function Split({
  text,
  as: Tag = 'span',
  className = '',
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const words = text.split(' ');
  return (
    <Tag className={`split ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((w, wi) => (
        <span className="split-word" aria-hidden="true" key={wi}>
          {[...w].map((c, ci) => (
            <span className="ch" key={ci}>
              {c}
            </span>
          ))}
          {wi < words.length - 1 ? <span className="ch space">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}

/** Masked rise for every `.split` inside the container, triggered on scroll. */
export function useSplitReveal(ref: React.RefObject<HTMLElement | null>, opts: { start?: string } = {}) {
  useEffect(() => {
    if (!ref.current || reduced) return;
    const ctx = gsap.context(() => {
      ref.current!.querySelectorAll<HTMLElement>('[data-split-reveal]').forEach((el) => {
        gsap.from(el.querySelectorAll('.ch'), {
          yPercent: 115,
          rotate: 6,
          duration: 1.1,
          ease: ease.outExpo,
          stagger: 0.022,
          scrollTrigger: { trigger: el, start: opts.start ?? 'top 85%' },
        });
      });
      ref.current!.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1,
          ease: ease.outExpo,
          delay: Number(el.dataset.reveal || 0),
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [ref, opts.start]);
}

/** Pulls an element toward the pointer while hovered. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || coarse) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [strength]);
  return ref;
}

export function Magnetic({
  children,
  strength,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useMagnetic<HTMLSpanElement>(strength);
  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}

/**
 * Section transition: a line of glyph noise that decodes into an agent-trace
 * log entry as it scrolls into view, while a rule draws across the page.
 */
export function TraceRule({ from, to, payload }: { from: string; to: string; payload: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const final = `edge(${from} → ${to})  ${payload}`;
  useEffect(() => {
    const el = ref.current;
    const t = textRef.current;
    if (!el || !t) return;
    if (reduced) {
      t.textContent = final;
      return;
    }
    t.textContent = final.replace(/[^\s]/g, '·');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector('.trace-line'),
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 45%', scrub: true } },
      );
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => scrambleTo(t, final, 1.2),
      });
    }, el);
    return () => ctx.revert();
  }, [final]);
  return (
    <div className="trace" ref={ref} aria-hidden="true">
      <span className="trace-dot" />
      <span className="trace-line" />
      <span className="trace-text" ref={textRef} />
    </div>
  );
}

/** Small mono label, used as "machine voice" throughout. */
export function Kicker({ children, index }: { children: ReactNode; index?: string }) {
  return (
    <p className="kicker">
      {index ? <span className="kicker-index">{index}</span> : null}
      {children}
    </p>
  );
}

export function Badge({ kind }: { kind: 'production' | 'development' }) {
  return (
    <span className={`badge badge-${kind}`}>
      <span className="badge-dot" />
      {kind === 'production' ? 'In production' : 'In development'}
    </span>
  );
}
